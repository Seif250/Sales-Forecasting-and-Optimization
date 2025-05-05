import pandas as pd
from sklearn.linear_model import LinearRegression
from xgboost import XGBRegressor
import joblib
from pathlib import Path

def train_linear_regression(X: pd.DataFrame, y: pd.Series, model_path: str = None):
    model = LinearRegression()
    model.fit(X, y)
    if model_path is not None:
        joblib.dump(model, model_path)
    return model

def train_xgboost(X: pd.DataFrame, y: pd.Series, model_path: str = None):
    model = XGBRegressor(objective='reg:squarederror', n_estimators=100, random_state=42)
    model.fit(X, y)
    if model_path is not None:
        joblib.dump(model, model_path)
    return model

def load_model(model_path: str):
    return joblib.load(model_path)

def predict(model, X: pd.DataFrame):
    return model.predict(X)
