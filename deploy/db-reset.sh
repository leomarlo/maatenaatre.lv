#!/bin/bash
# Reset and re-seed the production database.
# Run on the server as the deploy user:
#   bash /opt/maatenaatre/deploy/db-reset.sh
set -e

APP_DIR="/opt/maatenaatre"
cd "$APP_DIR"

echo "Resetting database and re-seeding..."
docker compose -f docker-compose.prod.yml exec -T app sh -c \
  "node_modules/.bin/prisma migrate reset --force --skip-generate"

echo "Done."
