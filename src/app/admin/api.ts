/**
 * Every admin call carries the session cookie and the server re-checks it, so
 * nothing here holds a token or a credential.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function api(url: string, init?: RequestInit): Promise<any> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? "Something went wrong");
  return data;
}

/** Multipart upload — no Content-Type header, the browser sets the boundary. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function upload(file: File, folder: string): Promise<any> {
  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder);
  const res = await fetch("/api/admin/media", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? "Could not upload that");
  return data.media;
}

export function message(e: unknown, fallback: string): string {
  return e instanceof Error ? e.message : fallback;
}
