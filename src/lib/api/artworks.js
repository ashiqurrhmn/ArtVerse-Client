"use server";

import getToken from "./getToken";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export const getArtworks = async (email = null) => {
  const url = email ? `${baseUrl}/api/artworks?email=${encodeURIComponent(email)}` : `${baseUrl}/api/artworks`;
  
  const headers = {
    "Content-Type": "application/json",
  };

  if (email) {
    try {
      const token = await getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Ignore token errors for public routes
    }
  }

  const res = await fetch(url, { headers });
  const data = await res.json();
  return data;
};

export const getArtworkById = async (id) => {
  const res = await fetch(`${baseUrl}/api/artworks/${id}`);
  const data = await res.json();
  return data;
};

export const getSales = async (email) => {
  const url = `${baseUrl}/api/sales/${encodeURIComponent(email)}`;
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

