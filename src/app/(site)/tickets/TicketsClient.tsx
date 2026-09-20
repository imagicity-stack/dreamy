"use client";

import { useState } from "react";
import Link from "next/link";
import { formatInr } from "@/data/fest";
import { SealedDateStamp, SealedDateTiles } from "@/components/SealedDate";
import { isPageHidden, type DateDisplay, type FestSettings } from "@/lib/festSettings";
import { openRazorpayCheckout } from "@/lib/razorpayClient";

type PassResult = {
  passCode: string;
  tierLabel: string;
  qty: number;
  totalLabel: string;
};

type PassLine = { id: string; text: string; included?: boolean };

/**
 * The rules footnote names the Cosplay page mid-sentence, and that phrase is a
 * link while the page is live and plain words once it is hidden. The slot holds
 * the whole sentence, so it is split on the phrase rather than cut into pieces.
 */
function passRulesLine(text: string, linked: boolean) {
  const phrase = "Cosplay page";
  const [lead, tail = ""] = text.split(phrase);
  return (
    <>
      {lead}
      {linked ? <Link href="/cosplay">{phrase}</Link> : phrase}
      {tail}
    </>
  );
}

export default function TicketsClient({
  settings,
  date,
  words,
  fetePassIncludes,
  concertPassIncludes,
}: {
  settings: FestSettings;
  date: DateDisplay;
  words: Record<string, string>;
  fetePassIncludes: PassLine[];
  concertPassIncludes: PassLine[];
}) {
  const [qty, setQty] = useState(1);
  const [buyer, setBuyer] = useState({ name: "", school: "", phone: "" });
  const [pass, setPass] = useState<PassResult | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [error, setError] = useState("");

  const total = qty * settings.fetePrice;
  const canBuy = buyer.name.trim().length > 1 && buyer.phone.trim().length >= 10 && !settings.soldOut;

  async function buyPass() {
    if (!canBuy) return;
    setStatus("processing");
    setError("");
    try {
      const orderRes = await fetch("/api/passes/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty }),
      });
      if (!orderRes.ok) {
        const { error: msg } = await orderRes.json().catch(() => ({ error: "Could not start checkout" }));
        throw new Error(msg || "Could not start checkout");
      }
      const order = await orderRes.json();

      await openRazorpayCheckout({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "MADOOZA",
        description: `Fete Pass × ${qty}`,
        order_id: order.orderId,
        prefill: { name: buyer.name, contact: buyer.phone },
        theme: { color: "#35C6D4" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/passes/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                qty,
                buyer,
              }),
            });
            if (!verifyRes.ok) throw new Error("Payment could not be verified");
            const result = await verifyRes.json();
            setPass(result);
            setStatus("idle");
            window.scrollTo(0, 0);
          } catch (e) {
            setStatus("error");
            setError(e instanceof Error ? e.message : "Something went wrong verifying payment");
          }
        },
        modal: { ondismiss: () => setStatus("idle") },
      });
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Could not start checkout");
    }
  }

  return (
    <main>
      <section style={{ background: "var(--bg)", padding: "54px 20px 40px", borderBottom: "3px solid var(--ink)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--teal)" }}>{words.heroEyebrow}</div>
          <h1 className="font-display" style={{ fontSize: "clamp(30px, 6vw, 60px)", lineHeight: 1.02, margin: "14px 0 16px", color: "var(--lilac)" }}>
            {words.heroTitle}
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--lilac-text)", maxWidth: "58ch", margin: 0 }}>
            {words.heroIntro}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginTop: 24 }}>
            <SealedDateStamp date={date} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <SealedDateTiles date={date} size="sm" />
              <span style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--muted-lilac)", maxWidth: "34ch" }}>
                {date.sealed ? words.heroGatesNoteSealed : words.heroGatesNoteRevealed}
              </span>
            </div>
          </div>
        </div>
      </section>

      {pass ? (
        <section style={{ background: "var(--teal)", color: "var(--ink)", padding: "60px 20px 70px", borderBottom: "3px solid var(--ink)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div style={{ background: "var(--paper)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "12px 12px 0 var(--ink)", overflow: "hidden" }}>
              <div style={{ background: "var(--purple)", color: "var(--lilac)", padding: "20px 26px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", borderBottom: "3px solid var(--ink)" }}>
                <div className="font-display" style={{ fontSize: 20, color: "var(--teal)" }}>{words.successTitle}</div>
                <div style={{ fontSize: 11, letterSpacing: "0.18em" }}>{words.successDateLine}</div>
              </div>
              <div style={{ padding: 26, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 22 }}>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--purple)" }}>{words.successPassCodeLabel}</div>
                  <div className="font-display" style={{ fontSize: 24, marginTop: 6 }}>{pass.passCode}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--purple)" }}>{words.successNameLabel}</div>
                  <div style={{ fontWeight: 700, fontSize: 19, marginTop: 8 }}>{buyer.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--purple)" }}>{pass.tierLabel}</div>
                  <div style={{ fontWeight: 700, fontSize: 19, marginTop: 8 }}>&times; {pass.qty}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--purple)" }}>{words.successPaidLabel}</div>
                  <div style={{ fontWeight: 700, fontSize: 19, marginTop: 8 }}>{pass.totalLabel}</div>
                </div>
              </div>
              <div style={{ borderTop: "2px dashed var(--ink)", padding: "20px 26px", fontSize: 14.5, lineHeight: 1.55, color: "#453063" }}>
                {words.successNote}
              </div>
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 26 }}>
              {!isPageHidden(settings, "cosplay") && (
              <Link
                href="/cosplay"
                className="mz-pop font-display"
                style={{ fontSize: 14, color: "var(--lilac)", background: "var(--purple)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "6px 6px 0 var(--ink)", padding: "14px 20px", ["--mz-shadow" as string]: "6px" }}
              >
                {words.successCosplayCta}
              </Link>
              )}
              <button
                onClick={() => {
                  setPass(null);
                  setQty(1);
                  setBuyer({ name: "", school: "", phone: "" });
                }}
                style={{ fontWeight: 700, fontSize: 12, letterSpacing: "0.14em", background: "transparent", border: "2px solid var(--ink)", borderRadius: 14, padding: "14px 18px", cursor: "pointer", color: "var(--ink)" }}
              >
                {words.successBuyAgainCta}
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section style={{ background: "var(--bg)", padding: "46px 20px 70px" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 26, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div
                style={{ background: "var(--teal)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "10px 10px 0 var(--ink)", padding: "26px 24px" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--purple)" }}>{words.fetePassKicker}</div>
                    <div className="font-display" style={{ fontSize: "clamp(30px, 5vw, 44px)", lineHeight: 1, marginTop: 8 }}>{formatInr(settings.fetePrice)}</div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, padding: "8px 12px", background: "var(--paper)" }}>
                    {words.fetePassBadge}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, margin: "20px 0 0", fontSize: 15, lineHeight: 1.5 }}>
                  {fetePassIncludes.map((line) => (
                    <div key={line.id} style={{ display: "flex", gap: 10, color: line.included ? undefined : "#6B5580" }}>
                      <span style={{ color: line.included ? "var(--purple)" : undefined, fontWeight: 700 }}>{line.included ? "★" : "✕"}</span>
                      <span>{line.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {!isPageHidden(settings, "concert") && (
              <Link
                href="/concert"
                style={{ background: "var(--near-black)", color: "var(--lilac)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "10px 10px 0 var(--ink)", padding: "26px 24px", cursor: "pointer", position: "relative", overflow: "hidden", display: "block" }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "radial-gradient(#150331 1.4px, transparent 1.5px)",
                    backgroundSize: "11px 11px",
                    opacity: 0.18,
                    animation: "mzdrift 30s linear infinite",
                    pointerEvents: "none",
                  }}
                />
                <div style={{ position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--teal)" }}>{words.concertPassKicker}</div>
                      <div className="font-display" style={{ fontSize: "clamp(26px, 4.4vw, 40px)", lineHeight: 1, marginTop: 8, color: "var(--teal)" }}>{words.concertPassPriceLabel}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, padding: "8px 12px", background: "var(--teal)" }}>
                        {words.concertPassCta}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--pink)", textAlign: "right" }}>{words.concertSeatsNote}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9, margin: "20px 0 0", fontSize: 15, lineHeight: 1.5, color: "#F0E4FA" }}>
                    {concertPassIncludes.map((line) => (
                      <div key={line.id} style={{ display: "flex", gap: 10 }}>
                        <span style={{ color: "var(--teal)", fontWeight: 700 }}>{"★"}</span>
                        <span>{line.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
              )}

              <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "#C9B4E0", padding: "0 4px" }}>
                {passRulesLine(words.passRulesNote, !isPageHidden(settings, "cosplay"))}
              </div>
            </div>

            <div style={{ background: "var(--purple)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "10px 10px 0 var(--ink)", padding: "28px 26px" }}>
              <h2 className="font-display" style={{ fontSize: 22, margin: "0 0 20px", color: "var(--teal)" }}>{words.checkoutTitle}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--lilac)", marginBottom: 7 }}>YOUR PASS</label>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", background: "var(--teal)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, padding: "15px 17px" }}>
                    <div className="font-display" style={{ fontSize: 15 }}>{words.checkoutPassName}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em" }}>{words.checkoutPassPrice}</div>
                  </div>
                  <div style={{ fontSize: 10.5, lineHeight: 1.7, letterSpacing: "0.08em", color: "#DCC9F2", marginTop: 9 }}>
                    {words.checkoutConcertNote}
                    {!isPageHidden(settings, "concert") && (
                      <> &mdash; <Link href="/concert" style={{ color: "var(--teal)" }}>{words.checkoutConcertLinkLabel}</Link></>
                    )}
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--lilac)", marginBottom: 7 }}>HOW MANY PASSES</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="font-display"
                      style={{ width: 46, height: 46, fontSize: 18, background: "var(--lilac)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, cursor: "pointer" }}
                    >
                      &ndash;
                    </button>
                    <div className="font-display" style={{ minWidth: 62, height: 46, background: "var(--bg)", border: "3px solid var(--ink)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "var(--teal)" }}>
                      {qty}
                    </div>
                    <button
                      onClick={() => setQty((q) => Math.min(10, q + 1))}
                      className="font-display"
                      style={{ width: 46, height: 46, fontSize: 18, background: "var(--lilac)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, cursor: "pointer" }}
                    >
                      +
                    </button>
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <div style={{ fontSize: 10.5, letterSpacing: "0.16em", color: "#F0E4FA" }}>TOTAL</div>
                      <div className="font-display" style={{ fontSize: 24, color: "var(--lilac)", lineHeight: 1.1 }}>{formatInr(total)}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--lilac)", marginBottom: 7 }}>FULL NAME</label>
                  <input
                    className="mz-input"
                    value={buyer.name}
                    onChange={(e) => setBuyer((b) => ({ ...b, name: e.target.value }))}
                    placeholder="As it should read on the pass"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--lilac)", marginBottom: 7 }}>SCHOOL OR ORGANISATION</label>
                  <input
                    className="mz-input"
                    value={buyer.school}
                    onChange={(e) => setBuyer((b) => ({ ...b, school: e.target.value }))}
                    placeholder="Optional &mdash; helps us plan the queues"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--lilac)", marginBottom: 7 }}>PHONE</label>
                  <input
                    className="mz-input"
                    value={buyer.phone}
                    onChange={(e) => setBuyer((b) => ({ ...b, phone: e.target.value }))}
                    placeholder="10 digits, we send the pass code here"
                  />
                </div>

                {!settings.soldOut ? (
                  <button
                    onClick={buyPass}
                    disabled={!canBuy || status === "processing"}
                    className="font-display mz-pop"
                    style={{
                      fontSize: 16,
                      color: "var(--ink)",
                      background: "var(--teal)",
                      border: "3px solid var(--ink)",
                      borderRadius: 20,
                      boxShadow: "6px 6px 0 var(--ink)",
                      padding: "17px 20px",
                      cursor: canBuy ? "pointer" : "not-allowed",
                      width: "100%",
                      opacity: canBuy ? 1 : 0.6,
                      ["--mz-shadow" as string]: "6px",
                    }}
                  >
                    {status === "processing"
                      ? words.checkoutPayProcessing
                      : words.checkoutPayCta.replace("{total}", formatInr(total))}
                  </button>
                ) : (
                  <div className="font-display" style={{ fontSize: 15, color: "var(--lilac)", background: "var(--bg)", border: "3px solid var(--ink)", borderRadius: 20, padding: "17px 20px", textAlign: "center" }}>
                    {words.checkoutSoldOut}
                  </div>
                )}
                {status === "error" && (
                  <div style={{ fontSize: 13, color: "var(--pink)", lineHeight: 1.5 }}>{error}</div>
                )}
                <div style={{ fontSize: 10.5, lineHeight: 1.6, letterSpacing: "0.06em", color: "#DCC9F2" }}>
                  {words.checkoutPaymentNote}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
