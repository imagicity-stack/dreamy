"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  createPaymentOrder,
  loadRazorpayScript,
  RazorpayOptions,
  RazorpaySuccessResponse,
  verifyPayment,
} from "@/lib/razorpay";

const TICKET_UNIT_PRICE = 480;

interface TicketModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TicketModal({ open, onClose }: TicketModalProps) {
  const [processing, setProcessing] = useState(false);
  const [additional, setAdditional] = useState<Array<{ id: number }>>([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const { body } = document;
    const prev = body.style.overflow;
    if (open) {
      body.style.overflow = "hidden";
      return () => {
        body.style.overflow = prev;
      };
    }
    body.style.overflow = prev;
    return () => {
      body.style.overflow = prev;
    };
  }, [open]);

  const handleClose = () => {
    setProcessing(false);
    setAdditional([]);
    onClose();
  };

  const addHolder = () => {
    const next = idRef.current;
    idRef.current += 1;
    setAdditional((p) => [...p, { id: next }]);
  };

  const removeHolder = (id: number) =>
    setAdditional((p) => p.filter((t) => t.id !== id));

  const count = 1 + additional.length;
  const total = count * TICKET_UNIT_PRICE;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (processing) return;
    const form = e.currentTarget;
    setProcessing(true);

    const fd = new FormData(form);
    const get = (k: string) => fd.get(k)?.toString().trim() ?? "";

    const additionalNames = additional
      .map((t) => get(`additionalTicketName-${t.id}`))
      .filter((n) => n.length > 0);
    const c = 1 + additionalNames.length;
    const t = c * TICKET_UNIT_PRICE;

    const details = {
      name: get("name"),
      email: get("email"),
      phone: get("phone"),
      ticketCount: c.toString(),
      ticketHolders: [get("name"), ...additionalNames],
      totalAmount: t,
      message: get("message"),
      termsAccepted: fd.get("terms") === "accepted",
      timestamp: new Date().toISOString(),
      unitPrice: TICKET_UNIT_PRICE,
      additionalTicketNames: additionalNames,
    };

    try {
      const orderConfig = await createPaymentOrder(
        "ticket",
        { ...details, formType: "ticket" },
        c,
      );

      const ok = await loadRazorpayScript();
      if (!ok || typeof window === "undefined" || !window.Razorpay) {
        throw new Error("Unable to load payment gateway. Please refresh and try again.");
      }

      let completed = false;
      const opts: RazorpayOptions = {
        key: orderConfig.razorpayKeyId,
        amount: orderConfig.amount,
        currency: orderConfig.currency,
        name: "Madooza Event Pass",
        description: "Ticket Purchase",
        prefill: { name: details.name, email: details.email, contact: details.phone },
        notes: {
          formType: "ticket",
          quantity: c.toString(),
          unitPrice: TICKET_UNIT_PRICE.toString(),
          totalAmount: t.toString(),
          displayName: "Madooza Event Pass",
        },
        config: {
          branding: {
            brand_name: "Madooza Event Pass",
            company_name: "Madooza Event Pass",
          },
        },
        handler: async (resp: RazorpaySuccessResponse) => {
          completed = true;
          const ver = await verifyPayment({
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_order_id: resp.razorpay_order_id,
            razorpay_signature: resp.razorpay_signature,
            formData: { ...details, formType: "ticket", quantity: c },
          });
          if (!ver.success) {
            completed = false;
            alert(ver.message ?? "Payment verification failed. Please contact support.");
            return;
          }
          form.reset();
          handleClose();
          const ref = resp.razorpay_payment_id ? ` Reference: ${resp.razorpay_payment_id}` : "";
          alert(
            `Payment successful! Your ${
              c === 1 ? "event pass is confirmed." : `${c} event passes are confirmed.`
            }${ref}`,
          );
        },
        modal: {
          ondismiss: () => {
            if (!completed) {
              alert("Payment popup closed before completion. Please try again.");
            }
          },
        },
      };
      if (orderConfig.orderId) opts.order_id = orderConfig.orderId;
      const razorpay = new window.Razorpay(opts);
      razorpay.on("payment.failed", () => {
        completed = false;
        alert("Payment failed. Please try again.");
      });
      razorpay.open();
    } catch (err) {
      console.error("Ticket error:", err);
      alert(err instanceof Error ? err.message : "Unexpected error. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8">
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-2xl">
        <div className="pointer-events-none absolute -inset-6 -z-10 opacity-60 blur-3xl bg-[var(--cyan)]" aria-hidden />
        <div
          className="relative flex max-h-[calc(100vh-4rem)] flex-col overflow-hidden border-2 border-black bg-[var(--ink-2)] text-white"
          style={{ boxShadow: "10px 10px 0 var(--magenta)" }}
        >
          <button
            type="button"
            onClick={handleClose}
            className="mobile-tap absolute top-4 right-4 z-20 text-[var(--acid)] hover:text-white transition-colors"
            aria-label="Close ticket form"
          >
            <X size={26} strokeWidth={2.5} />
          </button>

          <form
            onSubmit={handleSubmit}
            className="relative z-10 flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-10 sm:px-10"
          >
            <div className="text-center">
              <span className="sticker sticker-cyan">Step into Madooza</span>
              <h2 className="mt-3 font-bowlby text-4xl sm:text-5xl uppercase text-[var(--acid)]">
                Get Your Passes
              </h2>
              <p className="mt-3 text-sm text-white/75">
                Drop your details. We confirm tickets the second the payment lands.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-xs font-montserrat tracking-[0.15em] uppercase text-white/80">
                Full Name *
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full bg-white px-4 py-3 text-sm text-[var(--ink)] border-2 border-black focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]"
                  placeholder="Enter your full name"
                />
              </label>
              <label className="flex flex-col gap-2 text-xs font-montserrat tracking-[0.15em] uppercase text-white/80">
                Email *
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-white px-4 py-3 text-sm text-[var(--ink)] border-2 border-black focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]"
                  placeholder="your.email@example.com"
                />
              </label>
              <label className="flex flex-col gap-2 text-xs font-montserrat tracking-[0.15em] uppercase text-white/80">
                Phone *
                <input
                  type="tel"
                  name="phone"
                  required
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  minLength={10}
                  title="Enter a 10-digit phone number"
                  className="w-full bg-white px-4 py-3 text-sm text-[var(--ink)] border-2 border-black focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]"
                  placeholder="9876543210"
                />
              </label>
              <div className="flex flex-col gap-3 sm:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-montserrat tracking-[0.15em] uppercase text-white/80">
                    Additional Tickets
                  </span>
                  <button
                    type="button"
                    onClick={addHolder}
                    className="border-2 border-[var(--cyan)] px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-[var(--cyan)] hover:bg-[var(--cyan)] hover:text-[var(--ink)] transition-colors"
                  >
                    + Add
                  </button>
                </div>
                {additional.length === 0 ? (
                  <p className="text-xs text-white/55">
                    Primary ticket uses the full name above. Add extras for friends.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {additional.map((t, idx) => (
                      <div key={t.id} className="flex flex-col gap-2 sm:flex-row">
                        <input
                          type="text"
                          name={`additionalTicketName-${t.id}`}
                          required
                          className="w-full bg-white px-4 py-3 text-sm text-[var(--ink)] border-2 border-black focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]"
                          placeholder={`Ticket ${idx + 2} Name`}
                        />
                        <button
                          type="button"
                          onClick={() => removeHolder(t.id)}
                          className="border-2 border-white/40 px-3 py-2 text-[0.65rem] uppercase tracking-[0.2em] text-white hover:bg-white/10"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <label className="flex flex-col gap-2 text-xs font-montserrat tracking-[0.15em] uppercase text-white/80">
              Special Requests *
              <textarea
                name="message"
                rows={3}
                required
                className="w-full resize-none bg-white px-4 py-3 text-sm text-[var(--ink)] border-2 border-black focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]"
                placeholder="Anything we should know?"
              />
            </label>

            <div className="border-2 border-[var(--acid)] bg-[var(--ink-3)] px-4 py-4 flex items-center justify-between">
              <div>
                <p className="font-montserrat text-[0.65rem] uppercase tracking-[0.3em] text-white/60">
                  Total
                </p>
                <p className="font-bowlby text-3xl text-[var(--acid)]">
                  ₹{total}
                </p>
              </div>
              <div className="text-right">
                <p className="font-montserrat text-[0.65rem] uppercase tracking-[0.3em] text-white/60">
                  {count} {count === 1 ? "Pass" : "Passes"}
                </p>
                <p className="text-xs text-white/70">@ ₹{TICKET_UNIT_PRICE} ea.</p>
              </div>
            </div>

            <label className="flex items-start gap-3 text-xs text-white/75">
              <input
                type="checkbox"
                name="terms"
                value="accepted"
                required
                className="mt-1 h-5 w-5 accent-[var(--cyan)]"
              />
              <span>
                I accept the{" "}
                <Link
                  href="/terms-and-conditions"
                  className="text-[var(--acid)] underline-offset-4 hover:underline"
                >
                  terms and conditions
                </Link>
              </span>
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={processing}
                className="btn-acid flex-1 justify-center text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {processing ? "Processing…" : `Pay ₹${total} & Book`}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="border-2 border-white/40 px-6 py-3 text-xs font-montserrat tracking-[0.2em] uppercase text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
