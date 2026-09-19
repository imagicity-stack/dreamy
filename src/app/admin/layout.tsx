import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MADOOZA Control Room",
  // The panel is behind a sign-in, but there's no reason for it to be indexed.
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
