import type { Metadata } from "next";
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
  title: "Madooza 2025 | Hazaribagh's Youth Fusion Fest",
  description:
    "Discover MADOOZA Festival 2024 in Hazaribagh – a high-energy celebration of cosplay, music, art, food, and creator culture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} ${quicksand.variable} ${montserrat.variable} ${leagueGothic.variable} antialiased font-quicksand`}
      >
        <Header/>

        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
