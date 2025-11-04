import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    const sanitize = (value: unknown) => {
      if (typeof value === "string") {
        return value.trim();
      }

      if (value === null || value === undefined) {
        return "";
      }

      return String(value).trim();
    };

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
      "https://script.google.com/macros/s/AKfycbxXk292_Xm0t9Lb-lUJLqCzG8cX0Py-Kdpq8S4g5AhM18gVDdlHSC0fkdEv5LQDI7LZzQ/exec";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let responseText = "";

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      responseText = await response.text().catch(() => "");

      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            message: `Failed to submit form: Google Apps Script responded with ${response.status}: ${
              responseText || "No response body"
            }`,
          },
          { status: 502 },
        );
      }

      if (responseText) {
        try {
          const parsed = JSON.parse(responseText) as { result?: string; message?: string };

          if (parsed.result && parsed.result !== "Success") {
            return NextResponse.json(
              {
                success: false,
                message: parsed.message ?? `Google Apps Script reported ${parsed.result}`,
              },
              { status: 502 },
            );
          }
        } catch (parseError) {
          console.warn("Unable to parse Apps Script response as JSON:", parseError);
        }
      }
    } catch (fetchError) {
      const errorMessage = fetchError instanceof Error ? fetchError.message : "Unknown error during sponsor submission";
      return NextResponse.json(
        { success: false, message: `Failed to submit form: ${errorMessage}` },
        { status: 502 },
      );
    } finally {
      clearTimeout(timeoutId);
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
