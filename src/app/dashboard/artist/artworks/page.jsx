"use client";
"use no memo";

import { useState } from "react";
import { Pencil, Trash2, Search, Plus, ImageIcon } from "lucide-react";
import Link from "next/link";
import {
  Chip,
  Tooltip,
} from "@heroui/react";

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

const statusColorMap = {
  Published: "success",
  Draft:     "default",
  Reviewing: "warning",
};

export default function ManageArtworksPage() {
  const [artworks, setArtworks] = useState(initialArtworks);
  const [search, setSearch]     = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const filtered = artworks.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    setArtworks((prev) => prev.filter((a) => a.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="min-h-full text-foreground px-10">
      <div className="">

        {/* ── Page Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-[26px]">
              Manage Artworks
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              View, edit, and manage all your artworks in one place.
            </p>
          </div>
          <Link
            href="/dashboard/artist/artworks/add"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-95"
          >
            <Plus className="size-4" />
            Add Artwork
          </Link>
        </div>

        {/* ── Search Bar ── */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search artworks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-separator bg-accent/30 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-accent/20"
            />
          </div>
          <p className="shrink-0 text-xs text-muted-foreground">
            {filtered.length} artwork{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-separator bg-accent/30 dark:bg-accent/20">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-separator text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-4">Artwork Name</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-separator/60">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <div className="flex size-14 items-center justify-center rounded-2xl border border-separator bg-muted/30">
                          <ImageIcon className="size-6 opacity-50" />
                        </div>
                        <div>
                          <p className="font-semibold">No artworks found</p>
                          <p className="mt-1 text-xs">
                            Try a different search or{" "}
                            <Link href="/dashboard/artist/artworks/add" className="text-primary underline underline-offset-2">
                              add a new artwork
                            </Link>
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((artwork) => (
                    <tr key={artwork.id} className="transition-colors hover:bg-muted/20">
                      <td className="px-5 py-4 align-middle">
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
                      <td className="px-5 py-4 align-middle text-muted-foreground">{artwork.category}</td>
                      <td className="px-5 py-4 align-middle font-semibold text-foreground">{artwork.price}</td>
                      <td className="px-5 py-4 align-middle">
                        <Chip color={statusColorMap[artwork.status] || "default"} size="sm" variant="flat">
                          {artwork.status}
                        </Chip>
                      </td>
                      <td className="px-5 py-4 align-middle text-muted-foreground">{artwork.date}</td>
                      <td className="px-5 py-4 align-middle text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Tooltip content="Edit artwork" color="primary" size="sm">
                            <Link
                              href={`/dashboard/artist/artworks/edit?id=${artwork.id}`}
                              className="inline-flex size-8 items-center justify-center rounded-lg border border-separator text-muted-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
                            >
                              <Pencil className="size-3.5" />
                            </Link>
                          </Tooltip>

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
                            <Tooltip content="Delete artwork" color="danger" size="sm">
                              <button
                                onClick={() => setDeleteId(artwork.id)}
                                className="inline-flex size-8 items-center justify-center rounded-lg border border-separator text-muted-foreground transition-all hover:border-red-400/60 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                                type="button"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </Tooltip>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
