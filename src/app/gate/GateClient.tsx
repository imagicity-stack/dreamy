"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

/**
 * The scanning screen, built for one situation: a fifteen-year-old holding a
 * phone in the sun with a queue in front of them.
 *
 * So the answer is the whole screen and one word tall — a volunteer reads a
 * colour, not a sentence — and the camera goes straight back to scanning. The
 * same code scanned twice in a row is ignored for a few seconds, because a
 * camera pointed at a ticket reads it thirty times a second and only the first
 * one is a person arriving.
 */

export type Ticket = {
  id: string;
  code: string;
  tierLabel: string;
  holderName: string;
  index: number;
  of: number;
  status: string;
  usedAt: string | null;
  usedBy: string | null;
};

export type Outcome =
  | { result: "admitted"; ticket: Ticket }
  | { result: "already"; ticket: Ticket; usedAt: string; usedBy: string }
  | { result: "void"; ticket: Ticket }
  | { result: "unknown" };

const HOLD_MS = 2600;
const REPEAT_MS = 4000;

function timeOf(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

/** A short blip and a buzz: a gate is loud and nobody is looking at the screen. */
function feedback(good: boolean) {
  try {
    navigator.vibrate?.(good ? 60 : [40, 60, 40]);
  } catch {
    /* not every phone has it, and it is not important enough to check */
  }
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = good ? 880 : 220;
    gain.gain.value = 0.07;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + (good ? 0.12 : 0.3));
    setTimeout(() => ctx.close(), 600);
  } catch {
    /* audio is a courtesy, never a requirement */
  }
}

export default function GateClient({
  signedInAs,
  pinIsSet,
}: {
  signedInAs: string | null;
  pinIsSet: boolean;
}) {
  const [volunteer, setVolunteer] = useState(signedInAs);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [counts, setCounts] = useState<{ issued: number; admitted: number } | null>(null);
  const [cameraError, setCameraError] = useState("");
  const [manualOpen, setManualOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastSeen = useRef<{ token: string; at: number }>({ token: "", at: 0 });
  const busy = useRef(false);

  const refreshCounts = useCallback(async () => {
    try {
      const res = await fetch("/api/gate/stats");
      if (res.ok) {
        const d = await res.json();
        setCounts({ issued: d.issued, admitted: d.admitted });
      }
    } catch {
      /* the tally is nice to have; scanning matters more */
    }
  }, []);

  const submit = useCallback(
    async (token: string) => {
      if (busy.current) return;
      busy.current = true;
      try {
        const res = await fetch("/api/gate/check-in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        if (res.status === 401) {
          setVolunteer(null);
          return;
        }
        const data: Outcome = await res.json();
        setOutcome(data);
        feedback(data.result === "admitted");
        refreshCounts();
        setTimeout(() => setOutcome(null), HOLD_MS);
      } catch {
        setOutcome({ result: "unknown" });
        setTimeout(() => setOutcome(null), HOLD_MS);
      } finally {
        busy.current = false;
      }
    },
    [refreshCounts],
  );

  // ---- the camera ----
  useEffect(() => {
    if (!volunteer) return;
    let stream: MediaStream | null = null;
    let raf = 0;
    let stopped = false;

    const onFrame = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!stopped && video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        const w = video.videoWidth;
        const h = video.videoHeight;
        if (w && h) {
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (ctx) {
            ctx.drawImage(video, 0, 0, w, h);
            const image = ctx.getImageData(0, 0, w, h);
            const found = jsQR(image.data, w, h, { inversionAttempts: "dontInvert" });
            if (found?.data) {
              const token = found.data.includes("/t/")
                ? found.data.split("/t/").pop()!.split(/[?#]/)[0]
                : found.data;
              const now = Date.now();
              const repeat = token === lastSeen.current.token && now - lastSeen.current.at < REPEAT_MS;
              if (!repeat) {
                lastSeen.current = { token, at: now };
                submit(token);
              }
            }
          }
        }
      }
      if (!stopped) raf = requestAnimationFrame(onFrame);
    };

    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false })
      .then((s) => {
        if (stopped) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play().catch(() => undefined);
        }
        raf = requestAnimationFrame(onFrame);
      })
      .catch(() => {
        setCameraError(
          "No camera. Allow camera access for this site, or use the search below to admit people by name.",
        );
        setManualOpen(true);
      });

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [volunteer, submit]);

  useEffect(() => {
    if (volunteer) refreshCounts();
  }, [volunteer, refreshCounts]);

  if (!volunteer) {
    return <SignIn pinIsSet={pinIsSet} onDone={setVolunteer} />;
  }

  return (
    <main style={{ background: "var(--ink)", minHeight: "100dvh", color: "var(--lilac)" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "12px 16px",
          borderBottom: "2px solid #351059",
        }}
      >
        <span className="font-display" style={{ fontSize: 16, color: "var(--teal)" }}>MADOOZA GATE</span>
        <span style={{ fontSize: 11, letterSpacing: "0.12em", color: "var(--muted-lilac)" }}>
          {counts ? `${counts.admitted.toLocaleString("en-IN")} IN · ${counts.issued.toLocaleString("en-IN")} SOLD` : "…"}
        </span>
      </header>

      <div style={{ position: "relative", background: "#000", aspectRatio: "3 / 4", maxHeight: "62dvh", overflow: "hidden" }}>
        <video ref={videoRef} playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* The frame is only guidance; the decoder reads the whole picture. */}
        <div
          style={{
            position: "absolute",
            inset: "12% 14%",
            border: "3px solid rgba(53, 198, 212, 0.9)",
            borderRadius: 20,
            pointerEvents: "none",
          }}
        />

      </div>

      {outcome && <Result outcome={outcome} onDismiss={() => setOutcome(null)} />}

      {cameraError && (
        <div style={{ background: "var(--crimson)", padding: "12px 16px", fontSize: 13.5, lineHeight: 1.5 }}>
          {cameraError}
        </div>
      )}

      <div style={{ padding: "14px 16px 30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 11.5, letterSpacing: "0.1em", color: "var(--muted-lilac)" }}>
          <span>ON THE GATE: {volunteer.toUpperCase()}</span>
          <button
            onClick={async () => {
              await fetch("/api/gate/logout", { method: "POST" });
              setVolunteer(null);
            }}
            style={{ background: "none", border: "none", color: "var(--pink)", fontSize: 11.5, letterSpacing: "0.1em", cursor: "pointer", padding: 0 }}
          >
            SIGN OUT
          </button>
        </div>

        <button
          onClick={() => setManualOpen((v) => !v)}
          className="font-display mz-pop"
          style={{
            marginTop: 14,
            width: "100%",
            fontSize: 14,
            color: "var(--ink)",
            background: "var(--lilac)",
            border: "3px solid var(--ink)",
            borderRadius: 18,
            boxShadow: "5px 5px 0 var(--purple)",
            padding: "15px 16px",
            cursor: "pointer",
            ["--mz-shadow" as string]: "5px",
          }}
        >
          {manualOpen ? "HIDE SEARCH" : "PHONE DEAD? FIND BY NAME"}
        </button>

        {manualOpen && <ManualSearch onAdmitted={refreshCounts} onSignedOut={() => setVolunteer(null)} />}
      </div>
    </main>
  );
}

/**
 * The answer, over the whole screen.
 *
 * A volunteer working a queue is not reading; they are glancing. So the mark
 * comes first and large — a tick means the person in front of them walks in,
 * anything else means they do not — with the name under it so the volunteer can
 * say it out loud and the holder can agree that it is theirs. It covers the
 * whole viewport rather than just the camera, because a green strip at the top
 * of a phone in sunlight is not an answer anybody can see.
 *
 * Tapping clears it early: at a busy gate, waiting out an animation is the
 * difference between a queue moving and a queue not.
 */
export function Result({ outcome, onDismiss }: { outcome: Outcome; onDismiss: () => void }) {
  const skin =
    outcome.result === "admitted"
      ? { bg: "#0b7a3b", word: "ENTRY GRANTED", mark: "tick" as const }
      : outcome.result === "already"
        ? { bg: "#b8730a", word: "ALREADY IN", mark: "warn" as const }
        : outcome.result === "void"
          ? { bg: "#8a0b3c", word: "REFUNDED", mark: "cross" as const }
          : { bg: "#a10a0a", word: "NOT OURS", mark: "cross" as const };

  return (
    <div
      role="status"
      aria-live="assertive"
      onClick={onDismiss}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 120,
        background: skin.bg,
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 24,
        gap: 12,
        cursor: "pointer",
      }}
    >
      <Mark kind={skin.mark} />

      <div className="font-display" style={{ fontSize: "clamp(32px, 11vw, 60px)", lineHeight: 1 }}>{skin.word}</div>

      {"ticket" in outcome && (
        <>
          <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2 }}>{outcome.ticket.holderName}</div>
          <div style={{ fontSize: 13, letterSpacing: "0.14em", opacity: 0.92 }}>
            {outcome.ticket.tierLabel.toUpperCase()}
            {outcome.ticket.of > 1 ? ` · ${outcome.ticket.index} OF ${outcome.ticket.of}` : ""} · {outcome.ticket.code}
          </div>
        </>
      )}

      {outcome.result === "already" && (
        <div style={{ fontSize: 14.5, lineHeight: 1.5, maxWidth: "28ch" }}>
          Scanned at {timeOf(outcome.usedAt)}{outcome.usedBy ? ` by ${outcome.usedBy}` : ""}. Your call — send them to the
          fest desk if you aren&rsquo;t sure.
        </div>
      )}
      {outcome.result === "void" && (
        <div style={{ fontSize: 14.5, lineHeight: 1.5, maxWidth: "28ch" }}>
          This pass was refunded. Do not admit — the fest desk can explain it to them.
        </div>
      )}
      {outcome.result === "unknown" && (
        <div style={{ fontSize: 14.5, lineHeight: 1.5, maxWidth: "28ch" }}>
          Not a MADOOZA pass. Send them to the fest desk.
        </div>
      )}

      <div style={{ position: "absolute", bottom: 26, fontSize: 11, letterSpacing: "0.18em", opacity: 0.72 }}>
        TAP TO SCAN THE NEXT ONE
      </div>
    </div>
  );
}

/** The tick, the warning and the cross, drawn big enough to read at arm's length. */
function Mark({ kind }: { kind: "tick" | "warn" | "cross" }) {
  const size = 132;
  const common = {
    fill: "none",
    stroke: "#ffffff",
    strokeWidth: 9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden focusable="false">
      <circle cx="60" cy="60" r="52" fill="rgba(255,255,255,0.14)" />
      <circle cx="60" cy="60" r="52" {...common} strokeWidth={6} opacity={0.55} />
      {kind === "tick" && <path d="M36 62 L53 79 L85 43" {...common} />}
      {kind === "cross" && (
        <>
          <path d="M42 42 L78 78" {...common} />
          <path d="M78 42 L42 78" {...common} />
        </>
      )}
      {kind === "warn" && (
        <>
          <path d="M60 34 L60 68" {...common} />
          <circle cx="60" cy="84" r="5" fill="#ffffff" stroke="none" />
        </>
      )}
    </svg>
  );
}

function SignIn({ pinIsSet, onDone }: { pinIsSet: boolean; onDone: (name: string) => void }) {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/gate/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, volunteer: name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not sign in");
      onDone(data.volunteer);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not sign in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ background: "var(--bg)", minHeight: "100dvh", padding: "40px 18px", color: "var(--lilac)" }}>
      <div style={{ maxWidth: 360, margin: "0 auto" }}>
        <div className="font-display" style={{ fontSize: 26, color: "var(--teal)" }}>MADOOZA GATE</div>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--lilac-text)", margin: "10px 0 22px" }}>
          {pinIsSet
            ? "Your name, and the PIN the fest office gave you this morning."
            : "No gate PIN has been set yet. Somebody needs to set one in the admin panel before this will work."}
        </p>

        <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", marginBottom: 7 }}>YOUR NAME</label>
        <input className="mz-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="So the log knows who scanned" />

        <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", margin: "16px 0 7px" }}>GATE PIN</label>
        <input
          className="mz-input"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          inputMode="numeric"
          autoComplete="off"
          type="password"
          placeholder="4 to 8 digits"
        />

        <button
          onClick={go}
          disabled={busy || !pinIsSet || pin.length < 4}
          className="font-display mz-pop"
          style={{
            marginTop: 20,
            width: "100%",
            fontSize: 15,
            color: "var(--ink)",
            background: "var(--teal)",
            border: "3px solid var(--ink)",
            borderRadius: 18,
            boxShadow: "6px 6px 0 var(--ink)",
            padding: "16px 18px",
            cursor: "pointer",
            opacity: !pinIsSet || pin.length < 4 ? 0.6 : 1,
            ["--mz-shadow" as string]: "6px",
          }}
        >
          {busy ? "CHECKING…" : "START SCANNING"}
        </button>

        {error && <div style={{ color: "var(--pink)", fontSize: 13.5, marginTop: 14 }}>{error}</div>}
      </div>
    </main>
  );
}

function ManualSearch({ onAdmitted, onSignedOut }: { onAdmitted: () => void; onSignedOut: () => void }) {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Ticket[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (q.trim().length < 3) {
      setRows([]);
      return;
    }
    let live = true;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/gate/search?q=${encodeURIComponent(q.trim())}`);
        if (res.status === 401) return onSignedOut();
        const data = await res.json();
        if (live) setRows(data.tickets ?? []);
      } catch {
        /* a failed search just shows nothing */
      }
    }, 250);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [q, onSignedOut]);

  async function admit(ticket: Ticket) {
    const res = await fetch("/api/gate/admit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: ticket.id }),
    });
    if (res.status === 401) return onSignedOut();
    const data: Outcome = await res.json();
    feedback(data.result === "admitted");
    setNote(
      data.result === "admitted"
        ? `${ticket.holderName} let in.`
        : data.result === "already"
          ? `${ticket.holderName} was already admitted at ${timeOf("usedAt" in data ? data.usedAt : null)}.`
          : data.result === "void"
            ? `${ticket.holderName}'s pass was refunded.`
            : "That pass is not one of ours.",
    );
    setRows((list) => list.map((r) => (r.id === ticket.id ? { ...r, status: "used" } : r)));
    onAdmitted();
  }

  return (
    <div style={{ marginTop: 14 }}>
      <input
        className="mz-input"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Name, phone or pass code"
        autoComplete="off"
      />
      {note && <div style={{ fontSize: 13, color: "var(--teal)", marginTop: 10 }}>{note}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
        {rows.map((t) => (
          <div
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              background: "var(--bg)",
              border: "2px solid #4A2A73",
              borderRadius: 14,
              padding: "11px 13px",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{t.holderName}</div>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted-lilac)" }}>
                {t.code}
                {t.of > 1 ? ` · ${t.index}/${t.of}` : ""} · {t.status.toUpperCase()}
              </div>
            </div>
            <button
              onClick={() => admit(t)}
              disabled={t.status !== "valid"}
              className="font-display"
              style={{
                flexShrink: 0,
                fontSize: 12,
                color: "var(--ink)",
                background: t.status === "valid" ? "var(--teal)" : "#6b5292",
                border: "2px solid var(--ink)",
                borderRadius: 12,
                padding: "10px 13px",
                cursor: t.status === "valid" ? "pointer" : "not-allowed",
              }}
            >
              {t.status === "valid" ? "LET IN" : "USED"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
