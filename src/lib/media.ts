import { randomUUID } from "crypto";
import { getStorage } from "firebase-admin/storage";
import { getAdminApp } from "./firebaseAdmin";

/**
 * Images the council uploads from the panel live in the project's Firebase
 * Storage bucket. Uploading happens on the server with the Admin SDK — the
 * browser posts the file to our own route and never talks to Firebase.
 */

const MAX_BYTES = 8 * 1024 * 1024;

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export type StoredMedia = {
  /** Object path inside the bucket — what we keep in Firestore. */
  path: string;
  /** Public download URL the site renders. */
  url: string;
  contentType: string;
  size: number;
};

export function getBucket() {
  const app = getAdminApp();
  const name = process.env.FIREBASE_STORAGE_BUCKET;
  if (!app || !name) return null;
  try {
    return getStorage(app).bucket(name);
  } catch {
    return null;
  }
}

export function mediaConfigured(): boolean {
  return getBucket() !== null;
}

function safeSlug(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "image"
  );
}

export type UploadResult = { ok: true; media: StoredMedia } | { ok: false; status: number; error: string };

/**
 * Stores one image and returns a URL that works without making the bucket
 * public: the object carries a download token, the same mechanism the Firebase
 * client SDKs use, so uniform bucket-level access and strict Storage rules
 * both stay as they are.
 */
export async function uploadMedia(file: File, folder: string): Promise<UploadResult> {
  const bucket = getBucket();
  if (!bucket) {
    return { ok: false, status: 503, error: "FIREBASE_STORAGE_BUCKET is not set on the server" };
  }

  const contentType = file.type || "application/octet-stream";
  const extension = ALLOWED[contentType];
  if (!extension) {
    return { ok: false, status: 415, error: "That file type isn't allowed. Use JPEG, PNG, WebP, AVIF or GIF." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, status: 413, error: "That image is over 8MB. Shrink it and try again." };
  }

  const cleanFolder = folder.replace(/[^a-z0-9-]/gi, "") || "uploads";
  const path = `${cleanFolder}/${safeSlug(file.name)}-${randomUUID().slice(0, 8)}.${extension}`;
  const token = randomUUID();

  const buffer = Buffer.from(await file.arrayBuffer());
  await bucket.file(path).save(buffer, {
    contentType,
    resumable: false,
    metadata: {
      cacheControl: "public, max-age=31536000, immutable",
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });

  return {
    ok: true,
    media: { path, url: mediaUrl(bucket.name, path, token), contentType, size: file.size },
  };
}

function mediaUrl(bucketName: string, path: string, token: string): string {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
}

/** Removes an uploaded object. Missing files are not an error. */
export async function deleteMedia(path: string): Promise<boolean> {
  const bucket = getBucket();
  if (!bucket || !path) return false;
  try {
    await bucket.file(path).delete({ ignoreNotFound: true });
    return true;
  } catch {
    return false;
  }
}
