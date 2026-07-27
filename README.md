# Referral Hub

This repo contains a simple referral hub site and a daily X posting workflow.

## Daily X posting

The workflow in [.github/workflows/x-post.yml](.github/workflows/x-post.yml) runs every day at 08:00 UTC and posts one referral code/link pair to X.

### Required GitHub secrets

Add these secrets in your GitHub repository settings:

- `X_API_KEY`
- `X_API_SECRET`
- `X_ACCESS_TOKEN`
- `X_ACCESS_TOKEN_SECRET`

### Local dry run

Run:

```bash
npm install
npm run post:x
```

If credentials are not set, the script will print the post content instead of publishing it.
