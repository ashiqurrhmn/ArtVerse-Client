"use client";

import { motion } from "framer-motion";
import { ImageIcon, Heart } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function ArtworkCard({ artwork, index }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (!user || !artwork?._id) return;
    const checkSaved = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/saved-artworks/check/${encodeURIComponent(user.email)}/${artwork._id}`);
        const data = await res.json();
        setIsSaved(data.saved);
      } catch (e) {
        console.error("Failed to check saved status");
      }
    };
    checkSaved();
  }, [user, artwork?._id]);

  const toggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please log in to save artworks");
      return;
    }

    setIsSaving(true);
    // Optimistic update
    setIsSaved(!isSaved);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/saved-artworks/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, artworkId: artwork._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIsSaved(data.saved);
      toast.success(data.saved ? "Artwork saved!" : "Removed from saved", { duration: 2000 });
    } catch (e) {
      console.error(e);
      // Revert optimistic update
      setIsSaved(isSaved);
      toast.error("Failed to update saved status");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-background/60 backdrop-blur-xl border border-separator/60 shadow-xl shadow-black/5 dark:shadow-none transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-primary/40 cursor-pointer"
    >
      {/* Invisible Full-Card Link */}
      <Link href={`/artworks/${artwork._id}`} className="absolute inset-0 z-10" aria-label={`View details of ${artwork.title}`} />

      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted/20 rounded-t-2xl pointer-events-none">
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
          className="absolute right-2 sm:right-3 top-2 sm:top-3 rounded-full bg-background/90 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-bold text-foreground shadow-md border border-separator/50 z-20 pointer-events-none"
        >
          ${artwork.price}
        </motion.div>

        {/* Sold Badge */}
        {artwork.sold && (
          <div className="absolute left-2 sm:left-3 top-2 sm:top-3 z-20 pointer-events-none">
            <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-white shadow-lg">
              Sold
            </span>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="relative z-20 flex flex-col justify-end p-3.5 bg-background/40 pointer-events-none">
        <h3 className="text-base font-bold text-foreground line-clamp-1 transition-colors group-hover:text-primary pointer-events-auto w-fit">
          <Link href={`/artworks/${artwork._id}`} className="relative z-30">
            {artwork.title}
          </Link>
        </h3>
        {artwork.email ? (
          <Link href={`/artist/${artwork.email}`} className="mt-2 flex items-center gap-2 pointer-events-auto relative z-30 group/artist">
            <div className="size-5 rounded-full bg-accent/50 overflow-hidden flex items-center justify-center shrink-0 border border-separator/50 transition-colors group-hover/artist:border-primary">
              {artwork.artistImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={artwork.artistImage} alt="Artist" className="size-full object-cover" />
              ) : (
                <span className="text-[10px] font-bold text-primary group-hover/artist:text-primary-foreground">
                  {(artwork.userName || "A")[0].toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-muted-foreground line-clamp-1">
              by{" "}
              <span className="text-foreground/90 group-hover/artist:text-primary transition-colors">
                {artwork.userName || "Unknown Artist"}
              </span>
            </p>
          </Link>
        ) : (
          <div className="mt-2 flex items-center gap-2 pointer-events-auto relative z-30">
            <div className="size-5 rounded-full bg-accent/50 overflow-hidden flex items-center justify-center shrink-0 border border-separator/50">
              <span className="text-[10px] font-bold text-primary">
                {(artwork.userName || "A")[0].toUpperCase()}
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground line-clamp-1">
              by{" "}
              <span className="text-foreground/90">{artwork.userName || "Unknown Artist"}</span>
            </p>
          </div>
        )}

        <div className="mt-3.5 flex items-center justify-between border-t border-separator/60 pt-3 pointer-events-auto relative z-30">
          <Link href={`/artworks/${artwork._id}`}>
            <button className="rounded-full bg-primary/10 px-3 py-1.5 text-[11px] sm:text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
              View<span className="hidden sm:inline"> Artwork</span>
            </button>
          </Link>
          <button 
            onClick={toggleSave}
            disabled={isSaving}
            className={`flex size-8 items-center justify-center rounded-full transition-colors ${
              isSaved 
                ? "bg-red-500/15 text-red-500 hover:bg-red-500/25" 
                : "bg-muted/40 text-muted-foreground hover:bg-red-500/15 hover:text-red-500"
            }`}
            title={isSaved ? "Remove from saved" : "Save artwork"}
          >
            <Heart className={`size-4 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
