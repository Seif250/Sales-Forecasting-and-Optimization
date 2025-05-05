# Sales-Forecasting-and-Optimization

## Project Structure (Production/MLOps)

- `src/` — Production code (data, features, models, API, utils)
- `models/` — Saved trained models
- `data/` — Raw data (e.g., Walmart.csv)
- `notebooks/` — Exploratory notebooks
- `Makefile` — Common tasks (EDA, train, serve)

## Setup

Install dependencies:
```sh
pip install -r requirements.txt
choco install make
cd src
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
