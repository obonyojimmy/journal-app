FROM python:3.10-slim-buster

RUN apt-get update && apt-get install -y openssl  build-essential curl

WORKDIR /app

## only install deps if this files change
COPY pyproject.toml .
COPY requirements.txt .
COPY setup.py .

RUN python3 -m pip install --upgrade pip \
    && pip install --user -r requirements.txt \
    && pip install --user --no-cache-dir "uvicorn[standard]" gunicorn alembic

## copy other api source files
COPY . .

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=${PYTHONPATH}:/app/taskflow

EXPOSE 5000

CMD ["./run.sh"]
