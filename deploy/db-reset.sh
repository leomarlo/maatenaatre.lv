#!/bin/bash
# Reset and re-seed the production database.
# Run on the server as the deploy user:
#   bash /opt/maatenaatre/deploy/db-reset.sh
set -e

APP_DIR="/opt/maatenaatre"
cd "$APP_DIR"

echo "Applying schema..."
docker compose -f docker-compose.prod.yml exec -T app sh -c \
  "node_modules/.bin/prisma db push --accept-data-loss"

echo "Seeding..."
docker compose -f docker-compose.prod.yml exec -T app sh -c \
  "node_modules/.bin/prisma db seed"

echo "Done."
