/**
 * The line every form carries about its email and phone fields.
 *
 * The passes, the codes and the reveal all go to whatever is typed into those
 * two boxes, and a mistyped address is the one failure nobody can fix at the
 * gate. So it is said on every form, in the fest's voice, in a colour that is
 * noticed without shouting.
 */
export default function FormNote({ text, tone = "dark" }: { text: string; tone?: "dark" | "light" }) {
  if (!text) return null;

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        background: tone === "dark" ? "rgba(255, 79, 126, 0.14)" : "#FFE9F0",
        border: `2px solid ${tone === "dark" ? "var(--pink)" : "var(--crimson)"}`,
        borderRadius: 14,
        padding: "11px 13px",
      }}
    >
      <span aria-hidden style={{ fontSize: 14, lineHeight: 1.35 }}>✉️</span>
      <span
        style={{
          fontSize: 12.5,
          lineHeight: 1.55,
          color: tone === "dark" ? "#FFD9E4" : "#8A0B3C",
        }}
      >
        {text}
      </span>
    </div>
  );
}
