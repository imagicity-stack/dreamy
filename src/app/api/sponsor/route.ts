import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    console.log("Received sponsor form data:", formData);

    // Sanitize inputs like your volunteer form
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
      "https://script.google.com/macros/s/AKfycbxXk292_Xm0t9Lb-lUJLqCzG8cX0Py-Kdpq8S4g5AhM18gVDdlHSC0fkdEv5LQDI7LZzQ/exec";

    const jsonData = JSON.stringify(payload);
    console.log("Sending JSON to Google:", jsonData);

    try {
      console.log("About to send sponsor request to Google Apps Script...");

      // Fire-and-forget like the volunteer route
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

      await Promise.race([fetchPromise, timeoutPromise])
        .then(() => {
          console.log("Sponsor request sent to Google Apps Script");
        })
        .catch((error) => {
          console.log("Fetch failed but continuing:", error.message);
        });

    } catch (fetchError) {
      console.error("Error during fetch operation:", fetchError);
    }

    console.log("Sending success response to client");
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
      { success: false, message: `Failed to submit sponsor form: ${errorMessage}` },
      { status: 500 },
    );
  }
}
