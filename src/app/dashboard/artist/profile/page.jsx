"use client";

import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useProfile } from "@/context/ProfileContext";
import { getArtworks } from "@/lib/api/artworks";
import { Button } from "@heroui/react";
import {
  Camera,
  MapPin,
  Link as LinkIcon,
  Palette,
  Eye,
  ShoppingBag,
  Leaf,
  Loader2,
  Users,
} from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

async function uploadToImgbb(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!data.success) throw new Error("Image upload failed");
  return data.data.display_url;
}

export default function ArtistProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();
  const { refreshProfile } = useProfile();

  const [profile, setProfile] = useState(null);
  const [artworksCount, setArtworksCount] = useState(0);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    about: "",
    location: "",
    website: "",
    twitter: "",
    instagram: "",
  });

  // Fetch profile from DB
  useEffect(() => {
    if (!user?.email) return;
    const fetchProfile = async () => {
      try {
        const [profileRes, artworksData] = await Promise.all([
          fetch(`${BASE_URL}/api/profiles/${user.email}`, { cache: "no-store" }),
          getArtworks(user.email)
        ]);
        
        const data = await profileRes.json();
        setProfile(data);
        setArtworksCount(artworksData.length);
        
        setFormData({
          name: data.name || user.name || "",
          bio: data.bio || "",
          about: data.about || "",
          location: data.location || "",
          website: data.website || "",
          twitter: data.twitter || "",
          instagram: data.instagram || "",
        });
      } catch {
        console.error("Failed to load profile data");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [user?.email]);

  // Save profile data to DB
  const saveProfile = async (updates) => {
    try {
      const res = await fetch(`${BASE_URL}/api/profiles/${user.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        setProfile((prev) => ({ ...prev, ...updates }));
        return true;
      }
    } catch {
      return false;
    }
  };

  const handleSaveProfileDetails = async () => {
    const saved = await saveProfile(formData);
    if (saved) {
      toast.success("Profile details updated!");
      refreshProfile();
      setIsModalOpen(false);
    } else {
      toast.error("Failed to save profile details");
    }
  };

  // Handle avatar upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const imageUrl = await uploadToImgbb(file);
      const saved = await saveProfile({ profileImage: imageUrl });
      if (saved) {
        toast.success("Profile image updated!");
        refreshProfile();
      }
      else toast.error("Failed to save profile image");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle cover upload
  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const imageUrl = await uploadToImgbb(file);
      const saved = await saveProfile({ coverImage: imageUrl });
      if (saved) {
        toast.success("Cover image updated!");
        refreshProfile();
      }
      else toast.error("Failed to save cover image");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploadingCover(false);
    }
  };

  if (isPending || loadingProfile) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
          <p className="text-sm text-muted-foreground animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  const userName = profile?.name || user?.name || "Artist Name";
  const userEmail = user?.email || "artist@example.com";
  const userInitials = userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const profileImage = profile?.profileImage || user?.image;
  const coverImage = profile?.coverImage;

  // Dynamic stats for the UI
  const stats = [
    { label: "Followers", value: profile?.followers?.length || 0, icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Artworks", value: artworksCount, icon: Palette, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Sales", value: profile?.itemsSold || 0, icon: ShoppingBag, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="space-y-6 px-6">
      {/* Hidden File Inputs */}
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverChange} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Artist Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your public persona and view your stats.</p>
        </div>
        <Button 
          onPress={() => setIsModalOpen(true)}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5"
        >
          Edit Profile
        </Button>
      </div>

      {/* Custom Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-background border border-separator/60 shadow-2xl p-6 z-10 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold text-foreground mb-6 border-b border-separator/30 pb-4">Edit Profile Details</h2>
            
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Display Name</label>
                <input 
                  type="text"
                  placeholder="E.g. Alex Sterling" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-xl border border-separator/60 bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Short Bio</label>
                <input 
                  type="text"
                  placeholder="E.g. Digital artist exploring nature and tech" 
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full rounded-xl border border-separator/60 bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">About (Detailed)</label>
                <textarea 
                  placeholder="Tell your story..." 
                  value={formData.about}
                  onChange={(e) => setFormData({...formData, about: e.target.value})}
                  rows={4}
                  className="w-full rounded-xl border border-separator/60 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <input 
                    type="text"
                    placeholder="E.g. San Francisco, CA" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full rounded-xl border border-separator/60 bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Website</label>
                  <input 
                    type="text"
                    placeholder="E.g. artverse.com/artist/alex" 
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    className="w-full rounded-xl border border-separator/60 bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Twitter (X) Username</label>
                  <input 
                    type="text"
                    placeholder="E.g. @alex_arts" 
                    value={formData.twitter}
                    onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                    className="w-full rounded-xl border border-separator/60 bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Instagram Username</label>
                  <input 
                    type="text"
                    placeholder="E.g. @alex.sterling" 
                    value={formData.instagram}
                    onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                    className="w-full rounded-xl border border-separator/60 bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-separator/30 pt-4">
              <Button variant="light" onPress={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary text-primary-foreground" onPress={handleSaveProfileDetails}>
                Save Changes
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-3xl border border-separator/60 bg-background/50 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-none"
          >
            {/* Cover Image */}
            <div
              className="h-32 w-full relative bg-cover bg-center"
              style={{
                backgroundImage: coverImage
                  ? `url(${coverImage})`
                  : "linear-gradient(to right, rgba(16,185,129,0.8), rgba(20,184,166,0.8), rgba(6,182,212,0.8))",
              }}
            >
              <button
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
                className="absolute right-3 top-3 p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors disabled:opacity-50"
              >
                {uploadingCover ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
              </button>
            </div>

            {/* Profile Content */}
            <div className="relative px-6 pb-6 text-center">
              {/* Avatar */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-full border-4 border-background bg-background shadow-xl">
                {profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profileImage}
                    alt={userName}
                    className="size-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
                    {userInitials}
                  </div>
                )}
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors border-2 border-background disabled:opacity-50"
                >
                  {uploadingAvatar ? <Loader2 className="size-3 animate-spin" /> : <Camera className="size-3" />}
                </button>
              </div>

              <div className="pt-16 pb-4">
                <h2 className="text-xl font-bold text-foreground">{userName}</h2>
                <p className="text-sm text-muted-foreground">{userEmail}</p>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Pro Artist
                  </span>
                  <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    Digital
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground/80 pb-6 border-b border-separator/60">
                {profile?.bio || "Digital artist exploring the intersection of nature and technology. Creating vibrant, surreal landscapes that challenge our perception of reality."}
              </p>

              <div className="pt-6 space-y-3 text-sm text-left">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="size-4 mr-3" />
                  <span>{profile?.location || "Location not set"}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <LinkIcon className="size-4 mr-3" />
                  {profile?.website ? (
                    <a 
                      href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-primary transition-colors truncate"
                    >
                      {profile.website}
                    </a>
                  ) : (
                    <span>No website</span>
                  )}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <span className="size-4 mr-3 font-bold">X</span>
                  {profile?.twitter ? (
                    <a 
                      href={`https://twitter.com/${profile.twitter.replace(/^@/, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-primary transition-colors truncate"
                    >
                      {profile.twitter}
                    </a>
                  ) : (
                    <span>Not set</span>
                  )}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <span className="size-4 mr-3 font-bold">IG</span>
                  {profile?.instagram ? (
                    <a 
                      href={`https://instagram.com/${profile.instagram.replace(/^@/, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-primary transition-colors truncate"
                    >
                      {profile.instagram}
                    </a>
                  ) : (
                    <span>Not set</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Stats & Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => {
                  if (stat.label === "Followers") setIsFollowersModalOpen(true);
                  if (stat.label === "Artworks") router.push("/dashboard/artist/artworks");
                }}
                className={`rounded-3xl border border-separator/60 bg-background/50 backdrop-blur-xl p-5 shadow-sm transition-shadow ${(stat.label === "Followers" || stat.label === "Artworks") ? "cursor-pointer hover:shadow-md hover:border-primary/50" : ""}`}
              >
                <div className={`size-10 rounded-2xl ${stat.bg} flex items-center justify-center mb-4`}>
                  <stat.icon className={`size-5 ${stat.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Activity / About section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl border border-separator/60 bg-background/50 backdrop-blur-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-bold text-foreground mb-4">About the Artist</h3>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                {profile?.about || "I am a self-taught digital artist with a passion for creating immersive, surreal environments. My work often blends organic elements with futuristic cyberpunk aesthetics, aiming to evoke a sense of wonder and nostalgia."}
              </p>
              <p>
                With a background in graphic design, I bring a strong sense of composition and color theory to my digital paintings. I've been creating art professionally for over 5 years and have been featured in several online galleries and digital exhibitions.
              </p>
              <p>
                My toolset primarily includes Adobe Photoshop, Blender, and occasionally Procreate for sketching ideas on the go.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Followers Modal */}
      {isFollowersModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsFollowersModalOpen(false)} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-background border border-separator/60 shadow-2xl p-6 z-10 max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-separator/30 pb-4 mb-4">
              <h2 className="text-xl font-bold text-foreground">Followers ({profile?.followers?.length || 0})</h2>
              <button 
                onClick={() => setIsFollowersModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {!profile?.followers || profile.followers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="size-12 mx-auto rounded-full bg-muted/30 flex items-center justify-center mb-3">
                    <Users className="size-6 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No followers yet</p>
                  <p className="text-xs text-muted-foreground mt-1">When users follow you, they will appear here.</p>
                </div>
              ) : (
                profile.followers.map((follower, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-separator/40 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent text-primary flex items-center justify-center font-bold overflow-hidden border border-separator/40 shrink-0">
                        {follower.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={follower.image} alt={follower.name || "Follower"} className="w-full h-full object-cover" />
                        ) : (
                          (follower.name || "U")[0].toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground line-clamp-1">{follower.name || "Unknown User"}</p>
                        <p className="text-xs text-muted-foreground">{follower.email}</p>
                      </div>
                    </div>
                    {follower.role && (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider shrink-0">
                        {follower.role}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
