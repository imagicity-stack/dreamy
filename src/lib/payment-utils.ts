import type { PaymentFormType } from "@/lib/payment-records-shared";

export const UNIT_PRICES: Record<PaymentFormType, number> = {
  ticket: 480,
  cosplay: 420,
  stall: 3600,
  performer: 240,
};

export const normalizeQuantity = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(1, Math.trunc(value));
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) {
      return Math.max(1, parsed);
    }
  }

  return 1;
};

export const calculateTotalAmount = (
  formType: PaymentFormType,
  quantity: number,
): number => UNIT_PRICES[formType] * quantity;

export const toPaiseAmount = (amountInRupees: number): number =>
  Math.round(amountInRupees * 100);
