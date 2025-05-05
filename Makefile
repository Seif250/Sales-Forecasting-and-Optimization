train:
	python -m scripts.train

serve:
	uvicorn src.api.main:app --reload
	