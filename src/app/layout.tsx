import type { Metadata, Viewport } from "next";
import {
  Bowlby_One,
  Bungee,
  League_Gothic,
  Plus_Jakarta_Sans,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bowlby = Bowlby_One({
  variable: "--font-bowlby",
  subsets: ["latin"],
  weight: "400",
});

const bungee = Bungee({
  variable: "--font-bungee",
  subsets: ["latin"],
  weight: "400",
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
        className={`${jakarta.variable} ${grotesk.variable} ${bowlby.variable} ${bungee.variable} ${leagueGothic.variable} antialiased grain`}
      >
        <Header />
        <main className="relative z-[2]">
          {children}
        </main>
      </body>
    </html>
  );
}
