from fastapi import FastAPI, HTTPException, UploadFile, File, Query, Path, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import io
import os
import sys
import joblib # Added for loading scikit-learn models
import traceback # Added for detailed error logging
import numpy as np
from typing import Optional
from sklearn.preprocessing import StandardScaler

# Fix import paths when running from src directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from features.preprocess import preprocess_sales_data, scale_features
# train.py contains load_model, predict. We might need to adjust load_model if it's too generic.
from models.train import load_model as load_specific_model, predict 
from api.schemas import PredictRequest, PredictResponse, ModelResponse, HealthResponse, VisualizeResponse, DataStats, VisualizationData, StorePerformance, TimeTrend, DepartmentSales # VisualizeResponse and others might be removed if not used by these simplified endpoints
from utils.config import load_config
from utils.logging import get_logger

app = FastAPI(
    title="Sales Forecasting API",
    description="API for predicting sales and optimizing inventory",
    version="1.0.0"
)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
config = load_config()
logger = get_logger("api")

# Define paths for both models
LINEAR_MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'models', 'linear_regression_model.pkl')
XGBOOST_MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'models', 'xgboost_model.pkl')
SCALER_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'models', 'standard_scaler.pkl')

available_models = {}
loaded_scaler = None

@app.on_event("startup")
def load_trained_models():
    global available_models, loaded_scaler
    logger.info("Attempting to load trained models and scaler...")
    model_paths = {"linear": LINEAR_MODEL_PATH, "xgboost": XGBOOST_MODEL_PATH}    # Try to load the saved scaler
    try:
        if os.path.exists(SCALER_PATH):
            loaded_scaler = joblib.load(SCALER_PATH)
            logger.info(f"StandardScaler loaded from {SCALER_PATH}")
            
            # Validate scaler by checking its parameters
            if hasattr(loaded_scaler, 'n_features_in_'):
                logger.info(f"Loaded scaler was trained on {loaded_scaler.n_features_in_} features")
                if hasattr(loaded_scaler, 'feature_names_in_'):
                    logger.info(f"Scaler feature names: {loaded_scaler.feature_names_in_.tolist()}")
                    # Check if Weekly_Sales is in the scaler's features - it shouldn't be
                    if 'Weekly_Sales' in loaded_scaler.feature_names_in_:
                        logger.warning("Warning: Scaler includes 'Weekly_Sales' which should be excluded from scaling")
            else:
                logger.warning("Loaded scaler doesn't have n_features_in_ attribute, might be an older version")
        else:
            logger.warning(f"Scaler file not found at {SCALER_PATH}. Using fit_transform will be required for predictions.")
            loaded_scaler = None
    except Exception as e:
        logger.error(f"Failed to load scaler from {SCALER_PATH}: {e}", exc_info=True)
        loaded_scaler = None

    for model_name, model_path in model_paths.items():
        try:
            if os.path.exists(model_path):
                loaded_data = load_specific_model(model_path)  # load_specific_model is joblib.load

                if isinstance(loaded_data, dict) and 'model' in loaded_data and 'feature_names' in loaded_data:
                    available_models[model_name] = loaded_data
                    logger.info(f"{model_name.capitalize()} model loaded from {model_path} with features: {loaded_data['feature_names']}")
                else:
                    # Fallback for old model format or if something went wrong during saving
                    logger.warning(f"{model_name.capitalize()} model at {model_path} is not in the expected dictionary format (with 'model' and 'feature_names').")
                    # Attempt to load as a raw model object and extract features if possible (old way)
                    raw_model_obj = loaded_data 
                    feature_names_old = None
                    if model_name == "linear":
                        if hasattr(raw_model_obj, 'feature_names_in_'):
                            feature_names_old = raw_model_obj.feature_names_in_.tolist()
                    elif model_name == "xgboost":
                        if hasattr(raw_model_obj, 'get_booster') and hasattr(raw_model_obj.get_booster(), 'feature_names'):
                            feature_names_old = raw_model_obj.get_booster().feature_names
                        elif hasattr(raw_model_obj, 'feature_names_in_'): # Scikit-learn wrapper
                            feature_names_old = raw_model_obj.feature_names_in_.tolist()
                    
                    available_models[model_name] = {"model": raw_model_obj, "feature_names": feature_names_old}
                    if feature_names_old:
                        logger.info(f"Loaded old format {model_name.capitalize()} model. Extracted feature names: {feature_names_old}")
                    else:
                        logger.warning(f"Loaded old format {model_name.capitalize()} model, but could not extract feature names. Ensure preprocess_sales_data aligns columns correctly or retrain model to include feature names.")
            else:
                logger.warning(f"{model_name.capitalize()} model file not found at {model_path}.")
                available_models[model_name] = None
        except Exception as e:
            logger.error(f"Failed to load {model_name} model from {model_path}: {e}", exc_info=True)
            available_models[model_name] = None

    if not any(m is not None for m in available_models.values()):
        logger.error("No models could be loaded. Prediction and relevant endpoints might not work.")
    logger.info(f"Available models after startup: {list(available_models.keys())}")

# Removed old /predict endpoint
# @app.post("/predict", response_model=PredictResponse)
# def predict_sales_endpoint(request: PredictRequest):
#    ... (old implementation)

# Helper function for core prediction logic
async def _perform_prediction(input_df: pd.DataFrame, model_name: str) -> PredictResponse:
    """
    Internal helper to preprocess data, make predictions, and format response.
    """
    selected_model_data = available_models.get(model_name.lower())
    if selected_model_data is None or selected_model_data.get('model') is None:
        logger.error(f"Model '{model_name}' not loaded or not available for prediction helper.")
        raise HTTPException(status_code=503, detail=f"Model '{model_name}' not available.")

    if input_df.empty:
        logger.warning("Input DataFrame for _perform_prediction is empty.")
        return PredictResponse(predictions=[], success=True, message="No data provided for prediction, so no predictions made.")

    try:
        logger.info(f"Original DataFrame for preprocessing (first 5 rows):\n{input_df.head()}")
          # Preprocess the data - ensure preprocess_sales_data is robust
        df_proc = preprocess_sales_data(input_df.copy())  # Pass a copy
        logger.info(f"Preprocessed DataFrame columns after preprocess_sales_data: {df_proc.columns.tolist()}")
        
        # Check if Weekly_Sales exists in the input and handle appropriately
        has_weekly_sales = 'Weekly_Sales' in df_proc.columns
        if has_weekly_sales:
            logger.info("Input data contains 'Weekly_Sales' column - this will be preserved unscaled")
            # We'll preserve it for response but not use it for prediction
            weekly_sales_original = df_proc['Weekly_Sales'].copy()
        
        # Scale features using the loaded scaler or create a new one if none is loaded
        df_proc_scaled = df_proc.copy()
        
        if loaded_scaler is not None:
            # Use the pre-trained scaler from training (transform only, not fit_transform)
            try:
                # Use scale_features with the loaded scaler for consistency
                # The scale_features function will handle Weekly_Sales properly now
                df_proc_scaled, _ = scale_features(df_proc, loaded_scaler)
                logger.info("Successfully scaled features using the pre-trained scaler")
            except Exception as e:
                logger.error(f"Error using pre-trained scaler: {str(e)}")
                logger.warning("Falling back to unscaled features due to scaler error")
                df_proc_scaled = df_proc.copy()
        else:
            # If no scaler was loaded, we have to fit a new one (not ideal for production)
            logger.warning("No pre-trained scaler was loaded. Creating and fitting a new scaler (not recommended for production).")
            try:
                df_proc_scaled, temp_scaler = scale_features(df_proc)
                logger.info("Successfully created and fit a new scaler as fallback")
            except Exception as e:
                logger.error(f"Error creating new scaler: {str(e)}")
                # In case of error, use unscaled features
                df_proc_scaled = df_proc.copy()
        
        df_proc_values = df_proc_scaled.values  # Convert to numpy array like in training
        
        logger.info(f"Preprocessed DataFrame columns after preprocess_sales_data and scaling: {df_proc_scaled.columns.tolist()}")
        logger.info(f"Preprocessed DataFrame for prediction (first 5 rows):\n{df_proc_scaled.head()}")

        if df_proc.empty and not input_df.empty:
            logger.warning("Preprocessing resulted in an empty DataFrame from non-empty input.")
            return PredictResponse(predictions=[], success=True, message="Data preprocessed to empty, no predictions made.")
        elif df_proc.empty and input_df.empty:
             return PredictResponse(predictions=[], success=True, message="No data provided, no predictions made.")

        expected_features = selected_model_data.get('feature_names')
        
        # Keep track of both unscaled and scaled versions
        df_aligned = df_proc
        df_aligned_scaled = df_proc_scaled
        df_aligned_values = df_proc_values  # Default to use all scaled features as values

        if expected_features:
            logger.info(f"Model '{model_name}' expects features: {expected_features}")
            
            # Check for missing features
            missing_features = set(expected_features) - set(df_proc.columns)
            if missing_features:
                logger.error(f"Missing features in preprocessed data for model '{model_name}': {missing_features}. Expected: {expected_features}, Got: {df_proc.columns.tolist()}")
                raise HTTPException(status_code=500, detail=f"Internal server error: Preprocessing did not produce required features for model '{model_name}'. Missing: {missing_features}")

            # Check for extra features (and log them)
            extra_features = set(df_proc.columns) - set(expected_features)
            if extra_features:
                logger.warning(f"Extra features in preprocessed data not used by model '{model_name}': {extra_features}. These will be dropped.")
            
            # Align both dataframes to expected_features
            try:
                df_aligned = df_proc[expected_features]
                df_aligned_scaled = df_proc_scaled[expected_features]  # Keep the scaled version aligned too
                df_aligned_values = df_aligned_scaled.values  # Convert to numpy array for prediction
                logger.info(f"DataFrame columns aligned to expected features for model '{model_name}'. Aligned columns: {df_aligned.columns.tolist()}")
            except KeyError as e:
                logger.error(f"KeyError during feature alignment for model '{model_name}': {e}. This should have been caught by missing_features check.")
                raise HTTPException(status_code=500, detail=f"Internal server error: Feature alignment failed for model '{model_name}'.")
        else:
            logger.warning(f"No explicit feature names found for model '{model_name}'. "
                           f"Predicting based on the column order from preprocess_sales_data. "
                           f"Ensure preprocess_sales_data output ({df_proc.columns.tolist()}) "
                           f"matches the training data structure for this model implicitly.")        # Make predictions using the function from models.train - using the NumPy array values
        preds = predict(selected_model_data, df_aligned_values)  # Using the numpy array values like in training
        
        predictions_list = preds.tolist() if hasattr(preds, 'tolist') else list(preds)

        logger.info(f"Prediction successful for {len(predictions_list)} records using {model_name} model. Predictions (first 5): {predictions_list[:5]}")
        return PredictResponse(
            predictions=predictions_list,
            success=True,
            message=f"Successfully predicted {len(predictions_list)} records using {model_name} model."
        )
    except ValueError as ve: # Catch specific errors from preprocessing or data conversion
        logger.error(f"ValueError during _perform_prediction: {ve}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Invalid data format or value during processing: {str(ve)}")
    except Exception as e: # Catch other errors during prediction logic
        logger.error(f"Error in _perform_prediction: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error during prediction processing: {str(e)}")


@app.post("/api/predict_json", response_model=PredictResponse, tags=["Predictions"])
async def predict_from_json(request: PredictRequest):
    """
    Predict sales from JSON data.
    Expects a list of records and a model name.
    """
    logger.info(f"Received JSON prediction request for model: {request.model}")
    model_name = request.model.lower() if request.model else "xgboost"  # Default to xgboost

    # Model availability check (can be done here or within _perform_prediction,
    # doing it here allows for a more specific early exit if model doesn't exist at all)
    if model_name not in available_models or available_models.get(model_name) is None or available_models.get(model_name).get('model') is None:
        logger.error(f"Model '{model_name}' not loaded or not available for JSON request.")
        raise HTTPException(status_code=503, detail=f"Model '{model_name}' not available.")

    if not request.data:
        logger.warning("No data provided in JSON request.")
        raise HTTPException(status_code=400, detail="No data provided for prediction.")

    try:
        if not isinstance(request.data, list) or not all(isinstance(item, dict) for item in request.data):
            raise HTTPException(status_code=400, detail="Input data must be a list of records (dictionaries).")
        
        df = pd.DataFrame(request.data)
        if df.empty:
            logger.info("Received empty data list in JSON request.")
            # Consistent with _perform_prediction, return success with empty predictions
            return PredictResponse(predictions=[], success=True, message="No data provided in the list for prediction.")

        # Call the helper function for actual prediction logic
        return await _perform_prediction(df, model_name)

    except HTTPException as he: # Re-raise known HTTP exceptions
        logger.error(f"HTTP Exception during JSON prediction: {he.detail}")
        raise he
    except Exception as e: # Catch unexpected errors during JSON request handling (e.g., DataFrame conversion)
        logger.error(f"Unexpected error processing JSON request: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error processing JSON request: {str(e)}")


@app.post("/api/predict_csv", response_model=PredictResponse, tags=["Predictions"])
async def predict_from_csv(
    model_name: str = Form(default="xgboost", description="Name of the model to use (e.g., 'linear', 'xgboost')"),
    file: UploadFile = File(..., description="CSV file containing sales data for prediction")
):
    """
    Predict sales from an uploaded CSV file.
    """
    logger.info(f"Received CSV prediction request for model: {model_name}")
    
    # Model availability check
    if model_name.lower() not in available_models or available_models.get(model_name.lower()) is None or available_models.get(model_name.lower()).get('model') is None:
        logger.error(f"Model '{model_name}' not loaded or not available for CSV request.")
        raise HTTPException(status_code=503, detail=f"Model '{model_name}' not available.")

    if not file.filename.endswith('.csv'):
        logger.warning(f"Invalid file type uploaded: {file.filename}")
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV file.")

    try:
        contents = await file.read()
        if not contents:
            logger.warning("Uploaded CSV file is empty.")
            raise HTTPException(status_code=400, detail="CSV file is empty.")
            
        df = pd.read_csv(io.BytesIO(contents))
        
        if df.empty:
            logger.info("CSV file parsed to an empty DataFrame.")
            return PredictResponse(predictions=[], success=True, message="CSV file is empty or contains no data rows.")

        # Call the helper function for actual prediction logic
        return await _perform_prediction(df, model_name)

    except HTTPException as he: # Re-raise known HTTP exceptions
        logger.error(f"HTTP Exception during CSV prediction: {he.detail}")
        raise he
    except pd.errors.EmptyDataError: # Specifically for pd.read_csv if it fails on empty data before df.empty check
        logger.error("Uploaded CSV file is empty or unparseable (EmptyDataError).", exc_info=True)
        raise HTTPException(status_code=400, detail="Uploaded CSV file is empty or could not be parsed.")
    except pd.errors.ParserError:
        logger.error("Failed to parse CSV file.", exc_info=True)
        raise HTTPException(status_code=400, detail="Could not parse the CSV file. Please check its format.")
    except Exception as e: # Catch unexpected errors during CSV request handling
        logger.error(f"Unexpected error processing CSV request: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error processing CSV and making prediction: {str(e)}")
    finally:
        await file.close()

@app.get("/model_info", response_model=ModelResponse)
def get_model_info(model_name: str = Query("xgboost", description="Name of the model to get info for (e.g., 'linear', 'xgboost')")):
    model_name = model_name.lower()
    selected_model_data_dict = available_models.get(model_name)

    if selected_model_data_dict is None or selected_model_data_dict.get('model') is None:
        raise HTTPException(status_code=404, detail=f"Model '{model_name}' not found or not loaded.")

    actual_model = selected_model_data_dict['model']
    features = selected_model_data_dict.get('feature_names')
    
    model_actual_name = actual_model.__class__.__name__

    # If features were not in the dict, try to get them from the model directly (backup)
    if features is None:
        if hasattr(actual_model, 'feature_names_in_'):
            features = actual_model.feature_names_in_.tolist()
        elif hasattr(actual_model, 'get_booster') and hasattr(actual_model.get_booster(), 'feature_names'):
            features = actual_model.get_booster().feature_names
        else:
            features = [] # Default to empty list if not found

    model_info_response = {
        "model_name": model_actual_name,
        "model_type": "Regression", # This is generic, could be more specific if known
        "metrics": {"r2_score": "N/A"}, # Placeholder, actual metrics should be stored with the model
        "features": features
    }
    return ModelResponse(**model_info_response)

@app.get("/available_models")
def get_available_models_endpoint():
    """Return a list of available models for prediction"""
    return {"models": [name for name, model in available_models.items() if model is not None]}

@app.get("/health", response_model=HealthResponse)
def health_check():
    is_any_model_loaded = any(model is not None for model in available_models.values())
    return HealthResponse(
        status="healthy" if is_any_model_loaded else "degraded", 
        model_loaded=is_any_model_loaded,
        version="1.0.0"
    )

# Add new endpoint for data visualization
@app.post("/api/visualize_data", response_model=VisualizeResponse, tags=["Data Analysis"])
async def visualize_data(file: UploadFile = File(...)):
    df = None
    contents = None
    try:
        contents = await file.read()
        if not contents:
            logger.warning(f"Uploaded file {file.filename} is empty.")
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        logger.info(f"Processing visualization for file: {file.filename}")

        try:
            # Try decoding with utf-8, then latin-1 as a fallback
            try:
                df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
            except UnicodeDecodeError:
                logger.warning("UTF-8 decoding failed for CSV, trying latin-1.")
                df = pd.read_csv(io.StringIO(contents.decode('latin-1')))
        except pd.errors.EmptyDataError:
            logger.error(f"Uploaded CSV {file.filename} is empty or unparseable (EmptyDataError).", exc_info=True)
            raise HTTPException(status_code=400, detail="Uploaded CSV file is empty or could not be parsed.")
        except pd.errors.ParserError:
            logger.error(f"Failed to parse CSV file {file.filename} for visualization.", exc_info=True)
            raise HTTPException(status_code=400, detail="Could not parse the CSV file. Please check its format.")
        except Exception as e:
            logger.error(f"Unexpected error reading CSV {file.filename}: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Error reading CSV file: {str(e)}")


        if df.empty:
            logger.info(f"CSV file {file.filename} parsed to an empty DataFrame.")
            return VisualizeResponse(
                preprocessed_data=None,
                visualizations=VisualizationData(),
                success=True,
                message="CSV file is empty or contains no data rows."
            )

        logger.info(f"Original columns in uploaded CSV for visualization: {df.columns.tolist()}")
        
        # ...existing code...
        if 'Date' in df.columns:
            try:
                # Attempt to parse with specific format first, then infer
                original_dates = df['Date'].copy() # Keep original for fallback if needed
                try:
                    df['Date'] = pd.to_datetime(df['Date'], format='%d-%m-%Y', errors='raise')
                    logger.info("Parsed 'Date' column with format '%d-%m-%Y' for visualization.")
                except ValueError:
                    logger.warning("Failed to parse 'Date' for visualization with format '%d-%m-%Y', trying to infer format.")
                    df['Date'] = pd.to_datetime(original_dates, infer_datetime_format=True, errors='coerce')
                
                # Fallback if a large portion became NaT with infer_datetime_format
                if df['Date'].isna().sum() > len(df) / 2:
                    logger.warning("High number of NaNs after inferring date format for visualization. Trying with dayfirst=True as a fallback.")
                    # Ensure original_dates is used here if df['Date'] was modified in place by previous attempts
                    df['Date'] = pd.to_datetime(original_dates, dayfirst=True, errors='coerce')

                if df['Date'].notna().any():
                     logger.info("'Date' column converted to datetime for visualization aggregations.")
                else:                logger.warning("'Date' column exists but could not be converted to datetime for all values for visualization.")
            except Exception as e:
                logger.warning(f"Could not convert 'Date' column to datetime for visualization: {e}. Time-based aggregations might be affected.")
        
        # Preprocess a copy of the data for statistics
        df_for_stats = df.copy()
        df_proc = preprocess_sales_data(df_for_stats) # preprocess_sales_data handles its own date parsing if 'Date' is present
        
        # Check if Weekly_Sales exists in the input and handle appropriately
        has_weekly_sales = 'Weekly_Sales' in df_proc.columns
        if has_weekly_sales:
            logger.info("Visualization data contains 'Weekly_Sales' column - this will be preserved separately during scaling")
            # Preserve it before scaling
            weekly_sales_original = df_proc['Weekly_Sales'].copy()
            # Remove from DataFrame that will be scaled to avoid scaler errors
            df_proc_for_scaling = df_proc.drop('Weekly_Sales', axis=1)
        else:
            df_proc_for_scaling = df_proc.copy()
        
        # Scale features with the loaded scaler if available, otherwise fit a new one
        if loaded_scaler is not None:
            try:
                df_proc_scaled, _ = scale_features(df_proc_for_scaling, loaded_scaler) # Use the loaded scaler (transform only)
                logger.info("Statistics visualization: Successfully scaled features using pre-trained scaler")
                
                # Add back Weekly_Sales if it existed
                if has_weekly_sales:
                    df_proc_scaled['Weekly_Sales'] = weekly_sales_original
                    logger.info("Added 'Weekly_Sales' back to scaled data for visualization")
                
                # Update df_proc to use the scaled version
                df_proc = df_proc_scaled
            except Exception as e:
                logger.error(f"Statistics visualization: Error using pre-trained scaler: {str(e)}")
                # In case of error with loaded scaler, fit a new one
                df_proc, scaler = scale_features(df_proc) # Fallback to creating a new scaler (original implementation)
        else:
            # No scaler loaded - fit a new one for this data
            df_proc, scaler = scale_features(df_proc) # Scale features and get the scaler
        logger.info(f"Preprocessed DataFrame for stats (first 5 rows):\n{df_proc.head() if not df_proc.empty else 'Empty'}")
        logger.info(f"Preprocessed DataFrame columns for stats: {df_proc.columns.tolist() if not df_proc.empty else 'Empty'}")

        stats_data: Optional[DataStats]
        source_for_stats = df_proc if not df_proc.empty else df # Fallback to original df if preprocessing yields empty
        
        if source_for_stats.empty:
            stats_data = None
        else:
            stats_data = DataStats(
                columns=source_for_stats.columns.tolist(),
                rows=len(source_for_stats),
                statistics={
                    col: {
                        "min": float(source_for_stats[col].min()) if pd.api.types.is_numeric_dtype(source_for_stats[col]) and source_for_stats[col].notna().any() else None,
                        "max": float(source_for_stats[col].max()) if pd.api.types.is_numeric_dtype(source_for_stats[col]) and source_for_stats[col].notna().any() else None,
                        "mean": float(source_for_stats[col].mean()) if pd.api.types.is_numeric_dtype(source_for_stats[col]) and source_for_stats[col].notna().any() else None,
                        "median": float(source_for_stats[col].median()) if pd.api.types.is_numeric_dtype(source_for_stats[col]) and source_for_stats[col].notna().any() else None,
                    }
                    for col in source_for_stats.select_dtypes(include=np.number).columns
                },
                categorical_columns=[col for col in source_for_stats.select_dtypes(include=['object', 'category']).columns]
            )

        # ...existing code...
        # Aggregations for visualizations (using the original df after column mapping and date conversion)
        store_performances = []
        if 'Store' in df.columns and 'Weekly_Sales' in df.columns and pd.api.types.is_numeric_dtype(df['Weekly_Sales']) and df['Weekly_Sales'].notna().any():
            store_sales_agg = df.groupby('Store')['Weekly_Sales'].sum().reset_index()
            store_performances = [StorePerformance(store=int(row['Store']), average_sales=float(row['Weekly_Sales'])) for _, row in store_sales_agg.iterrows()]
        else:
            logger.warning("Could not generate store performance: 'Store' or 'Weekly_Sales' missing, not numeric, or all NaN.")

        time_trends = []
        if 'Date' in df.columns and 'Weekly_Sales' in df.columns and pd.api.types.is_datetime64_any_dtype(df['Date']) and pd.api.types.is_numeric_dtype(df['Weekly_Sales']) and df['Weekly_Sales'].notna().any():
            # ...existing code...
            # Ensure Date is not NaT before resampling
            df_time_agg = df.dropna(subset=['Date'])
            if not df_time_agg.empty:
                 # ...existing code...
                 # Resample to weekly, using Monday as the start of the week. Sum sales.
                time_sales_agg = df_time_agg.set_index('Date').resample('W-MON')['Weekly_Sales'].sum().reset_index()
                time_trends = [TimeTrend(period=row['Date'].strftime('%Y-%m-%d'), average_sales=float(row['Weekly_Sales'])) for _, row in time_sales_agg.iterrows()]
        else:
            logger.warning("Could not generate time trends: 'Date' (datetime) or 'Weekly_Sales' (numeric) missing, or all NaN.")
            
        department_sales_list = []
        if 'Dept' in df.columns and 'Weekly_Sales' in df.columns and pd.api.types.is_numeric_dtype(df['Weekly_Sales']) and df['Weekly_Sales'].notna().any():
            # ...existing code...
            # Ensure Dept is not all NaN
            if df['Dept'].notna().any():
                dept_sales_agg = df.groupby('Dept')['Weekly_Sales'].sum().reset_index()
                department_sales_list = [DepartmentSales(department=str(row['Dept']), total_sales=float(row['Weekly_Sales'])) for _, row in dept_sales_agg.iterrows()] # ...existing code... # Assuming Dept can be non-integer
            else:
                logger.warning("Could not generate department sales: 'Dept' column is all NaN.")
        else:
            logger.warning("Could not generate department sales: 'Dept' or 'Weekly_Sales' missing, not numeric, or all NaN.")

        visualization_data = VisualizationData(
            store_performance=store_performances,
            time_trend=time_trends,
            department_sales=department_sales_list
        )

        return VisualizeResponse(
            preprocessed_data=stats_data,
            visualizations=visualization_data,
            success=True,
            message="Data visualization processed successfully."
        )
    except HTTPException as he:
        logger.error(f"HTTPException in visualize_data: {he.detail}", exc_info=True)
        raise he # ...existing code... # Re-raise HTTPException to be handled by FastAPI
    except Exception as e:
        logger.error(f"Unexpected error in visualize_data endpoint: {e}", exc_info=True)
        # ...existing code...
        # Create minimal stats for error response to avoid further errors
        minimal_stats_error_response = DataStats(columns=[], rows=0, statistics={}, categorical_columns=[])
        if df is not None and not df.empty: # ...existing code... # Try to get columns from original df if available
            try:
                minimal_stats_error_response = DataStats(
                    columns=df.columns.tolist(),
                    rows=len(df),
                    statistics={}, 
                    categorical_columns=[col for col in df.select_dtypes(include=['object', 'category']).columns if col in df.columns]
                )
            except Exception as stat_err:
                 logger.error(f"Error creating minimal stats for error response: {stat_err}")
        
        return VisualizeResponse(
            preprocessed_data=minimal_stats_error_response,
            visualizations=VisualizationData(), # ...existing code... # Empty visualizations
            success=False,
            message=f"An error occurred during data visualization: {str(e)}"
        )
    finally:
        if file:
            try:
                await file.close()
                logger.debug(f"File {file.filename} closed.")
            except Exception as e_close:
                logger.error(f"Error closing file {file.filename}: {e_close}", exc_info=True)

# ... rest of the file