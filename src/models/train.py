import pandas as pd
from sklearn.linear_model import LinearRegression
from xgboost import XGBRegressor
import joblib
import numpy as np
import logging

logger = logging.getLogger(__name__)

def train_linear_regression(X: pd.DataFrame, y: pd.Series, model_path: str = None, feature_names: list = None):
    model = LinearRegression()
    model.fit(X, y)
    if model_path is not None:
        model_data_to_save = {'model': model, 'feature_names': feature_names}
        joblib.dump(model_data_to_save, model_path)
        logger.info(f"Linear Regression model and feature names saved to {model_path}")
    return model

def train_xgboost(X: pd.DataFrame, y: pd.Series, model_path: str = None, feature_names: list = None):
    model = XGBRegressor(objective='reg:squarederror', n_estimators=100)
    model.fit(X, y)
    if model_path is not None:
        model_data_to_save = {'model': model, 'feature_names': feature_names}
        joblib.dump(model_data_to_save, model_path)
        logger.info(f"XGBoost model and feature names saved to {model_path}")
    return model

def load_model(model_path: str):
    return joblib.load(model_path)

def predict(model_data: dict, X) -> np.ndarray:
    """Make predictions using the model and preprocessed data."""
    model = model_data.get('model')
    if model is None:
        logger.error("Model object not found in model_data.")
        raise ValueError("Model not loaded properly.")

    # Check if X is a numpy array
    if isinstance(X, np.ndarray):
        logger.debug(f"Input for prediction is a numpy array with shape {X.shape}")
        
        # For numpy arrays, we assume columns are already aligned to model's expectations
        if X.size == 0:  # Handle empty arrays
            logger.info("Input numpy array for prediction is empty.")
            return np.array([])
            
        try:
            predictions_output = model.predict(X)
            return predictions_output
        except Exception as e:
            logger.error(f"Error during model.predict call with numpy array: {e}", exc_info=True)
            raise
    
    # If X is a DataFrame, proceed with column alignment
    model_feature_names = model_data.get('feature_names')
    
    logger.debug(f"DataFrame columns before alignment for prediction: {X.columns.tolist()}")
    logger.debug(f"Expected model features based on loaded model: {model_feature_names}")

    if model_feature_names:
        # Ensure all expected features are in X's columns, add if missing (with 0)
        missing_features = []
        for col in model_feature_names:
            if col not in X.columns:
                missing_features.append(col)
                logger.warning(f"Input data for prediction is missing expected feature: '{col}'. Adding it with value 0.")
                X[col] = 0
        
        if missing_features:
            logger.warning(f"Added missing features for prediction: {missing_features}. Current X columns: {X.columns.tolist()}")

        # Select and reorder columns to match model's training features
        try:
            X_aligned = X[model_feature_names]
            logger.debug(f"DataFrame columns after alignment for prediction: {X_aligned.columns.tolist()}")
        except KeyError as e:
            logger.error(f"KeyError during feature alignment for prediction. This should not happen if missing features were added. Model features: {model_feature_names}, DataFrame columns: {X.columns.tolist()}", exc_info=True)
            raise ValueError(f"DataFrame for prediction is missing critical features or has a mismatch despite attempts to fix: {e}")
    else:
        logger.warning("No feature names found stored with the loaded model. Assuming input DataFrame columns are correctly ordered and all necessary features are present. This is risky.")
        X_aligned = X 

    if X_aligned.empty:
        if not X.empty:
            logger.warning("Aligned DataFrame for prediction (X_aligned) is empty, but original preprocessed DataFrame (X) was not. This might indicate all relevant features were missing or an issue with feature names list.")
        else:
            logger.info("Input DataFrame for prediction (X_aligned) is empty because the preprocessed input (X) was empty.")
        return np.array([]) # Return empty array if no data to predict on

    try:
        predictions_output = model.predict(X_aligned)
        return predictions_output
    except Exception as e:
        logger.error(f"Error during model.predict(X_aligned) call: {e}", exc_info=True)
        logger.error(f"Details of X_aligned fed to model.predict - Shape: {X_aligned.shape}, Dtypes:\n{X_aligned.dtypes}, Head:\n{X_aligned.head()}")
        raise  # Re-raise the exception to be caught by the API layer

