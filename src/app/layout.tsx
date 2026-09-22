import type { Metadata } from "next";
import { Bowlby_One, Karla } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/site";

const bowlbyOne = Bowlby_One({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const karla = Karla({
  variable: "--font-body",
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Without this, every relative URL Next writes into the page head — the
  // canonical link, the Open Graph image — resolves against localhost.
  metadataBase: new URL(siteUrl()),
  title: "MADOOZA — The Voice of Hazaribagh",
  description:
    "MADOOZA — The Elden Heights School's fest. Cosplay, fete, carnival stalls and a sealed concert reveal, in Hazaribagh. The date is sealed until the last guest reveal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bowlbyOne.variable} ${karla.variable}`} style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
