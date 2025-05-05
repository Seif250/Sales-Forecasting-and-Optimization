import pytest
from src.data.load_data import load_raw_data

def test_load_raw_data():
    df = load_raw_data()
    assert not df.empty
    assert 'Weekly_Sales' in df.columns
