import { requireRole } from "@/lib/session";

export default async function ArtistLayout({ children }) {
  await requireRole(["artist", "seller"]);

  return <>{children}</>;
}
