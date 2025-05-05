eda:
	python -m scripts.eda
train:
	python -m scripts.train

serve:
	uvicorn src.api.main:app --reload