# Security Setup Instructions

## ⚠️ IMPORTANT: Credentials have been removed from this repository

All sensitive credentials have been removed from the codebase and git tracking. You must configure environment variables before deploying.

## Required Environment Variables

### For SST/Pulumi Deployment

Copy `.env.example` to `.env` and fill in the actual values:

```bash
cp .env.example .env
```

Required variables:
- `DB_PASSWORD` - PostgreSQL database password
- `SECRET_KEY_BASE` - Phoenix secret key base (min 64 chars)
- `CLICKSEND_API_KEY` - ClickSend API key for SMS
- `CLICKSEND_API_USERNAME` - ClickSend username
- `POSTMARK_API_KEY` - Postmark API key for emails
- `NEXT_PUBLIC_DOMAIN_API_KEY` - Domain API key

### For Next.js App

Copy `.env.production.example` to `.env.production`:

```bash
cd limelease/apps/nextjs-app
cp .env.production.example .env.production
# Edit .env.production with real values
```

### For React Native Mobile App

Copy environment templates:

```bash
cd limelease/apps/tenant-mobile
cp .env.example .env
cp .env.dev.example .env.dev
cp keys.development.json.example keys.development.json
# Edit files with real values
```

## Credential Rotation Required

The following credentials were previously committed to git and **MUST be rotated immediately**:

1. **Database Password**: `REDACTED_DB_PASSWORD`
   - Update in AWS/database console
   - Update `DB_PASSWORD` environment variable
   
2. **ClickSend API Key**: `REDACTED_CLICKSEND_KEY`
   - Regenerate at https://dashboard.clicksend.com/
   
3. **Postmark API Key**: `REDACTED_POSTMARK_KEY_1`
   - Regenerate at https://account.postmarkapp.com/
   
4. **Domain API Key**: `REDACTED_DOMAIN_API_KEY`
   - Contact domain provider to regenerate
   
5. **Phoenix Secret Key Base**: `REDACTED_SECRET_KEY_BASE`
   - Generate new: `mix phx.gen.secret` (in Elixir project)
   - Or: `openssl rand -base64 64`

## Generating New Secrets

```bash
# Phoenix/Elixir secret key base
mix phx.gen.secret

# Or using OpenSSL
openssl rand -base64 64
```

## Files Removed from Git

The following files are now ignored and must be created locally:

- `/erl_crash.dump` (crash dumps)
- `limelease/apps/nextjs-app/.env.production`
- `limelease/apps/tenant-mobile/.env`
- `limelease/apps/tenant-mobile/.env.dev`
- `limelease/apps/tenant-mobile/.env.prod`
- `limelease/apps/tenant-mobile/keys.development.json`

## What Was NOT Removed (History Rewrite Not Performed)

**Note**: These credentials still exist in git history. For complete removal, you need to:

1. Rewrite git history using `git-filter-repo` or BFG
2. Force push to all branches
3. Coordinate with all collaborators to re-clone

Contact the team lead if you need instructions for history rewriting.

## Best Practices Going Forward

1. **Never commit secrets** - Always use environment variables
2. **Use `.env` files** - Keep them in `.gitignore`
3. **Rotate regularly** - Update credentials periodically
4. **Use secret managers** - Consider AWS Secrets Manager or similar for production
5. **Review before commit** - Always check `git diff` before pushing

## GitHub Secrets (CI/CD)

For GitHub Actions, add these secrets in repository settings:

- Settings → Secrets and variables → Actions → New repository secret

Add all the environment variables listed above.
