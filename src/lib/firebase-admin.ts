import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId =
  process.env.FIREBASE_ADMIN_PROJECT_ID ??
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
  "";
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL ?? "";
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n") ?? "";

const hasAdminConfig =
  projectId.trim().length > 0 &&
  clientEmail.trim().length > 0 &&
  privateKey.trim().length > 0;

export const isFirebaseAdminConfigured = (): boolean => hasAdminConfig;

export const getFirebaseAdminApp = () => {
  if (!hasAdminConfig) {
    return null;
  }

  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  return getApps()[0] ?? null;
};

export const getAdminFirestore = () => {
  const app = getFirebaseAdminApp();
  return app ? getFirestore(app) : null;
};
