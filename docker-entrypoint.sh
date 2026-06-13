#!/bin/sh
set -e

cat > public/config.js << CONF
window.__CONFIG__ = {
  BASE_URL: "${BASE_URL:-}",
  AUTH_API_URL: "${AUTH_API_URL:-}",
};
CONF

exec node server.js