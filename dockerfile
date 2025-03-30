# 🔹 Stage 1: Builder
FROM node:23-alpine AS builder

# Install dependencies (if needed for build, e.g., node-gyp)
# RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# --- Add nginx.conf.template to the source repo ---
# --- Add entrypoint.sh to the source repo (ensure it's executable) ---

COPY package*.json ./
# Use ci for potentially faster and more reliable installs in CI/build environments
RUN npm install --frozen-lockfile
COPY . .

# Build the static assets
RUN npm run build

# 🔹 Stage 2: Runner
FROM node:23-alpine

# Install serve globally
RUN npm install -g serve

# Set working directory (optional, but good practice)
WORKDIR /app

# Copy built static files from the builder stage
# Ensure the source path matches your build output directory (usually 'dist' or 'build')
COPY --from=builder /app/dist ./dist

# Expose the port serve listens on (default is 3000)
EXPOSE 3000

# Command to serve the 'dist' directory
# '-s' flag ensures it works well with single-page applications (SPA routing)
CMD ["serve", "-s", "dist"]