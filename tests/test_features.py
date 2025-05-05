import pytest
import pandas as pd
from src.features.preprocess import preprocess_sales_data

def test_preprocess_sales_data():
    # Minimal sample data
    data = {
        'Store': [1],
        'Dept': [1],
        'Date': ['2010-02-05'],
        'Weekly_Sales': [24924.50],
        'IsHoliday': [False]
    }
    df = pd.DataFrame(data)
    df_proc = preprocess_sales_data(df)
    assert 'Weekly_Sales' in df_proc.columns
    assert not df_proc.isnull().any().any()
