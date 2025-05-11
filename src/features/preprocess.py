import pandas as pd
import numpy as np
import category_encoders as ce
import logging
from sklearn.preprocessing import StandardScaler

logger = logging.getLogger("preprocessor")

def remove_outliers_iqr(df: pd.DataFrame, columns=None) -> pd.DataFrame:
    """Remove outliers from specified columns using the IQR method."""
    df_clean = df.copy()
    
    for col in columns:
        if col not in df.columns:
            logger.warning(f"Column {col} not found in dataframe")
            continue
            
        Q1 = df_clean[col].quantile(0.25)
        Q3 = df_clean[col].quantile(0.75)
        IQR = Q3 - Q1
        mask = (df_clean[col] >= Q1 - 1.5 * IQR) & (df_clean[col] <= Q3 + 1.5 * IQR)
        df_clean = df_clean[mask]
    
    logger.info(f"Removed outliers, shape after: {df_clean.shape}")
    return df_clean.reset_index(drop=True)

def preprocess_sales_data(df: pd.DataFrame) -> pd.DataFrame:
    """Preprocess the Walmart sales data: datetime, features, encoding, cleaning."""
    logger.info(f"Starting preprocessing, initial shape: {df.shape}")
    logger.info(f"Input columns: {df.columns.tolist()}")
    
    # Make a copy to avoid modifying the original
    df = df.copy()
    
    # Handle date conversion
    if 'Date' in df.columns:
        logger.info("Converting Date column for preprocessing")
        try:
            original_dates = df['Date'].copy() # Keep original for fallback
            try:
                df['Date'] = pd.to_datetime(df['Date'], format='%d-%m-%Y', errors='raise')
                logger.info("Parsed 'Date' column with format '%d-%m-%Y' for preprocessing.")
            except ValueError:
                logger.warning("Failed to parse 'Date' with format '%d-%m-%Y' for preprocessing, trying to infer format.")
                df['Date'] = pd.to_datetime(original_dates, infer_datetime_format=True, errors='coerce')
            
            # Fallback if a large portion became NaT with infer_datetime_format
            if df['Date'].notna().any() and (df['Date'].isna().sum() > len(df) / 2):
                logger.warning("High number of NaNs after inferring date format for preprocessing. Trying with dayfirst=True as a fallback.")
                df['Date'] = pd.to_datetime(original_dates, dayfirst=True, errors='coerce')

            if df['Date'].isna().any():
                logger.warning("Some dates could not be parsed to datetime for preprocessing and resulted in NaT even after fallbacks. Ensure all dates are in a recognizable format. These will affect date-derived features.")
            
            # Extract date features. If 'Date' column became all NaT, these will be NaN.
            df['weekday'] = df['Date'].dt.weekday
            df['month'] = df['Date'].dt.month
            df['year'] = df['Date'].dt.year
            df.drop(['Date'], axis=1, inplace=True) # Drop the original 'Date' column after extracting features
            logger.info("Date conversion and feature extraction for preprocessing successful.")
        except Exception as e:
            logger.error(f"Error in date conversion during preprocessing: {str(e)}")
            # Fallback: if date processing fails, ensure columns exist to prevent downstream errors
            if 'weekday' not in df.columns: df['weekday'] = 0
            if 'month' not in df.columns: df['month'] = 1
            if 'year' not in df.columns: df['year'] = 2023 # Or some other default
            if 'Date' in df.columns: # If 'Date' still exists and caused error, drop it
                df.drop(['Date'], axis=1, inplace=True, errors='ignore')
    else:
        logger.warning("No Date column found for preprocessing.")
    
    # Ensure required columns exist
    required_columns = ['Store', 'Temperature', 'Fuel_Price', 'CPI', 'Unemployment', 'Holiday_Flag']
    for col in required_columns:
        if col not in df.columns:
            logger.warning(f"Required column {col} not found, adding with default values")
            if col == 'Store':
                df[col] = 1
            elif col == 'Temperature':
                df[col] = 70.0
            elif col == 'Fuel_Price':
                df[col] = 3.5
            elif col == 'CPI':
                df[col] = 210.0
            elif col == 'Unemployment':
                df[col] = 6.5
            elif col == 'Holiday_Flag':
                df[col] = 0
    
    # Convert categorical features
    cf = ['Store', 'month', 'weekday', 'year', 'Holiday_Flag']

    for col in cf:
        if col in df.columns:
            logger.info(f"Converting {col} to string for Binary encoding")
            df[col] = df[col].astype(str)
    
    # Binary encoding categorical features
    logger.info("Performing Binary encoding")
    nf = ['Weekly_Sales', 'Temperature', 'Fuel_Price', 'CPI', 'Unemployment']

    df3 = df.copy(deep=True)
    encoder = ce.BinaryEncoder(cols=cf, drop_invariant=False)
    df_encoded = encoder.fit_transform(df3[cf])
    df3 = pd.concat([df3[nf], df_encoded], axis=1)
    df = df3.copy(deep=True)
    
    # Handle duplicates and missing values
    logger.info("Removing duplicates and handling missing values")
    df = df.drop_duplicates()
    df = df.fillna(0)
    
    # Remove outliers from numerical columns
    logger.info("Removing outliers")
    try:
        numerical_cols = [col for col in nf
                         if col in df.columns]
        if numerical_cols:
            df = remove_outliers_iqr(df, columns=numerical_cols)
        else:
            logger.warning("No numerical columns for outlier removal")
    except Exception as e:
        logger.error(f"Error in outlier removal: {str(e)}")
        
    logger.info(f"Preprocessing complete, final shape: {df.shape}")
    logger.info(f"Output columns: {df.columns.tolist()}")
    
    return df

def scale_features(df: pd.DataFrame, scaler: StandardScaler = None) -> tuple[pd.DataFrame, StandardScaler]:
    """
    Scale numerical features using StandardScaler.
    If a scaler is provided, it will use transform() only.
    If no scaler is provided, it will fit_transform() and return the fitted scaler.
    
    Args:
        df: DataFrame with features to scale
        scaler: Optional pre-fitted StandardScaler
        
    Returns:
        (scaled_df, scaler): Tuple of scaled DataFrame and the scaler used
    """
    logger.info("Scaling numerical features")
    
    # Create a copy to avoid modifying the original
    df_scaled = df.copy()
    
    # Handle the case of Weekly_Sales special - exclude it from scaling if present
    # This is to maintain consistency with how the model was trained
    # where Weekly_Sales was the target and not included in the feature scaling
    has_weekly_sales = 'Weekly_Sales' in df_scaled.columns
    if has_weekly_sales:
        logger.info("'Weekly_Sales' found in input data for scaling - will be preserved unscaled")
        weekly_sales_values = df_scaled['Weekly_Sales'].copy()
        df_scaled_without_target = df_scaled.drop('Weekly_Sales', axis=1)
    else:
        df_scaled_without_target = df_scaled
    
    # Select only numerical columns for scaling
    nf = df_scaled_without_target.select_dtypes(include=np.number).columns.tolist()
    
    if scaler is None:
        # Training mode: fit and transform
        scaler = StandardScaler()
        fit_new_scaler = True
        logger.info("No scaler provided, creating and fitting a new one")
    else:
        # Prediction mode: transform only
        fit_new_scaler = False
        logger.info("Using provided pre-fitted scaler for transformation only")

    if not nf:
        logger.warning("No numerical features found to scale. Returning original DataFrame and scaler.")
        return df_scaled, scaler # Return the original DataFrame and the scaler

    try:
        if fit_new_scaler:
            # Fit and transform the specified columns (training mode)
            df_scaled_without_target[nf] = scaler.fit_transform(df_scaled_without_target[nf])
            logger.info(f"Successfully fit and transformed {len(nf)} features with new scaler: {nf}")
        else:
            # Transform only with existing scaler (prediction mode)
            df_scaled_without_target[nf] = scaler.transform(df_scaled_without_target[nf])
            logger.info(f"Successfully transformed {len(nf)} features with pre-fitted scaler: {nf}")
        
        # If Weekly_Sales was in the original dataframe, add it back unscaled
        if has_weekly_sales:
            df_result = df_scaled_without_target.copy()
            df_result['Weekly_Sales'] = weekly_sales_values
            logger.info("Added back 'Weekly_Sales' column unscaled")
            return df_result, scaler
        else:
            return df_scaled_without_target, scaler
    except Exception as e:
        logger.error(f"Error in feature scaling: {str(e)}")
        logger.warning("Returning original DataFrame due to error during scaling.")
        # Return original dataframe and the scaler in case of error
        return df, scaler
