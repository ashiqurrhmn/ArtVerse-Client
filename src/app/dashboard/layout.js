"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { DashboardSideBar } from "@/components/dashboard/DashboardSideBar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground overflow-hidden">
      <DashboardSideBar />
      <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
