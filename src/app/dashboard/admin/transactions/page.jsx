"use client";
import React, { useState, useEffect } from "react";
import { Search, ShoppingBag, Download, CreditCard, ArrowUpDown, Copy } from "lucide-react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion } from "framer-motion";

const AdminTransactions = () => {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("artworks"); // "artworks" | "subscriptions"
  const [sortBy, setSortBy] = useState("date-desc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [subscriptions, setSubscriptions] = useState([]);

  const getSortLabel = () => {
    switch (sortBy) {
      case "date-desc": return "Date: Newest First";
      case "date-asc": return "Date: Oldest First";
      case "amount-desc": return "Amount: High to Low";
      case "amount-asc": return "Amount: Low to High";
      default: return "Date: Newest First";
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [purchasesRes, subscriptionsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/purchases`),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/subscriptions`)
      ]);
      
      if (!purchasesRes.ok) throw new Error("Failed to fetch purchases");
      if (!subscriptionsRes.ok) throw new Error("Failed to fetch subscriptions");
      
      const purchasesData = await purchasesRes.json();
      const subscriptionsData = await subscriptionsRes.json();
      
      setPurchases(purchasesData);
      setSubscriptions(subscriptionsData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const sortData = (a, b) => {
    if (sortBy === "amount-desc") return (b.amount || 0) - (a.amount || 0);
    if (sortBy === "amount-asc") return (a.amount || 0) - (b.amount || 0);
    
    // Default to date sorting
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (sortBy === "date-asc") return dateA - dateB;
    return dateB - dateA; // date-desc
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Transaction ID copied!");
  };

  const filteredPurchases = purchases.filter(
    (pur) =>
      (pur.buyerName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pur.artistName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pur.buyerEmail || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pur.id || "").toLowerCase().includes(searchQuery.toLowerCase()),
  ).sort(sortData);

  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      (sub.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.id || "").toLowerCase().includes(searchQuery.toLowerCase()),
  ).sort(sortData);

  const handleExport = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.setTextColor(41, 128, 185);
      doc.text("ArtVerse", 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(activeTab === "artworks" ? `Artwork Purchases` : `Subscription Transactions`, 14, 30);
      doc.text(`Generated on: ${new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}`, 14, 36);
      
      let tableColumn = [];
      let tableRows = [];

      const truncateId = (id) => id && id.length > 20 ? id.substring(0, 17) + "..." : id;

      if (activeTab === "artworks") {
        tableColumn = ["Transaction ID", "Buyer", "Artwork / Artist", "Amount", "Date"];
        filteredPurchases.forEach(pur => {
          tableRows.push([
            truncateId(pur.id),
            `${pur.buyerName}\n(${pur.buyerEmail})`,
            `${pur.artworkTitle}\nby ${pur.artistName}`,
            `$${pur.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            pur.date
          ]);
        });
      } else {
        tableColumn = ["Transaction ID", "User Email", "Plan", "Amount", "Date"];
        filteredSubscriptions.forEach(sub => {
          tableRows.push([
            truncateId(sub.id),
            `${sub.email}`,
            `${sub.plan} Plan`,
            `$${sub.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            sub.date
          ]);
        });
      }

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save(`${activeTab}_transactions_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("Exported to PDF successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export PDF");
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            View Transactions
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor all platform revenue and artwork sales.
          </p>
        </div>

        {/* Search Bar & Export */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 mt-4 md:mt-0 w-full md:w-auto flex-1 md:justify-end">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-separator bg-background pl-9 pr-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full sm:w-auto flex items-center justify-between gap-2 pl-4 pr-3 py-2.5 bg-background border border-separator rounded-xl text-sm font-semibold text-foreground hover:bg-muted/10 transition-colors shadow-sm cursor-pointer outline-none focus:border-primary focus:ring-1 focus:ring-primary min-w-[170px]"
              >
                <span>{getSortLabel()}</span>
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
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
                    {[
                      { value: "date-desc", label: "Date: Newest First" },
                      { value: "date-asc", label: "Date: Oldest First" },
                      { value: "amount-desc", label: "Amount: High to Low" },
                      { value: "amount-asc", label: "Amount: Low to High" }
                    ].map((option) => (
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

            <button 
              onClick={handleExport}
              disabled={activeTab === "artworks" ? filteredPurchases.length === 0 : filteredSubscriptions.length === 0}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-separator bg-background px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-accent/40 text-foreground disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
            >
              <Download className="size-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Toggle */}
      <div className="flex items-center gap-2 border-b border-separator/50 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("artworks")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap ${activeTab === "artworks" ? "bg-primary text-primary-foreground shadow-sm" : "bg-transparent text-muted-foreground hover:bg-muted/20"}`}
        >
          <ShoppingBag className="w-4 h-4" />
          Artwork Purchases
        </button>
        <button
          onClick={() => setActiveTab("subscriptions")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap ${activeTab === "subscriptions" ? "bg-primary text-primary-foreground shadow-sm" : "bg-transparent text-muted-foreground hover:bg-muted/20"}`}
        >
          <CreditCard className="w-4 h-4" />
          Subscription Purchases
        </button>
      </div>

      {/* Artwork Purchases Table */}
      {activeTab === "artworks" && (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-background border border-separator rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto md:overflow-visible">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-muted/20 border-b border-separator text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Buyer Info</th>
                    <th className="px-6 py-4">Artwork / Artist</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-separator">
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center">
                          <div className="size-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary mb-4"></div>
                          <p>Loading transactions...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredPurchases.length > 0 ? (
                    filteredPurchases.map((pur) => (
                      <tr
                        key={pur.id}
                        className="hover:bg-muted/10 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center gap-2 bg-[#f4ebd0]/80 dark:bg-[#f4ebd0]/20 px-3 py-1.5 rounded-lg border border-[#f4ebd0]">
                            <span className="font-mono text-xs font-medium text-foreground truncate max-w-[130px]">
                              {pur.id}
                            </span>
                            <button
                              onClick={() => handleCopy(pur.id)}
                              className="text-foreground/60 hover:text-foreground transition-colors flex-shrink-0"
                              title="Copy ID"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {pur.buyerName}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {pur.buyerEmail}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {pur.artworkTitle}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              by {pur.artistName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-foreground">
                            ${(pur.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">
                            {pur.date}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-muted-foreground block md:table-cell"
                      >
                        No artwork transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Purchases Table */}
      {activeTab === "subscriptions" && (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-background border border-separator rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto md:overflow-visible">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-muted/20 border-b border-separator text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">User Info</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-separator">
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center">
                          <div className="size-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary mb-4"></div>
                          <p>Loading subscriptions...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredSubscriptions.length > 0 ? (
                    filteredSubscriptions.map((sub) => (
                      <tr
                        key={sub.id}
                        className="hover:bg-muted/10 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center gap-2 bg-[#f4ebd0]/80 dark:bg-[#f4ebd0]/20 px-3 py-1.5 rounded-lg border border-[#f4ebd0]">
                            <span className="font-mono text-xs font-medium text-foreground truncate max-w-[130px]">
                              {sub.id}
                            </span>
                            <button
                              onClick={() => handleCopy(sub.id)}
                              className="text-foreground/60 hover:text-foreground transition-colors flex-shrink-0"
                              title="Copy ID"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">
                              {sub.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border bg-primary/10 text-primary border-primary/20 capitalize">
                            {sub.plan} Plan
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-foreground">
                            ${sub.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">
                            {sub.date}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-muted-foreground block md:table-cell"
                      >
                        No subscription transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;
