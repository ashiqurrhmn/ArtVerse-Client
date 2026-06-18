"use client";

import { motion } from "framer-motion";
import { ImageIcon, Heart } from "lucide-react";
import Link from "next/link";

export default function ArtworkCard({ artwork, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-background/60 backdrop-blur-xl border border-separator/60 shadow-xl shadow-black/5 dark:shadow-none transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-primary/40 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted/20 rounded-t-3xl">
        {artwork.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={artwork.image}
            alt={artwork.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
            <ImageIcon className="size-10" />
          </div>
        )}

        {/* Hover Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Floating Price Badge */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="absolute right-3 top-3 rounded-full bg-background/90 backdrop-blur-md px-3 py-1.5 text-sm font-bold text-foreground shadow-md border border-separator/50 z-10"
        >
          ${artwork.price}
        </motion.div>
      </div>

      {/* Details Section */}
      <div className="relative z-20 flex flex-col justify-end p-4 bg-background/40">
        <h3 className="text-lg font-bold text-foreground line-clamp-1 transition-colors group-hover:text-primary">
          {artwork.title}
        </h3>
        <p className="mt-1 text-xs font-medium text-muted-foreground line-clamp-1">
          by <span className="text-foreground/90">{artwork.userName || "Alex Sterling"}</span>
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-separator/60 pt-3">
          <Link href={`/artworks/${artwork._id}`}>
            <button className="rounded-full bg-primary/10 px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
              View<span className="hidden sm:inline"> Artwork</span>
            </button>
          </Link>
          <button 
            className="flex size-8 items-center justify-center rounded-full bg-muted/40 text-muted-foreground transition-colors hover:bg-red-500/15 hover:text-red-500"
            title="Save artwork"
          >
            <Heart className="size-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
