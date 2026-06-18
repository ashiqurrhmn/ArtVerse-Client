import {
  CheckCircle2,
  FileImage,
  GalleryHorizontalEnd,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

const stats = [
  {
    icon: FileImage,
    label: "Total Artworks",
    value: "48",
  },
  {
    icon: Users,
    label: "Total Followers",
    value: "1,284",
  },
  {
    icon: Zap,
    label: "Active Auctions",
    value: "18",
  },
  {
    icon: CheckCircle2,
    label: "Artworks Sold",
    value: "32",
  },
];

const artworks = [
  {
    name: "Abstract Harmony",
    category: "Painting",
    date: "Jun 14, 2026",
    price: "$1,200",
    status: "Selling",
    statusClass:
      "bg-emerald-600/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  },
  {
    name: "Urban Echoes",
    category: "Photography",
    date: "Jun 11, 2026",
    price: "$800",
    status: "New",
    statusClass:
      "bg-secondary/20 text-secondary-foreground dark:bg-secondary/30 dark:text-secondary-foreground",
  },
  {
    name: "Neon Dreams",
    category: "Digital Art",
    date: "Jun 8, 2026",
    price: "$450",
    status: "Reviewing",
    statusClass:
      "bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  },
  {
    name: "Silent Forest",
    category: "Sculpture",
    date: "Jun 2, 2026",
    price: "$2,100",
    status: "Draft",
    statusClass:
      "bg-red-500/15 text-red-700 dark:bg-red-500/20 dark:text-red-400",
  },
];

const galleries = [
  {
    icon: GalleryHorizontalEnd,
    name: "Gagosian Gallery",
    meta: "Contemporary • New York",
    active: "24",
  },
  {
    icon: Sparkles,
    name: "Tate Modern",
    meta: "Museum • London",
    active: "18",
  },
  {
    icon: GalleryHorizontalEnd,
    name: "Saatchi Art",
    meta: "Online • Los Angeles",
    active: "12",
  },
  {
    icon: Zap,
    name: "Lisson Gallery",
    meta: "Contemporary • London",
    active: "31",
  },
];

export default function ArtistDashboard() {
  return (
    <div className="min-h-full text-foreground px-10">
      <div className="">
        <h1 className="text-2xl font-semibold tracking-tight md:text-[26px]">
          Welcome back, Alex Sterling
        </h1>

        {/* Stats Cards */}
        <section className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        {/* Table + Galleries */}
        <section className="mt-10 grid grid-cols-2 gap-10 xl:grid-cols-[minmax(0,2fr)_minmax(292px,1fr)]">
          {/* Recent Artworks Table */}
          <div>
            <SectionHeader title="Recent Artworks" action="View all" />
            <div className="overflow-hidden rounded-xl border border-separator bg-accent/30 dark:bg-accent/20">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b border-separator text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-5 py-4">Artwork Name</th>
                      <th className="px-5 py-4">Category</th>
                      <th className="px-5 py-4">Date Uploaded</th>
                      <th className="px-5 py-4">Price</th>
                      <th className="px-5 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-separator/60">
                    {artworks.map((artwork) => (
                      <ArtworkRow key={artwork.name} {...artwork} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Galleries */}
        </section>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function StatCard({ icon: Icon, label, value }) {
  return (
    <article className="rounded-xl border border-separator bg-accent/30 p-5 dark:bg-accent/20">
      <div className="flex size-9 items-center justify-center rounded-lg bg-muted/50 text-primary">
        <Icon className="size-[18px]" />
      </div>
      <p className="mt-6 text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </article>
  );
}

function SectionHeader({ title, action }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <button
        className="text-xs font-medium text-muted-foreground transition hover:text-primary"
        type="button"
      >
        {action}
      </button>
    </div>
  );
}

function ArtworkRow({ name, category, date, price, status, statusClass }) {
  return (
    <tr className="transition hover:bg-muted/20">
      <td className="px-5 py-5">
        <div className="flex items-center gap-3">
          <span className="block size-7 shrink-0 rounded-full border border-separator bg-muted/40" />
          <span className="font-semibold text-foreground">{name}</span>
        </div>
      </td>
      <td className="px-5 py-5 text-muted-foreground">{category}</td>
      <td className="px-5 py-5 text-muted-foreground">{date}</td>
      <td className="px-5 py-5 text-muted-foreground">{price}</td>
      <td className="px-5 py-5">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${statusClass}`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}

function GalleryRow({ icon: Icon, name, meta, active }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg p-3 transition hover:bg-muted/20">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/40 text-primary">
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {name}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {meta}
          </p>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-bold text-foreground">{active}</p>
        <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
          Active Items
        </p>
      </div>
    </div>
  );
}
