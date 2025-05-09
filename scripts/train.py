import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.preprocessing import StandardScaler
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
    y = df_proc['Weekly_Sales']

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=1)

    # Data scaling
    X_train_df = pd.DataFrame(X_train, columns=X.columns)
    X_train_scaled_df, scaler = scale_features(X_train_df)
    X_train_scaled = X_train_scaled_df.values
    
    # Apply same scaling to test data
    X_test_df = pd.DataFrame(X_test, columns=X.columns)
    X_test_scaled = scaler.transform(X_test_df)

    models_dir = Path(config['model']['path']).parent
    models_dir.mkdir(exist_ok=True)

    logger.info("Training Linear Regression...")
    train_linear_regression(X_train_scaled, y_train, str(models_dir / 'linear_regression_model.pkl'))
    logger.info("Training XGBoost...")
    train_xgboost(X_train_scaled, y_train, str(models_dir / 'xgboost_model.pkl'))
    logger.info("Models trained and saved.")

    # Automated evaluation (train/test RMSE, R2)
    for model_name in ['linear_regression_model.pkl', 'xgboost_model.pkl']:
        model = joblib.load(str(models_dir / model_name))
        for split, Xs, ys in [
            ("Train", X_train_scaled, y_train),
            ("Test", X_test_scaled, y_test)
        ]: 
            preds = model.predict(Xs)
            rmse = np.sqrt(mean_squared_error(ys, preds))
            r2 = r2_score(ys, preds)
            logger.info(f"{model_name} {split} RMSE: {rmse:.2f}")