# -------------------------------
# Stage 1: Build & Install Dependencies
# -------------------------------
FROM python:3.12-slim AS builder

# Set working directory
WORKDIR /app

# Copy only requirements first to leverage Docker cache
COPY Backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY Backend/ .

# -------------------------------
# Stage 2: Production
# -------------------------------
FROM python:3.12-slim

WORKDIR /app

# Copy installed dependencies from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages

# Copy backend source code
COPY Backend/ .

# Expose backend port
EXPOSE 8000

# Command to run
CMD ["python", "fastapi_main.py"]
