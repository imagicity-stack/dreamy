"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import * as ui from "./adminUi";

/**
 * Posts the email and password to our own server, which does the Firebase work
 * and sets an HttpOnly cookie. Nothing Firebase-shaped runs in this file.
 */
export default function SignInCard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Could not sign in");
        return;
      }
      setPassword("");
      router.refresh();
    } catch {
      setError("Could not reach the server");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ ...ui.card, maxWidth: 440 }}>
      <div style={ui.kicker}>COUNCIL ACCESS</div>
      <h2 className="font-display" style={{ fontSize: 24, margin: "10px 0 6px" }}>SIGN IN</h2>
      <p style={{ fontSize: 14.5, lineHeight: 1.55, margin: "0 0 18px", color: "#5B4480" }}>
        The Firebase account that&apos;s on the admin list.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={ui.label} htmlFor="admin-email">EMAIL</label>
          <input
            id="admin-email"
            className="mz-input"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label style={ui.label} htmlFor="admin-password">PASSWORD</label>
          <input
            id="admin-password"
            className="mz-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div style={{ fontSize: 13.5, color: "var(--crimson)" }}>{error}</div>}
        <button type="submit" className="font-display mz-pop" style={ui.primaryButton} disabled={busy}>
          {busy ? "CHECKING…" : "OPEN THE PANEL"}
        </button>
      </div>
    </form>
  );
}
