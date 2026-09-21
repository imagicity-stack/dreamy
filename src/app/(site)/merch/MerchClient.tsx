"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatInr } from "@/data/fest";
import PriceLines from "@/components/PriceLines";
import { formatPaise } from "@/lib/pricing";
import {
  CheckoutDismissed,
  fetchQuote,
  startCheckout,
  type Quote,
  type Receipt,
} from "@/lib/checkoutClient";

export type MerchRecord = {
  id: string;
  name: string;
  price: number;
  note: string;
  image: { path: string; url: string } | null;
};

export default function MerchClient({
  merchItems,
  words,
  open,
  closedNote,
}: {
  merchItems: MerchRecord[];
  words: Record<string, string>;
  open: boolean;
  closedNote: string;
}) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [buyer, setBuyer] = useState({ name: "", phone: "", email: "" });
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const cartLines = merchItems
    .filter((m) => (cart[m.id] || 0) > 0)
    .map((m) => ({ ...m, qty: cart[m.id], lineLabel: formatInr(m.price * cart[m.id]) }));
  const cartCount = cartLines.reduce((a, l) => a + l.qty, 0);

  // The bag's own arithmetic is for the item rows; what is charged — the bag,
  // the convenience fee and the GST on it — is priced by the server on every
  // change to the bag.
  useEffect(() => {
    if (cartCount === 0) {
      setQuote(null);
      return;
    }
    let live = true;
    fetchQuote("merch", { cart })
      .then((q) => live && setQuote(q))
      .catch(() => live && setQuote(null));
    return () => {
      live = false;
    };
  }, [cart, cartCount]);

  // Same rule as the passes page: a quote for a different bag is a stale price.
  const quoteMatchesBag = !!quote && quote.units === cartCount;
  const canPay =
    cartCount > 0 && quoteMatchesBag && buyer.name.trim().length > 1 && buyer.phone.trim().length >= 10;

  function add(id: string) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
    setReceipt(null);
  }
  function sub(id: string) {
    setCart((c) => {
      const next = { ...c };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });
    setReceipt(null);
  }

  async function placeMerch() {
    if (!canPay) return;
    setPlacing(true);
    setError("");
    try {
      const paid = await startCheckout({
        product: "merch",
        input: { cart },
        customer: buyer,
        title: "MADOOZA Merch",
      });
      setReceipt(paid);
      setCart({});
      window.scrollTo(0, 0);
    } catch (e) {
      if (!(e instanceof CheckoutDismissed)) {
        setError(e instanceof Error ? e.message : words.orderErrorFallback);
      }
    } finally {
      setPlacing(false);
    }
  }

  return (
    <main>
      <section style={{ background: "var(--bg)", padding: "54px 20px 40px", borderBottom: "3px solid var(--ink)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--teal)" }}>{words.heroEyebrow}</div>
            <h1 className="font-display" style={{ fontSize: "clamp(30px, 6vw, 60px)", lineHeight: 1.02, margin: "14px 0 16px", color: "var(--lilac)" }}>{words.heroTitle}</h1>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--lilac-text)", maxWidth: "54ch", margin: 0 }}>
              {words.heroIntro}
            </p>
          </div>
          <div style={{ background: "var(--purple)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "6px 6px 0 var(--ink)", padding: "14px 18px", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.14em", color: "var(--lilac)" }}>
            IN BAG: {cartCount} &middot; {quoteMatchesBag ? formatPaise(quote.price.totalPaise) : "…"}
          </div>
        </div>
      </section>

      {receipt && (
        <section style={{ background: "var(--teal)", color: "var(--ink)", borderBottom: "3px solid var(--ink)", padding: "40px 20px" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div>
              <div className="font-display" style={{ fontSize: "clamp(20px, 3.4vw, 30px)" }}>
                {words.confirmTitle.replace("{total}", formatPaise(receipt.amount.totalPaise))}
              </div>
              {/* The code is what the merch tent looks up, so it leads. */}
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", marginTop: 10 }}>
                COLLECTION CODE &middot; <span className="font-display" style={{ fontSize: 18, letterSpacing: 0 }}>{receipt.primaryCode}</span>
              </div>
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.5, maxWidth: "46ch" }}>
              {words.confirmBody}
            </div>
            <button
              onClick={() => setReceipt(null)}
              style={{ marginLeft: "auto", fontWeight: 700, fontSize: 12, letterSpacing: "0.14em", background: "var(--ink)", color: "var(--teal)", border: "3px solid var(--ink)", borderRadius: 20, padding: "13px 16px", cursor: "pointer" }}
            >
              {words.confirmResetButton}
            </button>
          </div>
        </section>
      )}

      <section style={{ background: "var(--paper)", color: "var(--ink)", padding: "50px 20px 64px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 34, alignItems: "start" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 20 }}>
            {merchItems.map((item) => (
              <div key={item.id} style={{ background: "#FFFFFF", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "7px 7px 0 var(--ink)", display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    height: 190, borderBottom: "3px solid var(--ink)", background: "var(--lilac)",
                    borderRadius: "17px 17px 0 0", overflow: "hidden", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 12, letterSpacing: "0.08em", color: "var(--purple)",
                    textAlign: "center", padding: 12,
                  }}
                >
                  {item.image ? (
                    <Image
                      src={item.image.url}
                      alt={item.name}
                      width={420}
                      height={190}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <>{item.name.toUpperCase()} PHOTO</>
                  )}
                </div>
                <div style={{ padding: "16px 16px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                    <h3 className="font-display" style={{ fontSize: 16, margin: 0, lineHeight: 1.15 }}>{item.name}</h3>
                    <div className="font-display" style={{ fontSize: 16, color: "var(--purple)" }}>{formatInr(item.price)}</div>
                  </div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.45, color: "#453063", margin: "8px 0 16px" }}>{item.note}</p>
                  <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      onClick={() => sub(item.id)}
                      className="font-display"
                      style={{ width: 38, height: 38, fontSize: 15, background: "var(--lilac)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, cursor: "pointer" }}
                    >
                      &ndash;
                    </button>
                    <div className="font-display" style={{ minWidth: 40, textAlign: "center", fontSize: 16 }}>{cart[item.id] || 0}</div>
                    <button
                      onClick={() => add(item.id)}
                      className="font-display"
                      style={{ flex: 1, height: 38, fontSize: 12, background: "var(--teal)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, cursor: "pointer" }}
                    >
                      {words.itemAddButton}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--bg)", color: "var(--lilac)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "9px 9px 0 var(--ink)", padding: "26px 24px", position: "sticky", top: 120 }}>
            <h2 className="font-display" style={{ fontSize: 20, margin: "0 0 18px", color: "var(--teal)" }}>{words.bagTitle}</h2>
            {cartCount === 0 ? (
              <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--muted-lilac)", margin: 0 }}>
                {words.bagEmptyNote}
              </p>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
                  {cartLines.map((line) => (
                    <div key={line.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14.5, borderBottom: "1px dashed #351059", paddingBottom: 10 }}>
                      <span>{line.qty} &times; {line.name}</span>
                      <strong>{line.lineLabel}</strong>
                    </div>
                  ))}
                </div>
                {quote && (
                  <div style={{ marginBottom: 18, opacity: quoteMatchesBag ? 1 : 0.55, transition: "opacity 0.15s ease" }}>
                    <PriceLines price={quote.price} baseLabel="BAG" />
                  </div>
                )}
                {open && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                    <input
                      className="mz-input"
                      value={buyer.name}
                      onChange={(e) => setBuyer((b) => ({ ...b, name: e.target.value }))}
                      placeholder="Your name"
                    />
                    <input
                      className="mz-input"
                      value={buyer.phone}
                      onChange={(e) => setBuyer((b) => ({ ...b, phone: e.target.value }))}
                      placeholder="Phone — 10 digits"
                    />
                    <input
                      className="mz-input"
                      value={buyer.email}
                      onChange={(e) => setBuyer((b) => ({ ...b, email: e.target.value }))}
                      placeholder="Email (optional)"
                    />
                  </div>
                )}
                {open ? (
                  <button
                    onClick={placeMerch}
                    disabled={placing || !canPay}
                    className="font-display mz-pop"
                    style={{ fontSize: 14, color: "var(--ink)", background: "var(--teal)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "5px 5px 0 var(--ink)", padding: "15px 16px", cursor: canPay ? "pointer" : "not-allowed", width: "100%", opacity: canPay ? 1 : 0.6, ["--mz-shadow" as string]: "5px" }}
                  >
                    {placing ? words.placeOrderBusyLabel : words.placeOrderButton}
                  </button>
                ) : (
                  <div style={{ background: "var(--crimson)", color: "var(--lilac)", border: "3px solid var(--ink)", borderRadius: 20, padding: "14px 16px", fontSize: 13.5, lineHeight: 1.5 }}>
                    {closedNote}
                  </div>
                )}
                {error && <div style={{ fontSize: 12, color: "var(--pink)", marginTop: 10 }}>{error}</div>}
              </>
            )}
            <div style={{ fontSize: 10.5, lineHeight: 1.6, letterSpacing: "0.06em", color: "#7D63A8", marginTop: 18 }}>
              {words.collectionFootnote}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
