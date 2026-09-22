"use client";

/**
 * The WhatsApp consent box.
 *
 * Meta will not let a business message anybody who has not agreed to it, and
 * the agreement has to be the buyer's own — typing a phone number into a
 * checkout is not consent to be messaged on it. So this is a real checkbox with
 * the number it applies to printed inside it, which is also the honest thing to
 * do regardless of what Meta requires.
 *
 * It starts ticked. A fest buyer who has just entered their mobile number
 * plainly does want their ticket on it, and an unticked box means almost nobody
 * gets the thing they came for. Untick it and nothing is sent — the pass is in
 * the email and on screen either way, so this is never the only copy.
 */
export default function WhatsAppOptIn({
  checked,
  onChange,
  phone,
  tone = "dark",
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** Shown back to them, so a typo is caught here rather than at the gate. */
  phone: string;
  tone?: "dark" | "light";
}) {
  const dark = tone === "dark";
  const digits = phone.replace(/\D/g, "");

  return (
    <label
      style={{
        display: "flex",
        gap: 11,
        alignItems: "flex-start",
        background: dark ? "rgba(53, 198, 212, 0.12)" : "#E4F8FA",
        border: `2px solid ${dark ? "var(--teal)" : "#1C9AA8"}`,
        borderRadius: 14,
        padding: "12px 13px",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 18, height: 18, marginTop: 1, flexShrink: 0, accentColor: "#1C9AA8", cursor: "pointer" }}
      />
      <span style={{ fontSize: 12.5, lineHeight: 1.55, color: dark ? "var(--lilac-text)" : "#0C4E56" }}>
        <strong>Send my pass on WhatsApp too</strong>
        {digits.length >= 10 ? (
          <>
            {" — to "}
            <strong>{phone.trim()}</strong>.
          </>
        ) : (
          " — to the number above."
        )}{" "}
        You will get it by email and can download it here as well.
      </span>
    </label>
  );
}
