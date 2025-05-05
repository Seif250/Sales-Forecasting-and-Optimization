# Sales-Forecasting-and-Optimization

## Project Structure (Production/MLOps)

- `src/` — Production code (data, features, models, API, utils)
- `models/` — Saved trained models
- `data/` — Raw data (e.g., Walmart.csv)
- `notebooks/` — Exploratory notebooks
- `tests/` — Unit tests
- `Makefile` — Common tasks (train, serve, test)

## Setup

1. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```

## Training

To train and save models:
```sh
make train
```

## Serving the API

To start the FastAPI server for predictions:
```sh
make serve
```

- The API will be available at `http://127.0.0.1:8000`.
- Use the `/predict` endpoint for batch predictions.

## Testing

To run all unit tests:
```sh
make test
```

## Example API Usage

POST `/predict`
```json
{
  "data": [
    {"Store": 1, "Dept": 1, "Date": "2010-02-05", "Weekly_Sales": 24924.50, "IsHoliday": false}
  ]
}
```

Response:
```json
{"predictions": [24500.0]}
```
