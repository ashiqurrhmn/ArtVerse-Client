# ArtVerse

ArtVerse is a dynamic, multi-role web platform designed for the creative community. It serves as a digital marketplace where artists can showcase and sell their artworks, buyers can browse, save, and purchase art securely, and administrators can oversee the entire ecosystem.

## Key Features

- **Multi-Role Authentication**: Seamless login and registration with distinct roles for Admins, Artists, and Buyers (powered by Better Auth).
- **Artwork Marketplace**: Browse, search, and filter a wide variety of artworks. Features detailed artwork pages with save/favorite functionality.
- **Secure Payments**: Fully integrated with Stripe for secure and reliable artwork purchases.
- **Dedicated Dashboards**:
  - **Buyers**: Track purchase history, view saved artworks, and manage profile settings.
  - **Artists**: Monitor sales analytics, manage artwork listings, and track revenue.
  - **Admins**: Comprehensive control panel to manage users, update roles, oversee platform transactions, and export data as PDF reports.
- **Modern & Responsive UI**: Built with a focus on aesthetics using HeroUI, Tailwind CSS, and smooth animations with Framer Motion.

## Technologies Used

### Frontend (Client)
- **Framework**: [Next.js](https://nextjs.org/) (v16.2.9) with React 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **UI Library**: [HeroUI](https://heroui.com/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Payments**: Stripe.js
- **Data Visualization**: Recharts
- **PDF Export**: jsPDF & jspdf-autotable

### Backend (Server)
- **Runtime & Framework**: Node.js with [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (using native MongoDB driver)
- **Authentication/Security**: JWT verification via JWKS (using `jose`), CORS, Dotenv
- **Payments**: Stripe Node.js SDK

## Getting Started

First, run the development server for the Next.js client:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

*Note: Ensure your Express backend server is also running and correctly mapped in your environment variables via `NEXT_PUBLIC_BASE_URL`.*
