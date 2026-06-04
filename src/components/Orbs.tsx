"use client";

interface OrbsProps {
  className?: string;
}

export default function Orbs({ className = "" }: OrbsProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="orb orb-magenta orb-drift" style={{ width: 420, height: 420, top: "-8%", left: "-6%" }} />
      <div className="orb orb-cyan orb-drift" style={{ width: 380, height: 380, top: "20%", right: "-8%", animationDelay: "3s" }} />
      <div className="orb orb-acid orb-drift" style={{ width: 320, height: 320, bottom: "-6%", left: "30%", animationDelay: "6s" }} />
      <div className="orb orb-violet orb-drift" style={{ width: 260, height: 260, bottom: "10%", right: "10%", animationDelay: "1.5s" }} />
    </div>
  );
}
