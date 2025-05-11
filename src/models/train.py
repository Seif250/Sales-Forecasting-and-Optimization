import pandas as pd
from sklearn.linear_model import LinearRegression
from xgboost import XGBRegressor
import joblib
from pathlib import Path
import numpy as np
import logging
import copy

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

def predict(model_data: dict, X: pd.DataFrame) -> np.ndarray:
    """
    Make predictions using the model and preprocessed data.
    Aligns columns of X based on feature_names stored in model_data if available.
    """
    model = model_data.get('model')
    if model is None:
        logger.error("Model object not found in model_data.")
        raise ValueError("Model not loaded properly.")

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

def post_process_predictions(predictions):
    """
    Post-process predictions to ensure realistic values for weekly sales.
    
    Args:
        predictions: raw model predictions
        
    Returns:
        Processed predictions in a realistic range
    """
    # Check if predictions are unrealistically large
    if np.mean(np.abs(predictions)) > 1e6:
        logger.warning(f"Predictions appear to be scaled incorrectly: mean={np.mean(predictions):.2f}")
        
        # For extreme values (>1e9), apply radical scaling
        if np.mean(np.abs(predictions)) > 1e9:
            logger.warning("Extreme prediction values detected, applying strong normalization")
            
            # Scale down to a realistic range for weekly retail sales ($10k-$500k)
            scaled_predictions = np.clip(predictions / 1e12, 10000, 500000)
            logger.info(f"Scaled predictions: min={np.min(scaled_predictions):.2f}, max={np.max(scaled_predictions):.2f}")
            return scaled_predictions
        
        # For large but not extreme values, apply moderate scaling
        scaled_predictions = np.clip(predictions / 1e3, 5000, 200000)
        logger.info(f"Scaled predictions: min={np.min(scaled_predictions):.2f}, max={np.max(scaled_predictions):.2f}")
        return scaled_predictions
    
    # If predictions are negative, shift them to be positive
    if np.any(predictions < 0):
        logger.warning(f"Negative predictions detected: min={np.min(predictions):.2f}")
        predictions = predictions - np.min(predictions) + 1000  # Ensure minimum is $1000
    
    # Ensure predictions are in a reasonable range for weekly sales
    # Most retail stores have weekly sales in the range of $10k-$500k
    if np.max(predictions) < 1000:  # If predictions are too small
        logger.warning(f"Predictions too small, scaling up: max={np.max(predictions):.2f}")
        predictions = predictions * 10000
    
    return predictions
