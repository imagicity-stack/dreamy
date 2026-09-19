import type { CSSProperties } from "react";

/** Shared styling for the control room — the fest's look, minus the confetti. */

export const card: CSSProperties = {
  background: "var(--paper)",
  color: "var(--ink)",
  border: "3px solid var(--ink)",
  borderRadius: 20,
  boxShadow: "8px 8px 0 var(--ink)",
  padding: "22px 22px 24px",
};

export const kicker: CSSProperties = {
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: "0.2em",
  color: "var(--purple)",
};

export const primaryButton: CSSProperties = {
  fontSize: 14,
  color: "var(--ink)",
  background: "var(--teal)",
  border: "3px solid var(--ink)",
  borderRadius: 16,
  boxShadow: "5px 5px 0 var(--ink)",
  padding: "13px 20px",
  cursor: "pointer",
};

export const quietButton: CSSProperties = {
  fontSize: 11.5,
  fontWeight: 700,
  letterSpacing: "0.14em",
  color: "var(--ink)",
  background: "var(--lilac)",
  border: "2px solid var(--ink)",
  borderRadius: 999,
  padding: "8px 14px",
  cursor: "pointer",
};

export const label: CSSProperties = {
  display: "block",
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: "0.18em",
  color: "var(--purple)",
  marginBottom: 6,
};

export const tableWrap: CSSProperties = {
  overflowX: "auto",
  border: "3px solid var(--ink)",
  borderRadius: 18,
  background: "#ffffff",
};

export const th: CSSProperties = {
  textAlign: "left",
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: "0.14em",
  color: "var(--paper)",
  background: "var(--purple)",
  padding: "11px 13px",
  whiteSpace: "nowrap",
};

export const td: CSSProperties = {
  fontSize: 13.5,
  color: "var(--ink)",
  padding: "11px 13px",
  borderTop: "2px solid #E4D8F2",
  whiteSpace: "nowrap",
};
