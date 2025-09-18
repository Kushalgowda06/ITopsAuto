# -----------------------------
# Base image
# -----------------------------
FROM node:20-alpine

# -----------------------------
# Set working directory
# -----------------------------
WORKDIR /app

# -----------------------------
# Copy package files and install dependencies
# -----------------------------
COPY package*.json ./
RUN npm install --legacy-peer-deps

# -----------------------------
# Copy frontend source code
# -----------------------------
COPY . .

# -----------------------------
# Build the React app
# -----------------------------
RUN npm run build

# -----------------------------
# Install serve to run production build
# -----------------------------
RUN npm install -g serve

# -----------------------------
# Expose frontend port
# -----------------------------
EXPOSE 80

# -----------------------------
# Start frontend server
# -----------------------------
CMD ["serve", "-s", "build", "-l", "80"]
