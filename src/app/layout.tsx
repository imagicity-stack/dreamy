import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  League_Gothic,
  Montserrat,
  Oswald,
  Quicksand,
} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const leagueGothic = League_Gothic({
  variable: "--font-league-gothic",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MADOOZA · The Sound of Pure Madness · Hazaribagh 2025",
  description:
    "MADOOZA — Hazaribagh's first creative explosion. 12 hours of music, cosplay, food, art, and pure madness. 13 December 2025.",
  openGraph: {
    title: "MADOOZA · The Sound of Pure Madness",
    description:
      "Hazaribagh, 13 December 2025 — music, cosplay, stalls, art and madness.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0014",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} ${quicksand.variable} ${montserrat.variable} ${leagueGothic.variable} antialiased font-quicksand grain`}
      >
        <Header />
        <main className="relative z-[2]">
          {children}
        </main>
      </body>
    </html>
  );
}
