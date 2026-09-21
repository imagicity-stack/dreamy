import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findTicket, qrDataUrl, ticketUrl } from "@/lib/tickets";
import { getSettings, describeDate } from "@/lib/settings";
import { HOST_NAME, ORGANIZER_NAME, ORGANIZER_ROLE } from "@/lib/legal";

export const dynamic = "force-dynamic";

/** A ticket is not a page to be found in a search engine. */
export const metadata: Metadata = {
  title: "Your MADOOZA pass",
  robots: { index: false, follow: false },
};

/**
 * The ticket itself, outside the site's own header and footer: what somebody
 * holds up at the gate. Deliberately one screen, with the QR large and bright
 * — a phone at arm's length in daylight is the hardest thing a QR ever has to
 * survive, and every extra element pushes it smaller.
 */
export default async function TicketPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const ticket = await findTicket(token);
  if (!ticket) notFound();

  const settings = await getSettings();
  const date = describeDate(settings);
  const qr = await qrDataUrl(ticketUrl(token));

  const used = ticket.status === "used";
  const voided = ticket.status === "void";
  const bandColour = voided ? "var(--crimson)" : used ? "#8f74b5" : "var(--teal)";
  const bandText = voided ? "THIS PASS HAS BEEN REFUNDED" : used ? "ALREADY ADMITTED" : "READY TO SCAN";

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", padding: "22px 16px 40px" }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <div
          style={{
            background: "var(--paper)",
            border: "3px solid var(--ink)",
            borderRadius: 24,
            boxShadow: "10px 10px 0 var(--ink)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: bandColour,
              borderBottom: "3px solid var(--ink)",
              padding: "14px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span className="font-display" style={{ fontSize: 19, color: "var(--ink)" }}>MADOOZA</span>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: "var(--ink)" }}>
              {bandText}
            </span>
          </div>

          <div style={{ padding: "20px 20px 6px" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--purple)" }}>
              {ticket.tierLabel.toUpperCase()}
              {ticket.of > 1 ? ` · ${ticket.index} OF ${ticket.of}` : ""}
            </div>
            <div className="font-display" style={{ fontSize: 26, lineHeight: 1.15, margin: "8px 0 0", color: "var(--ink)" }}>
              {ticket.holderName}
            </div>
          </div>

          {/* White plate behind the QR: scanners want contrast, and a dark
              theme or a low-brightness screen is where scans go to die. */}
          <div style={{ padding: "14px 20px 8px" }}>
            <div style={{ background: "#ffffff", border: "3px solid var(--ink)", borderRadius: 18, padding: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qr}
                alt={`QR code for pass ${ticket.code}`}
                style={{ display: "block", width: "100%", height: "auto", opacity: used || voided ? 0.25 : 1 }}
              />
            </div>
          </div>

          <div style={{ padding: "6px 20px 16px", textAlign: "center" }}>
            <div className="font-display" style={{ fontSize: 24, letterSpacing: "0.08em", color: "var(--ink)" }}>
              {ticket.code}
            </div>
          </div>

          <div
            style={{
              borderTop: "2px dashed var(--ink)",
              padding: "16px 20px 20px",
              fontSize: 13.5,
              lineHeight: 1.6,
              color: "#453063",
            }}
          >
            {voided ? (
              <>This pass was refunded and will not be admitted. The fest office can explain why.</>
            ) : used ? (
              <>
                Admitted{ticket.usedAt ? ` at ${new Date(ticket.usedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : ""}.
                If that wasn&rsquo;t you, go to the fest office — don&rsquo;t argue with the gate volunteer, they can&rsquo;t fix it.
              </>
            ) : (
              <>
                {date.short} · gates 9:00 AM. Turn your screen brightness up and hold it steady.
                Screenshot this now so a flat battery or no signal can&rsquo;t keep you out.
              </>
            )}
          </div>
        </div>

        <div style={{ fontSize: 11, lineHeight: 1.7, color: "var(--muted-lilac)", marginTop: 18, textAlign: "center" }}>
          Hosted by {HOST_NAME} · {ORGANIZER_ROLE}: {ORGANIZER_NAME}
          <br />
          {settings.contactEmail} · {settings.contactPhone}
        </div>
      </div>
    </main>
  );
}
