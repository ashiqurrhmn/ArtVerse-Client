"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, Download, ImageIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function BuyerDashboard() {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "price-low", label: "Price: Low to High" },
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || "Newest First";
  
  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (!user?.email) {
      if (session === null) setIsLoading(false); // Finished loading session, but no user
      return;
    }

    const fetchPurchases = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/purchases?email=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        setPurchases(data || []);
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
    const title = String(purchase.artworkTitle || purchase.artwork?.title || "").toLowerCase();
    const artist = String(purchase.artwork?.userName || "").toLowerCase();
    
    return title.includes(searchString) || artist.includes(searchString);
  });

  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.purchasedAt).getTime() - new Date(b.purchasedAt).getTime();
    } else if (sortBy === "price-high") {
      return (Number(b.amount) || 0) - (Number(a.amount) || 0);
    } else if (sortBy === "price-low") {
      return (Number(a.amount) || 0) - (Number(b.amount) || 0);
    }
    return 0;
  });

  return (
    <div className="flex-1 w-full p-4 md:p-6overflow-y-auto">
      <div className="space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Purchase History</h1>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage your recent artwork acquisitions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between gap-2 pl-4 pr-3 py-2.5 bg-background border border-separator rounded-xl text-sm font-semibold text-foreground hover:bg-muted/10 transition-colors shadow-sm cursor-pointer outline-none focus:border-primary focus:ring-1 focus:ring-primary min-w-[170px]"
              >
                <span>{currentSortLabel}</span>
                <Filter className="w-4 h-4 text-muted-foreground" />
              </button>
              
              {isDropdownOpen && (
                <>
                  {/* Invisible overlay to close dropdown when clicking outside */}
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
                          sortBy === option.value ? "font-bold text-primary bg-primary/5" : "text-foreground font-medium"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:brightness-110 transition-all shadow-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by artwork name or artist..."
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-separator rounded-xl text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
          />
        </div>

        {/* Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-background border border-separator rounded-2xl overflow-hidden shadow-sm"
        >
          {isLoading ? (
            <div className="p-10 text-center text-muted-foreground flex flex-col items-center gap-4">
              <span className="size-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              Loading your purchase history...
            </div>
          ) : purchases.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">No purchases yet</h3>
              <p className="text-sm text-muted-foreground mb-4">You haven't bought any artworks yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {sortedPurchases.length > 0 ? (
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-muted/10 border-b border-separator">
                      <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Artwork Details
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Purchase Date
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-separator">
                    {sortedPurchases.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-muted/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.artwork?.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.artwork.image} alt={item.artworkTitle} className="w-10 h-10 object-cover rounded-md" />
                          ) : (
                            <div className="w-10 h-10 bg-muted/30 rounded-md flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground">
                              {item.artworkTitle || item.artwork?.title || "Unknown Artwork"}
                            </span>
                            <span className="text-xs text-muted-foreground mt-0.5">
                              by {item.artwork?.userName || "Unknown Artist"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-foreground">
                          {new Date(item.purchasedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-foreground">
                          ${item.amount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              ) : (
                <div className="p-10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">No results found</h3>
                  <p className="text-sm text-muted-foreground mb-4">Try adjusting your search terms.</p>
                </div>
              )}
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}