#!/bin/bash
# Initial server setup for maatenaatre.lv
# Run once on a fresh Hetzner Ubuntu 24.04 instance as root:
#   bash setup.sh
set -e

DEPLOY_USER="deploy"
APP_DIR="/opt/maatenaatre"
REPO_URL="https://github.com/leomarlo/maatenaatre.lv.git"  # <-- update this

# ── Docker ────────────────────────────────────────────────────────────────────
echo "Installing Docker..."
apt-get update -q
apt-get install -y -q ca-certificates curl git

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -q
apt-get install -y -q docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

systemctl enable --now docker
echo "Docker installed: $(docker --version)"

# ── Deploy user ───────────────────────────────────────────────────────────────
echo ""
echo "Creating '$DEPLOY_USER' user..."
useradd -m -s /bin/bash "$DEPLOY_USER"
usermod -aG docker "$DEPLOY_USER"

DEPLOY_HOME="/home/$DEPLOY_USER"
mkdir -p "$DEPLOY_HOME/.ssh"
chmod 700 "$DEPLOY_HOME/.ssh"
touch "$DEPLOY_HOME/.ssh/authorized_keys"
chmod 600 "$DEPLOY_HOME/.ssh/authorized_keys"

# ── Your personal SSH key (unrestricted) ──────────────────────────────────────
echo ""
echo "Paste your PERSONAL SSH public key for interactive access to '$DEPLOY_USER',"
echo "then press Enter and Ctrl+D. (Leave empty to skip.)"
PERSONAL_KEY=$(cat || true)
if [ -n "$PERSONAL_KEY" ]; then
  echo "$PERSONAL_KEY" >> "$DEPLOY_HOME/.ssh/authorized_keys"
  echo "Personal key added (unrestricted)."
fi

# ── GitHub Actions deploy key (force-command restricted) ─────────────────────
echo ""
echo "Generating restricted SSH key for GitHub Actions..."
ssh-keygen -t ed25519 -C "github-actions@maatenaatre.lv" \
  -f "$DEPLOY_HOME/.ssh/github_actions" -N ""

CI_PUBKEY=$(cat "$DEPLOY_HOME/.ssh/github_actions.pub")

# The forced command means this key can ONLY run deploy/run.sh — nothing else.
echo "command=\"$APP_DIR/deploy/run.sh\",no-pty,no-port-forwarding,no-X11-forwarding,no-agent-forwarding $CI_PUBKEY" \
  >> "$DEPLOY_HOME/.ssh/authorized_keys"

chown -R "$DEPLOY_USER:$DEPLOY_USER" "$DEPLOY_HOME/.ssh"

echo ""
echo "┌─────────────────────────────────────────────────────────────────┐"
echo "│  Add this PRIVATE key to GitHub → Settings → Secrets           │"
echo "│  as SSH_PRIVATE_KEY                                             │"
echo "│  Also add:  SSH_HOST = this server's IP                        │"
echo "│             SSH_USER = deploy                                   │"
echo "└─────────────────────────────────────────────────────────────────┘"
cat "$DEPLOY_HOME/.ssh/github_actions"

# ── Clone repo ────────────────────────────────────────────────────────────────
echo ""
echo "Cloning repository to $APP_DIR..."
mkdir -p "$APP_DIR"
git clone "$REPO_URL" "$APP_DIR"
chmod +x "$APP_DIR/deploy/run.sh"
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$APP_DIR"

# ── .env ──────────────────────────────────────────────────────────────────────
cp "$APP_DIR/.env.example" "$APP_DIR/.env"
chown "$DEPLOY_USER:$DEPLOY_USER" "$APP_DIR/.env"
chmod 600 "$APP_DIR/.env"

echo ""
echo "┌─────────────────────────────────────────────────────────────────┐"
echo "│  Edit the .env file before continuing:                          │"
echo "│    nano $APP_DIR/.env                                           │"
echo "│                                                                 │"
echo "│  Required values:                                               │"
echo "│    DB_PASSWORD    — strong random password                      │"
echo "│    JWT_SECRET     — strong random secret (32+ chars)            │"
echo "│    ADMIN_EMAIL    — your admin email                            │"
echo "│    ADMIN_PASSWORD — your admin password                         │"
echo "│    SMTP_*         — your mail server credentials                │"
echo "└─────────────────────────────────────────────────────────────────┘"
echo ""
read -rp "Press Enter once you have saved the .env file to continue..."

# ── Initial deploy ────────────────────────────────────────────────────────────
echo ""
echo "Building and starting containers (with DB seed)..."
su -c "cd $APP_DIR && SEED_DB=true docker compose -f docker-compose.prod.yml up -d --build" "$DEPLOY_USER"

echo ""
echo "✓ Setup complete. The site should be live at https://maatenaatre.lv shortly."
echo ""
echo "Useful commands (ssh as $DEPLOY_USER, then):"
echo "  docker compose -f $APP_DIR/docker-compose.prod.yml ps"
echo "  docker compose -f $APP_DIR/docker-compose.prod.yml logs -f"
