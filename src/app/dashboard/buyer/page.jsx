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

  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (!user?.email) {
      if (session === null) setIsLoading(false); // Finished loading session, but no user
      return;
    }

    const fetchPurchases = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/purchases?email=${encodeURIComponent(user.email)}`,
        );
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
    const searchString = searchTerm.toLowerCase();
    const title = (
      purchase.artworkTitle ||
      purchase.artwork?.title ||
      ""
    ).toLowerCase();
    const artist = (purchase.artwork?.userName || "").toLowerCase();

    return title.includes(searchString) || artist.includes(searchString);
  });

  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.purchasedAt) - new Date(a.purchasedAt);
    } else if (sortBy === "oldest") {
      return new Date(a.purchasedAt) - new Date(b.purchasedAt);
    } else if (sortBy === "price-high") {
      return Number(b.amount) - Number(a.amount);
    } else if (sortBy === "price-low") {
      return Number(a.amount) - Number(b.amount);
    }
    return 0;
  });

  return (
    <div className="flex-1 w-full p-4 md:p-6 overflow-y-auto">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Purchase History
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage your recent artwork acquisitions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none flex items-center gap-2 pl-4 pr-10 py-2.5 bg-background border border-separator rounded-xl text-sm font-semibold text-foreground hover:bg-muted/10 transition-colors shadow-sm cursor-pointer outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
              </select>
              <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:brightness-110 transition-all shadow-sm">
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
            <div className="overflow-x-auto">
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
                  {[...Array(5)].map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted/30 rounded-md"></div>
                          <div className="flex flex-col gap-2">
                            <div className="h-4 bg-muted/30 rounded w-32"></div>
                            <div className="h-3 bg-muted/30 rounded w-20"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-muted/30 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-muted/30 rounded w-16"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : purchases.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                No purchases yet
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                You haven't bought any artworks yet.
              </p>
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
                              <img
                                src={item.artwork.image}
                                alt={item.artworkTitle}
                                className="w-10 h-10 object-cover rounded-md"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-muted/30 rounded-md flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-foreground">
                                {item.artworkTitle ||
                                  item.artwork?.title ||
                                  "Unknown Artwork"}
                              </span>
                              <span className="text-xs text-muted-foreground mt-0.5">
                                by {item.artwork?.userName || "Unknown Artist"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-foreground">
                            {new Date(item.purchasedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
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
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    No results found
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Try adjusting your search terms.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
