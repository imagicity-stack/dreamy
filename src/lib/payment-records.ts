import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase";
import {
  COLLECTION_BY_FORM,
  PaymentRecordPayload,
} from "@/lib/payment-records-shared";

export type { PaymentFormType, PaymentRecordPayload } from "@/lib/payment-records-shared";

export const recordPayment = async (
  payload: PaymentRecordPayload,
): Promise<void> => {
  if (!isFirebaseConfigured()) {
    console.warn("Firebase is not configured; skipping payment record.");
    return;
  }

  const db = getFirestoreDb();

  if (!db) {
    console.warn("Firestore is unavailable; skipping payment record.");
    return;
  }

  const collectionName = COLLECTION_BY_FORM[payload.formType];

  await addDoc(collection(db, collectionName), {
    formType: payload.formType,
    paymentId: payload.paymentId ?? null,
    orderId: payload.orderId ?? null,
    signature: payload.signature ?? null,
    amount: payload.amount,
    currency: payload.currency,
    details: payload.details,
    createdAt: serverTimestamp(),
  });
};
