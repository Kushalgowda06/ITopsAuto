# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY "UI_Copy/frontend/package.json" "UI_Copy/frontend/package-lock.json" ./
RUN npm install

# Copy frontend source code
COPY "UI_Copy/frontend/." ./

# Build the frontend
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build output to nginx html folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
