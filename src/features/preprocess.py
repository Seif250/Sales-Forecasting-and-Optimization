import pandas as pd
import numpy as np

def remove_outliers_iqr(df: pd.DataFrame, columns=None) -> pd.DataFrame:
    """Remove outliers from specified columns using the IQR method."""
    if columns is None:
        columns = df.select_dtypes(include=[np.number]).columns.tolist()
    df_clean = df.copy()
    for col in columns:
        Q1 = df_clean[col].quantile(0.25)
        Q3 = df_clean[col].quantile(0.75)
        IQR = Q3 - Q1
        mask = (df_clean[col] >= Q1 - 1.5 * IQR) & (df_clean[col] <= Q3 + 1.5 * IQR)
        df_clean = df_clean[mask]
    return df_clean.reset_index(drop=True)

def preprocess_sales_data(df: pd.DataFrame) -> pd.DataFrame:
    """Preprocess the Walmart sales data: datetime, features, encoding, cleaning."""
    df = df.copy()
    if 'Date' in df.columns:
        df['Date'] = pd.to_datetime(df['Date'])
        df['weekday'] = df['Date'].dt.weekday
        df['month'] = df['Date'].dt.month
        df['year'] = df['Date'].dt.year
        df.drop(['Date'], axis=1, inplace=True)
    # Categorical and numerical features
    cf = ['Store', 'month', 'weekday', 'year', 'Holiday_Flag']
    for col in cf:
        if col in df.columns:
            df[col] = df[col].astype(str)
    df = pd.get_dummies(df, columns=[c for c in cf if c in df.columns], drop_first=False)
    df = df.drop_duplicates()
    df = df.fillna(0)
    df = remove_outliers_iqr(df, columns=['Weekly_Sales', 'Temperature', 'Fuel_Price', 'CPI', 'Unemployment'])
    return df
