import pandas as pd
import plotly.express as px
from src.data.load_data import load_raw_data
from src.features.preprocess import preprocess_sales_data

def main():
    df = load_raw_data()
    # EDA: Total sales by store
    store_sales = df.groupby('Store', as_index=False)['Weekly_Sales'].sum()
    fig = px.bar(store_sales, x='Store', y='Weekly_Sales', title='Total Weekly Sales by Store')
    fig.show()

    # Top 10 selling stores
    top_10_stores = store_sales.sort_values(by='Weekly_Sales', ascending=False).head(10)
    fig_top = px.bar(top_10_stores, x='Store', y='Weekly_Sales', title='Top 10 Selling Stores')
    fig_top.show()

    # Least 5 selling stores
    least_5_stores = store_sales.sort_values(by='Weekly_Sales', ascending=True).head(5)
    fig_least = px.bar(least_5_stores, x='Store', y='Weekly_Sales', title='Least 5 Selling Stores')
    fig_least.show()

    # Impact of holidays
    fig_holiday = px.box(df, x='Holiday_Flag', y='Weekly_Sales', title='Impact of Holidays on Weekly Sales')
    fig_holiday.show()

    # Weekly sales over time
    df['Date'] = pd.to_datetime(df['Date'], format='%d-%m-%Y')
    weekly_sales = df.groupby('Date', as_index=False)['Weekly_Sales'].sum()
    fig_time = px.line(weekly_sales, x='Date', y='Weekly_Sales', title='Weekly Sales Over Time')
    fig_time.show()

if __name__ == "__main__":
    main()
