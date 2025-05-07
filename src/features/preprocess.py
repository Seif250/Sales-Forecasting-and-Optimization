import pandas as pd
import numpy as np
import logging

logger = logging.getLogger("preprocessor")

def remove_outliers_iqr(df: pd.DataFrame, columns=None) -> pd.DataFrame:
    """Remove outliers from specified columns using the IQR method."""
    if columns is None:
        columns = df.select_dtypes(include=[np.number]).columns.tolist()
    
    if not columns:
        logger.warning("No numeric columns for outlier removal")
        return df
    
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
        logger.info("Converting Date column")
        try:
            df['Date'] = pd.to_datetime(df['Date'], format='%d-%m-%Y', errors='coerce')
            
            # Check for NaN values after conversion
            if df['Date'].isna().any():
                logger.warning(f"Some dates could not be parsed: {df[df['Date'].isna()]['Date'].head()}")
                
            df['weekday'] = df['Date'].dt.weekday
            df['month'] = df['Date'].dt.month
            df['year'] = df['Date'].dt.year
            df.drop(['Date'], axis=1, inplace=True)
            logger.info("Date conversion successful")
        except Exception as e:
            logger.error(f"Error in date conversion: {str(e)}")
            # If date conversion fails, add default columns to ensure model compatibility
            if 'weekday' not in df.columns:
                df['weekday'] = 0
            if 'month' not in df.columns:
                df['month'] = 1
            if 'year' not in df.columns:
                df['year'] = 2023
    else:
        logger.warning("No Date column found")
        # Add default date-related columns if not present
        if 'weekday' not in df.columns:
            df['weekday'] = 0
        if 'month' not in df.columns:
            df['month'] = 1
        if 'year' not in df.columns:
            df['year'] = 2023
    
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
            logger.info(f"Converting {col} to string for one-hot encoding")
            df[col] = df[col].astype(str)
    
    # One-hot encode categorical features
    logger.info("Performing one-hot encoding")
    categorical_cols = [c for c in cf if c in df.columns]
    if categorical_cols:
        df = pd.get_dummies(df, columns=categorical_cols, drop_first=False)
        
        # Always ensure all weekday_X columns (0-6) exist
        all_weekdays = [f'weekday_{i}' for i in range(7)]
        for weekday_col in all_weekdays:
            if weekday_col not in df.columns:
                logger.info(f"Adding missing {weekday_col} column")
                df[weekday_col] = 0
    
    # Handle duplicates and missing values
    logger.info("Removing duplicates and handling missing values")
    df = df.drop_duplicates()
    df = df.fillna(0)
    
    # Remove outliers from numerical columns
    logger.info("Removing outliers")
    try:
        numerical_cols = [col for col in ['Weekly_Sales', 'Temperature', 'Fuel_Price', 'CPI', 'Unemployment'] 
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
