# 🔹 Stage 1: Builder
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json ./

# Install dependencies with specific platform
RUN npm install --legacy-peer-deps --frozen-lockfile --platform=linux --arch=x64

# Copy application source code
COPY . .

# Generate Prisma client & build application
RUN npm run build

# 🔹 Stage 2: Runner
FROM node:20-slim AS runner

# Set working directory
WORKDIR /app

# Copy necessary built files from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public

# Use non-root user for security
USER node

# Expose the required port
EXPOSE 3000

# Start application
CMD ["npm", "run", "start"]
