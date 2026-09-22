import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";
import { readInterest } from "@/lib/interest";

export const dynamic = "force-dynamic";

/** The live figure the concert page quotes: the start plus the real signups. */
export async function GET() {
  const settings = await getSettings();
  const interest = await readInterest(settings);

  return NextResponse.json({
    interestCount: interest.shown.toLocaleString("en-IN"),
  });
}
