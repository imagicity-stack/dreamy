import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    const sanitize = (value: unknown) => (typeof value === "string" ? value.trim() : "");

    const payload = {
      formType: "sponsor" as const,
      brandName: sanitize(formData.brandName),
      contactPerson: sanitize(formData.contactPerson),
      phoneNumber: sanitize(formData.phoneNumber),
      emailId: sanitize(formData.emailId),
      sponsorshipType: sanitize(formData.sponsorshipType),
      brandDescription: sanitize(formData.brandDescription),
    };

    const requiredFields = [
      ["brandName", payload.brandName],
      ["contactPerson", payload.contactPerson],
      ["phoneNumber", payload.phoneNumber],
      ["emailId", payload.emailId],
      ["sponsorshipType", payload.sponsorshipType],
      ["brandDescription", payload.brandDescription],
    ] as const;

    const missingField = requiredFields.find(([, value]) => value.length === 0);
    if (missingField) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required field: ${missingField[0]}`,
        },
        { status: 400 },
      );
    }

    const scriptURL =
      "https://script.google.com/macros/s/AKfycbwmNQlxEvGT6r3qgL8riXgh4ZCDynlb8AiHPa2TJaiIVmgSlA_WtIiEsFeRNCyruJvA/exec";

    const submitToAppsScript = async (
      body: BodyInit,
      headers: Record<string, string>,
    ): Promise<{ ok: true } | { ok: false; message: string }> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(scriptURL, {
          method: "POST",
          headers,
          body,
          signal: controller.signal,
        });

        const responseText = await response.text().catch(() => "");

        if (!response.ok) {
          return {
            ok: false,
            message: `Google Apps Script responded with ${response.status}: ${responseText || "No response body"}`,
          };
        }

        if (!responseText) {
          return { ok: true };
        }

        try {
          const parsed = JSON.parse(responseText) as { result?: string; message?: string };

          if (parsed.result && parsed.result !== "Success") {
            return { ok: false, message: parsed.message ?? `Google Apps Script reported ${parsed.result}` };
          }

          return { ok: true };
        } catch (parseError) {
          console.warn("Unable to parse Apps Script response as JSON:", parseError);
          return { ok: true };
        }
      } catch (fetchError) {
        const errorMessage =
          fetchError instanceof Error ? fetchError.message : "Unknown error during sponsor submission";
        return { ok: false, message: errorMessage };
      } finally {
        clearTimeout(timeoutId);
      }
    };

    const jsonAttempt = await submitToAppsScript(JSON.stringify(payload), {
      "Content-Type": "application/json",
    });

    if (!jsonAttempt.ok) {
      console.error("Sponsor JSON submission failed:", jsonAttempt.message);

      const fallbackParams = new URLSearchParams();
      fallbackParams.set("formType", "sponsor");
      fallbackParams.set("brandName", payload.brandName);
      fallbackParams.set("contactPerson", payload.contactPerson);
      fallbackParams.set("phoneNumber", payload.phoneNumber);
      fallbackParams.set("emailId", payload.emailId);
      fallbackParams.set("sponsorshipType", payload.sponsorshipType);
      fallbackParams.set("brandDescription", payload.brandDescription);
      fallbackParams.set("form_type", "sponsor");

      const formAttempt = await submitToAppsScript(fallbackParams.toString(), {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      });

      if (!formAttempt.ok) {
        console.error("Sponsor fallback submission failed:", formAttempt.message);
        return NextResponse.json(
          { success: false, message: `Failed to submit form: ${formAttempt.message}` },
          { status: 502 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      redirectUrl: "/",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in sponsor API route:", error.message);
    } else {
      console.error("Unknown error in sponsor API route:", error);
    }

    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";

    return NextResponse.json(
      { success: false, message: `Failed to submit form: ${errorMessage}` },
      { status: 500 },
    );
  }
}
