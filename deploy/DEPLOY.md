# Deployment Guide — maatenaatre.lv

## Overview

```
GitHub (main branch)
  → GitHub Actions (SSH)
    → Hetzner server (Ubuntu 24.04)
      → Docker Compose
          ├── Caddy  (reverse proxy + HTTPS, ports 80/443)
          ├── App    (Next.js, internal only)
          └── DB     (PostgreSQL, internal only)
```

---

## Part 1 — One-time local setup

### 1.1 Create Prisma migrations

The production entrypoint uses `prisma migrate deploy`, which requires migration
files to exist. Run this once locally:

```bash
npx prisma migrate dev --name init
```

This creates `prisma/migrations/`. Commit and push everything:

```bash
git add prisma/migrations deploy/ .github/
git commit -m "add migrations and deployment config"
git push
```

---

## Part 2 — Hetzner server

### 2.1 Create the server

In the Hetzner Cloud console:
- **Image:** Ubuntu 24.04
- **Type:** CX22 or higher (2 vCPU, 4 GB RAM is plenty)
- **Firewall:** allow inbound TCP 22, 80, 443
- **SSH key:** add your personal public key so you can log in as root initially

### 2.2 Run the setup script

Copy the script to the server and run it as root:

```bash
scp deploy/setup.sh root@<HETZNER_IP>:/root/setup.sh
ssh root@<HETZNER_IP> "bash /root/setup.sh"
```

The script will:
1. Install Docker
2. Create the `deploy` user and add it to the `docker` group
3. Add your personal SSH key to `deploy`'s `authorized_keys` (unrestricted)
4. Generate a separate GitHub Actions SSH key — **restricted by forced command**
   so it can only run `deploy/run.sh`, nothing else
5. Print the GitHub Actions **private key** to your console — copy it now
6. Clone the repo to `/opt/maatenaatre`
7. Pause so you can fill in `.env`
8. Run the initial deploy with `SEED_DB=true`

### 2.3 Fill in the .env file

When the script pauses, open a second terminal and SSH in as `deploy`:

```bash
ssh deploy@<HETZNER_IP>
nano /opt/maatenaatre/.env
```

Fill in all values:

```env
DB_PASSWORD=          # generate: openssl rand -base64 24
JWT_SECRET=           # generate: openssl rand -base64 32
ADMIN_EMAIL=          # your email address
ADMIN_PASSWORD=       # strong password you will remember

SMTP_HOST=smtp.mailbox.org
SMTP_PORT=587
SMTP_USER=register@maatenaatre.lv
SMTP_PASS=            # your mailbox.org account password
SMTP_FROM=register@maatenaatre.lv
```

Save, then go back to the first terminal and press Enter to continue.

---

## Part 3 — Cloudflare DNS

In your Cloudflare dashboard for `maatenaatre.lv`:

### 3.1 Remove the existing apex CNAME

Delete the record:
```
CNAME  maatenaatre.lv  →  maatenaatre-lv.pages.dev
```

### 3.2 Add A records pointing to your Hetzner server

| Type | Name | Value | Proxy |
|------|------|-------|-------|
| A | `@` | `<HETZNER_IP>` | DNS only (gray cloud) |
| A | `www` | `<HETZNER_IP>` | DNS only (gray cloud) |

> Keep gray cloud for now. Caddy needs direct access to obtain a Let's Encrypt
> certificate. You can enable the Cloudflare proxy later if you want CDN/DDoS
> protection — if you do, set SSL/TLS mode to **Full (strict)**.

Your existing email records (MX, DKIM, SPF, DMARC) are already correct —
leave them untouched.

---

## Part 4 — GitHub Actions CI/CD

### 4.1 Add repository secrets

Go to your repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret name | Value |
|-------------|-------|
| `SSH_HOST` | Your Hetzner server IP |
| `SSH_USER` | `deploy` |
| `SSH_PRIVATE_KEY` | The private key printed by `setup.sh` |

### 4.2 How deployments work

Every push to `main` (directly or via merged PR) triggers `.github/workflows/deploy.yml`:

1. GitHub Actions SSHs into the server as `deploy`
2. The SSH key is restricted — it can **only** run `deploy/run.sh`
3. `run.sh` does: `git pull` → `docker compose up -d --build` → `docker image prune`

To deploy manually without a push:
```bash
ssh deploy@<HETZNER_IP>
# The forced command runs immediately on connect — no shell needed
```

Or trigger it from the Actions tab in GitHub → select the workflow → **Run workflow**.

---

## Part 5 — Verify the deployment

```bash
# Check all three containers are running
ssh deploy@<HETZNER_IP>
docker compose -f /opt/maatenaatre/docker-compose.prod.yml ps

# Watch live logs
docker compose -f /opt/maatenaatre/docker-compose.prod.yml logs -f

# Check Caddy obtained a TLS certificate
docker compose -f /opt/maatenaatre/docker-compose.prod.yml logs caddy
```

The site should be live at `https://maatenaatre.lv` within a minute of the
containers starting (Caddy needs a few seconds to get the cert).

---

## Part 6 — End-to-end testing

### 6.1 Basic site

| Check | Expected |
|-------|----------|
| `https://maatenaatre.lv` | Home page loads |
| `https://www.maatenaatre.lv` | Redirects to `https://maatenaatre.lv` |
| `http://maatenaatre.lv` | Redirects to `https://` |
| Browser padlock | Valid TLS certificate (Let's Encrypt) |

### 6.2 Admin login (email + password)

1. Go to `https://maatenaatre.lv/login`
2. Enter your `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`
3. Should redirect to `/admin`
4. You should see the admin dashboard with menu item management

To log out, there should be a logout button in the admin UI, or clear cookies.

### 6.3 Magic link (email-based login)

The magic link is currently API-only (no dedicated UI page). Test it with curl
or a REST client:

**Step 1 — request a magic link:**
```bash
curl -X POST https://maatenaatre.lv/api/auth/send-link \
  -H "Content-Type: application/json" \
  -d '{"email": "your@email.com"}'
# Expected: {"ok":true}
```

**Step 2 — check your inbox**

You should receive an email from `register@maatenaatre.lv` with a link like:
```
https://maatenaatre.lv/auth/verify?token=<uuid>
```

The token expires in **15 minutes**.

**Step 3 — click the link**

The `/auth/verify` page automatically exchanges the token for a session cookie
and redirects to `/admin`.

**What to check if the email doesn't arrive:**
```bash
# Check app logs for SMTP errors
docker compose -f /opt/maatenaatre/docker-compose.prod.yml logs app | grep -i smtp
docker compose -f /opt/maatenaatre/docker-compose.prod.yml logs app | grep -i send-link
```

Common causes: wrong `SMTP_PASS`, mailbox.org blocking the connection,
`SMTP_FROM` address not verified with mailbox.org.

### 6.4 Admin — create a menu item

1. Log in as admin at `/login`
2. Go to `/admin`
3. Fill in the form: name, description, price, category
4. Submit — the item should appear in the list
5. Go to `https://maatenaatre.lv/menu` — the item should be visible publicly

### 6.5 Token edge cases

| Scenario | Expected behaviour |
|----------|--------------------|
| Click the magic link a second time | "Token already used" error on `/auth/verify` |
| Wait >15 min before clicking | "Token expired" error |
| Tamper with the token in the URL | "Invalid token" error |

---

## Ongoing operations

**Update the site** — just push to `main`. GitHub Actions deploys automatically.

**View logs:**
```bash
ssh deploy@<HETZNER_IP>
docker compose -f /opt/maatenaatre/docker-compose.prod.yml logs -f app
```

**Update .env** (e.g. change SMTP password):
```bash
ssh deploy@<HETZNER_IP>
nano /opt/maatenaatre/.env
docker compose -f /opt/maatenaatre/docker-compose.prod.yml up -d
```

**Database access:**
```bash
docker compose -f /opt/maatenaatre/docker-compose.prod.yml exec db \
  psql -U maatenaatre -d maatenaatre
```
