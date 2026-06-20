"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Pencil,
  Trash2,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { getArtworks } from "@/lib/api/artworks";
import { deleteArtwork } from "@/lib/actions/artworks";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function ManageArtworksPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [deleteId, setDeleteId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const data = await getArtworks();
        setArtworks(data || []);
      } catch (error) {
        console.error("Failed to fetch artworks", error);
        toast.error("Failed to load artworks");
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  // Filter by search term AND by current user email
  let filteredArtworks = artworks.filter(
    (artwork) =>
      artwork.email === user?.email &&
      (artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       artwork.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (sortOption === "price-asc") {
    filteredArtworks.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortOption === "price-desc") {
    filteredArtworks.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortOption === "date-newest") {
    filteredArtworks.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  } else if (sortOption === "date-oldest") {
    filteredArtworks.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
  }

  const totalArtworks = filteredArtworks.length;
  const publishedCount = filteredArtworks.filter(
    (a) => a.status === "Published",
  ).length;

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await deleteArtwork(deleteId);
      if (res.deletedCount > 0) {
        setArtworks((prev) => prev.filter((a) => a._id !== deleteId));
        toast.success("Artwork deleted successfully");
      } else {
        toast.error("Failed to delete artwork");
      }
    } catch (error) {
      console.error("Failed to delete artwork:", error);
      toast.error("Failed to delete artwork");
    } finally {
      setDeleteId(null);
      setIsModalOpen(false);
    }
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
    <div className="min-h-full text-foreground px-4 md:px-6 pb-16">
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
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Total Artworks
            </p>
            <p className="text-xl font-bold text-foreground">{totalArtworks}</p>
          </div>
          <div className="w-px h-10 bg-separator mx-2" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Published
            </p>
            <p className="text-xl font-bold text-foreground">
              {publishedCount}
            </p>
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
            <div className="relative flex-1 sm:flex-none">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <Filter className="size-4" />
              </div>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full sm:w-auto appearance-none rounded-lg border border-separator bg-background pl-9 pr-8 py-2.5 text-sm font-semibold text-foreground outline-none transition-colors hover:bg-accent/40 focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="default">Sort by: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="date-newest">Date: Newest First</option>
                <option value="date-oldest">Date: Oldest First</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
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
                  <th className="px-6 py-4">View</th>
                  <th className="px-6 py-4 text-right rounded-tr-xl">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-separator/60">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr
                      key={i}
                      className="animate-pulse border-b border-separator/60 last:border-0"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-muted/40 shrink-0"></div>
                          <div className="space-y-2 w-full">
                            <div className="h-3.5 w-32 rounded-md bg-muted/40"></div>
                            <div className="h-2.5 w-20 rounded-md bg-muted/40"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-3.5 w-24 rounded-md bg-muted/40"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-3.5 w-16 rounded-md bg-muted/40"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 w-20 rounded-full bg-muted/40"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-3.5 w-24 rounded-md bg-muted/40"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-16 rounded-md bg-muted/40"></div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <div className="size-8 rounded-lg bg-muted/40"></div>
                          <div className="size-8 rounded-lg bg-muted/40"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : filteredArtworks.length > 0 ? (
                  filteredArtworks.map((artwork) => (
                    <tr
                      key={artwork._id}
                      className="transition-colors hover:bg-accent/30 dark:hover:bg-accent/20 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-separator bg-muted/40 text-muted-foreground overflow-hidden">
                            {artwork.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={artwork.image}
                                alt={artwork.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="size-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {artwork.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {artwork.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {artwork.category}
                      </td>
                      <td className="px-6 py-4 font-bold text-foreground">
                        ${artwork.price}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(artwork.status)}`}
                        >
                          {artwork.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {artwork.date || "Just now"}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/artworks/${artwork._id}`}
                          className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors hover:underline underline-offset-2"
                        >
                          View Details
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/artist/artworks/edit/${artwork._id}`}
                            className="inline-flex size-8 items-center justify-center rounded-lg border border-separator text-muted-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
                            title="Edit artwork"
                          >
                            <Pencil className="size-3.5" />
                          </Link>

                          <button
                            onClick={() => openDeleteModal(artwork._id)}
                            className="inline-flex size-8 items-center justify-center rounded-lg border border-separator text-muted-foreground transition-all hover:border-red-400/60 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                            type="button"
                            title="Delete artwork"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <ImageIcon className="size-10 opacity-20 mb-3" />
                        <p className="font-semibold text-foreground">
                          No artworks found
                        </p>
                        <p className="text-sm mt-1">
                          Try a different search or{" "}
                          <Link
                            href="/dashboard/artist/artworks/add"
                            className="text-primary hover:underline"
                          >
                            add a new artwork
                          </Link>
                          .
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsModalOpen(false)} 
          />
          
          {/* Modal Panel */}
          <div className="relative w-full max-w-md rounded-2xl border border-separator/60 bg-background/95 backdrop-blur-xl p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            {/* Warning Icon */}
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
              <Trash2 className="size-5 text-red-500" />
            </div>
            
            {/* Title */}
            <h3 className="text-center text-lg font-bold text-foreground mb-2">
              Delete Artwork
            </h3>
            
            {/* Description */}
            <p className="text-center text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this artwork? This action is permanent and cannot be undone.
            </p>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-xl border border-separator bg-accent/30 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent/60"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 shadow-lg shadow-red-500/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
