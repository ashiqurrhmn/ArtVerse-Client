"use client";

import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { 
  Camera, 
  MapPin, 
  Link as LinkIcon,
  Palette,
  Eye,
  ShoppingBag,
  Leaf
} from "lucide-react";
import Image from "next/image";

export default function ArtistProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
          <p className="text-sm text-muted-foreground animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  const userName = user?.name || "Artist Name";
  const userEmail = user?.email || "artist@example.com";
  const userInitials = userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  // Mock stats for the UI
  const stats = [
    { label: "Flowers", value: "12.5K", icon: Leaf, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Artworks", value: "45", icon: Palette, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Views", value: "1.2M", icon: Eye, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Sales", value: "128", icon: ShoppingBag, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Artist Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your public persona and view your stats.</p>
        </div>
        <button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-3xl border border-separator/60 bg-background/50 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-none"
          >
            {/* Cover Image */}
            <div className="h-32 w-full bg-gradient-to-r from-emerald-500/80 via-teal-500/80 to-cyan-500/80 relative">
              <button className="absolute right-3 top-3 p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors">
                <Camera className="size-4" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="relative px-6 pb-6 text-center">
              {/* Avatar */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-full border-4 border-background bg-background shadow-xl">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={userName}
                    className="size-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
                    {userInitials}
                  </div>
                )}
                <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors border-2 border-background">
                  <Camera className="size-3" />
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
                Digital artist exploring the intersection of nature and technology. Creating vibrant, surreal landscapes that challenge our perception of reality.
              </p>

              <div className="pt-6 space-y-3 text-sm text-left">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="size-4 mr-3" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <LinkIcon className="size-4 mr-3" />
                  <a href="#" className="hover:text-primary transition-colors">artverse.com/artist/alex</a>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <span className="size-4 mr-3 font-bold">X</span>
                  <a href="#" className="hover:text-primary transition-colors">@alex_arts</a>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <span className="size-4 mr-3 font-bold">IG</span>
                  <a href="#" className="hover:text-primary transition-colors">@alex.sterling</a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Stats & Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl border border-separator/60 bg-background/50 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-shadow"
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
                I am a self-taught digital artist with a passion for creating immersive, surreal environments. My work often blends organic elements with futuristic cyberpunk aesthetics, aiming to evoke a sense of wonder and nostalgia.
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
    </div>
  );
}
