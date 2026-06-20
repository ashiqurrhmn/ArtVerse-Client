"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, Download, ImageIcon, CreditCard, Crown, Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function BuyerDashboard() {
  const [purchases, setPurchases] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubLoading, setIsSubLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Pagination state
  const [currentPurchasePage, setCurrentPurchasePage] = useState(1);
  const [currentSubscriptionPage, setCurrentSubscriptionPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPurchasePage(1);
    setCurrentSubscriptionPage(1);
  }, [searchTerm, sortBy]);

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "price-low", label: "Price: Low to High" },
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || "Sort By";

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Transaction ID copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

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

    const fetchSubscriptions = async () => {
      try {
        const res = await fetch("/api/subscriptions");
        const data = await res.json();
        if (Array.isArray(data)) {
          setSubscriptions(data);
        }
      } catch (error) {
        console.error("Failed to fetch subscriptions", error);
      } finally {
        setIsSubLoading(false);
      }
    };

    fetchPurchases();
    fetchSubscriptions();
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

  const totalPurchasePages = Math.ceil(sortedPurchases.length / itemsPerPage) || 1;
  const startPurchaseIndex = (currentPurchasePage - 1) * itemsPerPage;
  const paginatedPurchases = sortedPurchases.slice(startPurchaseIndex, startPurchaseIndex + itemsPerPage);

  const handlePurchasePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPurchasePages) {
      setCurrentPurchasePage(newPage);
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const searchString = searchTerm.toLowerCase();
    const plan = (sub.plan || "").toLowerCase();
    const transactionId = (sub.transactionId || "").toLowerCase();
    const status = (sub.status || "").toLowerCase();

    return plan.includes(searchString) || transactionId.includes(searchString) || status.includes(searchString);
  });

  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === "price-high") {
      return Number(b.amount) - Number(a.amount);
    } else if (sortBy === "price-low") {
      return Number(a.amount) - Number(b.amount);
    }
    return 0;
  });

  const totalSubscriptionPages = Math.ceil(sortedSubscriptions.length / itemsPerPage) || 1;
  const startSubscriptionIndex = (currentSubscriptionPage - 1) * itemsPerPage;
  const paginatedSubscriptions = sortedSubscriptions.slice(startSubscriptionIndex, startSubscriptionIndex + itemsPerPage);

  const handleSubscriptionPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalSubscriptionPages) {
      setCurrentSubscriptionPage(newPage);
    }
  };

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

        {/* Tables Grid - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Purchase History Table */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-background border border-separator rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="px-6 py-4 border-b border-separator flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Artwork Purchases</h2>
                <p className="text-xs text-muted-foreground">Your artwork acquisition history</p>
              </div>
            </div>

            {isLoading ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/10 border-b border-separator">
                      <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Artwork</th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-separator">
                    {[...Array(5)].map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-muted/30 rounded-md shrink-0"></div>
                            <div className="flex flex-col gap-1.5">
                              <div className="h-3.5 bg-muted/30 rounded w-24"></div>
                              <div className="h-2.5 bg-muted/30 rounded w-16"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><div className="h-3.5 bg-muted/30 rounded w-20"></div></td>
                        <td className="px-4 py-3"><div className="h-3.5 bg-muted/30 rounded w-14"></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : purchases.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center">
                <div className="w-14 h-14 bg-muted/30 rounded-full flex items-center justify-center mb-3">
                  <ImageIcon className="w-7 h-7 text-muted-foreground/50" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">No purchases yet</h3>
                <p className="text-xs text-muted-foreground">You haven&apos;t bought any artworks yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {sortedPurchases.length > 0 ? (
                  <>
                    <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/10 border-b border-separator">
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Artwork</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-separator">
                      {paginatedPurchases.map((item) => (
                        <tr key={item._id} className="hover:bg-muted/5 transition-colors group">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              {item.artwork?.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.artwork.image}
                                  alt={item.artworkTitle}
                                  className="w-9 h-9 object-cover rounded-md shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 bg-muted/30 rounded-md flex items-center justify-center shrink-0">
                                  <ImageIcon className="w-4 h-4 text-muted-foreground/50" />
                                </div>
                              )}
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold text-foreground truncate">
                                  {item.artworkTitle || item.artwork?.title || "Unknown Artwork"}
                                </span>
                                <span className="text-xs text-muted-foreground truncate">
                                  by {item.artwork?.userName || "Unknown Artist"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="text-xs text-foreground">
                              {new Date(item.purchasedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="text-sm font-semibold text-foreground">${item.amount}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {totalPurchasePages > 1 && (
                    <div className="flex items-center justify-center gap-2 p-4 border-t border-separator">
                      <button
                        onClick={() => handlePurchasePageChange(currentPurchasePage - 1)}
                        disabled={currentPurchasePage === 1}
                        className="flex size-8 items-center justify-center rounded-lg border border-separator/60 bg-background hover:bg-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <div className="flex items-center gap-1">
                        {[...Array(totalPurchasePages)].map((_, i) => {
                          const pageNum = i + 1;
                          if (
                            pageNum === 1 ||
                            pageNum === totalPurchasePages ||
                            (pageNum >= currentPurchasePage - 1 && pageNum <= currentPurchasePage + 1)
                          ) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePurchasePageChange(pageNum)}
                                className={`flex size-8 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                                  currentPurchasePage === pageNum
                                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                                    : "border border-separator/60 bg-background hover:bg-accent/50 text-foreground"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          } else if (
                            pageNum === currentPurchasePage - 2 ||
                            pageNum === currentPurchasePage + 2
                          ) {
                            return <span key={pageNum} className="px-1 text-muted-foreground text-xs">...</span>;
                          }
                          return null;
                        })}
                      </div>
                      <button
                        onClick={() => handlePurchasePageChange(currentPurchasePage + 1)}
                        disabled={currentPurchasePage === totalPurchasePages}
                        className="flex size-8 items-center justify-center rounded-lg border border-separator/60 bg-background hover:bg-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  )}
                  </>
                ) : (
                  <div className="p-10 text-center flex flex-col items-center">
                    <div className="w-14 h-14 bg-muted/30 rounded-full flex items-center justify-center mb-3">
                      <Search className="w-7 h-7 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-1">No results found</h3>
                    <p className="text-xs text-muted-foreground">Try adjusting your search terms.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Subscription Transactions Table */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-background border border-separator rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="px-6 py-4 border-b border-separator flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Crown className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Subscription Transactions</h2>
                <p className="text-xs text-muted-foreground">Your subscription billing history</p>
              </div>
            </div>

            {isSubLoading ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/10 border-b border-separator">
                      <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plan</th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Transaction ID</th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-separator">
                    {[...Array(3)].map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="px-4 py-3"><div className="h-3.5 bg-muted/30 rounded w-20"></div></td>
                        <td className="px-4 py-3"><div className="h-3.5 bg-muted/30 rounded w-20"></div></td>
                        <td className="px-4 py-3"><div className="h-3.5 bg-muted/30 rounded w-28"></div></td>
                        <td className="px-4 py-3"><div className="h-3.5 bg-muted/30 rounded w-14"></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center">
                <div className="w-14 h-14 bg-muted/30 rounded-full flex items-center justify-center mb-3">
                  <CreditCard className="w-7 h-7 text-muted-foreground/50" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">No subscriptions yet</h3>
                <p className="text-xs text-muted-foreground">You haven&apos;t subscribed to any plan yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {sortedSubscriptions.length > 0 ? (
                  <>
                    <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/10 border-b border-separator">
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plan</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Transaction ID</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-separator">
                      {paginatedSubscriptions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-muted/5 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Crown className="w-4 h-4 text-primary shrink-0" />
                              <span className="text-sm font-semibold text-foreground truncate">{sub.plan}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="text-xs text-foreground">
                              {new Date(sub.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleCopy(sub.transactionId, sub.id)}
                              className="flex items-center gap-1.5 group/copy hover:bg-muted/30 px-1.5 py-1 rounded transition-colors"
                              title="Copy Transaction ID"
                            >
                              <span className="text-[10px] font-mono text-muted-foreground bg-muted/20 px-1.5 py-0.5 rounded group-hover/copy:text-foreground transition-colors">
                                {typeof sub.transactionId === 'string' ? sub.transactionId.slice(0, 18) : sub.transactionId}...
                              </span>
                              {copiedId === sub.id ? (
                                <Check className="w-3 h-3 text-green-500" />
                              ) : (
                                <Copy className="w-3 h-3 text-muted-foreground opacity-0 group-hover/copy:opacity-100 transition-opacity" />
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              sub.status === "active"
                                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                : sub.status === "canceled"
                                  ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                  : sub.status === "past_due"
                                    ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                                    : "bg-muted/30 text-muted-foreground"
                            }`}>
                              {sub.status.charAt(0).toUpperCase() + sub.status.slice(1).replace("_", " ")}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {totalSubscriptionPages > 1 && (
                    <div className="flex items-center justify-center gap-2 p-4 border-t border-separator">
                      <button
                        onClick={() => handleSubscriptionPageChange(currentSubscriptionPage - 1)}
                        disabled={currentSubscriptionPage === 1}
                        className="flex size-8 items-center justify-center rounded-lg border border-separator/60 bg-background hover:bg-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <div className="flex items-center gap-1">
                        {[...Array(totalSubscriptionPages)].map((_, i) => {
                          const pageNum = i + 1;
                          if (
                            pageNum === 1 ||
                            pageNum === totalSubscriptionPages ||
                            (pageNum >= currentSubscriptionPage - 1 && pageNum <= currentSubscriptionPage + 1)
                          ) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handleSubscriptionPageChange(pageNum)}
                                className={`flex size-8 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                                  currentSubscriptionPage === pageNum
                                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                                    : "border border-separator/60 bg-background hover:bg-accent/50 text-foreground"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          } else if (
                            pageNum === currentSubscriptionPage - 2 ||
                            pageNum === currentSubscriptionPage + 2
                          ) {
                            return <span key={pageNum} className="px-1 text-muted-foreground text-xs">...</span>;
                          }
                          return null;
                        })}
                      </div>
                      <button
                        onClick={() => handleSubscriptionPageChange(currentSubscriptionPage + 1)}
                        disabled={currentSubscriptionPage === totalSubscriptionPages}
                        className="flex size-8 items-center justify-center rounded-lg border border-separator/60 bg-background hover:bg-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  )}
                  </>
                ) : (
                  <div className="p-10 text-center flex flex-col items-center">
                    <div className="w-14 h-14 bg-muted/30 rounded-full flex items-center justify-center mb-3">
                      <Search className="w-7 h-7 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-1">No results found</h3>
                    <p className="text-xs text-muted-foreground">Try adjusting your search terms.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
