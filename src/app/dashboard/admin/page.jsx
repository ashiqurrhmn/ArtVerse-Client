"use client";
import React, { useState, useEffect } from "react";
import { Users, Paintbrush, ShoppingBag, DollarSign } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getAdminStats } from "@/lib/api/admin";

const COLORS = [
  "var(--app-primary)",
  "var(--app-secondary)",
  "var(--app-navlight)",
  "var(--app-muted-foreground)",
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArtists: 0,
    totalArtworks: 0,
    pendingApprovals: 0,
    totalRevenue: 0,
    salesData: [],
    categoryData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then(data => {
        if (data && !data.error) {
          setStats({
            totalUsers: data.totalUsers || 0,
            totalArtists: data.totalArtists || 0,
            totalArtworks: data.totalArtworks || 0,
            pendingApprovals: data.pendingApprovals || 0,
            totalRevenue: data.totalRevenue || 0,
            salesData: data.salesData || [],
            categoryData: data.categoryData || []
          });
        }
      })
      .catch(err => {
        console.error("Failed to fetch admin stats", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
          <p className="text-sm text-muted-foreground animate-pulse">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Analytics Overview
        </h1>
        <p className="text-muted-foreground mt-1">
          A summary of your platform's performance and key metrics.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title="Total Users"
          value={(stats.totalUsers || 0).toLocaleString()}
          icon={Users}
          trend="All time"
          trendUp
        />
        <Card
          title="Total Artists"
          value={(stats.totalArtists || 0).toLocaleString()}
          icon={Paintbrush}
          trend="All time"
          trendUp
        />
        <Card
          title="Artworks Sold"
          value={(stats.artworksSold || 0).toLocaleString()}
          icon={ShoppingBag}
          trend="All time"
          trendUp
        />
        <Card
          title="Total Revenue"
          value={`$${(stats.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          trend="All time"
          trendUp
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="lg:col-span-2 bg-background border border-separator rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Revenue Overview
          </h2>
          <div className="h-[300px] min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.salesData || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--app-primary)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--app-primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--app-separator)"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--app-muted-foreground)", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--app-muted-foreground)", fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "var(--app-background)",
                    borderColor: "var(--app-separator)",
                    borderRadius: "8px",
                    color: "var(--app-foreground)",
                  }}
                  itemStyle={{ color: "var(--app-primary)" }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="var(--app-primary)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-background border border-separator rounded-2xl shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Artworks by Category
          </h2>
          <div className="h-[300px] min-h-[300px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryData || []}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {(stats.categoryData || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "var(--app-background)",
                    borderColor: "var(--app-separator)",
                    borderRadius: "8px",
                    color: "var(--app-foreground)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-foreground text-sm font-medium">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, icon: Icon, trend, trendUp }) => (
  <div className="bg-background border border-separator rounded-2xl shadow-sm p-6 flex flex-col justify-between hover:border-primary/30 transition-colors group">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
    </div>
    <div className="mt-4 flex items-baseline gap-2">
      <span className="text-3xl font-bold text-foreground">{value}</span>
      <span
        className={`text-sm font-semibold ${trendUp ? "text-green-500" : "text-red-500"}`}
      >
        {trend}
      </span>
    </div>
  </div>
);

export default AdminDashboard;
