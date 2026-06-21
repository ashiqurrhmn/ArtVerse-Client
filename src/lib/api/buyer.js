"use server";

import getToken from "./getToken";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export const getPurchases = async (email) => {
  const url = `${baseUrl}/api/purchases?email=${encodeURIComponent(email)}`;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const token = await getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    // Ignore
  }

  const res = await fetch(url, { headers });
  const data = await res.json();
  return data;
};

export const getSavedArtworks = async (email) => {
  const url = `${baseUrl}/api/saved-artworks/${encodeURIComponent(email)}`;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const token = await getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    // Ignore
  }

  const res = await fetch(url, { headers });
  const data = await res.json();
  return data;
};

export const toggleSavedArtwork = async (email, artworkId) => {
  const url = `${baseUrl}/api/saved-artworks/toggle`;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const token = await getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    // Ignore
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ email, artworkId }),
  });
  
  if (!res.ok) {
      throw new Error("Failed to toggle artwork");
  }
  
  return true;
};
