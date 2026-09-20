import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { deleteMedia, uploadMedia } from "@/lib/media";

export const dynamic = "force-dynamic";

/** Takes a file from the panel and puts it in the storage bucket. */
export async function POST(req: Request) {
  const check = await requireAdmin();
  if ("response" in check) return check.response;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file was uploaded" }, { status: 400 });
  }

  const result = await uploadMedia(file, String(form?.get("folder") ?? "uploads"));
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ media: result.media });
}

/** Removes an uploaded image the panel no longer references. */
export async function DELETE(req: Request) {
  const check = await requireAdmin();
  if ("response" in check) return check.response;

  const body = await req.json().catch(() => null);
  const path = String(body?.path ?? "");
  if (!path) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  await deleteMedia(path);
  return NextResponse.json({ ok: true });
}
