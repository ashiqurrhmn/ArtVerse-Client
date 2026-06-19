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
  DollarSign
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

export default function CommonProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();
  const { refreshProfile } = useProfile();

  const [profile, setProfile] = useState(null);
  const [artworksCount, setArtworksCount] = useState(0);
  const [purchases, setPurchases] = useState([]);
  
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

  // Fetch profile and role-specific data
  useEffect(() => {
    if (!user?.email) return;
    const fetchData = async () => {
      try {
        const [profileRes, purchasesRes, artworksData] = await Promise.all([
          fetch(`${BASE_URL}/api/profiles/${user.email}`, { cache: "no-store" }),
          fetch(`${BASE_URL}/api/purchases?email=${encodeURIComponent(user.email)}`),
          getArtworks(user.email).catch(() => [])
        ]);
        
        const data = await profileRes.json();
        const purchasesData = await purchasesRes.json();

        setProfile(data);
        setArtworksCount(artworksData.length || 0);
        setPurchases(purchasesData || []);
        
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
    fetchData();
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
      <div className="space-y-6 px-4 md:px-6 py-6 md:py-0 w-full animate-pulse">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted/30 rounded-md"></div>
            <div className="h-4 w-72 bg-muted/30 rounded-md"></div>
          </div>
          <div className="h-10 w-28 bg-muted/30 rounded-xl"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="overflow-hidden rounded-3xl border border-separator/60 bg-background/50 shadow-sm">
              <div className="h-32 w-full bg-muted/30"></div>
              <div className="relative px-6 pb-6 text-center">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 size-24 rounded-full border-4 border-background bg-muted/40 shadow-sm"></div>
                <div className="pt-16 pb-4 space-y-3 flex flex-col items-center">
                  <div className="h-6 w-32 bg-muted/30 rounded-md"></div>
                  <div className="h-4 w-48 bg-muted/30 rounded-md"></div>
                  <div className="flex gap-2 mt-2">
                    <div className="h-5 w-24 bg-muted/30 rounded-full"></div>
                    <div className="h-5 w-24 bg-muted/30 rounded-full"></div>
                  </div>
                </div>
                <div className="pb-6 border-b border-separator/60 space-y-2 flex flex-col items-center">
                  <div className="h-3 w-full bg-muted/30 rounded-md"></div>
                  <div className="h-3 w-5/6 bg-muted/30 rounded-md"></div>
                </div>
                <div className="pt-6 space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="size-4 rounded-full bg-muted/30"></div>
                      <div className="h-3 w-2/3 bg-muted/30 rounded-md"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-3xl border border-separator/60 bg-background/50 p-5 shadow-sm">
                  <div className="size-10 rounded-2xl bg-muted/30 mb-4"></div>
                  <div className="h-7 w-16 bg-muted/30 rounded-md mb-2"></div>
                  <div className="h-3 w-24 bg-muted/30 rounded-md"></div>
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-separator/60 bg-background/50 p-6 space-y-4 shadow-sm">
              <div className="h-6 w-40 bg-muted/30 rounded-md mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-muted/30 rounded-md"></div>
                <div className="h-4 w-full bg-muted/30 rounded-md"></div>
                <div className="h-4 w-5/6 bg-muted/30 rounded-md"></div>
                <div className="h-4 w-4/6 bg-muted/30 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  let userRole = profile?.role || user?.role || "buyer";
  if (userRole === "seller") userRole = "artist";

  const isArtist = userRole === "artist";

  const userName = profile?.name || user?.name || (isArtist ? "Artist Name" : "Buyer Name");
  const userEmail = user?.email || "user@example.com";
  const userInitials = userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const profileImage = profile?.profileImage || user?.image;
  const coverImage = profile?.coverImage;

  const totalSpent = purchases.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const supportedArtistsCount = new Set(purchases.filter(p => p.artwork?.userName).map(p => p.artwork.userName)).size;

  // Dynamic stats
  const stats = isArtist ? [
    { label: "Followers", value: profile?.followers?.length || 0, icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Artworks", value: artworksCount, icon: Palette, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Sales", value: profile?.itemsSold || 0, icon: ShoppingBag, color: "text-orange-500", bg: "bg-orange-500/10" },
  ] : [
    { label: "Purchased", value: purchases.length, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Spent", value: `$${totalSpent.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Artists Supported", value: supportedArtistsCount, icon: Palette, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="space-y-6 px-4 md:px-6 py-6 md:py-0 overflow-y-auto w-full">
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverChange} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{isArtist ? "Artist Profile" : "Buyer Profile"}</h1>
          <p className="text-muted-foreground mt-1">Manage your public persona and view your stats.</p>
        </div>
        <Button 
          onPress={() => setIsModalOpen(true)}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5"
        >
          Edit Profile
        </Button>
      </div>

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
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-background border border-separator/60 shadow-2xl p-6 z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
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
                  placeholder={isArtist ? "E.g. Digital artist" : "E.g. Art collector and enthusiast"} 
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
                    placeholder="E.g. artverse.com/user/alex" 
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
              <Button variant="light" onPress={() => setIsModalOpen(false)}>Cancel</Button>
              <Button className="bg-primary text-primary-foreground" onPress={handleSaveProfileDetails}>Save Changes</Button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-3xl border border-separator/60 bg-background/50 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-none"
          >
            <div
              className="h-32 w-full relative bg-cover bg-center"
              style={{
                backgroundImage: coverImage
                  ? `url(${coverImage})`
                  : (isArtist 
                      ? "linear-gradient(to right, rgba(16,185,129,0.8), rgba(20,184,166,0.8), rgba(6,182,212,0.8))"
                      : "linear-gradient(to right, rgba(139,92,246,0.8), rgba(236,72,153,0.8), rgba(244,63,94,0.8))"),
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

            <div className="relative px-6 pb-6 text-center">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-full border-4 border-background bg-background shadow-xl">
                {profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profileImage} alt={userName} className="size-24 rounded-full object-cover" />
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
                  {isArtist ? (
                    <>
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">Pro Artist</span>
                      <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">Digital</span>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400">Art Collector</span>
                      <span className="inline-flex items-center rounded-full bg-pink-500/10 px-2.5 py-0.5 text-xs font-semibold text-pink-600 dark:text-pink-400">Enthusiast</span>
                    </>
                  )}
                </div>
              </div>

              <p className="text-sm text-muted-foreground/80 pb-6 border-b border-separator/60">
                {profile?.bio || (isArtist ? "Digital artist exploring the intersection of nature and technology." : "An avid lover of digital art and surreal landscapes.")}
              </p>

              <div className="pt-6 space-y-3 text-sm text-left">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="size-4 mr-3" />
                  <span>{profile?.location || "Location not set"}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <LinkIcon className="size-4 mr-3" />
                  {profile?.website ? (
                    <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors truncate">
                      {profile.website}
                    </a>
                  ) : <span>No website</span>}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <span className="size-4 mr-3 font-bold">X</span>
                  {profile?.twitter ? (
                    <a href={`https://twitter.com/${profile.twitter.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors truncate">
                      {profile.twitter}
                    </a>
                  ) : <span>Not set</span>}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <span className="size-4 mr-3 font-bold">IG</span>
                  {profile?.instagram ? (
                    <a href={`https://instagram.com/${profile.instagram.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors truncate">
                      {profile.instagram}
                    </a>
                  ) : <span>Not set</span>}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-6">
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
                  if (stat.label === "Purchased") router.push("/dashboard/buyer/artworks");
                }}
                className={`rounded-3xl border border-separator/60 bg-background/50 backdrop-blur-xl p-5 shadow-sm transition-shadow ${(stat.label === "Followers" || stat.label === "Artworks" || stat.label === "Purchased") ? "cursor-pointer hover:shadow-md hover:border-primary/50" : ""}`}
              >
                <div className={`size-10 rounded-2xl ${stat.bg} flex items-center justify-center mb-4`}>
                  <stat.icon className={`size-5 ${stat.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-foreground truncate">{stat.value}</h3>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl border border-separator/60 bg-background/50 backdrop-blur-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-bold text-foreground mb-4">{isArtist ? "About the Artist" : "About the Collector"}</h3>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                {profile?.about || (isArtist 
                  ? "I am a self-taught digital artist with a passion for creating immersive, surreal environments." 
                  : "I am passionate about discovering new talent and adding unique pieces to my collection.")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Followers Modal (Artist Only) */}
      {isArtist && isFollowersModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsFollowersModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-background border border-separator/60 shadow-2xl p-6 z-10 max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-separator/30 pb-4 mb-4">
              <h2 className="text-xl font-bold text-foreground">Followers ({profile?.followers?.length || 0})</h2>
              <button onClick={() => setIsFollowersModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
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
