# syntax=docker/dockerfile:1
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONUNBUFFERED=1
ENV PORT=8001

EXPOSE 8001

CMD ["sh", "-c", "python3 -m backend.ingestion.seed_central_province && uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8001}"]

