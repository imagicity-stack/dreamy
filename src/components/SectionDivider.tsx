import { memo } from "react";

interface SectionDividerProps {
  variant?: "spacer" | "stripes" | "zig";
}

const SectionDivider = ({ variant = "spacer" }: SectionDividerProps) => {
  if (variant === "stripes") return <div className="divider-stripes" aria-hidden />;
  if (variant === "zig")     return <div className="divider-zig" aria-hidden />;
  return <div className="w-full py-4" aria-hidden />;
};

export default memo(SectionDivider);
