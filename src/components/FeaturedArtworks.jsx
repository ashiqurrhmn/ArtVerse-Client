"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, ImageIcon, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@heroui/react";

const FeaturedArtworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"}/api/artworks/featured`
        );
        const data = await res.json();
        setArtworks(data || []);
      } catch (error) {
        console.error("Failed to fetch featured artworks", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-20 md:py-28 px-4 md:px-6 max-w-7xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6"
        >
          <Sparkles className="size-4" />
          <span>Curated Selection</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent mb-4"
        >
          Featured Artworks
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-base md:text-lg max-w-2xl"
        >
          Discover hand-picked masterpieces from our community of talented artists.
          New inspirations arriving every day.
        </motion.p>
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="bg-background/40 border border-separator/60 rounded-3xl overflow-hidden shadow-sm animate-pulse flex flex-col"
            >
              <div className="w-full aspect-[4/3] bg-muted/20"></div>
              <div className="p-5 md:p-6 flex flex-col gap-4">
                <div>
                  <div className="h-5 bg-muted/30 rounded-md w-3/4 mb-3"></div>
                  <div className="h-4 bg-muted/30 rounded-md w-1/2"></div>
                </div>
                <div className="mt-2 pt-4 border-t border-separator/60 flex items-center justify-between">
                  <div className="h-5 bg-muted/30 rounded-md w-1/4"></div>
                  <div className="h-8 bg-muted/30 rounded-full w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : artworks.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            No featured artworks yet
          </h3>
          <p className="text-muted-foreground max-w-sm">
            Check back later for curated masterpieces.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {artworks.map((artwork, idx) => (
            <motion.div
              key={artwork._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group flex flex-col bg-background/60 backdrop-blur-md border border-separator/60 rounded-3xl overflow-hidden shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 dark:shadow-none transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[4/3] bg-muted/20 overflow-hidden">
                {artwork.image ? (
                  <Image
                    src={artwork.image}
                    alt={artwork.title || "Featured Artwork"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
                {/* Overlay tags */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full border border-white/20">
                    {artwork.category}
                  </span>
                </div>
                {/* View Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 md:p-6">
                  <Button
                    as={Link}
                    href={`/artworks/${artwork._id}`}
                    radius="full"
                    className="w-full bg-primary text-primary-foreground font-bold shadow-lg hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 text-xs md:text-sm py-2 md:py-3 h-auto"
                  >
                    View Masterpiece
                    <ExternalLink className="w-3 h-3 md:w-4 md:h-4 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 md:p-6 flex flex-col flex-1">
                <h3 className="text-base md:text-xl font-bold text-foreground mb-1 md:mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {artwork.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                  {artwork.description}
                </p>
                
                <div className="pt-4 border-t border-separator/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {artwork.artistImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={artwork.artistImage} 
                        alt={artwork.userName} 
                        className="w-8 h-8 rounded-full object-cover border border-separator"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {artwork.userName?.charAt(0)?.toUpperCase() || "A"}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-foreground line-clamp-1 max-w-[120px]">
                      {artwork.userName || "Unknown Artist"}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-foreground bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    ${artwork.price}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      <div className="mt-16 text-center">
        <Button
          as={Link}
          href="/browse"
          radius="full"
          variant="bordered"
          className="border-2 border-foreground text-foreground px-6 py-4 md:px-8 md:py-6 font-bold text-sm md:text-lg w-full sm:w-auto shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:bg-foreground hover:text-background transition-all duration-300 group"
        >
          Explore All Artworks <ArrowRight size={20} className="ml-2 transition-transform duration-300 group-hover:translate-x-1.5" />
        </Button>
      </div>
    </section>
  );
};

export default FeaturedArtworks;
