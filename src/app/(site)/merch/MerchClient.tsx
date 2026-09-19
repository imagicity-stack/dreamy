"use client";

import { useState } from "react";
import { formatInr, type MerchItem } from "@/data/fest";

export default function MerchClient({ merchItems }: { merchItems: MerchItem[] }) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const cartLines = merchItems
    .filter((m) => (cart[m.id] || 0) > 0)
    .map((m) => ({ ...m, qty: cart[m.id], lineLabel: formatInr(m.price * cart[m.id]) }));
  const cartCount = cartLines.reduce((a, l) => a + l.qty, 0);
  const cartTotal = cartLines.reduce((a, l) => a + l.price * l.qty, 0);

  function add(id: string) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
    setDone(false);
  }
  function sub(id: string) {
    setCart((c) => {
      const next = { ...c };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });
    setDone(false);
  }

  async function placeMerch() {
    if (cartCount === 0) return;
    setPlacing(true);
    setError("");
    try {
      const res = await fetch("/api/merch-preorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });
      if (!res.ok) throw new Error("Could not place the pre-order — try again");
      setDone(true);
      window.scrollTo(0, 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <main>
      <section style={{ background: "var(--bg)", padding: "54px 20px 40px", borderBottom: "3px solid var(--ink)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--teal)" }}>04 / THE SHOP</div>
            <h1 className="font-display" style={{ fontSize: "clamp(30px, 6vw, 60px)", lineHeight: 1.02, margin: "14px 0 16px", color: "var(--lilac)" }}>MERCH DROP</h1>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--lilac-text)", maxWidth: "54ch", margin: 0 }}>
              Printed in one run, in Hazaribagh, and never printed again. Pre-order now and collect at the merch tent
              with your pass code.
            </p>
          </div>
          <div style={{ background: "var(--purple)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "6px 6px 0 var(--ink)", padding: "14px 18px", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.14em", color: "var(--lilac)" }}>
            IN BAG: {cartCount} &middot; {formatInr(cartTotal)}
          </div>
        </div>
      </section>

      {done && (
        <section style={{ background: "var(--teal)", color: "var(--ink)", borderBottom: "3px solid var(--ink)", padding: "40px 20px" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div className="font-display" style={{ fontSize: "clamp(20px, 3.4vw, 30px)" }}>PRE-ORDER PLACED &mdash; {formatInr(cartTotal)}</div>
            <div style={{ fontSize: 15, lineHeight: 1.5, maxWidth: "46ch" }}>
              Collect at the merch tent on fest day, any time after 10 AM. Bring your pass code. Sizes get swapped at
              the counter, no drama.
            </div>
            <button
              onClick={() => setCart({})}
              style={{ marginLeft: "auto", fontWeight: 700, fontSize: 12, letterSpacing: "0.14em", background: "var(--ink)", color: "var(--teal)", border: "3px solid var(--ink)", borderRadius: 20, padding: "13px 16px", cursor: "pointer" }}
            >
              START A NEW BAG
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
                  {item.name.toUpperCase()} PHOTO
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
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--bg)", color: "var(--lilac)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "9px 9px 0 var(--ink)", padding: "26px 24px", position: "sticky", top: 120 }}>
            <h2 className="font-display" style={{ fontSize: 20, margin: "0 0 18px", color: "var(--teal)" }}>YOUR BAG</h2>
            {cartCount === 0 ? (
              <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--muted-lilac)", margin: 0 }}>
                Nothing in here yet. The hoodie has a clue printed inside the hood, if that helps you decide.
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 18 }}>
                  <span style={{ fontSize: 11, letterSpacing: "0.16em", color: "var(--muted-lilac)" }}>TOTAL</span>
                  <span className="font-display" style={{ fontSize: 24, color: "var(--teal)" }}>{formatInr(cartTotal)}</span>
                </div>
                <button
                  onClick={placeMerch}
                  disabled={placing}
                  className="font-display mz-pop"
                  style={{ fontSize: 14, color: "var(--ink)", background: "var(--teal)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "5px 5px 0 var(--ink)", padding: "15px 16px", cursor: "pointer", width: "100%", ["--mz-shadow" as string]: "5px" }}
                >
                  {placing ? "PLACING…" : "PLACE PRE-ORDER"}
                </button>
                {error && <div style={{ fontSize: 12, color: "var(--pink)", marginTop: 10 }}>{error}</div>}
              </>
            )}
            <div style={{ fontSize: 10.5, lineHeight: 1.6, letterSpacing: "0.06em", color: "#7D63A8", marginTop: 18 }}>
              COLLECT AT THE MERCH TENT &middot; PAY ON COLLECTION &middot; SIZES S&ndash;XXL ON TEES AND HOODIES
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
