"use client";
import React, { useState, useEffect } from "react";
import { Search, Trash2, Image as ImageIcon, ArrowUpDown, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { Modal, Button, Skeleton } from "@heroui/react";

const AdminManageArtworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const [isOpen, setIsOpen] = useState(false);
  const [artworkToDelete, setArtworkToDelete] = useState(null);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/artworks`,
      );
      if (!res.ok) throw new Error("Failed to fetch artworks");
      const data = await res.json();
      setArtworks(data);
    } catch (error) {
      console.error("Error fetching artworks:", error);
      toast.error("Failed to load artworks");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (art) => {
    setArtworkToDelete(art);
    setIsOpen(true);
  };

  const handleDeleteArtwork = async () => {
    if (!artworkToDelete) return;

    const loadingToast = toast.loading("Deleting artwork...");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/artworks/${artworkToDelete._id}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) throw new Error("Failed to delete artwork");

      setArtworks((prev) =>
        prev.filter((art) => art._id !== artworkToDelete._id),
      );
      toast.success("Artwork deleted successfully", { id: loadingToast });
      setIsOpen(false);
      setArtworkToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete artwork", { id: loadingToast });
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const loadingToast = toast.loading(`Updating status to ${newStatus}...`);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/artworks/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!res.ok) throw new Error("Failed to update status");

      setArtworks((prev) =>
        prev.map((art) => (art._id === id ? { ...art, status: newStatus } : art)),
      );
      toast.success(`Artwork status updated to ${newStatus}`, { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update artwork status", { id: loadingToast });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Reviewing":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500";
      case "Rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20 focus:ring-2 focus:ring-red-500/20 focus:border-red-500";
      case "Published":
      default:
        return "bg-green-500/10 text-green-500 border-green-500/20 focus:ring-2 focus:ring-green-500/20 focus:border-green-500";
    }
  };

  const filteredArtworks = artworks.filter((art) => {
    const titleMatch = (art.title || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const artistMatch = (art.userName || art.artist || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return titleMatch || artistMatch;
  });

  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    if (sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
    if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
    return 0;
  });

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Manage Artworks
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and manage all artworks uploaded to the platform.
          </p>
        </div>

        {/* Search / Action Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-auto group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search artworks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-background border border-separator rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none w-full sm:w-64 text-sm text-foreground placeholder-muted-foreground shadow-sm"
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-background border border-separator text-foreground text-sm rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary block w-full py-2.5 pl-4 pr-10 cursor-pointer hover:bg-muted/10 transition-colors outline-none shadow-sm"
            >
              <option value="default" className="bg-background text-foreground">
                Sort by: Default
              </option>
              <option
                value="price-asc"
                className="bg-background text-foreground"
              >
                Price: Low to High
              </option>
              <option
                value="price-desc"
                className="bg-background text-foreground"
              >
                Price: High to Low
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
              <ArrowUpDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-background border border-separator rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto md:overflow-visible">
          <table className="w-full text-left border-collapse block md:table">
            <thead className="hidden md:table-header-group">
              <tr className="bg-muted/20 border-b border-separator text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                <th className="px-6 py-4">Artwork</th>
                <th className="px-6 py-4">Artist</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Upload Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-separator block md:table-row-group">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr
                    key={`skeleton-${idx}`}
                    className="block md:table-row border-b border-separator/30 p-4 md:p-0"
                  >
                    <td className="block md:table-cell px-2 py-3 md:px-6 md:py-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="w-16 h-16 md:w-12 md:h-12 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-2 min-w-0">
                          <Skeleton className="h-4 w-32 rounded-lg" />
                          <Skeleton className="h-3 w-24 rounded-lg md:hidden" />
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-2 py-3 md:px-6 md:py-4">
                      <Skeleton className="h-4 w-24 rounded-lg" />
                    </td>
                    <td className="hidden md:table-cell px-2 py-3 md:px-6 md:py-4">
                      <Skeleton className="h-5 w-16 rounded-md" />
                    </td>
                    <td className="hidden md:table-cell px-2 py-3 md:px-6 md:py-4">
                      <Skeleton className="h-9 w-full max-w-[120px] rounded-lg" />
                    </td>
                    <td className="hidden md:table-cell px-2 py-3 md:px-6 md:py-4">
                      <Skeleton className="h-5 w-24 rounded-md" />
                    </td>
                    <td className="hidden md:table-cell px-2 py-3 md:px-6 md:py-4 md:text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="w-20 h-8 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : sortedArtworks.length > 0 ? (
                sortedArtworks.map((art) => (
                  <tr
                    key={art._id || art.id}
                    className="block md:table-row hover:bg-muted/10 transition-colors group p-4 md:p-0"
                  >
                    <td className="block md:table-cell px-2 py-3 md:px-6 md:py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          {art.images?.[0] || art.image ? (
                            <img
                              src={art.images?.[0] || art.image}
                              alt={art.title}
                              className="w-16 h-16 md:w-12 md:h-12 rounded-lg object-cover border-2 border-separator shadow-sm"
                            />
                          ) : (
                            <div className="w-16 h-16 md:w-12 md:h-12 rounded-lg bg-muted flex items-center justify-center border-2 border-separator shadow-sm">
                              <ImageIcon className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-base md:text-sm">
                            {art.title}
                          </div>
                          <div className="text-sm text-muted-foreground mt-0.5 md:hidden">
                            By {art.userName || art.artist}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4 border-t border-separator/30 md:border-none mt-3 md:mt-0 pt-4 md:pt-4">
                      <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">
                        Artist
                      </span>
                      <div className="font-medium text-foreground text-sm">
                        {art.userName || art.artist}
                      </div>
                    </td>
                    <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4">
                      <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">
                        Price
                      </span>
                      <div className="font-bold text-primary">
                        ${(art.price || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4">
                      <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">
                        Status
                      </span>
                      <div className="relative w-32 md:w-full md:max-w-[140px]">
                        <select
                          className={`appearance-none border font-semibold text-sm rounded-lg block w-full p-2 pr-8 cursor-pointer transition-colors outline-none shadow-sm ${getStatusColor(art.status || "Published")}`}
                          value={art.status || "Published"}
                          onChange={(e) =>
                            handleUpdateStatus(art._id, e.target.value)
                          }
                        >
                          <option
                            value="Reviewing"
                            className="bg-background text-foreground"
                          >
                            Reviewing
                          </option>
                          <option
                            value="Published"
                            className="bg-background text-foreground"
                          >
                            Published
                          </option>
                          <option
                            value="Rejected"
                            className="bg-background text-foreground"
                          >
                            Rejected
                          </option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </td>
                    <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4">
                      <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">
                        Upload Date
                      </span>
                      <div className="font-medium text-muted-foreground text-sm">
                        {art._id
                          ? new Date(
                              parseInt(art._id.substring(0, 8), 16) * 1000,
                            ).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </div>
                    </td>
                    <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4 md:text-right">
                      <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">
                        Actions
                      </span>
                      <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                        <button
                          onClick={() => confirmDelete(art)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20"
                          title="Delete Artwork"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="md:hidden">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center block md:table-cell"
                  >
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
                      <p>No artworks found matching your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (Mock) */}
        <div className="bg-muted/10 border-t border-separator px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {sortedArtworks.length > 0 ? 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {sortedArtworks.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {sortedArtworks.length}
            </span>{" "}
            artworks
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 text-sm font-medium text-foreground bg-background border border-separator rounded-lg hover:bg-muted/20 transition-colors disabled:opacity-50 shadow-sm"
              disabled={true}
            >
              Previous
            </button>
            <button
              className="px-3 py-1.5 text-sm font-medium text-foreground bg-background border border-separator rounded-lg hover:bg-muted/20 transition-colors shadow-sm disabled:opacity-50"
              disabled={true}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Backdrop className="bg-black/50 backdrop-blur-sm">
          <Modal.Container placement="center">
            <Modal.Dialog className="bg-background border border-separator shadow-2xl rounded-3xl p-4 md:p-6 text-foreground max-w-sm w-full mx-auto">
              <Modal.Header className="flex flex-col items-center justify-center pt-4 pb-2">
                <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 shadow-sm">
                  <Trash2 className="w-6 h-6 text-red-500" strokeWidth={1.5} />
                </div>
                <Modal.Heading className="text-xl font-bold text-foreground">
                  Delete Artwork
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="text-center px-4 py-0">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Are you sure you want to delete the artwork{" "}
                  <strong>{artworkToDelete?.title || "Unknown"}</strong>? This
                  action is permanent and cannot be undone.
                </p>
              </Modal.Body>
              <Modal.Footer className="flex flex-row justify-center gap-3 pt-8 pb-2">
                <Button
                  variant="bordered"
                  onPress={() => setIsOpen(false)}
                  className="flex-1 font-semibold border border-separator text-foreground bg-transparent hover:bg-muted/30 rounded-2xl py-6 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => handleDeleteArtwork()}
                  className="flex-1 font-semibold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 rounded-2xl py-6 border border-transparent transition-colors"
                >
                  Yes, Delete
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
};

export default AdminManageArtworks;
