# 🔹 Stage 1: Builder
FROM node:23-alpine AS builder

# Install dependencies
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# --- Add nginx.conf.template to the source repo ---
# --- Add entrypoint.sh to the source repo (ensure it's executable) ---

COPY package*.json ./
# Use ci for potentially faster and more reliable installs in CI/build environments
RUN npm ci --frozen-lockfile
COPY . .

# --- Ensure your frontend code is modified to use relative /api paths ---
RUN npm run build

# 🔹 Stage 2: Runner
FROM nginx:alpine

# Install envsubst for substituting environment variables
RUN apk add --no-cache gettext

# Remove default nginx config served by the base image
RUN rm /etc/nginx/conf.d/default.conf

# Copy built static files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx config template into a specific directory within the image
# Nginx base image suggests using /etc/nginx/templates
COPY --from=builder /app/nginx.conf.template /etc/nginx/templates/nginx.conf.template

# Copy and ensure the entrypoint script is executable
COPY --from=builder /app/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port 80 (already exposed by base image, but good practice)
EXPOSE 80

# Set the entrypoint script to run when the container starts
ENTRYPOINT ["/entrypoint.sh"]

# CMD is now handled by the entrypoint script (exec nginx -g 'daemon off;')