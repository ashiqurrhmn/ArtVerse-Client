"use client";

import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { ProfileProvider } from "@/context/ProfileContext";

export function Providers({ children }) {
  return (
    <HeroUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <ProfileProvider>
          {children}
          <Toaster position="top-center" />
        </ProfileProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
