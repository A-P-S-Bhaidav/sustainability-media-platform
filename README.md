# EcoLens 🌿

**EcoLens** is a next-generation sustainability platform designed to help teams track, visualize, and report the real-world impact of their environmental field projects. Powered by AI and secure enterprise-grade authentication, EcoLens automatically organizes media assets, extracts intelligent tags (like *reforestation*, *solar-panel*), and generates stunning before-and-after interactive comparisons.

## 🚀 Features

- **Real-Time Impact Dashboard**: Monitor total projects, media assets, and AI-generated tags dynamically.
- **Interactive Comparisons**: Showcase the "before and after" of your sustainability efforts using interactive image sliders.
- **AI Auto-Tagging**: Field media is automatically analyzed and tagged by AI, allowing for powerful discovery and semantic search.
- **Secure by Default**: Built with NextAuth (Auth.js v5) and robust middleware to ensure your project data remains entirely secure and private.
- **Edge-to-Edge Design**: A beautiful, modern, 100/100 UI designed for both professional aesthetics and maximum usability.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (hosted on [Neon](https://neon.tech/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Auth.js v5](https://authjs.dev/) (Google OAuth)
- **Styling**: Vanilla CSS Modules (Glassmorphism, CSS Variables, Full-Screen Layout)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (e.g., Neon)
- Google Cloud Console account (for OAuth credentials)

### 1. Clone the repository

```bash
git clone https://github.com/A-P-S-Bhaidav/sustainability-media-platform.git
cd sustainability-media-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Your `.env` file should look like this:
```env
# Database
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"

# Auth.js v5
AUTH_SECRET="your-random-32-byte-secret"
AUTH_URL="http://localhost:3000"

# Google OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### 4. Database Setup

Run Prisma migrations to set up the PostgreSQL schema:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚢 Deployment (Vercel)

EcoLens is optimized for deployment on Vercel.

1. Push your code to GitHub.
2. Import the project into Vercel.
3. In the **Environment Variables** section, add your `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `AUTH_GOOGLE_ID`, and `AUTH_GOOGLE_SECRET`.
4. Ensure the `Install Command` runs `npm install` and the `Build Command` runs `npm run build`.
   - *Note: Our `package.json` includes `postinstall: prisma generate` to automatically generate the Prisma client during Vercel builds.*
5. Deploy!

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
