"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Search, Filter, Download } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function SalesHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-high", label: "Amount: High to Low" },
    { value: "price-low", label: "Amount: Low to High" },
  ];

  const currentSortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label || "Newest First";

  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (!user?.email) {
      if (session === null) setIsLoading(false);
      return;
    }

    const fetchSales = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"}/api/sales/${encodeURIComponent(user.email)}`,
        );
        const data = await res.json();
        setSales(data || []);
      } catch (error) {
        console.error("Failed to fetch sales", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSales();
  }, [user?.email, session]);

  const filteredSales = sales.filter(
    (sale) =>
      sale.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.buyerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedSales = [...filteredSales].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === "price-high") {
      return (b.amount || 0) - (a.amount || 0);
    } else if (sortBy === "price-low") {
      return (a.amount || 0) - (b.amount || 0);
    }
    return 0;
  });

  const totalRevenue = sales.reduce((acc, sale) => acc + (sale.amount || 0), 0);

  const handleExport = (format) => {
    if (sortedSales.length === 0) return;

    if (format === "csv") {
      const headers = ["Transaction ID", "Artwork Title", "Buyer Name", "Buyer Email", "Purchase Date", "Status", "Amount (USD)"];
      
      const rows = sortedSales.map(sale => [
        sale.id,
        `"${(sale.title || "").replace(/"/g, '""')}"`,
        `"${(sale.buyerName || "").replace(/"/g, '""')}"`,
        sale.buyerEmail,
        `"${sale.date}"`,
        sale.status,
        sale.amount
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(r => r.join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `sales_history_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === "pdf") {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text("Sales History Report", 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}`, 14, 30);
      
      const tableColumn = ["Transaction ID", "Artwork Title", "Buyer", "Date", "Status", "Amount"];
      const tableRows = [];

      sortedSales.forEach(sale => {
        const saleData = [
          sale.id,
          sale.title,
          sale.buyerName,
          sale.date,
          sale.status,
          `$${sale.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
        ];
        tableRows.push(saleData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'striped',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save(`sales_history_${new Date().toISOString().split('T')[0]}.pdf`);
    }
  };

  return (
    <div className="min-h-full text-foreground px-4 md:px-6 pb-16">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <Link
            href="/dashboard/artist"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-all hover:text-primary mb-4 hover:-translate-x-1"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            Sales History
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-xl">
            Track your sold artworks, analyze buyer trends, and manage your revenue.
          </p>
        </div>

        {/* Quick Stats Summary */}
        <div className="flex items-center gap-4 bg-accent/30 dark:bg-accent/20 border border-separator rounded-xl px-5 py-3 shadow-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-bold text-foreground">{isLoading ? "-" : `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}</p>
          </div>
          <div className="w-px h-10 bg-separator mx-2" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Artworks Sold</p>
            <p className="text-xl font-bold text-foreground">{isLoading ? "-" : sales.length}</p>
          </div>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="rounded-2xl border border-separator/60 bg-background/40 backdrop-blur-xl p-6 shadow-xl shadow-black/5 dark:shadow-none">
        
        {/* Toolbar: Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title or buyer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-separator bg-background pl-9 pr-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
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
            <div className="relative w-full sm:w-auto">
              <button 
                onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                disabled={sortedSales.length === 0}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-separator bg-background px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-accent/40 text-foreground disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
              >
                <Download className="size-4" />
                Export
              </button>

              {isExportDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsExportDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-full min-w-[120px] bg-background border border-separator rounded-xl shadow-xl overflow-hidden z-50 py-1"
                  >
                    <button
                      onClick={() => {
                        handleExport("csv");
                        setIsExportDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted/20 text-foreground"
                    >
                      Export to CSV
                    </button>
                    <button
                      onClick={() => {
                        handleExport("pdf");
                        setIsExportDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted/20 text-foreground"
                    >
                      Export to PDF
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Sales Table ── */}
        <div className="overflow-hidden rounded-xl border border-separator bg-accent/20 dark:bg-accent/10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-separator text-[11px] font-bold uppercase tracking-wider text-muted-foreground bg-accent/30 dark:bg-accent/20">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl">Artwork Title</th>
                  <th className="px-6 py-4">Buyer Name</th>
                  <th className="px-6 py-4">Buyer Email</th>
                  <th className="px-6 py-4">Purchase Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right rounded-tr-xl">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-separator/60">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <span className="inline-block size-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      </div>
                    </td>
                  </tr>
                ) : sortedSales.length > 0 ? (
                  sortedSales.map((sale) => (
                    <tr key={sale.id} className="transition-colors hover:bg-accent/30 dark:hover:bg-accent/20 group">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-foreground">{sale.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {sale.buyerAvatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={sale.buyerAvatar} alt={sale.buyerName} className="size-8 rounded-full object-cover bg-muted" />
                          ) : (
                            <div className="size-8 rounded-full bg-muted border border-separator flex items-center justify-center font-bold text-xs">
                              {sale.buyerName?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                          <span className="font-medium text-foreground">{sale.buyerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-muted-foreground">{sale.buyerEmail}</span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{sale.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          sale.status === "Completed" 
                            ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" 
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                        }`}>
                          {sale.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-foreground">
                        ${sale.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <ReceiptIcon className="size-10 opacity-20 mb-3" />
                        <p className="font-semibold text-foreground">No sales found</p>
                        <p className="text-sm mt-1">Try adjusting your search filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

// Inline Icon to avoid extra imports
function ReceiptIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 17.5v-11" />
    </svg>
  );
}
