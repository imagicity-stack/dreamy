import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import {
  COLLECTION_BY_FORM,
  PaymentRecordPayload,
} from "@/lib/payment-records-shared";

export const recordPaymentServer = async (
  payload: PaymentRecordPayload,
): Promise<void> => {
  if (!isFirebaseAdminConfigured()) {
    console.warn("Firebase Admin is not configured; skipping payment record.");
    return;
  }

  const db = getAdminFirestore();

  if (!db) {
    console.warn("Firestore Admin is unavailable; skipping payment record.");
    return;
  }

  const collectionName = COLLECTION_BY_FORM[payload.formType];

  await db.collection(collectionName).add({
    formType: payload.formType,
    paymentId: payload.paymentId ?? null,
    orderId: payload.orderId ?? null,
    signature: payload.signature ?? null,
    amount: payload.amount,
    currency: payload.currency,
    details: payload.details,
    createdAt: FieldValue.serverTimestamp(),
  });
};
