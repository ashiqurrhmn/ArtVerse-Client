import { requireRole } from "@/lib/session";

export default async function BuyerLayout({ children }) {
  // Empty array or no array means it just checks for authentication
  await requireRole();

  return <>{children}</>;
}
