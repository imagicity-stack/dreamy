const RAZORPAY_SCRIPT_ID = "razorpay-checkout-js";
const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";
const DEFAULT_PAYMENT_API_BASE_URL = "https://madooza-back-production.up.railway.app";
const PAYMENT_PROXY_BASE_PATH = "/api/payment/orders";

const PAYMENT_API_BASE_URL =
  process.env.NEXT_PUBLIC_PAYMENT_API_BASE_URL ?? DEFAULT_PAYMENT_API_BASE_URL;

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency?: string;
  name?: string;
  description?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayInstance {
  open(): void;
  on(event: string, handler: (response: unknown) => void): void;
  close(): void;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export async function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  if (typeof window.Razorpay !== "undefined") {
    return true;
  }

  if (document.getElementById(RAZORPAY_SCRIPT_ID)) {
    return new Promise((resolve) => {
      const existingScript = document.getElementById(RAZORPAY_SCRIPT_ID);
      if (existingScript?.getAttribute("data-loaded") === "true") {
        resolve(true);
      } else {
        existingScript?.addEventListener("load", () => resolve(true));
        existingScript?.addEventListener("error", () => resolve(false));
      }
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.id = RAZORPAY_SCRIPT_ID;
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => {
      script.setAttribute("data-loaded", "true");
      resolve(true);
    };
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface CreatePaymentOrderPayload {
  amount: number;
  formData: Record<string, unknown>;
  [key: string]: unknown;
}

export interface PaymentOrderConfig {
  orderId: string;
  razorpayKeyId: string;
  amount: number;
  currency: string;
}

function normalizeCurrency(currency: unknown, fallback = "INR"): string {
  if (typeof currency === "string" && currency.trim().length > 0) {
    return currency.toUpperCase();
  }
  return fallback;
}

function getPaymentEndpoint(formType: string): string {
  if (typeof window === "undefined") {
    return `${PAYMENT_API_BASE_URL}/api/orders/${formType}`;
  }

  return `${PAYMENT_PROXY_BASE_PATH}/${formType}`;
}

export async function createPaymentOrder(
  formType: string,
  payload: CreatePaymentOrderPayload
): Promise<PaymentOrderConfig> {
  let response: Response;

  try {
    response = await fetch(getPaymentEndpoint(formType), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Unable to reach payment service. Please check your connection and try again.");
  }

  let data: Record<string, unknown> | null = null;

  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      (typeof data?.message === "string" && data.message.trim().length > 0
        ? data.message
        : "Failed to create payment order. Please try again.");
    throw new Error(message);
  }

  const orderId =
    (typeof data?.orderId === "string" && data.orderId) ||
    (typeof (data as { order_id?: string })?.order_id === "string" && (data as { order_id?: string }).order_id) ||
    (typeof (data as { id?: string })?.id === "string" && (data as { id?: string }).id) ||
    (typeof (data as { order?: { id?: string } })?.order?.id === "string" && (data as { order?: { id?: string } }).order?.id) ||
    "";

  const razorpayKeyId =
    (typeof (data as { razorpayKeyId?: string })?.razorpayKeyId === "string" && (data as { razorpayKeyId?: string }).razorpayKeyId) ||
    (typeof (data as { keyId?: string })?.keyId === "string" && (data as { keyId?: string }).keyId) ||
    (typeof (data as { key?: string })?.key === "string" && (data as { key?: string }).key) ||
    (typeof (data as { razorpay_key_id?: string })?.razorpay_key_id === "string" && (data as { razorpay_key_id?: string }).razorpay_key_id) ||
    "";

  const rawAmount =
    (typeof (data as { amount?: number })?.amount === "number" && (data as { amount?: number }).amount) ||
    (typeof (data as { order?: { amount?: number } })?.order?.amount === "number" && (data as { order?: { amount?: number } }).order?.amount) ||
    payload.amount;

  const amount = Number.isFinite(rawAmount) ? rawAmount : payload.amount;
  const currency = normalizeCurrency((data as { currency?: string })?.currency ?? (data as { order?: { currency?: string } })?.order?.currency);

  if (!orderId || !razorpayKeyId) {
    throw new Error("Invalid payment configuration returned from server.");
  }

  return {
    orderId,
    razorpayKeyId,
    amount,
    currency,
  };
}
