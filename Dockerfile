# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# Set default build arguments for environment variables
ARG REACT_APP_API_URL=http://localhost:5000/api
ARG REACT_APP_BASE_URL=http://localhost:5000

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL

# Build the React app for production
RUN npm run build

# Stage 2: Serve the production build with Nginx
FROM nginx:alpine

# Copy built assets from Stage 1
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration for port 3000 and SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
