"use server";

import getToken from "../api/getToken";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export const addArtwork = async (newArtwork) => {
  const token = await getToken();
  const res = await fetch(`${baseUrl}/api/artworks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(newArtwork),
  });
  const data = await res.json();
  return data;
};

export const deleteArtwork = async (id) => {
  const token = await getToken();
  const res = await fetch(`${baseUrl}/api/artworks/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  const data = await res.json();
  return data;
};

export const updateArtwork = async (id, updatedData) => {
  const token = await getToken();
  const res = await fetch(`${baseUrl}/api/artworks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(updatedData),
  });
  const data = await res.json();
  return data;
};
