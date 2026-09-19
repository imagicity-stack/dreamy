import type { Metadata } from "next";
import { Bowlby_One, Karla } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  title: "MADOOZA — The Voice of Hazaribagh",
  description:
    "MADOOZA — The Elden Heights School's fest. Cosplay, fete, carnival stalls and a sealed concert reveal, this November in Hazaribagh.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bowlbyOne.variable} ${karla.variable}`} style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
