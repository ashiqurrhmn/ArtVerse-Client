"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getArtworkById } from "@/lib/api/artworks";
import {
  ArrowLeft,
  Heart,
  ImageIcon,
  ShoppingCart,
  Calendar,
  Tag,
  ShieldCheck,
  BadgeCheck,
  MessageSquare,
  Send,
  Pencil,
  Trash2,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import CommentSection from "@/components/CommentSection";

export default function ArtworkDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [artwork, setArtwork] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseStats, setPurchaseStats] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (!user || !id) return;
    const checkSaved = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/saved-artworks/check/${encodeURIComponent(user.email)}/${id}`,
        );
        const data = await res.json();
        setIsSaved(data.saved);
      } catch (e) {
        console.error("Failed to check saved status");
      }
    };
    checkSaved();
  }, [user, id]);

  const toggleSave = async () => {
    if (!user) {
      toast.error("Please log in to save artworks");
      return;
    }

    setIsSaving(true);
    setIsSaved(!isSaved);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/saved-artworks/toggle`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, artworkId: id }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIsSaved(data.saved);
      toast.success(data.saved ? "Artwork saved!" : "Removed from saved", {
        duration: 2000,
      });
    } catch (e) {
      console.error(e);
      setIsSaved(isSaved);
      toast.error("Failed to update saved status");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "buyer") return;
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/purchases/stats/${user.email}`,
        );
        const data = await res.json();
        if (data && !data.error) {
          setPurchaseStats(data);
        }
      } catch (err) {
        console.error("Failed to load purchase stats", err);
      }
    };
    fetchStats();
  }, [user]);

  useEffect(() => {
    if (!id) return;

    const fetchArtwork = async () => {
      try {
        const data = await getArtworkById(id);
        setArtwork(data);
      } catch (error) {
        console.error("Failed to fetch artwork", error);
        toast.error("Failed to load artwork details");
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
          <p className="text-muted-foreground font-medium animate-pulse">
            Loading masterpiece...
          </p>
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
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Artwork Not Found
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          The artwork you are looking for does not exist or has been removed by
          the artist.
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

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Please sign in to purchase artwork.");
      return;
    }
    if (user.role !== "buyer") {
      toast.error("Only buyers can purchase artworks.");
      return;
    }

    setIsPurchasing(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: artwork.title,
            image: artwork.image,
            price: artwork.price,
            _id: artwork._id,
            buyerEmail: user.email,
          }),
        },
      );
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(
          data.error || data.message || "Failed to create checkout session."
        );
        setIsPurchasing(false);
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Something went wrong. Please try again.");
      setIsPurchasing(false);
    }
  };

  const isSold = artwork.sold === true;

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

              {/* Sold Overlay */}
              {isSold && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                  <div className="bg-red-600 text-white px-8 py-3 rounded-full text-lg font-extrabold uppercase tracking-widest shadow-2xl rotate-[-12deg]">
                    Sold
                  </div>
                </div>
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
              {/* Status Banners */}
              {artwork.status === "Reviewing" && (
                <div className="mb-6 rounded-2xl bg-yellow-500/10 p-4 border border-yellow-500/20 flex items-start gap-3">
                  <div className="size-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex items-center justify-center font-bold">
                    !
                  </div>
                  <div>
                    <p className="text-sm font-bold text-yellow-600 dark:text-yellow-500">
                      Admin is reviewing this post
                    </p>
                    <p className="text-xs text-yellow-600/80 dark:text-yellow-500/80 mt-0.5">
                      This artwork is currently under review and is not publicly
                      visible yet.
                    </p>
                  </div>
                </div>
              )}

              {artwork.status === "Rejected" && (
                <div className="mb-6 rounded-2xl bg-red-500/10 p-4 border border-red-500/20 flex items-start gap-3">
                  <div className="size-5 text-red-600 dark:text-red-500 mt-0.5 flex items-center justify-center font-bold">
                    X
                  </div>
                  <div>
                    <p className="text-sm font-bold text-red-600 dark:text-red-500">
                      Artwork Rejected
                    </p>
                    <p className="text-xs text-red-600/80 dark:text-red-500/80 mt-0.5">
                      This artwork did not meet the platform guidelines and has
                      been rejected.
                    </p>
                  </div>
                </div>
              )}

              {/* Sold Banner */}
              {isSold && (
                <div className="mb-6 rounded-2xl bg-emerald-500/10 p-4 border border-emerald-500/20 flex items-start gap-3">
                  <BadgeCheck className="size-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      Artwork Sold
                    </p>
                    <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                      This artwork has been purchased and is no longer available
                      for sale.
                    </p>
                  </div>
                </div>
              )}

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

              <Link
                href={`/artist/${artwork.email}`}
                className="flex items-center gap-3 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-separator/60 hover:opacity-80 transition-opacity w-fit"
              >
                <div className="flex size-10 md:size-12 items-center justify-center rounded-full bg-accent text-base md:text-lg font-bold text-primary shadow-inner overflow-hidden border-2 border-background">
                  {artwork.artistImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={artwork.artistImage}
                      alt={artwork.userName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (artwork.userName || "A")[0].toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">
                    Created by
                  </p>
                  <p className="text-base md:text-lg font-bold text-foreground hover:text-primary transition-colors">
                    {artwork.userName || "Unknown Artist"}
                  </p>
                </div>
              </Link>

              {/* Price & Primary Actions */}
              <div className="mb-8 md:mb-10">
                <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 md:mb-2">
                  Price
                </p>
                <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-5 md:mb-6">
                  ${artwork.price}
                </p>

                {/* Purchase Plan Progress */}
                {user?.role === "buyer" &&
                  purchaseStats &&
                  (!artwork.status || artwork.status === "Published") &&
                  !isSold && (
                    <div className="mb-6 p-4 rounded-xl bg-accent/20 border border-separator/40">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-semibold text-foreground capitalize">
                          {purchaseStats.plan} Plan
                        </span>
                        <span className="text-muted-foreground font-medium text-xs">
                          {purchaseStats.limit === -1
                            ? "Unlimited Purchases"
                            : `${purchaseStats.count} / ${purchaseStats.limit} Purchased`}
                        </span>
                      </div>
                      {purchaseStats.limit !== -1 && (
                        <div className="w-full bg-muted/40 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${purchaseStats.count >= purchaseStats.limit ? "bg-red-500" : "bg-primary"}`}
                            style={{
                              width: `${Math.min((purchaseStats.count / purchaseStats.limit) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      )}
                      {purchaseStats.limit !== -1 &&
                        purchaseStats.count >= purchaseStats.limit && (
                          <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-xs text-red-500 font-medium">
                              You've reached your limit. Upgrade your plan to
                              collect more!
                            </p>
                            <Link
                              href="/pricing"
                              className="shrink-0 text-xs font-bold bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition-colors shadow-sm text-center"
                            >
                              Upgrade Plan
                            </Link>
                          </div>
                        )}
                    </div>
                  )}

                <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
                  {(!artwork.status || artwork.status === "Published") &&
                    !isSold && (
                      <button
                        onClick={handlePurchase}
                        disabled={
                          isPurchasing ||
                          (purchaseStats &&
                            purchaseStats.limit !== -1 &&
                            purchaseStats.count >= purchaseStats.limit)
                        }
                        className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-2xl bg-foreground px-6 md:px-8 py-3.5 md:py-4 text-sm font-bold text-background transition-all hover:bg-foreground/90 hover:scale-[1.02] shadow-xl shadow-foreground/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {isPurchasing ? (
                          <>
                            <span className="size-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="size-4 md:size-5" />
                            Purchase Art
                          </>
                        )}
                      </button>
                    )}
                  {isSold && (
                    <div className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-2xl bg-muted/40 px-6 md:px-8 py-3.5 md:py-4 text-sm font-bold text-muted-foreground border border-separator cursor-not-allowed">
                      <BadgeCheck className="size-4 md:size-5" />
                      Sold Out
                    </div>
                  )}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={toggleSave}
                      disabled={isSaving}
                      className={`flex-1 sm:flex-none flex size-12 md:size-14 items-center justify-center rounded-2xl border-2 transition-all ${
                        isSaved
                          ? "border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20"
                          : "border-separator bg-background text-muted-foreground hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className={`size-5 md:size-6 ${isSaved ? "fill-current" : ""}`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-foreground mb-3">
                  About the Artwork
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {artwork.description ||
                    "No description provided by the artist."}
                </p>
              </div>

              {/* Trust Badges */}
              {(!artwork.status || artwork.status === "Published") && (
                <div className="rounded-2xl bg-accent/30 p-5 border border-separator/50 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="size-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        Authenticity Guaranteed
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Verified original artwork from the artist.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* ── Comment Section ── */}
        <CommentSection id={id} user={user} />
      </div>
    </main>
  );
}
