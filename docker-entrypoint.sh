#!/bin/sh
set -e

cat > public/config.js << CONF
window.__CONFIG__ = {
  AUTH_URL: "${AUTH_URL:-}",
  API_URL: "${API_URL:-}",
};
CONF

exec node server.js