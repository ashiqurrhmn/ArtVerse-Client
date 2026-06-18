'use server'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export const addArtwork = async (newArtwork) => {
    const res = await fetch(`${baseUrl}/api/artworks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newArtwork),
    });
    const data = await res.json();
    return data;
}

export const deleteArtwork = async (id) => {
  const res = await fetch(`${baseUrl}/api/artworks/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  return data;
};

export const updateArtwork = async (id, updatedData) => {
  const res = await fetch(`${baseUrl}/api/artworks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  const data = await res.json();
  return data;
};
