import joblib
import os
from pathlib import Path

model_path = 'models/xgboost_model.pkl'
print(f"Checking model at {os.path.abspath(model_path)}")

try:
    model_data = joblib.load(model_path)
    if isinstance(model_data, dict):
        print(f"Model data keys: {list(model_data.keys())}")
        
        if 'model' in model_data:
            model = model_data['model']
            print(f"Model type: {type(model)}")
            
            if hasattr(model, 'n_features_in_'):
                print(f"Model n_features_in_: {model.n_features_in_}")
            
            if hasattr(model, 'get_booster'):
                booster = model.get_booster()
                print(f"Booster type: {type(booster)}")
                if hasattr(booster, 'feature_names'):
                    print(f"Booster feature names: {booster.feature_names}")
                    print(f"Booster feature count: {len(booster.feature_names) if booster.feature_names else 'None'}")
        
        if 'feature_names' in model_data:
            feature_names = model_data['feature_names']
            print(f"Feature names count: {len(feature_names)}")
            print(f"Sample feature names: {feature_names[:10]}")
    else:
        print(f"Model is not a dict, type: {type(model_data)}")
except Exception as e:
    print(f"Error loading model: {str(e)}") 