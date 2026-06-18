"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

const ProfileContext = createContext({ profile: null, refreshProfile: () => {} });

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export function ProfileProvider({ children }) {
  const { data: session } = authClient.useSession();
  const email = session?.user?.email;
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    if (!email) return;
    try {
      const res = await fetch(`${BASE_URL}/api/profiles/${email}`);
      const data = await res.json();
      setProfile(data);
    } catch {
      console.error("Failed to fetch profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [email]);

  const refreshProfile = () => fetchProfile();

  return (
    <ProfileContext.Provider value={{ profile, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
