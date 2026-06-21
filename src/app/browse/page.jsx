"use client";

import { useState, useEffect } from "react";
import { getArtworks } from "@/lib/api/artworks";
import { Search, Filter, SlidersHorizontal, ImageIcon, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import ArtworkCard from "@/components/ArtworkCard";

const categories = [
  { key: "painting", label: "Painting" },
  { key: "photography", label: "Photography" },
  { key: "digital", label: "Digital Art" },
  { key: "sculpture", label: "Sculpture" },
  { key: "mixed", label: "Mixed Media" },
];

const BrowseArtworksPage = () => {
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, minPrice, maxPrice, sortOption]);

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

  let filteredArtworks = artworks.filter((artwork) => {
    // Only show artworks that are either explicitly "Published" or have no status (older posts)
    if (artwork.status && artwork.status !== "Published") {
      return false;
    }

    // Search by title or artist (userName)
    const matchesSearch =
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (artwork.userName && artwork.userName.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter by Category
    const matchesCategory =
      categoryFilter === "all" || artwork.category === categoryFilter;

    // Filter by Price
    const price = Number(artwork.price) || 0;
    const matchesMinPrice = minPrice === "" || price >= Number(minPrice);
    const matchesMaxPrice = maxPrice === "" || price <= Number(maxPrice);

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  // Sorting
  if (sortOption === "newest") {
    filteredArtworks.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  } else if (sortOption === "price-asc") {
    filteredArtworks.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  } else if (sortOption === "price-desc") {
    filteredArtworks.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
  }

  // Pagination Logic
  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArtworks = filteredArtworks.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-background pt-10 pb-20 px-4 md:px-30">
      <div className="">
        {/* Page Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            Browse Artworks
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Discover unique pieces from talented artists around the world.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* ── MOBILE FILTER TOGGLE ── */}
          <div className="w-full lg:hidden">
            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="flex w-full items-center justify-between rounded-2xl border border-separator/60 bg-background/40 backdrop-blur-xl px-5 py-4 text-sm font-bold shadow-sm transition-colors hover:bg-muted/20"
            >
              <div className="flex items-center gap-2">
                <Filter className="size-4" />
                <span>Filters & Sort</span>
              </div>
              <ChevronDown className={`size-5 transition-transform duration-300 ${isMobileFiltersOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* ── LEFT SIDEBAR (Filters & Sort) ── */}
          <aside className={`w-full lg:w-72 shrink-0 space-y-6 rounded-2xl border border-separator/60 bg-background/40 backdrop-blur-xl p-6 shadow-xl shadow-black/5 dark:shadow-none lg:sticky lg:top-24 ${isMobileFiltersOpen ? "block" : "hidden lg:block"}`}>
            {/* Search */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Title or artist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-separator bg-background pl-10 pr-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Sort By
              </label>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-separator bg-background pl-4 pr-10 py-2.5 text-sm font-semibold text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <SlidersHorizontal className="size-4" />
                </div>
              </div>
            </div>

            <hr className="border-separator/60" />

            {/* Category Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Category
              </label>
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-separator bg-background px-4 py-2.5 text-sm outline-none transition-colors cursor-pointer focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Filter className="size-4" />
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Price Range ($)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full rounded-xl border border-separator bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full rounded-xl border border-separator bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </aside>

          {/* ── RIGHT CONTENT (Artworks Grid) ── */}
          <div className="flex-1 w-full ">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl border border-separator/60 bg-background/40 backdrop-blur-xl p-4 shadow-sm">
                    <div className="aspect-[4/5] w-full rounded-xl bg-muted/40"></div>
                    <div className="mt-4 space-y-2">
                      <div className="h-4 w-3/4 rounded-md bg-muted/40"></div>
                      <div className="h-3 w-1/2 rounded-md bg-muted/40"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredArtworks.length > 0 ? (
              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  {paginatedArtworks.map((artwork, index) => (
                    <ArtworkCard key={artwork._id} artwork={artwork} index={index} />
                  ))}
                </div>
                
                {/* ── PAGINATION CONTROLS ── */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
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
                        // Show first, last, current, and adjacent pages
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
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-separator/60 bg-background/40 backdrop-blur-xl p-6">
                <div className="flex size-20 items-center justify-center rounded-full bg-muted/30 mb-6">
                  <ImageIcon className="size-8 text-muted-foreground/50" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">No artworks found</h2>
                <p className="text-muted-foreground max-w-sm">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default BrowseArtworksPage;
