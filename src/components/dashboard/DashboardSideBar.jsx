"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bars } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { ThemeSwitcher } from "../ThemeSwitcher";

// --- Icons ---
const GridIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    stroke="currentColor"
    strokeWidth="1.8"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ImageIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    stroke="currentColor"
    strokeWidth="1.8"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const PlusSquareIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    stroke="currentColor"
    strokeWidth="1.8"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const EditIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    stroke="currentColor"
    strokeWidth="1.8"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const ReceiptIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    stroke="currentColor"
    strokeWidth="1.8"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
    <path d="M12 17.5v-11" />
  </svg>
);

const SettingsIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    stroke="currentColor"
    strokeWidth="1.8"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.32 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const LogoutIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    stroke="currentColor"
    strokeWidth="1.8"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const UsersIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    stroke="currentColor"
    strokeWidth="1.8"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export function DashboardSideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const isAuthenticated = !isPending && Boolean(user);
  let userRole = user?.role || "buyer";
  if (userRole === "seller") userRole = "artist";
  const userName = user?.name || user?.email || "User";
  const userImage = user?.image;
  const userPlan = user?.plan || "free";
  const normalizedPlan = userPlan.toLowerCase();
  const isPremium =
    normalizedPlan.includes("premium") ||
    normalizedPlan.includes("pro") ||
    normalizedPlan.includes("enterprise");

  let displayPlanName = "PREMIUM";
  if (normalizedPlan.includes("pro")) displayPlanName = "PRO";
  else if (normalizedPlan.includes("enterprise"))
    displayPlanName = "ENTERPRISE";

  const userInitials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSigningOut(false);
    }
  };

  const adminNavItems = [
    { icon: GridIcon, label: "Analytics Overview", href: "/dashboard/admin" },
    { icon: UsersIcon, label: "Manage Users", href: "/dashboard/admin/users" },
    {
      icon: ImageIcon,
      label: "Manage Artworks",
      href: "/dashboard/admin/artworks",
    },
    {
      icon: ReceiptIcon,
      label: "View Transactions",
      href: "/dashboard/admin/transactions",
    },
  ];

  const artistNavItems = [
    { icon: GridIcon, label: "Dashboard", href: "/dashboard/artist" },
    {
      icon: ImageIcon,
      label: "Manage Artworks",
      href: "/dashboard/artist/artworks",
    },
    {
      icon: PlusSquareIcon,
      label: "Add Artwork",
      href: "/dashboard/artist/artworks/add",
    },
    {
      icon: ReceiptIcon,
      label: "Sales History",
      href: "/dashboard/artist/artworks/sales",
    },
    {
      icon: SettingsIcon,
      label: "Settings",
      href: "/dashboard/artist/settings",
    },
  ];

  const userNavItems = [
    { icon: ReceiptIcon, label: "Purchase History", href: "/dashboard/user" },
    {
      icon: ImageIcon,
      label: "Bought Artworks",
      href: "/dashboard/user/artworks",
    },
    {
      icon: SettingsIcon,
      label: "Profile Management",
      href: "/dashboard/user/profile",
    },
  ];

  let navItems = userNavItems;
  if (userRole === "admin") {
    navItems = adminNavItems;
  } else if (userRole === "artist") {
    navItems = artistNavItems;
  }

  const activeItemHref = navItems.reduce((bestMatch, item) => {
    if (pathname?.startsWith(item.href) && item.href.length > bestMatch.length) {
      if (pathname === item.href || pathname.charAt(item.href.length) === "/") {
        return item.href;
      }
    }
    return bestMatch;
  }, "");

  const isActive = (href) => {
    return href === activeItemHref;
  };

  // --- Shared UI blocks ---

  const navContent = (
    <nav className="flex w-full flex-col gap-1 px-[18px]">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`group relative flex items-center gap-3 py-3 pl-2.5 pr-4  font-medium transition-all duration-150 ${
              active
                ? "bg-muted/35 text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
            }`}
          >
            {/* Active indicator bar */}
            {active && (
              <span className="absolute right-0 top-0 h-full w-[3px] bg-foreground" />
            )}
            <item.icon
              className={`size-5 transition-colors duration-150 ${
                active
                  ? "text-foreground"
                  : "text-muted-foreground group-hover:text-foreground"
              }`}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const profileBlock = (
    <div className="flex flex-col gap-3 px-1 py-2 w-full mt-2">
      <div className="flex items-center gap-3">
        {userImage ? (
          <Image
            src={userImage}
            alt={userName}
            width={44}
            height={44}
            className="h-16 w-16 rounded-full object-cover border border-separator"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted p-2 border border-separator text-2xl font-bold">
            {userInitials}
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className=" font-semibold text-foreground truncate leading-tight">
            {userName}
          </span>
          <span className="text-[14px] text-muted-foreground capitalize truncate">
            {userRole}
          </span>
        </div>
      </div>
      <div className="mt-1">
        {isPremium ? (
          <span className="inline-flex items-center rounded border border-secondary/40 bg-secondary/10 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase text-secondary">
            {displayPlanName} ACCOUNT
          </span>
        ) : (
          <span className="inline-flex items-center rounded border border-separator bg-muted/15 px-2 py-0.5 text-sm uppercase text-muted-foreground">
            FREE ACCOUNT
          </span>
        )}
      </div>
    </div>
  );

  const signOutButton = (
    <button
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="flex w-full cursor-pointer items-center gap-3 px-[28px] py-3 text-[12px] font-medium text-muted-foreground transition-all hover:bg-red-500/5 hover:text-red-500 disabled:opacity-50"
      type="button"
    >
      {isSigningOut ? (
        <svg className="animate-spin size-5" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <LogoutIcon className="size-5" />
      )}
      <span>Sign Out</span>
    </button>
  );

  return (
    <>
      {/* ==================== Desktop Sidebar ==================== */}
      <aside className="sticky border border-right-1  px-4 top-0 hidden min-h-screen w-[300px] shrink-0 flex-col border-r border-separator bg-background md:flex">
        {/* Top section: logo + profile + nav */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center px-[18px] pb-1  outline-none transition-opacity hover:opacity-80"
          >
            <Image
              src="/logo.png"
              alt="ArtVerse"
              width={166}
              height={33}
              className="object-contain mt-2"
            />
          </Link>

          {/* Profile */}
          {isAuthenticated && profileBlock}

          {/* Nav */}
          <div className="mt-8">{navContent}</div>
        </div>

        {/* Bottom: Sign Out — pinned to bottom */}
        <div className="mt-auto shrink-0 border-t border-separator py-3">
          {isAuthenticated ? (
            signOutButton
          ) : (
            <div className="px-[18px] py-2">
              <Link
                href="/auth/signin"
                className="flex items-center justify-center w-full py-2.5 rounded-lg border border-separator text-sm font-semibold text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* ==================== Mobile Header ==================== */}
      <div className="md:hidden flex items-center justify-between w-full border-b border-separator bg-background/80 backdrop-blur-md px-4 py-3 sticky top-0 z-40">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="ArtVerse" width={120} height={80} />
        </Link>

        <Drawer>
          <Button
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-separator text-xs font-semibold text-foreground hover:text-primary hover:border-primary bg-transparent transition-all min-w-0"
            variant="secondary"
          >
            <Bars className="size-4" />
          </Button>
          <Drawer.Backdrop>
            <Drawer.Content
              placement="left"
              className="bg-background border-r border-separator text-foreground w-[280px]"
            >
              <Drawer.Dialog className="h-full flex flex-col bg-background">
                <Drawer.CloseTrigger className="absolute right-4 top-4 z-50 text-muted-foreground hover:text-foreground" />
                <Drawer.Header className="pt-6 px-6 pb-4 border-b border-separator">
                  <Drawer.Heading>
                    <Link
                      href="/"
                      className="hover:opacity-80 transition-opacity block"
                    >
                      <Image
                        src="/logo.png"
                        alt="ArtVerse"
                        width={120}
                        height={80}
                      />
                    </Link>
                  </Drawer.Heading>
                </Drawer.Header>
                <Drawer.Body className="flex-1 overflow-y-auto px-0 py-0">
                  {isAuthenticated && profileBlock}
                  <div className="mt-2">{navContent}</div>
                </Drawer.Body>
                <div className="border-t border-separator py-3 shrink-0">
                  <div className="flex items-center justify-between px-[28px] py-3">
                    <span className="text-[12px] font-medium text-muted-foreground">
                      Theme
                    </span>
                    <ThemeSwitcher />
                  </div>
                  {isAuthenticated && signOutButton}
                </div>
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
      </div>
    </>
  );
}