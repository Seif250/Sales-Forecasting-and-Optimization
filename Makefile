train:
	python scripts/train.py

serve:
	uvicorn src.api.main:app --reload

test:
	pytest tests/
