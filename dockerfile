# 🔹 Development Environment
FROM node:23-alpine

# Install OS dependencies if needed for runtime or dev server (e.g., native modules)
# RUN apk add --no-cache openssl some-other-package

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy the rest of the application code
# Note: This ensures the code exists in the image if not mounted.
# For development, you'll typically mount your local source code
# using 'docker run -v $(pwd):/app' to see live changes.
COPY . .

# Expose the port the development server listens on
# Common defaults are 3000, 5173 (Vite), 8080. Adjust if necessary.
EXPOSE 5173

# Command to run the development server
# Adjust 'dev' if your script is named differently (e.g., 'start', 'serve:dev')
CMD ["npm", "run", "dev", "--host"]