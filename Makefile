eda:
	python -m scripts.eda

train:
	python -m scripts.train

back:
	python -m uvicorn src.api.main:app --reload --host 0.0.0.0

front:
	cd frontend && npm start

install:
	pip install -r requirements.txt
