# Use official Python image
FROM python:3.12-slim

# Set working directory inside container
WORKDIR /app

# Copy requirements and install dependencies first (cache)
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy entire backend source code
COPY . .

# Expose backend port
EXPOSE 8000

# Default command to run backend
CMD ["python", "fastapi_main.py"]
