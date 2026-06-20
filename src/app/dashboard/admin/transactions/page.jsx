"use client";
import React, { useState } from "react";
import { Search, CreditCard, ShoppingBag } from "lucide-react";

const AdminTransactions = () => {
  // Mock Data for Subscriptions
  const [subscriptions] = useState([
    {
      id: "TXN-SUB-1001",
      name: "Alice Wonderland",
      email: "alice@example.com",
      type: "Subscription",
      plan: "Pro",
      amount: 15.0,
      date: "2026-06-15",
    },
    {
      id: "TXN-SUB-1002",
      name: "Bob Ross",
      email: "bob@ross.com",
      type: "Subscription",
      plan: "Premium",
      amount: 30.0,
      date: "2026-06-16",
    },
    {
      id: "TXN-SUB-1003",
      name: "Charlie Admin",
      email: "charlie@admin.com",
      type: "Subscription",
      plan: "Enterprise",
      amount: 100.0,
      date: "2026-06-17",
    },
  ]);

  // Mock Data for Artwork Purchases
  const [purchases] = useState([
    {
      id: "TXN-ART-2001",
      buyerName: "Diana Prince",
      artistName: "Vincent V.",
      email: "diana@themyscira.com",
      type: "Purchase",
      artworkTitle: "Starry Night Reflection",
      amount: 1200.0,
      date: "2026-06-18",
    },
    {
      id: "TXN-ART-2002",
      buyerName: "Edward Scissorhands",
      artistName: "Jane Doe",
      email: "edward@scissors.com",
      type: "Purchase",
      artworkTitle: "Modern Abstract I",
      amount: 850.0,
      date: "2026-06-19",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredPurchases = purchases.filter(
    (pur) =>
      pur.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pur.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pur.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pur.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            View Transactions
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor all platform revenue, including subscriptions and artwork
            sales.
          </p>
        </div>

        {/* Search Bar */}
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
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <CreditCard className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Subscriptions
          </h2>
        </div>
        <div className="bg-background border border-separator rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto md:overflow-visible">
            <table className="w-full text-left border-collapse block md:table">
              <thead className="hidden md:table-header-group">
                <tr className="bg-muted/20 border-b border-separator text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-separator block md:table-row-group">
                {filteredSubscriptions.length > 0 ? (
                  filteredSubscriptions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="block md:table-row hover:bg-muted/10 transition-colors group p-4 md:p-0"
                    >
                      <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4">
                        <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">
                          Transaction ID
                        </span>
                        <span className="font-mono text-sm text-muted-foreground">
                          {sub.id}
                        </span>
                      </td>
                      <td className="block md:table-cell px-2 py-3 md:px-6 md:py-4 border-t border-separator/30 md:border-none mt-2 md:mt-0 pt-4 md:pt-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {sub.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {sub.email}
                          </span>
                        </div>
                      </td>
                      <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4">
                        <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">
                          Plan
                        </span>
                        <div className="flex flex-col md:items-start items-end">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border bg-primary/10 text-primary border-primary/20 capitalize">
                            {sub.plan} Plan
                          </span>
                        </div>
                      </td>
                      <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4">
                        <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">
                          Amount
                        </span>
                        <span className="font-bold text-foreground">
                          ${sub.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4">
                        <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">
                          Date
                        </span>
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

      {/* Artwork Purchases Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <ShoppingBag className="w-5 h-5 text-secondary" />
          <h2 className="text-xl font-semibold text-foreground">
            Artwork Purchases
          </h2>
        </div>
        <div className="bg-background border border-separator rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto md:overflow-visible">
            <table className="w-full text-left border-collapse block md:table">
              <thead className="hidden md:table-header-group">
                <tr className="bg-muted/20 border-b border-separator text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Buyer Info</th>
                  <th className="px-6 py-4">Artwork / Artist</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-separator block md:table-row-group">
                {filteredPurchases.length > 0 ? (
                  filteredPurchases.map((pur) => (
                    <tr
                      key={pur.id}
                      className="block md:table-row hover:bg-muted/10 transition-colors group p-4 md:p-0"
                    >
                      <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4">
                        <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">
                          Transaction ID
                        </span>
                        <span className="font-mono text-sm text-muted-foreground">
                          {pur.id}
                        </span>
                      </td>
                      <td className="block md:table-cell px-2 py-3 md:px-6 md:py-4 border-t border-separator/30 md:border-none mt-2 md:mt-0 pt-4 md:pt-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {pur.buyerName}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {pur.email}
                          </span>
                        </div>
                      </td>
                      <td className="block md:table-cell px-2 py-3 md:px-6 md:py-4 mt-2 md:mt-0">
                        <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                          Artwork / Artist
                        </span>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {pur.artworkTitle}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            by {pur.artistName}
                          </span>
                        </div>
                      </td>
                      <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4">
                        <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">
                          Type
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border bg-secondary/10 text-secondary border-secondary/20">
                          {pur.type}
                        </span>
                      </td>
                      <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4">
                        <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">
                          Amount
                        </span>
                        <span className="font-bold text-foreground">
                          ${pur.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4">
                        <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">
                          Date
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {pur.date}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-muted-foreground block md:table-cell"
                    >
                      No purchase transactions found.
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
};

export default AdminTransactions;
