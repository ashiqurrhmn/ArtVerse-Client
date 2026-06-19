"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, Download } from "lucide-react";

// Mock Data
const purchaseHistory = [
  { id: "PH101", artwork: "Silent Symphony", artist: "Jane Doe", price: "$1,200", date: "Jun 12, 2026", status: "Delivered" },
  { id: "PH102", artwork: "Neon Whispers", artist: "Alex Smith", price: "$850", date: "May 28, 2026", status: "Processing" },
  { id: "PH103", artwork: "Abstract Harmony", artist: "Emily Chen", price: "$2,100", date: "May 15, 2026", status: "Delivered" },
  { id: "PH104", artwork: "Urban Decay", artist: "Michael Ross", price: "$450", date: "Apr 02, 2026", status: "Delivered" },
  { id: "PH105", artwork: "Golden Hour", artist: "Sarah Johnson", price: "$3,400", date: "Mar 18, 2026", status: "Delivered" },
];

export default function BuyerDashboard() {
  return (
    <div className="flex-1 w-full p-4 md:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Purchase History</h1>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage your recent artwork acquisitions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-background border border-separator rounded-lg text-sm font-medium text-foreground hover:bg-muted/10 transition-colors shadow-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
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
            placeholder="Search by artwork name, artist, or order ID..."
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
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-muted/10 border-b border-separator">
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Artwork Details
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Purchase Date
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-separator">
                {purchaseHistory.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/5 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-foreground">
                        {item.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground">
                          {item.artwork}
                        </span>
                        <span className="text-xs text-muted-foreground mt-0.5">
                          by {item.artist}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-foreground">
                        {item.date}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-foreground">
                        {item.price}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase ${
                          item.status === "Delivered"
                            ? "bg-secondary/15 text-secondary border border-secondary/30"
                            : "bg-accent/20 text-accent-foreground border border-accent/30"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination (Mock) */}
          <div className="border-t border-separator bg-background px-6 py-4 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Showing 1 to 5 of 12 orders
            </span>
            <div className="flex gap-2">
              <button disabled className="px-3 py-1 border border-separator rounded-md text-xs font-medium text-muted-foreground opacity-50 cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-1 border border-separator rounded-md text-xs font-medium text-foreground hover:bg-muted/10 transition-colors">
                Next
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}