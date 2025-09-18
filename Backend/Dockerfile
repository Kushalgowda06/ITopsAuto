# Backend Dockerfile
FROM python:3.12-slim

# Set work directory inside container
WORKDIR /app

# Copy requirements and install dependencies first (cache)
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend source code
COPY . .

# Expose port
EXPOSE 8000

# Command to run FastAPI backend
CMD ["uvicorn", "fastapi_main:app", "--host", "0.0.0.0", "--port", "8000"]
