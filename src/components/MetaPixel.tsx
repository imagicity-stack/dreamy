"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { Suspense, useEffect, useRef } from "react";
import { PIXEL_ID } from "@/lib/pixel";

/**
 * The pixel's base code, and the PageView it owes on every page.
 *
 * The snippet Meta hands out fires PageView once, on load. That is correct for
 * a site of separate documents and wrong for this one: moving between pages
 * here is a client-side navigation, the document never reloads, and a visitor
 * who lands on the home page and reads four more would be recorded as having
 * seen one. So the first PageView comes from the snippet and every later one
 * from the route changing.
 */
function PixelRoutes() {
  const pathname = usePathname();
  const search = useSearchParams();
  // The snippet's own init already counted the page it loaded on.
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
    try {
      fbq?.("track", "PageView");
    } catch {
      /* measurement is never worth an error */
    }
  }, [pathname, search]);

  return null;
}

export default function MetaPixel() {
  if (!PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
      {/* useSearchParams needs a boundary, and this one renders nothing. */}
      <Suspense fallback={null}>
        <PixelRoutes />
      </Suspense>
    </>
  );
}
