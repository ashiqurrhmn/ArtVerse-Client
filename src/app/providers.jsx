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
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: {
                background: 'var(--app-background)',
                color: 'var(--app-foreground)',
                border: '1px solid var(--app-separator)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                borderRadius: '9999px',
                padding: '12px 24px',
              },
              success: {
                iconTheme: {
                  primary: 'var(--app-primary)',
                  secondary: 'var(--app-primary-foreground)',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </ProfileProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
