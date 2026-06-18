"use client";

import { useState } from "react";
import { Search, Filter, Download, Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
import Link from "next/link";

const initialArtworks = [
  { id: 1, title: "Abstract Harmony", category: "Painting",    price: "$1,200", status: "Published", date: "Jun 14, 2026" },
  { id: 2, title: "Urban Echoes",     category: "Photography", price: "$800",   status: "Published", date: "Jun 11, 2026" },
  { id: 3, title: "Neon Dreams",      category: "Digital Art", price: "$450",   status: "Draft",     date: "Jun 8, 2026"  },
  { id: 4, title: "Silent Forest",    category: "Sculpture",   price: "$2,100", status: "Published", date: "Jun 2, 2026"  },
  { id: 5, title: "Crimson Tide",     category: "Painting",    price: "$950",   status: "Reviewing", date: "May 28, 2026" },
  { id: 6, title: "Ethereal Light",   category: "Digital Art", price: "$1,750", status: "Published", date: "May 20, 2026" },
  { id: 7, title: "Concrete Jungle",  category: "Photography", price: "$600",   status: "Draft",     date: "May 15, 2026" },
  { id: 8, title: "Ocean Whisper",    category: "Painting",    price: "$3,200", status: "Published", date: "May 10, 2026" },
];

export default function ManageArtworksPage() {
  const [artworks, setArtworks] = useState(initialArtworks);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const filteredArtworks = artworks.filter(
    (artwork) =>
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalArtworks = artworks.length;
  const publishedCount = artworks.filter(a => a.status === "Published").length;

  const handleDelete = (id) => {
    setArtworks((prev) => prev.filter((a) => a.id !== id));
    setDeleteId(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Published":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "Reviewing":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case "Draft":
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="min-h-full text-foreground px-4 md:px-10 pb-16">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            Manage Artworks
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-xl">
            View, edit, and manage all your artworks in one place.
          </p>
        </div>

        {/* Quick Stats Summary */}
        <div className="flex items-center gap-4 bg-accent/30 dark:bg-accent/20 border border-separator rounded-xl px-5 py-3 shadow-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Total Artworks</p>
            <p className="text-xl font-bold text-foreground">{totalArtworks}</p>
          </div>
          <div className="w-px h-10 bg-separator mx-2" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Published</p>
            <p className="text-xl font-bold text-foreground">{publishedCount}</p>
          </div>
          <div className="w-px h-10 bg-separator mx-2 hidden sm:block" />
          <div className="hidden sm:block">
            <Link
              href="/dashboard/artist/artworks/add"
              className="flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition-all hover:bg-foreground/90"
            >
              <Plus className="size-4" />
              Add Artwork
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Add Button */}
      <div className="sm:hidden mb-6">
        <Link
          href="/dashboard/artist/artworks/add"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-all hover:bg-foreground/90"
        >
          <Plus className="size-4" />
          Add Artwork
        </Link>
      </div>

      {/* ── Main Content Area ── */}
      <div className="rounded-2xl border border-separator/60 bg-background/40 backdrop-blur-xl p-6 shadow-xl shadow-black/5 dark:shadow-none">
        
        {/* Toolbar: Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search artworks..."
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

        {/* ── Artworks Table ── */}
        <div className="overflow-hidden rounded-xl border border-separator bg-accent/20 dark:bg-accent/10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-separator text-[11px] font-bold uppercase tracking-wider text-muted-foreground bg-accent/30 dark:bg-accent/20">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl">Artwork Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-separator/60">
                {filteredArtworks.length > 0 ? (
                  filteredArtworks.map((artwork) => (
                    <tr key={artwork.id} className="transition-colors hover:bg-accent/30 dark:hover:bg-accent/20 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-separator bg-muted/40 text-muted-foreground">
                            <ImageIcon className="size-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{artwork.title}</p>
                            <p className="text-xs text-muted-foreground">{artwork.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{artwork.category}</td>
                      <td className="px-6 py-4 font-bold text-foreground">{artwork.price}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(artwork.status)}`}>
                          {artwork.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{artwork.date}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/artist/artworks/edit?id=${artwork.id}`}
                            className="inline-flex size-8 items-center justify-center rounded-lg border border-separator text-muted-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
                            title="Edit artwork"
                          >
                            <Pencil className="size-3.5" />
                          </Link>

                          {deleteId === artwork.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(artwork.id)}
                                className="inline-flex h-8 items-center gap-1 rounded-lg bg-red-500/15 px-2.5 text-[11px] font-semibold text-red-600 transition hover:bg-red-500/25 dark:text-red-400"
                                type="button"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteId(null)}
                                className="inline-flex h-8 items-center rounded-lg border border-separator px-2.5 text-[11px] font-semibold text-muted-foreground transition hover:bg-muted/20"
                                type="button"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteId(artwork.id)}
                              className="inline-flex size-8 items-center justify-center rounded-lg border border-separator text-muted-foreground transition-all hover:border-red-400/60 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                              type="button"
                              title="Delete artwork"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <ImageIcon className="size-10 opacity-20 mb-3" />
                        <p className="font-semibold text-foreground">No artworks found</p>
                        <p className="text-sm mt-1">Try a different search or <Link href="/dashboard/artist/artworks/add" className="text-primary hover:underline">add a new artwork</Link>.</p>
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
