# 🔹 Stage 1: Builder
FROM node:23-alpine AS builder

# Install dependencies
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy application source code
COPY . .

# build application
RUN npm run build

# Remove development dependencies to reduce image size
RUN npm prune --production

# 🔹 Stage 2: Runner
FROM nginx:alpine

# Copy built files to the nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration if you have one
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
