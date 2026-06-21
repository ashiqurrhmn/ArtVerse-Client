"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, ArrowRight, User, Sparkles } from "lucide-react";

const TopArtists = () => {
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"}/api/top-artists`
        );
        const data = await res.json();
        setArtists(data || []);
      } catch (error) {
        console.error("Failed to fetch top artists", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopArtists();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 md:py-28 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-40">
          <div className="size-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
        </div>
      </section>
    );
  }

  if (artists.length === 0) return null;

  return (
    <section className="py-20 md:py-28 px-4 md:px-6 max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col items-center text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6"
        >
          <Trophy className="size-4" />
          <span>Top Creators</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent mb-4"
        >
          Artists of the Month
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-base md:text-lg max-w-2xl"
        >
          Meet the visionary artists whose works are capturing the most attention and sales.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {artists.map((artist, index) => (
          <motion.div
            key={artist.email || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/artist/${encodeURIComponent(artist.email)}`} className="group block h-full">
              <div className="relative overflow-hidden rounded-3xl border border-separator/60 bg-background shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-primary/50 flex flex-col h-full">
                
                {/* Banner Background */}
                <div 
                  className={`h-32 w-full relative opacity-90 group-hover:opacity-100 transition-opacity ${!artist.coverImage ? `bg-gradient-to-r from-primary/30 to-primary/5 border-b border-primary/10` : ''}`}
                >
                  {artist.coverImage && (
                    <img src={artist.coverImage} alt="Cover" className="absolute inset-0 h-full w-full object-cover" />
                  )}
                  {artist.coverImage && (
                    <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
                  )}
                  
                  {/* Ranking Badge */}
                  <div className="absolute top-4 right-4 flex items-center justify-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-sm font-bold text-foreground shadow-sm backdrop-blur-md">
                    <Trophy className={`size-3.5 ${index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : index === 2 ? "text-amber-700" : "text-primary"}`} />
                    #{index + 1}
                  </div>
                </div>

                {/* Avatar */}
                <div className="relative -mt-16 flex justify-center">
                  <div className="relative size-32 rounded-full border-4 border-background bg-muted shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500 z-10">
                    {artist.avatar ? (
                      <img
                        src={artist.avatar}
                        alt={artist.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                        <User className="size-12" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 text-center flex flex-col items-center flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {artist.name}
                  </h3>
                  
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
                    <Sparkles className="size-3" />
                    {artist.sales} Artworks Sold
                  </div>

                  <div className="mt-auto w-full inline-flex items-center justify-center gap-2 rounded-xl bg-muted/50 border border-transparent px-6 py-3 text-sm font-semibold text-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/25">
                    View Portfolio
                    <ArrowRight className="size-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TopArtists;
