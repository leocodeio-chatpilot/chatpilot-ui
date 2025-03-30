#!/bin/sh
set -e # Exit immediately if a command exits with a non-zero status.

# Define the template file path
TEMPLATE_CONF="/etc/nginx/templates/nginx.conf.template"
# Define the output file path (Nginx default location)
OUTPUT_CONF="/etc/nginx/conf.d/default.conf"

# Export the variables so envsubst can find them
# Use :- to provide a default value if the env var is missing or empty (optional)
export VITE_APP_USER_BACKEND_USER_URL=${VITE_APP_USER_BACKEND_USER_URL:-"http://default-user-service"}
export VITE_APP_USER_BACKEND_MODEL_URL=${VITE_APP_USER_BACKEND_MODEL_URL:-"http://default-model-service"}

echo "Substituting environment variables in Nginx config..."
# Substitute environment variables in the template file
# Use single quotes around the variable list for envsubst
envsubst '${VITE_APP_USER_BACKEND_USER_URL} ${VITE_APP_USER_BACKEND_MODEL_URL}' < "$TEMPLATE_CONF" > "$OUTPUT_CONF"

echo "Nginx configuration generated:"
cat $OUTPUT_CONF # Log the generated config for debugging

echo "Starting Nginx..."
# Start Nginx in the foreground
exec nginx -g 'daemon off;'