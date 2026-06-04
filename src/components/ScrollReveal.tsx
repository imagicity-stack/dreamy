"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealMode = "up" | "left" | "right" | "scale";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  mode?: RevealMode;
  delay?: number;
  threshold?: number;
  once?: boolean;
}

const modeClassMap: Record<RevealMode, string> = {
  up: "reveal",
  left: "reveal-left",
  right: "reveal-right",
  scale: "reveal-scale",
};

export default function ScrollReveal({
  children,
  className = "",
  mode = "up",
  delay = 0,
  threshold = 0.15,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.setTimeout(() => el.classList.add("in"), delay);
            if (once) observer.unobserve(el);
          } else if (!once) {
            el.classList.remove("in");
          }
        });
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold, once]);

  return (
    <div ref={ref} className={`${modeClassMap[mode]} ${className}`}>
      {children}
    </div>
  );
}
