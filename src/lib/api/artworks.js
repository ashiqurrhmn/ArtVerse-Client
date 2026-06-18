"use server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export const getArtworks = async () => {
    const res = await fetch(`${baseUrl}/api/artworks`);
    const data = await res.json();
    return data;
}