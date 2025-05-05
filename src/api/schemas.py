from pydantic import BaseModel
from typing import List, Dict, Any

class PredictRequest(BaseModel):
    data: List[Dict[str, Any]]  # List of dicts representing rows

class PredictResponse(BaseModel):
    predictions: List[float]
