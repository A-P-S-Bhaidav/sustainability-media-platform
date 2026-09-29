# ImpactHub Deployment Guide

ImpactHub is a modern, AI-powered Next.js application designed for Impact and Sustainability NGOs. This guide explains how to deploy it from scratch to Vercel (recommended) or any Node.js environment.

## Prerequisites

- Node.js 18.17 or later
- A [Vercel](https://vercel.com) account (for seamless Next.js deployment)
- A [Cloudinary](https://cloudinary.com) account
- A [GitHub](https://github.com) or Google Cloud project (for NextAuth OAuth)
- A PostgreSQL or MySQL database (we used SQLite for local development, but you should migrate to Postgres for production).

---

## Step 1: Set up your Database (Production)

For local development, we used `dev.db` (SQLite). For production, we recommend **Neon (Serverless Postgres)** or **Supabase**.

1. Create a Postgres database.
2. Get the connection string (e.g. `postgresql://user:password@host:port/mydb?schema=public`).
3. Update `prisma/schema.prisma` to use Postgres instead of SQLite:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Run `npx prisma db push` or `npx prisma migrate deploy` locally connected to your production DB to initialize the schema.

---

## Step 2: Set up Cloudinary

1. Log into your Cloudinary Dashboard.
2. Note your **Cloud Name**, **API Key**, and **API Secret**.
3. Go to Settings > Upload and create a new **Upload Preset**. Set the Signing Mode to "Unsigned" and give it a name like `impact_media_preset`.
4. Ensure your new upload preset matches the `uploadPreset` prop in `src/components/ui/CloudinaryUpload.tsx`.

---

## Step 3: Set up OAuth (GitHub/Google)

NextAuth requires OAuth credentials to let users log in.

### GitHub
1. Go to GitHub > Settings > Developer Settings > OAuth Apps.
2. Create a New OAuth App.
3. Set the Authorization callback URL to: `https://your-app-domain.com/api/auth/callback/github`
4. Copy the Client ID and Client Secret.

---

## Step 4: Configure Environment Variables

In your deployment platform (e.g., Vercel dashboard), add the following Environment Variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host/dbname"

# NextAuth (Auth.js v5)
AUTH_URL="https://your-app-domain.com"
AUTH_SECRET="your-super-secret-random-string" # Generate with `openssl rand -base64 32`

# OAuth Providers
AUTH_GITHUB_ID="your_github_oauth_client_id"
AUTH_GITHUB_SECRET="your_github_oauth_client_secret"
AUTH_GOOGLE_ID="your_google_oauth_client_id"
AUTH_GOOGLE_SECRET="your_google_oauth_client_secret"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

---

## Step 5: Deploy to Vercel

1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com/new) and click "Add New Project".
3. Import your GitHub repository.
4. Open the "Environment Variables" section and add all the variables from Step 4.
5. In the "Build and Output Settings", Vercel should automatically detect Next.js.
   - Build Command: `prisma generate && next build`
6. Click **Deploy**.

## Post-Deployment Validation

1. Visit your deployed URL.
2. Attempt to log in using GitHub/Google.
3. Navigate to the `/upload` page and upload a test image to verify Cloudinary integration.
4. Check the `/search` page to ensure UI components load correctly.

Congratulations! Your AI-powered impact platform is live! 🚀
