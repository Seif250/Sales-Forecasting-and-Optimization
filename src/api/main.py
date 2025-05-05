from fastapi import FastAPI, HTTPException
import pandas as pd
from src.features.preprocess import preprocess_sales_data
from src.models.train import load_model, predict
from src.api.schemas import PredictRequest, PredictResponse
from src.utils.config import load_config
from src.utils.logging import get_logger

app = FastAPI()
config = load_config()
logger = get_logger("api")

MODEL_PATH = config['model']['path']

@app.on_event("startup")
def load_trained_model():
    global model
    try:
        model = load_model(MODEL_PATH)
        logger.info(f"Model loaded from {MODEL_PATH}")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        model = None

@app.post("/predict", response_model=PredictResponse)
def predict_sales(request: PredictRequest):
    if model is None:
        logger.error("Model not loaded.")
        raise HTTPException(status_code=500, detail="Model not loaded.")
    df = pd.DataFrame(request.data)
    df_proc = preprocess_sales_data(df)
    preds = predict(model, df_proc)
    logger.info(f"Prediction made for {len(df)} records.")
    return PredictResponse(predictions=preds.tolist())
