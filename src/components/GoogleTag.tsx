"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { Suspense, useEffect, useRef } from "react";
import { GA_ID } from "@/lib/gtag";

/**
 * The Google tag, and the page_view it owes on every page.
 *
 * Google's snippet sends one page_view when gtag('config') runs, which is
 * right for a site of separate documents and wrong for this one: moving
 * between pages here is a client-side navigation and the document never
 * reloads. Left alone, a visitor who lands on the home page and reads four
 * more is recorded as having seen one.
 *
 * So the first page_view comes from config and every later one is sent by
 * hand, with the new path spelled out — gtag would otherwise still be
 * reporting the URL the page was opened at.
 */
function GoogleRoutes() {
  const pathname = usePathname();
  const search = useSearchParams();
  // config already counted the page it loaded on.
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    // Next sets the document title in an effect of its own, after the route
    // has changed. Reading it straight away therefore reports an empty title
    // and fills GA's reports with blanks, so the event waits a beat — and is
    // cancelled if the visitor has already moved on again.
    const timer = setTimeout(() => {
      const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
      try {
        gtag?.("event", "page_view", {
          page_path: pathname + (search?.toString() ? `?${search}` : ""),
          page_location: window.location.href,
          page_title: document.title,
        });
      } catch {
        /* measurement is never worth an error */
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [pathname, search]);

  return null;
}

export default function GoogleTag() {
  if (!GA_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-tag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
      {/* useSearchParams needs a boundary, and this one renders nothing. */}
      <Suspense fallback={null}>
        <GoogleRoutes />
      </Suspense>
    </>
  );
}
