# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY NewKnowledgeAssist/package.json NewKnowledgeAssist/package-lock.json ./

RUN npm install

# Copy entire frontend source including public and src
COPY NewKnowledgeAssist/. .

# Build the frontend
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build output to nginx
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
