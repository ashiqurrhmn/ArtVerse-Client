"use server";

import getToken from "./getToken";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

const getHeaders = async () => {
  const headers = { "Content-Type": "application/json" };
  try {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  } catch (error) {
    // Ignore
  }
  return headers;
};

export const getAdminStats = async () => {
  const headers = await getHeaders();
  const res = await fetch(`${baseUrl}/api/admin/stats`, { headers });
  return await res.json();
};

export const getUsers = async () => {
  const headers = await getHeaders();
  const res = await fetch(`${baseUrl}/api/users`, { headers });
  if (!res.ok) throw new Error("Failed to fetch users");
  return await res.json();
};

export const updateUserRole = async (userId, role) => {
  const headers = await getHeaders();
  const res = await fetch(`${baseUrl}/api/users/${userId}/role`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error("Failed to update role");
  return await res.json();
};

export const deleteUser = async (userId) => {
  const headers = await getHeaders();
  const res = await fetch(`${baseUrl}/api/users/${userId}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return await res.json();
};

export const getAdminPurchases = async () => {
  const headers = await getHeaders();
  const res = await fetch(`${baseUrl}/api/admin/purchases`, { headers });
  return await res.json();
};

export const getAdminSubscriptions = async () => {
  const headers = await getHeaders();
  const res = await fetch(`${baseUrl}/api/admin/subscriptions`, { headers });
  return await res.json();
};

export const updateArtworkStatus = async (artworkId, status) => {
  const headers = await getHeaders();
  const res = await fetch(`${baseUrl}/api/artworks/${artworkId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return await res.json();
};

export const deleteArtworkAdmin = async (artworkId) => {
  const headers = await getHeaders();
  const res = await fetch(`${baseUrl}/api/artworks/${artworkId}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("Failed to delete artwork");
  return await res.json();
};
