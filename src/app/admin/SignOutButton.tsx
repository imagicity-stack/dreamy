"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import * as ui from "./adminUi";

export default function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      style={ui.quietButton}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/admin/logout", { method: "POST" });
        router.refresh();
      }}
    >
      {busy ? "SIGNING OUT…" : "SIGN OUT"}
    </button>
  );
}
