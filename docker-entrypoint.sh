#!/bin/sh
set -e

echo "Waiting for database..."
sleep 2

echo "Pushing Prisma schema to database..."
node_modules/.bin/prisma db push --accept-data-loss

echo "Running seed..."
node_modules/.bin/prisma db seed

echo "Starting app..."
exec node server.js
