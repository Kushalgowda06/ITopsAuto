# Backend Dockerfile
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt


# Copy entire backend source code
COPY . .

# Expose backend port
EXPOSE 8000

# Start FastAPI
CMD ["uvicorn", "fastapi_main:app", "--host", "0.0.0.0", "--port", "8000"]
