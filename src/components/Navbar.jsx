"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, Button, Dropdown, Label } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { MdDashboard } from "react-icons/md";
import { ThemeSwitcher } from "./ThemeSwitcher";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user;


  const handleSignOut = async () => {
    await authClient.signOut();
  };
  return (
    <>
      <div className="h-16 w-full"></div>
      <nav className="fixed top-0 z-50 w-full border-b border-separator bg-background/60 backdrop-blur-md transition-colors duration-300">
        <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            <Link href={'/'}>
              <div className="flex items-center gap-3">
                <Image
                  height={60}
                  width={150}
                  loading="eager"
                  src="/logo.png"
                  alt="logo"
                />
              </div>
            </Link>
          </div>
          <ul className="hidden items-center gap-4 md:flex">
            <li>
              <Link
                href="#"
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                Browse Artworks
              </Link>
            </li>
            <li>
              <Link 
                href="/pricing"
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                Pricing
              </Link>
            </li>
          </ul>
          
          <div className="hidden items-center gap-4 md:flex">
            <ThemeSwitcher />
            
            {!user ? (
              <>
                <Link href="/signin">Login</Link>
                <Link href="/signup">
                  <Button className="bg-primary text-primary-foreground font-medium rounded-full px-6">Sign Up</Button>
                </Link>
              </>
            ) : (
              <Dropdown>
                <Dropdown.Trigger className="rounded-full">
                  <Avatar size="sm" aria-label="Menu" className="cursor-pointer">
                    <Avatar.Image
                      referrerPolicy="no-referrer"
                      alt={user?.name || "User"}
                      src={user?.image}
                    />
                    <Avatar.Fallback>{user?.name?.charAt(0) || "U"}</Avatar.Fallback>
                  </Avatar>
                </Dropdown.Trigger>
                <Dropdown.Popover>
                  <div className="px-3 pt-3 pb-1">
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <Avatar.Image alt={user?.name} src={user?.image} />
                        <Avatar.Fallback delayMs={600}>{user?.name?.charAt(0) || "U"}</Avatar.Fallback>
                      </Avatar>
                      <div className="flex flex-col gap-0">
                        <p className="text-sm leading-5 font-medium">
                          {user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Dropdown.Menu
                    onAction={(key) => console.log(`Selected: ${key}`)}
                  >
                    <Dropdown.Item key="dashboard" textValue="Dashboard">
                      <div className="flex items-center gap-2">
                        <MdDashboard />
                        <Label>Dashboard</Label>
                      </div>
                    </Dropdown.Item>

                    <Dropdown.Item key="profile" textValue="Profile">
                      <div className="flex items-center gap-2">
                        <CgProfile />
                        <Label>Profile</Label>
                      </div>
                    </Dropdown.Item>

                    <Dropdown.Item
                      key="logout"
                      textValue="Logout"
                      variant="danger"
                      onClick={handleSignOut}
                    >
                      <div className="flex items-center gap-2">
                        <BiLogOut />
                        <Label>Logout</Label>
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            )}
          </div>
        </header>
        
        {isMenuOpen && (
          <div className="border-t border-separator md:hidden">
            <ul className="flex flex-col gap-2 p-4">
              <li>
                <Link href="#" className="block py-2">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="block py-2 font-medium text-accent">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="#" className="block py-2">
                  Pricing
                </Link>
              </li>
              <li className="py-2 flex items-center justify-between">
                <span>Theme</span>
                <ThemeSwitcher />
              </li>
              <li className="mt-4 flex flex-col gap-2 border-t border-separator pt-4">
                <Link href="/signin" className="block py-2 text-center border rounded-xl">
                  Login
                </Link>
                <Link href="/signup">
                  <Button className="w-full bg-primary text-primary-foreground font-medium rounded-full">Sign Up</Button>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
