export type PaymentFormType = "ticket" | "cosplay" | "stall" | "performer";

export const COLLECTION_BY_FORM: Record<PaymentFormType, string> = {
  ticket: "ticketPayments",
  cosplay: "cosplayPayments",
  stall: "stallPayments",
  performer: "performerPayments",
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
