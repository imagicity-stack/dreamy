import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase";

export type PaymentFormType = "ticket" | "cosplay" | "stall";

const COLLECTION_BY_FORM: Record<PaymentFormType, string> = {
  ticket: "ticketPayments",
  cosplay: "cosplayPayments",
  stall: "stallPayments",
};

export interface PaymentRecordPayload {
  formType: PaymentFormType;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  amount: number;
  currency: string;
  details: Record<string, unknown>;
}

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
