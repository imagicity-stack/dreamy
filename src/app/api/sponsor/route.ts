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

    const scriptURL =
      "https://script.google.com/macros/s/AKfycbwmNQlxEvGT6r3qgL8riXgh4ZCDynlb8AiHPa2TJaiIVmgSlA_WtIiEsFeRNCyruJvA/exec";

    const jsonData = JSON.stringify(payload);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
        signal: controller.signal,
      });

      if (!response.ok) {
        const responseText = await response.text().catch(() => "");
        throw new Error(
          `Google Apps Script responded with ${response.status}: ${responseText || "No response body"}`,
        );
      }

      const result = await response
        .json()
        .catch(() => ({ result: "Unknown", message: "Unable to parse response" }));

      if (result.result !== "Success") {
        throw new Error(result.message ?? "Google Apps Script reported a failure");
      }
    } catch (fetchError) {
      const errorMessage =
        fetchError instanceof Error ? fetchError.message : "Unknown error during sponsor submission";
      console.error("Error during sponsor fetch operation:", errorMessage);
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
