from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from enum import Enum

class PredictRequest(BaseModel):
    data: List[Dict[str, Any]] = Field(..., description="List of dictionaries representing sales data rows")
    model: str = Field(default="xgboost", description="Name of the model to use (e.g., 'linear', 'xgboost')")

class PredictResponse(BaseModel):
    predictions: List[float] = Field(..., description="List of predicted sales values")
    success: bool = Field(default=True, description="Whether the prediction was successful")
    message: Optional[str] = Field(default=None, description="Additional information about the prediction")

class ModelType(str, Enum):
    REGRESSION = "Regression"
    CLASSIFICATION = "Classification"
    TIME_SERIES = "TimeSeries"

class ModelResponse(BaseModel):
    model_name: str = Field(..., description="Name of the model")
    model_type: ModelType = Field(..., description="Type of the model")
    metrics: Dict[str, float] = Field(..., description="Performance metrics of the model")
    features: Optional[List[str]] = Field(default=None, description="Features used by the model")

class HealthResponse(BaseModel):
    status: str = Field(..., description="Health status of the API")
    model_loaded: bool = Field(..., description="Whether the model is loaded")
    version: str = Field(default="1.0.0", description="API version")

class ColumnStatistics(BaseModel):
    min: Optional[float] = Field(None, description="Minimum value")
    max: Optional[float] = Field(None, description="Maximum value")
    mean: Optional[float] = Field(None, description="Mean value")
    median: Optional[float] = Field(None, description="Median value")

class DataStats(BaseModel):
    columns: List[str] = Field(..., description="List of column names")
    rows: int = Field(..., description="Number of rows in the dataset")
    statistics: Dict[str, ColumnStatistics] = Field(..., description="Statistics for numeric columns")
    categorical_columns: List[str] = Field(..., description="List of categorical column names")

class StorePerformance(BaseModel):
    store: int = Field(..., description="Store ID")
    average_sales: float = Field(..., description="Average sales for this store")

class TimeTrend(BaseModel):
    period: str = Field(..., description="Time period (month, year)")
    average_sales: float = Field(..., description="Average sales in this period")

class DepartmentSales(BaseModel):
    department: str = Field(..., description="Department ID or name")
    total_sales: float = Field(..., description="Total sales for this department")

class VisualizationData(BaseModel):
    store_performance: List[StorePerformance] = Field(default_factory=list, description="Store performance data")
    time_trend: List[TimeTrend] = Field(default_factory=list, description="Time trend data")
    department_sales: List[DepartmentSales] = Field(default_factory=list, description="Department sales data")

class VisualizeResponse(BaseModel):
    preprocessed_data: Optional[DataStats] = Field(None, description="Statistics about the preprocessed data")
    visualizations: VisualizationData = Field(..., description="Data for visualizations")
    success: bool = Field(default=True, description="Whether the visualization was successful")
    message: str = Field(..., description="Information about the visualization process")
