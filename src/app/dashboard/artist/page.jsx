"use client";

import {
  CheckCircle2,
  FileImage,
  Users,
  Zap,
  TrendingUp,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    icon: FileImage,
    label: "Total Artworks",
    value: "48",
    trend: "+12% this month",
    trendUp: true,
  },
  {
    icon: Users,
    label: "Total Followers",
    value: "1,284",
    trend: "+5% this month",
    trendUp: true,
  },
  {
    icon: Zap,
    label: "Active Auctions",
    value: "18",
    trend: "-2% this month",
    trendUp: false,
  },
  {
    icon: CheckCircle2,
    label: "Artworks Sold",
    value: "32",
    trend: "+18% this month",
    trendUp: true,
  },
];

const recentArtworks = [
  {
    id: 1,
    name: "Abstract Harmony",
    category: "Painting",
    date: "Jun 14, 2026",
    price: "$1,200",
    status: "Selling",
    statusClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    id: 2,
    name: "Urban Echoes",
    category: "Photography",
    date: "Jun 11, 2026",
    price: "$800",
    status: "New",
    statusClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    id: 3,
    name: "Neon Dreams",
    category: "Digital Art",
    date: "Jun 8, 2026",
    price: "$450",
    status: "Reviewing",
    statusClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    id: 4,
    name: "Silent Forest",
    category: "Sculpture",
    date: "Jun 2, 2026",
    price: "$2,100",
    status: "Draft",
    statusClass: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  },
];

const topArtworks = [
  {
    id: 101,
    name: "Starry Night Resonance",
    category: "Painting",
    sales: 12,
    revenue: "$15,000",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=150&h=150&fit=crop",
  },
  {
    id: 102,
    name: "Ethereal Light",
    category: "Digital Art",
    sales: 8,
    revenue: "$14,000",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=150&h=150&fit=crop",
  },
  {
    id: 103,
    name: "Ocean Whisper",
    category: "Painting",
    sales: 5,
    revenue: "$16,000",
    image: "https://images.unsplash.com/photo-1505909182942-e2f09aee3e89?w=150&h=150&fit=crop",
  },
  {
    id: 104,
    name: "Concrete Jungle",
    category: "Photography",
    sales: 15,
    revenue: "$9,000",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=150&h=150&fit=crop",
  },
];

export default function ArtistDashboard() {
  return (
    <div className="min-h-full text-foreground px-4 md:px-10 pb-16">
      
      {/* ── Page Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
          Welcome back, Alex Sterling
        </h1>
        <p className="mt-2 text-base text-muted-foreground max-w-xl">
          Here's what's happening with your art business today.
        </p>
      </div>

      {/* ── Stats Cards ── */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      {/* ── Main Content Grid ── */}
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(350px,1fr)] gap-8">
        
        {/* Left: Recent Artworks */}
        <div className="rounded-2xl border border-separator/60 bg-background/40 backdrop-blur-xl p-6 shadow-xl shadow-black/5 dark:shadow-none flex flex-col">
          <SectionHeader title="Recent Artworks" action="View all" href="/dashboard/artist/artworks" />
          
          <div className="overflow-hidden rounded-xl border border-separator bg-accent/20 dark:bg-accent/10 mt-4 flex-1">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="border-b border-separator text-[11px] font-bold uppercase tracking-wider text-muted-foreground bg-accent/30 dark:bg-accent/20">
                  <tr>
                    <th className="px-5 py-4 rounded-tl-xl">Artwork Name</th>
                    <th className="px-5 py-4">Date Uploaded</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4 rounded-tr-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-separator/60">
                  {recentArtworks.map((artwork) => (
                    <ArtworkRow key={artwork.id} {...artwork} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Top Artworks */}
        <div className="rounded-2xl border border-separator/60 bg-background/40 backdrop-blur-xl p-6 shadow-xl shadow-black/5 dark:shadow-none flex flex-col">
          <SectionHeader title="Top Artworks" action="View sales" href="/dashboard/artist/artworks/sales" />
          
          <div className="mt-4 flex flex-col gap-3 flex-1">
            {topArtworks.map((art, index) => (
              <TopArtworkRow key={art.id} index={index + 1} {...art} />
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}

/* ─── Sub-components ─── */

function StatCard({ icon: Icon, label, value, trend, trendUp }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-separator/60 bg-background/40 backdrop-blur-xl p-5 shadow-sm transition-all hover:shadow-md dark:shadow-none">
      <div className="flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-accent/50 text-foreground border border-separator">
          <Icon className="size-5" />
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${trendUp ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
            {trendUp ? <TrendingUp className="size-3" /> : <TrendingUp className="size-3 rotate-180" />}
            {trend}
          </span>
        )}
      </div>
      <p className="mt-5 text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
        {value}
      </p>
    </article>
  );
}

function SectionHeader({ title, action, href }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {href ? (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition hover:text-primary group"
        >
          {action}
          <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      ) : (
        <button className="text-xs font-semibold text-muted-foreground transition hover:text-primary">
          {action}
        </button>
      )}
    </div>
  );
}

function ArtworkRow({ name, category, date, price, status, statusClass }) {
  return (
    <tr className="transition-colors hover:bg-accent/30 dark:hover:bg-accent/20 group">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-separator bg-muted/40 text-muted-foreground">
            <FileImage className="size-4" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{category}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 text-muted-foreground">{date}</td>
      <td className="px-5 py-4 font-bold text-foreground">{price}</td>
      <td className="px-5 py-4">
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusClass}`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}

function TopArtworkRow({ index, name, category, sales, revenue, image }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-separator/40 bg-accent/10 p-3 transition-all hover:bg-accent/30 group">
      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-separator">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-0 left-0 flex size-5 items-center justify-center rounded-br-lg bg-background/80 backdrop-blur-md text-[10px] font-bold">
          {index}
        </div>
      </div>
      
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <p className="truncate text-sm font-bold text-foreground">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{category}</p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-bold text-foreground">{revenue}</p>
        <p className="text-[10px] font-semibold text-muted-foreground">{sales} sales</p>
      </div>
    </div>
  );
}
