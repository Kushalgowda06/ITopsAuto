# -----------------------------
# Base image
# -----------------------------
FROM python:3.12-slim

# -----------------------------
# Set working directory
# -----------------------------
WORKDIR /app

# -----------------------------
# Copy requirements and install dependencies
# -----------------------------
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# -----------------------------
# Copy backend source code
# -----------------------------
COPY . .

# -----------------------------
# Expose backend port
# -----------------------------
EXPOSE 8000

# -----------------------------
# Start backend server
# -----------------------------
CMD ["uvicorn", "fastapi_main:app", "--host", "0.0.0.0", "--port", "8000"]
