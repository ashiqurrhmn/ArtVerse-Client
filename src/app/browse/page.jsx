"use client";

import { useState, useEffect } from "react";
import { getArtworks } from "@/lib/api/artworks";
import { ImageIcon } from "lucide-react";
import ArtworkCard from "@/components/ArtworkCard";

export default function BrowseArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const data = await getArtworks();
        // Filter out artworks that are not published if needed, 
        // but for now, we'll just show all of them.
        setArtworks(data || []);
      } catch (error) {
        console.error("Failed to fetch artworks", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  return (
    <main className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            Browse Artworks
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Discover unique pieces from talented artists around the world.
          </p>
        </div>

        {/* Artworks Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-separator/60 bg-background/40 backdrop-blur-xl p-4 shadow-sm">
                <div className="aspect-[4/5] w-full rounded-xl bg-muted/40"></div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-3/4 rounded-md bg-muted/40"></div>
                  <div className="h-3 w-1/2 rounded-md bg-muted/40"></div>
                </div>
              </div>
            ))}
          </div>
        ) : artworks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {artworks.map((artwork, index) => (
              <ArtworkCard key={artwork._id} artwork={artwork} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-muted/30 mb-6">
              <ImageIcon className="size-8 text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No artworks found</h2>
            <p className="text-muted-foreground max-w-sm">
              We couldn't find any artworks at the moment. Check back later for new additions!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
