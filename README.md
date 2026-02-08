# LinkedIn Clone

A full-stack LinkedIn-style social feed application built with Next.js, Clerk authentication, and MongoDB.

## Project Status

This project is actively under development.

## Features

- User authentication with Clerk
- Create text-only posts or posts with images
- Image upload support via Cloudflare R2
- Feed with newest posts first
- Like, unlike, comment, and delete post functionality
- Responsive UI using Tailwind CSS + shadcn/ui primitives

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Authentication:** Clerk
- **File Storage:** Cloudflare R2 (S3-compatible API)
- **UI:** Tailwind CSS, shadcn/ui, Radix UI, Lucide Icons
- **Notifications:** Sonner

## Environment Variables

Create a `.env.local` file in the project root and configure the required values:

```env
# MongoDB
MONGO_DB_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Cloudflare R2 (S3-compatible)
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=

# Optional: public base URL for your R2 bucket/custom domain
# Example: https://cdn.yourdomain.com
R2_PUBLIC_BASE_URL=
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run lint checks

## Notes

- The app uses Next.js server actions for post/comment mutations.
- Remote image domains are configured in `next.config.mjs`.
