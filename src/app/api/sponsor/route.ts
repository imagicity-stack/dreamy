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

    const scriptURL = "https://script.google.com/macros/s/AKfycbwmNQlxEvGT6r3qgL8riXgh4ZCDynlb8AiHPa2TJaiIVmgSlA_WtIiEsFeRNCyruJvA/exec";

    const jsonData = JSON.stringify(payload);

    try {
      const fetchPromise = fetch(scriptURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
        mode: "no-cors",
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out")), 5000);
      });

      await Promise.race([fetchPromise, timeoutPromise]).catch((error) => {
        console.warn(
          "Sponsor fetch encountered an issue but continuing:",
          error instanceof Error ? error.message : error,
        );
      });
    } catch (fetchError) {
      console.error("Error during sponsor fetch operation:", fetchError);
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
