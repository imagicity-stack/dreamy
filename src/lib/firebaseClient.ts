"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

/** Whether the browser has enough config to talk to Firebase Auth at all. */
export const firebaseClientReady = Boolean(config.apiKey && config.authDomain && config.projectId);

let app: FirebaseApp | null = null;

/**
 * Firebase Auth in the browser. This is the public web config, not the service
 * account — the admin credentials never leave the server.
 */
export function getClientAuth(): Auth | null {
  if (!firebaseClientReady) return null;
  app ??= getApps().length ? getApp() : initializeApp(config);
  return getAuth(app);
}
