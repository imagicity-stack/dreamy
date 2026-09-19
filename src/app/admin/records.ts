/** What the panel shows for each Firestore collection it can read. */

export type Row = Record<string, unknown>;

export type Column = {
  label: string;
  get: (row: Row) => string;
};

function path(row: Row, dotted: string): unknown {
  return dotted.split(".").reduce<unknown>((value, key) => {
    if (value && typeof value === "object") return (value as Row)[key];
    return undefined;
  }, row);
}

function text(row: Row, dotted: string): string {
  const value = path(row, dotted);
  if (value === undefined || value === null || value === "") return "—";
  return String(value);
}

function money(row: Row, dotted: string): string {
  const value = Number(path(row, dotted));
  return Number.isFinite(value) ? "₹" + value.toLocaleString("en-IN") : "—";
}

/** Firestore timestamps arrive as ISO strings from the API. */
function when(row: Row): string {
  const value = path(row, "createdAt");
  if (typeof value !== "string") return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export type RecordView = {
  key: "passes" | "cosplayEntries" | "concertInterest" | "merchOrders";
  title: string;
  blurb: string;
  columns: Column[];
};

export const RECORD_VIEWS: RecordView[] = [
  {
    key: "passes",
    title: "Passes sold",
    blurb: "Every verified Fete Pass payment, newest first.",
    columns: [
      { label: "WHEN", get: when },
      { label: "PASS CODE", get: (r) => text(r, "passCode") },
      { label: "NAME", get: (r) => text(r, "buyer.name") },
      { label: "SCHOOL", get: (r) => text(r, "buyer.school") },
      { label: "PHONE", get: (r) => text(r, "buyer.phone") },
      { label: "QTY", get: (r) => text(r, "qty") },
      { label: "PAID", get: (r) => money(r, "total") },
      { label: "PAYMENT", get: (r) => text(r, "razorpay.paymentId") },
    ],
  },
  {
    key: "cosplayEntries",
    title: "Cosplay entries",
    blurb: "Paid arena entries — solo walks and squads.",
    columns: [
      { label: "WHEN", get: when },
      { label: "NAME", get: (r) => text(r, "name") },
      { label: "CHARACTER", get: (r) => text(r, "character") },
      { label: "CATEGORY", get: (r) => text(r, "category") },
      { label: "MODE", get: (r) => text(r, "mode") },
      { label: "TEAM", get: (r) => text(r, "team") },
      { label: "SCHOOL", get: (r) => text(r, "school") },
      { label: "PHONE", get: (r) => text(r, "phone") },
      { label: "FEE", get: (r) => money(r, "fee") },
    ],
  },
  {
    key: "concertInterest",
    title: "Concert interest list",
    blurb: "Who wants the reveal first, in queue order.",
    columns: [
      { label: "WHEN", get: when },
      { label: "QUEUE", get: (r) => text(r, "queueNumber") },
      { label: "NAME", get: (r) => text(r, "name") },
      { label: "CONTACT", get: (r) => text(r, "contact") },
      { label: "WANTS", get: (r) => text(r, "pick") },
      { label: "GUESS", get: (r) => text(r, "guess") },
      { label: "SEATS", get: (r) => text(r, "seats") },
    ],
  },
  {
    key: "merchOrders",
    title: "Merch pre-orders",
    blurb: "Carts placed for collection at the gate.",
    columns: [
      { label: "WHEN", get: when },
      {
        label: "ITEMS",
        get: (r) => {
          const lines = path(r, "lines");
          if (!Array.isArray(lines)) return "—";
          return lines
            .map((l) => {
              const line = l as Row;
              return `${line.qty}× ${line.name}`;
            })
            .join(", ");
        },
      },
      { label: "TOTAL", get: (r) => money(r, "total") },
    ],
  },
];

/** Turns the visible table into a CSV the council can open in a spreadsheet. */
export function toCsv(columns: Column[], rows: Row[]): string {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const head = columns.map((c) => escape(c.label)).join(",");
  const body = rows.map((row) => columns.map((c) => escape(c.get(row))).join(","));
  return [head, ...body].join("\n");
}
