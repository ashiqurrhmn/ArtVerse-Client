"use server";

import getToken from "./getToken";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export const getArtworks = async (email = null) => {
  const token = await getToken();
  console.log(token);
  console.log("akash");
  const url = email ? `${baseUrl}/api/artworks?email=${encodeURIComponent(email)}` : `${baseUrl}/api/artworks`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data;
};

export const getArtworkById = async (id) => {
  const res = await fetch(`${baseUrl}/api/artworks/${id}`);
  const data = await res.json();
  return data;
};

