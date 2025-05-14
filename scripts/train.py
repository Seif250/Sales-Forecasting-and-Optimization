import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.model_selection import train_test_split
from src.data.load_data import load_raw_data
from src.features.preprocess import preprocess_sales_data, scale_features
from src.utils.config import load_config
from src.utils.logging import get_logger
from src.models.train import train_linear_regression, train_xgboost
from sklearn.metrics import mean_squared_error, r2_score
import joblib

if __name__ == "__main__":
    config = load_config()
    logger = get_logger("train")
    df = load_raw_data(config['data']['path'])
    df_proc = preprocess_sales_data(df)

    X = df_proc.drop('Weekly_Sales', axis=1)
    y = df_proc['Weekly_Sales']    # Get feature names after preprocessing and before scaling for saving with the model
    feature_names = X.columns.tolist()

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=1)
    
    # Data scaling - Note: X already has Weekly_Sales removed, so it won't be scaled
    X_train_df = pd.DataFrame(X_train, columns=X.columns)
    X_train_scaled_df, scaler = scale_features(X_train_df)
    X_train_scaled = X_train_scaled_df.values
    
    # Apply same scaling to test data using the fitted scaler
    X_test_df = pd.DataFrame(X_test, columns=X.columns)
    X_test_scaled_df, _ = scale_features(X_test_df, scaler)  # Use same scaler, ignore returned one
    X_test_scaled = X_test_scaled_df.values

    models_dir = Path(config['model']['path']).parent
    models_dir.mkdir(exist_ok=True)
    
    # Save the scaler for prediction-time use
    scaler_path = models_dir / 'standard_scaler.pkl'
    joblib.dump(scaler, scaler_path)
    logger.info(f"StandardScaler saved to {scaler_path}")

    logger.info("Training Linear Regression...")
    train_linear_regression(X_train_scaled, y_train, str(models_dir / 'linear_regression_model.pkl'), feature_names=feature_names)
    logger.info("Training XGBoost...")
    train_xgboost(X_train_scaled, y_train, str(models_dir / 'xgboost_model.pkl'), feature_names=feature_names)
    logger.info("Models trained and saved.")

    # Automated evaluation (train/test RMSE)
    for model_name_pkl in ['linear_regression_model.pkl', 'xgboost_model.pkl']:
        model_path = models_dir / model_name_pkl
        if not model_path.exists():
            logger.warning(f"Model file {model_path} not found for evaluation.")
            continue
        
        loaded_data = joblib.load(model_path) # Models are now saved as dicts
        model = loaded_data.get('model')
        
        if model is None:
            logger.error(f"Could not extract model from {model_path}")
            continue

        for split, Xs, ys in [
            ("Train", X_train_scaled, y_train),
            ("Test", X_test_scaled, y_test)
        ]: 
            preds = model.predict(Xs)
            rmse = np.sqrt(mean_squared_error(ys, preds))
            r2 = r2_score(ys, preds)
            logger.info(f"{model_name_pkl} {split} RMSE: {rmse:.2f}")