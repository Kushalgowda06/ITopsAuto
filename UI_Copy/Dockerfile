# Use official Node.js image
FROM node:20 AS builder

WORKDIR /app

# Copy package files first
COPY UI_Copy/package.json UI_Copy/package-lock.json* ./

# Install dependencies
RUN npm install

# Copy frontend source code
COPY UI_Copy/ .

# Build the React app
RUN npm run build

# -------------------------------
# Stage 2: Production Nginx
# -------------------------------
FROM nginx:alpine

# Remove default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built React app to Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
