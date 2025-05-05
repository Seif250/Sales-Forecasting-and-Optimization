import pandas as pd
from pathlib import Path

def load_raw_data(csv_path: str = None) -> pd.DataFrame:
    """Load the raw Walmart sales data from a CSV file."""
    if csv_path is None:
        csv_path = str(Path(__file__).parent.parent.parent / 'data' / 'Walmart.csv')
    df = pd.read_csv(csv_path)
    return df
