# Sales-Forecasting-and-Optimization

## Project Structure (Production/MLOps)

- `src/` — Production code (data, features, models, API, utils)
- `models/` — Saved trained models
- `data/` — Raw data (e.g., Walmart.csv)
- `notebooks/` — Exploratory notebooks
- `Makefile` — Common tasks (EDA, train, serve)
- `frontend/` — React frontend application

## Backend Setup

Install dependencies:
```sh
pip install -r requirements.txt
```

## Training Models

To train and save models:
```sh
make train
```

## Starting the Backend API

To start the FastAPI server for predictions:
```sh
cd src
python -m uvicorn api.main:app --reload
```

Or using Make:
```sh
make serve
```

- The API will be available at `http://localhost:8000`.
- Use `/predict` endpoint for single predictions.
- Use `/predict_from_csv` for batch predictions from CSV files.
- Use `/predict_with_model` to choose specific models.

## استخدام واجهة برمجة التطبيقات مع الواجهة الأمامية

### مثال على استخدام API في React

```javascript
// مثال على استدعاء API للتنبؤ
async function predictSales(data) {
  try {
    const response = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error predicting sales:', error);
    return { success: false, message: error.message, predictions: [] };
  }
}

// مثال على تحميل ملف CSV للتنبؤ
async function uploadCSVForPrediction(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('http://localhost:8000/predict_from_csv', {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error('Error uploading CSV:', error);
    return { success: false, message: error.message, predictions: [] };
  }
}
```

## Frontend Setup

To run the React frontend:
```sh
cd frontend
npm install
npm start
```

The frontend will be available at `http://localhost:3000` and includes:
- Dashboard with sales insights
- Form for single predictions
- CSV upload for batch predictions
- Interactive visualizations

## Complete Project Execution

1. Start the backend server:
```sh
cd src
python -m uvicorn api.main:app --reload
```

2. In another terminal, start the frontend server:
```sh
cd frontend
npm install
npm start
```

3. Open your browser to `http://localhost:3000`

## Testing

To run all unit tests:
```sh
make test
```

## Project Features

- **Prediction**: Submit features to predict weekly sales
- **Visualization**: Interactive charts of sales patterns and insights
- **CSV Processing**: Batch predictions from CSV files
- **Multiple Models**: Compare XGBoost and Linear Regression model performance
