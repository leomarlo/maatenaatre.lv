#!/bin/bash
# Called by GitHub Actions via SSH forced command.
# This is the ONLY thing the CI SSH key is allowed to run.
set -e

APP_DIR="/opt/maatenaatre"

cd "$APP_DIR"
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
docker image prune -f
