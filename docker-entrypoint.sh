#!/bin/sh
set -e

echo "Running database migrations..."
node_modules/.bin/prisma migrate deploy

if [ "${SEED_DB:-false}" = "true" ]; then
  echo "Seeding database..."
  node_modules/.bin/prisma db seed
fi

echo "Starting app..."
exec node server.js
