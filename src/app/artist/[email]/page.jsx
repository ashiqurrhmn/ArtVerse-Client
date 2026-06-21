"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Link as LinkIcon,
  Eye,
  Leaf,
  Palette,
  ShoppingBag,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { getArtworks } from "@/lib/api/artworks";
import ArtworkCard from "@/components/ArtworkCard";
import { authClient } from "@/lib/auth-client";
import { useProfile } from "@/context/ProfileContext";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

const PublicArtistProfilePage = () => {
  const params = useParams();
  const email = decodeURIComponent(params?.email || "");

  const [profile, setProfile] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowingToggle, setIsFollowingToggle] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(10);
      } else {
        setItemsPerPage(9);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data: session } = authClient.useSession();
  const currentUser = session?.user;
  const { profile: loggedInProfile } = useProfile();

  useEffect(() => {
    if (!email) return;

    const fetchArtistData = async () => {
      try {
        // Fetch profile
        const profileRes = await fetch(`${BASE_URL}/api/profiles/${email}`);
        const profileData = await profileRes.json();
        setProfile(profileData);

        // Fetch artworks
        const artworksData = await getArtworks(email);
        // Only show Published artworks (or older artworks with no status)
        const publishedArtworks = artworksData.filter(
          (a) => a.status === "Published" || !a.status
        );
        setArtworks(publishedArtworks);
      } catch (error) {
        console.error("Failed to fetch artist data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistData();
  }, [email]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error("Please login to follow artists");
      return;
    }

    setIsFollowingToggle(true);

    const followerName = loggedInProfile?.name || currentUser.name;
    const followerImage =
      loggedInProfile?.profileImage || currentUser.image || "";
    const followerRole = currentUser.role || "user";

    try {
      const res = await fetch(`${BASE_URL}/api/profiles/${email}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: currentUser.email,
          name: followerName,
          image: followerImage,
          role: followerRole,
        }),
      });

      if (!res.ok) throw new Error("Failed to toggle follow");

      const data = await res.json();

      // Update local profile state
      setProfile((prev) => {
        const currentFollowers = prev.followers || [];
        if (data.isFollowing) {
          return {
            ...prev,
            followers: [
              ...currentFollowers,
              {
                email: currentUser.email,
                name: followerName,
                image: followerImage,
                role: followerRole,
              },
            ],
          };
        } else {
          return {
            ...prev,
            followers: currentFollowers.filter(
              (f) => f.email !== currentUser.email,
            ),
          };
        }
      });

      toast.success(
        data.isFollowing ? "Followed artist!" : "Unfollowed artist",
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to perform action");
    } finally {
      setIsFollowingToggle(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading artist profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile || Object.keys(profile).length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Artist Not Found
          </h2>
          <p className="text-muted-foreground mt-2">
            The profile you are looking for does not exist.
          </p>
          <Link href="/browse">
            <button className="mt-6 rounded-full bg-primary px-6 py-2 font-medium text-primary-foreground hover:opacity-90">
              Browse Artworks
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (profile && (profile.role === "buyer" || profile.role === "admin")) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center bg-background">
        <div className="flex size-20 md:size-24 items-center justify-center rounded-full bg-muted/50 mb-6 border border-separator/50 shadow-inner">
          <UserX className="size-10 md:size-12 text-muted-foreground/60" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3 tracking-tight">Profile Unavailable</h1>
        <p className="text-muted-foreground mb-8 max-w-md text-base sm:text-lg leading-relaxed">
          This user does not have a public artist profile available for viewing.
        </p>
        <Link
          href="/browse"
          className="rounded-2xl bg-foreground px-8 py-4 font-bold text-background transition-all hover:scale-105 hover:bg-foreground/90 shadow-xl shadow-foreground/20"
        >
          Explore Gallery
        </Link>
      </div>
    );
  }

  const userName = profile?.name || "Unknown Artist";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const profileImage = profile?.profileImage;
  const coverImage = profile?.coverImage;

  // Pagination logic
  const totalPages = Math.ceil(artworks.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArtworks = artworks.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* ── Cover Banner ── */}
      <div className="relative h-[250px] md:h-[350px] w-full bg-muted/30 overflow-hidden">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-separator/60 bg-background/80 backdrop-blur-xl p-6 shadow-xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6 size-32 sm:size-40 shrink-0 rounded-full border-4 border-background bg-muted shadow-xl overflow-hidden">
                  {profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profileImage}
                      alt={userName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-4xl font-bold text-primary">
                      {userInitials}
                    </div>
                  )}
                </div>

                <h1 className="text-2xl font-bold text-foreground">
                  {userName}
                </h1>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    Artist
                  </span>
                </div>

                {currentUser && currentUser.email !== email && (
                  <button
                    onClick={handleFollowToggle}
                    disabled={isFollowingToggle}
                    className={`mt-4 w-full max-w-[200px] rounded-full px-6 py-2 text-sm font-semibold transition-all ${
                      profile?.followers?.some(
                        (f) => f.email === currentUser.email,
                      )
                        ? "bg-muted text-foreground border border-separator hover:bg-muted/80"
                        : "bg-primary text-primary-foreground hover:opacity-90"
                    } disabled:opacity-50`}
                  >
                    {isFollowingToggle ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      </span>
                    ) : profile?.followers?.some(
                        (f) => f.email === currentUser.email,
                      ) ? (
                      "Following"
                    ) : (
                      "Follow"
                    )}
                  </button>
                )}

                <div className="mt-6 flex justify-center gap-8 border-y border-separator/60 py-5 w-full">
                  <div className="text-center">
                    <p className="text-xl font-bold text-foreground">
                      {profile?.followers?.length || 0}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">
                      Followers
                    </p>
                  </div>
                  <div className="w-px bg-separator/60"></div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-foreground">
                      {profile?.itemsSold || 0}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">
                      Items Sold
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-sm text-muted-foreground">
                  {profile?.bio || "This artist hasn't written a bio yet."}
                </p>

                <div className="w-full mt-6 space-y-3 text-sm text-left border-t border-separator/60 pt-6">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="size-4 mr-3" />
                    <span>{profile?.location || "Location not set"}</span>
                  </div>

                  {profile?.website && (
                    <div className="flex items-center text-muted-foreground">
                      <LinkIcon className="size-4 mr-3" />
                      <a
                        href={
                          profile.website.startsWith("http")
                            ? profile.website
                            : `https://${profile.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors truncate"
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}

                  {profile?.twitter && (
                    <div className="flex items-center text-muted-foreground">
                      <span className="size-4 mr-3 font-bold">X</span>
                      <a
                        href={`https://twitter.com/${profile.twitter.replace(/^@/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors truncate"
                      >
                        {profile.twitter}
                      </a>
                    </div>
                  )}

                  {profile?.instagram && (
                    <div className="flex items-center text-muted-foreground">
                      <span className="size-4 mr-3 font-bold">IG</span>
                      <a
                        href={`https://instagram.com/${profile.instagram.replace(/^@/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors truncate"
                      >
                        {profile.instagram}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: About & Artworks */}
          <div className="lg:col-span-2 space-y-8 mt-6 sm:mt-24 lg:mt-0">
            {/* About Section */}
            {profile?.about && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-3xl border border-separator/60 bg-background/50 backdrop-blur-xl p-6 md:p-8"
              >
                <h3 className="text-lg font-bold text-foreground mb-4">
                  About the Artist
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {profile.about}
                </p>
              </motion.div>
            )}

            {/* Artworks Portfolio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">
                  Portfolio
                </h3>
                <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                  {artworks.length}{" "}
                  {artworks.length === 1 ? "Artwork" : "Artworks"}
                </span>
              </div>

              {artworks.length > 0 ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                    {paginatedArtworks.map((artwork, index) => (
                      <ArtworkCard
                        key={artwork._id}
                        artwork={artwork}
                        index={index}
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-separator rounded-xl hover:bg-muted/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        Previous
                      </button>
                      
                      <div className="hidden sm:flex gap-1">
                        {[...Array(totalPages)].map((_, i) => {
                          const pageNum = i + 1;
                          if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`size-9 flex items-center justify-center text-sm font-medium rounded-xl transition-colors ${
                                  currentPage === pageNum
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-foreground bg-background border border-separator hover:bg-muted/20"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          } else if (
                            pageNum === currentPage - 2 ||
                            pageNum === currentPage + 2
                          ) {
                            return (
                              <span key={pageNum} className="px-1 py-2 text-muted-foreground">
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-separator rounded-xl hover:bg-muted/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-3xl border border-separator/60 border-dashed bg-background/30 p-12 text-center">
                  <Palette className="mx-auto size-10 text-muted-foreground/40 mb-4" />
                  <h3 className="text-lg font-bold text-foreground">
                    No artworks yet
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This artist hasn't published any artworks yet.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicArtistProfilePage;
