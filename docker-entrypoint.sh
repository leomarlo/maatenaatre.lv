#!/bin/sh
set -e

echo "Syncing database schema..."
node_modules/.bin/prisma db push --accept-data-loss

if [ "${SEED_DB:-false}" = "true" ]; then
  echo "Seeding database..."
  node_modules/.bin/prisma db seed
fi

echo "Starting app..."
exec node server.js
