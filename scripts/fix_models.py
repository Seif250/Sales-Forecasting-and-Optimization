import joblib
import os
import numpy as np
import pandas as pd
from pathlib import Path
import sys

# Add the parent directory to the path so we can import from src
sys.path.append(str(Path(__file__).parent.parent))

from src.data.load_data import load_raw_data
from src.features.preprocess import preprocess_sales_data
from src.utils.logging import get_logger

logger = get_logger("fix_models")

def fix_models():
    """
    Load existing models and save them in the new format with feature names.
    """
    # Define model paths
    models_dir = Path(__file__).parent.parent / "models"
    xgboost_path = models_dir / "xgboost_model.pkl"
    linear_path = models_dir / "linear_regression_model.pkl"
    
    # Load a sample dataset to get feature names
    logger.info("Loading sample data")
    try:
        df = load_raw_data()
        df_proc = preprocess_sales_data(df)
        feature_names = df_proc.drop('Weekly_Sales', axis=1).columns.tolist()
        logger.info(f"Found {len(feature_names)} features")
    except Exception as e:
        logger.error(f"Error preparing feature names: {e}")
        feature_names = None
        
    # Fix XGBoost model
    if xgboost_path.exists():
        logger.info(f"Fixing XGBoost model at {xgboost_path}")
        try:
            model = joblib.load(xgboost_path)
            # Check if already in new format
            if isinstance(model, dict) and 'model' in model and 'feature_names' in model:
                logger.info("XGBoost model already in new format")
            else:
                model_data = {
                    'model': model,
                    'feature_names': feature_names
                }
                # Backup original
                backup_path = models_dir / "xgboost_model.original.pkl"
                joblib.dump(model, backup_path)
                logger.info(f"Backed up original model to {backup_path}")
                
                # Save new format
                joblib.dump(model_data, xgboost_path)
                logger.info("XGBoost model updated to new format")
        except Exception as e:
            logger.error(f"Error fixing XGBoost model: {e}")
    else:
        logger.warning(f"XGBoost model not found at {xgboost_path}")
        
    # Fix Linear Regression model
    if linear_path.exists():
        logger.info(f"Fixing Linear Regression model at {linear_path}")
        try:
            model = joblib.load(linear_path)
            # Check if already in new format
            if isinstance(model, dict) and 'model' in model and 'feature_names' in model:
                logger.info("Linear Regression model already in new format")
            else:
                model_data = {
                    'model': model,
                    'feature_names': feature_names
                }
                # Backup original
                backup_path = models_dir / "linear_regression_model.original.pkl"
                joblib.dump(model, backup_path)
                logger.info(f"Backed up original model to {backup_path}")
                
                # Save new format
                joblib.dump(model_data, linear_path)
                logger.info("Linear Regression model updated to new format")
        except Exception as e:
            logger.error(f"Error fixing Linear Regression model: {e}")
    else:
        logger.warning(f"Linear Regression model not found at {linear_path}")
    
    logger.info("Model fixing complete")

if __name__ == "__main__":
    fix_models() 