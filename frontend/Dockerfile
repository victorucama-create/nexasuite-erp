# Development stage
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Development command
CMD ["npm", "run", "dev"]

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy .env.production if exists
COPY .env.production /usr/share/nginx/html/.env

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# Development stage with hot reload
FROM node:18-alpine AS dev

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including dev
RUN npm install

# Copy source code
COPY . .

# Install nodemon for hot reload
RUN npm install -g nodemon

# Expose ports
EXPOSE 3000 24678

# Development command with hot reload
CMD ["npm", "run", "dev", "--", "--host"]
