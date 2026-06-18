"use client";

import { useSession } from "@/lib/auth-client";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { useProfile } from "@/context/ProfileContext";

export default function DashboardHeader() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const userName = user?.name || user?.email || "User";
  const { profile } = useProfile();
  const userImage = profile?.profileImage || user?.image;
  let userRole = user?.role || "buyer";
  if (userRole === "seller") userRole = "artist";

    const userInitials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "NH";

  return (
    <header className="hidden md:flex w-full items-center px-6 gap-4 py-3 border-b border-separator mb-4">
      <div className="flex-1" />
      {!isPending && user && (
        <div className="flex items-center gap-3">
          {userImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={userImage}
              alt={userName}
              className="h-10 w-10 rounded-full object-cover border border-separator"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted p-2 border border-separator text-xl font-bold">
              {userInitials}
            </div>
          )}
          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold text-foreground">{userName}</span>
            <span className="text-[10px] text-muted-foreground font-medium capitalize">
              {userRole === "admin" ? "Admin" : userRole === "artist" ? "Artist" : "Buyer"}
            </span>
          </div>
        </div>
      )}
      <ThemeSwitcher />
    </header>
  );
}