"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Search } from "lucide-react";

// Mock Data
const artworks = [
  { id: "A1", title: "Silent Symphony", artist: "Jane Doe", image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80", href: "#" },
  { id: "A2", title: "Neon Whispers", artist: "Alex Smith", image: "https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?w=800&q=80", href: "#" },
  { id: "A3", title: "Abstract Harmony", artist: "Emily Chen", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80", href: "#" },
  { id: "A4", title: "Urban Decay", artist: "Michael Ross", image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&q=80", href: "#" },
  { id: "A5", title: "Golden Hour", artist: "Sarah Johnson", image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80", href: "#" },
];

export default function BoughtArtworksPage() {
  return (
    <div className="flex-1 w-full p-4 md:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Bought Artworks</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your personal collection of purchased masterpieces.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search your collection..."
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-separator rounded-xl text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
          />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((artwork, idx) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group flex flex-col bg-background border border-separator rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[4/3] bg-muted/20 overflow-hidden">
                <Image
                  src={artwork.image}
                  alt={artwork.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link
                    href={artwork.href}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
                  >
                    View Details
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Details */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">
                  {artwork.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  By <span className="font-medium text-foreground">{artwork.artist}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
