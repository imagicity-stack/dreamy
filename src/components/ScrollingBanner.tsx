"use client";

import Marquee from "./Marquee";

interface ScrollingBannerProps {
  variant?: "default" | "magenta" | "cyan" | "acid" | "stripe";
  tilt?: "left" | "right" | "none";
}

const defaultItems = [
  "MADOOZA",
  "13 · DEC · 25",
  "HAZARIBAGH",
  "MUSIC · COSPLAY · STALLS",
  "SOUND OF PURE MADNESS",
  "THE MAD PARADE",
  "FOOD · ART · VIBES",
];

const altItems = [
  "GRAB YOUR PASS",
  "12 HOURS · ZERO CHILL",
  "ONE CITY · ONE MOVEMENT",
  "BRING YOUR CREW",
];

export default function ScrollingBanner({ variant = "default", tilt = "none" }: ScrollingBannerProps) {
  if (variant === "magenta") {
    return <Marquee items={altItems} tone="magenta" tilt={tilt} speed="normal" />;
  }
  if (variant === "cyan") {
    return <Marquee items={altItems} tone="cyan" tilt={tilt} speed="normal" />;
  }
  if (variant === "acid") {
    return <Marquee items={defaultItems} tone="acid" tilt={tilt} speed="fast" reverse />;
  }
  if (variant === "stripe") {
    return <Marquee items={defaultItems} tone="stripe-magenta" tilt={tilt} speed="normal" />;
  }
  return <Marquee items={defaultItems} tone="ink" tilt={tilt} speed="normal" />;
}
