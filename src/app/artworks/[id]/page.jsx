"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getArtworkById } from "@/lib/api/artworks";
import { ArrowLeft, Heart, Share2, ImageIcon, ShoppingCart, Calendar, Tag, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ArtworkDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  
  const [artwork, setArtwork] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchArtwork = async () => {
      try {
        const data = await getArtworkById(id);
        setArtwork(data);
      } catch (error) {
        console.error("Failed to fetch artwork", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtwork();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <span className="size-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading masterpiece...</p>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-muted/50 mb-6">
          <ImageIcon className="size-10 text-muted-foreground/50" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Artwork Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          The artwork you are looking for does not exist or has been removed by the artist.
        </p>
        <button 
          onClick={() => router.back()}
          className="rounded-full bg-primary px-6 py-2.5 font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-20 pt-4 md:pt-6">
      
      <div className="mx-auto max-w-7xl">
        
        {/* Back Button */}
        <div className="px-4 md:px-10 lg:px-12 md:pt-6 mb-6">
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-muted/40 group-hover:bg-accent transition-colors">
              <ArrowLeft className="size-4" />
            </div>
            Back to Browse
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 md:px-10 lg:px-12">
          
          {/* Left Column: Image Viewer */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full overflow-hidden bg-muted/10 border-y md:border border-separator/40 shadow-xl md:shadow-2xl md:rounded-3xl flex items-center justify-center min-h-[40vh] md:min-h-[70vh]"
            >
              {artwork.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={artwork.image} 
                  alt={artwork.title}
                  className="w-full h-full object-contain max-h-[75vh] md:max-h-[85vh] backdrop-blur-3xl" 
                />
              ) : (
                <ImageIcon className="size-20 text-muted-foreground/30" />
              )}
            </motion.div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-start px-4 md:px-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Category & Status */}
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                  <Tag className="size-3" />
                  {artwork.category}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-separator px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Calendar className="size-3" />
                  {artwork.date || "Just now"}
                </span>
              </div>

              {/* Title & Artist */}
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground leading-tight tracking-tight mb-4">
                {artwork.title}
              </h1>
              
              <div className="flex items-center gap-3 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-separator/60">
                <div className="flex size-10 md:size-12 items-center justify-center rounded-full bg-accent text-base md:text-lg font-bold text-primary shadow-inner">
                  {(artwork.userName || "A")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Created by</p>
                  <p className="text-base md:text-lg font-bold text-foreground">{artwork.userName || "Alex Sterling"}</p>
                </div>
              </div>

              {/* Price & Primary Actions */}
              <div className="mb-8 md:mb-10">
                <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 md:mb-2">Price</p>
                <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-5 md:mb-6">
                  ${artwork.price}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
                  <button className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-2xl bg-foreground px-6 md:px-8 py-3.5 md:py-4 text-sm font-bold text-background transition-all hover:bg-foreground/90 hover:scale-[1.02] shadow-xl shadow-foreground/20">
                    <ShoppingCart className="size-4 md:size-5" />
                    Purchase Art
                  </button>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex size-12 md:size-14 items-center justify-center rounded-2xl border-2 border-separator bg-background text-muted-foreground transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500">
                      <Heart className="size-5 md:size-6" />
                    </button>
                    
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-foreground mb-3">About the Artwork</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {artwork.description || "No description provided by the artist."}
                </p>
              </div>

              {/* Trust Badges */}
              <div className="rounded-2xl bg-accent/30 p-5 border border-separator/50 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="size-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-foreground">Authenticity Guaranteed</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Verified original artwork from the artist.</p>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
