FROM python:3.10-buster

RUN apt-get update && apt-get install -y openssl  build-essential curl

WORKDIR /app

## only install deps if this files change
COPY pyproject.toml .
COPY requirements.txt .
COPY setup.py .

RUN python3 -m pip install --upgrade pip \
    && pip3 install --user -r requirements.txt
    
RUN pip install  --user "uvicorn[standard]" gunicorn alembic

## copy other api source files
COPY . .

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=${PYTHONPATH}:/app/src
ENV PATH=/root/.local/bin:${PATH}


EXPOSE 5000

CMD ["./run.sh"]
