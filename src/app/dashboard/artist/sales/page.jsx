"use client";

import { useState } from "react";
import { ArrowLeft, Search, Filter, Download } from "lucide-react";
import Link from "next/link";

// Mock Data
const mockSales = [
  {
    id: "TRX-1092",
    title: "Starry Night Resonance",
    buyerName: "Eleanor Vance",
    buyerEmail: "eleanor.v@example.com",
    buyerAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    date: "Oct 24, 2023",
    amount: 1250.00,
    status: "Completed",
  },
  {
    id: "TRX-1091",
    title: "Urban Echoes",
    buyerName: "Marcus Thorne",
    buyerEmail: "m.thorne@example.com",
    buyerAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    date: "Oct 18, 2023",
    amount: 850.50,
    status: "Completed",
  },
  {
    id: "TRX-1088",
    title: "Whispering Pines",
    buyerName: "Sophia Loren",
    buyerEmail: "sophia.loren@example.com",
    buyerAvatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    date: "Oct 12, 2023",
    amount: 2100.00,
    status: "Processing",
  },
  {
    id: "TRX-1085",
    title: "Neon Dreams",
    buyerName: "James Holden",
    buyerEmail: "james.h@example.com",
    buyerAvatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    date: "Sep 30, 2023",
    amount: 450.00,
    status: "Completed",
  },
  {
    id: "TRX-1081",
    title: "Abstract Harmony",
    buyerName: "Elena Rostova",
    buyerEmail: "elena.r@example.com",
    buyerAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026024e",
    date: "Sep 15, 2023",
    amount: 1500.00,
    status: "Completed",
  },
];

export default function SalesHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSales = mockSales.filter(
    (sale) =>
      sale.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.buyerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = mockSales.reduce((acc, sale) => acc + sale.amount, 0);

  return (
    <div className="min-h-full text-foreground px-4 md:px-10 pb-16">
      
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
            <p className="text-xl font-bold text-foreground">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="w-px h-10 bg-separator mx-2" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Artworks Sold</p>
            <p className="text-xl font-bold text-foreground">{mockSales.length}</p>
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
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg border border-separator bg-background px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-accent/40 text-foreground">
              <Filter className="size-4" />
              Filter
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg border border-separator bg-background px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-accent/40 text-foreground">
              <Download className="size-4" />
              Export
            </button>
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
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale) => (
                    <tr key={sale.id} className="transition-colors hover:bg-accent/30 dark:hover:bg-accent/20 group">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-foreground">{sale.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-foreground">{sale.buyerName}</span>
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
                        ${sale.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
