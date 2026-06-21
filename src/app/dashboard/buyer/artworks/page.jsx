"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Search, Filter, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";

import { getPurchases } from "@/lib/api/buyer";

const BoughtArtworksPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "price-low", label: "Price: Low to High" },
  ];

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label || "Newest First";

  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (!user?.email) {
      if (session === null) setIsLoading(false);
      return;
    }

    const fetchPurchases = async () => {
      try {
        const data = await getPurchases(user.email);
        setPurchases(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch purchases", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, [user?.email, session]);

  const filteredPurchases = purchases.filter((purchase) => {
    const searchString = String(searchTerm).toLowerCase();
    const title = String(
      purchase.artworkTitle || purchase.artwork?.title || "",
    ).toLowerCase();
    const artist = String(purchase.artwork?.userName || "").toLowerCase();
    return title.includes(searchString) || artist.includes(searchString);
  });

  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
    if (sortBy === "newest") {
      return (
        new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime()
      );
    } else if (sortBy === "oldest") {
      return (
        new Date(a.purchasedAt).getTime() - new Date(b.purchasedAt).getTime()
      );
    } else if (sortBy === "price-high") {
      return (Number(b.amount) || 0) - (Number(a.amount) || 0);
    } else if (sortBy === "price-low") {
      return (Number(a.amount) || 0) - (Number(b.amount) || 0);
    }
    return 0;
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedPurchases.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPurchases = sortedPurchases.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex-1 w-full p-4 md:p-6 overflow-y-auto">
      <div className=" space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Bought Artworks
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your personal collection of purchased masterpieces.
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your collection..."
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-separator rounded-xl text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full sm:w-auto flex items-center justify-between gap-2 pl-4 pr-3 py-2.5 bg-background border border-separator rounded-xl text-sm font-semibold text-foreground hover:bg-muted/10 transition-colors shadow-sm cursor-pointer outline-none focus:border-primary focus:ring-1 focus:ring-primary min-w-[170px]"
            >
              <span>{currentSortLabel}</span>
              <Filter className="w-4 h-4 text-muted-foreground" />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-full min-w-[170px] bg-background border border-separator rounded-xl shadow-xl overflow-hidden z-50 py-1"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-muted/20 ${
                        sortBy === option.value
                          ? "font-bold text-primary bg-primary/5"
                          : "text-foreground font-medium"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="bg-background border border-separator rounded-2xl overflow-hidden shadow-sm animate-pulse flex flex-col"
              >
                <div className="w-full aspect-[4/3] bg-muted/20"></div>
                <div className="p-3 md:p-5 flex flex-col justify-between flex-1 gap-3">
                  <div>
                    <div className="h-4 md:h-5 bg-muted/30 rounded w-3/4 mb-2"></div>
                    <div className="h-3 md:h-4 bg-muted/30 rounded w-1/2"></div>
                  </div>
                  <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-separator flex items-center justify-between">
                    <div className="h-4 bg-muted/30 rounded w-1/3"></div>
                    <div className="h-3 bg-muted/30 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : purchases.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              No artworks yet
            </h3>
            <p className="text-muted-foreground max-w-sm">
              Your collection is currently empty. Visit the browse page to find
              your next masterpiece.
            </p>
            <Link
              href="/browse"
              className="mt-6 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:brightness-110 transition-all shadow-lg"
            >
              Browse Artworks
            </Link>
          </div>
        ) : sortedPurchases.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              No results found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
            {paginatedPurchases.map((purchase, idx) => (
              <motion.div
                key={purchase._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group flex flex-col bg-background border border-separator rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[4/3] bg-muted/20 overflow-hidden">
                  {purchase.artwork?.image ? (
                    <Image
                      src={purchase.artwork.image}
                      alt={
                        purchase.artworkTitle ||
                        purchase.artwork.title ||
                        "Artwork"
                      }
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link
                      href={`/artworks/${purchase.artworkId}`}
                      className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full text-xs md:text-sm font-medium hover:bg-white/30 transition-colors"
                    >
                      View Details
                      <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                    </Link>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3 md:p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-sm md:text-base lg:text-sm xl:text-base font-bold text-foreground mb-0.5 md:mb-1 line-clamp-1">
                      {purchase.artworkTitle ||
                        purchase.artwork?.title ||
                        "Unknown Artwork"}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
                      By{" "}
                      {purchase.artwork?.userEmail ? (
                        <Link
                          href={`/artist/${purchase.artwork.userEmail}`}
                          className="font-medium text-foreground hover:text-primary hover:underline transition-colors"
                        >
                          {purchase.artwork?.userName || "Unknown Artist"}
                        </Link>
                      ) : (
                        <span className="font-medium text-foreground">
                          {purchase.artwork?.userName || "Unknown Artist"}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-separator flex flex-col xl:flex-row xl:items-center justify-between gap-1 xl:gap-0">
                    <span className="text-sm md:text-base lg:text-sm xl:text-base font-bold text-primary">
                      ${purchase.amount}
                    </span>
                    <span className="text-[10px] md:text-xs text-muted-foreground truncate">
                      {new Date(purchase.purchasedAt).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex size-10 items-center justify-center rounded-xl border border-separator/60 bg-background hover:bg-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="size-5" />
            </button>

            <div className="flex items-center gap-1.5 overflow-x-auto max-w-[60vw] sm:max-w-none px-2 scrollbar-hide">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                        currentPage === pageNum
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "border border-separator/60 bg-background hover:bg-accent/50 text-foreground"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return (
                    <span key={pageNum} className="px-1 text-muted-foreground">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex size-10 items-center justify-center rounded-xl border border-separator/60 bg-background hover:bg-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BoughtArtworksPage;
