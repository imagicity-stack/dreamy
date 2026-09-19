import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let app: App | null = null;
let db: Firestore | null = null;

/**
 * Lazily initializes the Firebase Admin app from env vars set on Vercel.
 * Returns null (instead of throwing) when the project hasn't configured
 * Firebase yet, so routes can degrade to "not configured" responses
 * rather than crashing the whole request.
 */
export function getAdminApp(): App | null {
  if (app) return app;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) return null;

  app =
    getApps()[0] ??
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });

  return app;
}

export function getDb(): Firestore | null {
  if (db) return db;
  const adminApp = getAdminApp();
  if (!adminApp) return null;
  db = getFirestore(adminApp);
  return db;
}
