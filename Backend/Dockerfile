# Base image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies for psycopg2 and other build tools
RUN apt-get update && \
    apt-get install -y gcc libpq-dev python3-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Default environment variables (can be overridden)
ENV VAULT_TOKEN=""
ENV DB_HOST=""
ENV DB_NAME=""
ENV DB_USER=""
ENV DB_PASSWORD=""

# Expose backend port
EXPOSE 8000

# Run backend
CMD ["python", "main.py"]
