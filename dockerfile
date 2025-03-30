# 🔹 Optimized & Secured Development Environment
# Use a specific Alpine version for better reproducibility
FROM node:23-alpine AS development

# --- Security: Create a non-root user and group ---
RUN addgroup --system --gid 1001 appgroup \
    && adduser --system --uid 1001 appuser --ingroup appgroup

# Set working directory
WORKDIR /app

# Install OS dependencies ONLY if absolutely necessary for runtime/dev server
# RUN apk add --no-cache openssl some-other-package

# Copy package files
# Use chown to ensure the non-root user can modify node_modules if needed later
COPY --chown=appuser:appgroup package*.json ./

# Install dependencies and clean cache
# Running install as root first might be necessary for some global tools or permissions,
# but we'll switch to the non-root user right after.
# Alternatively, run everything as appuser if permissions allow.
RUN npm install
# --- Optimization: Clean npm cache ---
RUN npm cache clean --force

# Copy the rest of the application code as the non-root user
# Ensure .dockerignore is used to exclude secrets, .git, node_modules etc.
COPY --chown=appuser:appgroup . .

# --- Security: Switch to the non-root user ---
USER appuser

# Expose the port the development server listens on (adjust if necessary)
EXPOSE 3000

# Command to run the development server
CMD ["npm", "run", "dev"]