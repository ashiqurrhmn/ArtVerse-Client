import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "ArtVerse - Discover & Buy Original Artworks",
  description: "Buy, sell, and explore extraordinary artworks.",
  icons: {
    icon: "/assets/art-logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased overflow-x-hidden`}
      suppressHydrationWarning
    >
      <body className="overflow-x-hidden">
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
