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

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useProfile } from "@/context/ProfileContext";
import { getArtworks } from "@/lib/api/artworks";

export default function ArtistDashboard() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;
  const { profile } = useProfile();
  
  const [artworks, setArtworks] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      const fetchArtworks = getArtworks(user.email);
      const fetchSales = fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"}/api/sales/${encodeURIComponent(user.email)}`
      ).then(res => res.json());

      Promise.all([fetchArtworks, fetchSales])
        .then(([artworksData, salesData]) => {
          setArtworks(artworksData || []);
          setSales(salesData || []);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load dashboard data", err);
          setLoading(false);
        });
    }
  }, [user?.email]);

  const userName = profile?.name || user?.name || "Artist";

  // Dynamic Stats Calculation
  const activeAuctions = artworks.filter(a => a.status?.toLowerCase() === "selling" || a.status?.toLowerCase() === "reviewing").length;
  const totalRevenue = sales.reduce((acc, sale) => acc + (sale.amount || 0), 0);
  
  const stats = [
    {
      icon: FileImage,
      label: "Total Artworks",
      value: artworks.length.toString(),
      trend: "All time",
      trendUp: true,
    },
    {
      icon: TrendingUp,
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      trend: "All time",
      trendUp: true,
    },
    {
      icon: Zap,
      label: "Reviewing",
      value: activeAuctions.toString(),
      trend: "Current",
      trendUp: true,
    },
    {
      icon: CheckCircle2,
      label: "Artworks Sold",
      value: sales.length.toString(),
      trend: "All time",
      trendUp: true,
    },
  ];

  // Map to recent artworks
  const recentArtworks = [...artworks]
    .sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || 0).getTime();
      const dateB = new Date(b.date || b.createdAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 4)
    .map(a => ({
      id: a._id,
      name: a.title,
      category: a.category,
      date: a.date || new Date().toLocaleDateString(),
      price: `$${a.price}`,
      status: a.status || "Draft",
      statusClass: (a.status?.toLowerCase() === "selling" || a.status?.toLowerCase() === "approved") 
        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
        : (a.status?.toLowerCase() === "reviewing")
        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
        : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    }));

  // Map to top artworks (aggregated by real sales)
  const topArtworksAgg = sales.reduce((acc, sale) => {
    if (!acc[sale.title]) {
      acc[sale.title] = { name: sale.title, sales: 0, revenue: 0 };
    }
    acc[sale.title].sales += 1;
    acc[sale.title].revenue += (sale.amount || 0);
    return acc;
  }, {});

  let topArtworks = Object.values(topArtworksAgg)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4)
    .map(agg => {
      const art = artworks.find(a => a.title === agg.name);
      return {
        id: agg.name,
        name: agg.name,
        category: art?.category || "Art",
        sales: agg.sales,
        revenue: `$${agg.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        image: art?.image || "https://placehold.co/400",
      };
    });

  // Pad to 4 artworks using most expensive if sales are less than 4
  if (topArtworks.length < 4) {
    const soldArtworkNames = topArtworks.map(t => t.name);
    const unsoldArtworks = [...artworks]
      .filter(a => !soldArtworkNames.includes(a.title))
      .sort((a, b) => Number(b.price) - Number(a.price))
      .slice(0, 4 - topArtworks.length)
      .map(a => ({
        id: a._id || a.title,
        name: a.title,
        category: a.category || "Art",
        sales: 0,
        revenue: `$${a.price}`,
        image: a.image || "https://placehold.co/400",
      }));
    topArtworks = [...topArtworks, ...unsoldArtworks];
  }

  if (sessionLoading || loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
          <p className="text-sm text-muted-foreground animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full text-foreground px-4 md:px-6 pb-16">
      
      {/* ── Page Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
          Welcome back, {userName}
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
                  {recentArtworks.length > 0 ? (
                    recentArtworks.map((artwork) => (
                      <ArtworkRow key={artwork.id} {...artwork} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-muted-foreground">
                        No artworks found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Top Artworks */}
        <div className="rounded-2xl border border-separator/60 bg-background/40 backdrop-blur-xl p-6 shadow-xl shadow-black/5 dark:shadow-none flex flex-col">
          <SectionHeader title="Top Artworks" action="View sales" href="/dashboard/artist/sales" />
          
          <div className="mt-4 flex flex-col gap-3 flex-1">
            {topArtworks.length > 0 ? (
              topArtworks.map((art, index) => (
                <TopArtworkRow key={art.id} index={index + 1} {...art} />
              ))
            ) : (
              <div className="flex flex-1 items-center justify-center text-muted-foreground text-sm py-8 border border-dashed border-separator rounded-xl">
                No artworks to display.
              </div>
            )}
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
