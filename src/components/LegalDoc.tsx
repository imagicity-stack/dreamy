import Link from "next/link";
import {
  HOST_ADDRESS,
  HOST_NAME,
  LEGAL_PAGES,
  ORGANIZER_NAME,
  ORGANIZER_ROLE,
  type LegalDoc as Doc,
} from "@/lib/legal";

/**
 * The shared shell for the privacy, terms and refund pages: the same hero, the
 * same numbered sections, the same "who is behind this" strip, so the three
 * pages read as one document in three parts rather than three near-misses.
 */
export default function LegalDoc({
  doc,
  contactEmail,
  contactPhone,
}: {
  doc: Doc;
  contactEmail: string;
  contactPhone: string;
}) {
  return (
    <main>
      <section style={{ background: "var(--bg)", padding: "54px 20px 40px", borderBottom: "3px solid var(--ink)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--teal)" }}>{doc.eyebrow}</div>
          <h1
            className="font-display"
            style={{ fontSize: "clamp(30px, 6vw, 60px)", lineHeight: 1.02, margin: "14px 0 16px", color: "var(--lilac)" }}
          >
            {doc.title}
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--lilac-text)", maxWidth: "58ch", margin: 0 }}>
            {doc.intro}
          </p>
          <div style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--muted-lilac)", marginTop: 18 }}>
            LAST UPDATED · {doc.updated.toUpperCase()}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--paper)", padding: "40px 20px 64px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* Who is behind the fest, stated on every legal page rather than on one. */}
          <div
            style={{
              background: "var(--purple)",
              border: "3px solid var(--ink)",
              borderRadius: 20,
              boxShadow: "8px 8px 0 var(--ink)",
              padding: "22px 24px",
              color: "var(--lilac)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 20,
            }}
          >
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--teal)", marginBottom: 8 }}>
                HOSTED BY
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.6 }}>
                {HOST_NAME}
                <br />
                <span style={{ color: "#D9C5F0" }}>{HOST_ADDRESS}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--teal)", marginBottom: 8 }}>
                {ORGANIZER_ROLE.toUpperCase()}
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.6 }}>
                {ORGANIZER_NAME}
                <br />
                <span style={{ color: "#D9C5F0" }}>Organises and operates MADOOZA</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--teal)", marginBottom: 8 }}>
                REACH US
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.6 }}>
                <a href={`mailto:${contactEmail}`} style={{ color: "var(--teal)" }}>
                  {contactEmail}
                </a>
                <br />
                <span style={{ color: "#D9C5F0" }}>{contactPhone}</span>
              </div>
            </div>
          </div>

          <article style={{ marginTop: 34 }}>
            {doc.sections.map((section) => (
              <section key={section.id} id={section.id} style={{ marginBottom: 30, scrollMarginTop: 90 }}>
                <h2
                  className="font-display"
                  style={{ fontSize: "clamp(19px, 3.2vw, 24px)", lineHeight: 1.2, color: "var(--purple)", margin: "0 0 12px" }}
                >
                  {section.heading}
                </h2>
                {section.blocks.map((block, i) =>
                  block.kind === "p" ? (
                    <p
                      key={i}
                      style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink)", margin: "0 0 12px", maxWidth: "70ch" }}
                    >
                      {block.text}
                    </p>
                  ) : (
                    <ul
                      key={i}
                      style={{ margin: "0 0 12px", padding: "0 0 0 20px", maxWidth: "70ch", listStyle: "square" }}
                    >
                      {block.items.map((item, j) => (
                        <li key={j} style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink)", marginBottom: 8 }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ),
                )}
              </section>
            ))}
          </article>

          <div
            style={{
              background: "var(--teal)",
              border: "3px solid var(--ink)",
              borderRadius: 20,
              boxShadow: "8px 8px 0 var(--ink)",
              padding: "26px 24px",
              color: "var(--ink)",
            }}
          >
            <h3 className="font-display" style={{ fontSize: 20, margin: "0 0 8px" }}>
              {doc.contactTitle}
            </h3>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: 0, maxWidth: "62ch" }}>{doc.contactBody}</p>
          </div>

          {/* The other two documents, so a reader never has to go back to the footer. */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 26 }}>
            {LEGAL_PAGES.filter((p) => p.key !== doc.key).map((page) => (
              <Link
                key={page.key}
                href={page.href}
                className="mz-pop font-display"
                style={{
                  fontSize: 13,
                  color: "var(--lilac)",
                  background: "var(--purple)",
                  border: "3px solid var(--ink)",
                  borderRadius: 18,
                  boxShadow: "6px 6px 0 var(--ink)",
                  padding: "13px 18px",
                  ["--mz-shadow" as string]: "6px",
                }}
              >
                {page.label.toUpperCase()} →
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
