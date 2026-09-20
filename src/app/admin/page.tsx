import Link from "next/link";
import { adminGate } from "@/lib/adminAuth";
import { CONTENT } from "@/lib/content";
import { COPY_GROUPS } from "@/lib/copyText";
import { mediaConfigured } from "@/lib/media";
import { PAGES } from "@/lib/settings";
import AdminPanel from "./AdminPanel";
import SignInCard from "./SignInCard";
import SignOutButton from "./SignOutButton";
import * as ui from "./adminUi";

export const dynamic = "force-dynamic";

/**
 * The gate runs on the server, so a visitor who isn't an admin never receives
 * the panel at all — not its data, not even its markup.
 */
export default async function AdminPage() {
  const gate = await adminGate();

  if (gate.status === "not-configured") {
    return (
      <Shell>
        <div style={ui.card}>
          <div style={ui.kicker}>NOT CONFIGURED</div>
          <h2 className="font-display" style={{ fontSize: 22, margin: "10px 0 12px" }}>
            THE SERVER ISN&apos;T SET UP YET
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.6, margin: "0 0 12px" }}>
            Still needed in the deployment&apos;s environment variables:
          </p>
          <ul style={{ fontSize: 15, lineHeight: 1.7, margin: 0, paddingLeft: 20 }}>
            {gate.missing.map((item) => (
              <li key={item}><code>{item}</code></li>
            ))}
          </ul>
        </div>
      </Shell>
    );
  }

  if (gate.status === "signed-out") {
    return (
      <Shell>
        <SignInCard />
      </Shell>
    );
  }

  if (gate.status === "denied") {
    return (
      <Shell>
        <div style={ui.card}>
          <div style={ui.kicker}>NO ENTRY</div>
          <h2 className="font-display" style={{ fontSize: 22, margin: "10px 0 12px" }}>{gate.reason}</h2>
          <p style={{ fontSize: 15, lineHeight: 1.6, margin: "0 0 18px" }}>
            Add the address to <code>ADMIN_EMAILS</code>, or sign in with one that&apos;s already on the list.
          </p>
          <SignOutButton />
        </div>
      </Shell>
    );
  }

  // content.ts and settings.ts both reach for firebase-admin, so the lists are
  // flattened here on the server and handed to the panel as plain data.
  return (
    <Shell email={gate.user.email}>
      <AdminPanel
        collections={CONTENT.map((c) => ({ key: c.key, title: c.title }))}
        pages={PAGES.map((p) => ({ key: p.key, label: p.label }))}
        copyGroups={COPY_GROUPS.map((g) => ({ key: g.key, title: g.title }))}
        mediaReady={mediaConfigured()}
      />
    </Shell>
  );
}

function Shell({ children, email }: { children: React.ReactNode; email?: string }) {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", padding: "28px 20px 70px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            flexWrap: "wrap",
            marginBottom: 26,
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.24em", color: "var(--teal)" }}>
              MADOOZA &middot; STAFF ONLY
            </div>
            <h1 className="font-display" style={{ fontSize: "clamp(26px, 5vw, 40px)", margin: "10px 0 0", color: "var(--lilac)" }}>
              THE CONTROL ROOM
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <Link href="/" style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.14em", color: "var(--muted-lilac)" }}>
              &larr; BACK TO THE SITE
            </Link>
            {email && (
              <>
                <span style={{ fontSize: 12.5, color: "var(--muted-lilac)" }}>{email}</span>
                <SignOutButton />
              </>
            )}
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
