# Frontend Dockerfile
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy entire frontend source code
COPY . .

# Build React app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build to nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
