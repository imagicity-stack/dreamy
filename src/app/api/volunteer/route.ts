import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.json();
        console.log('Received form data:', formData);


        const scriptURL = 'https://script.google.com/macros/s/AKfycbzbaHT2pptV9fnqyyisZ0QQY1EHavT3hJt5rwK41k-QOlb8CbIKFrkZ2aPpCzHBVLDOOA/exec';


        const jsonData = JSON.stringify(formData);
        console.log('Sending JSON to Google:', jsonData);


        try {
            console.log('About to send request to Google Apps Script...');


            const fetchPromise = fetch(scriptURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: jsonData,
                mode: 'no-cors',
            });


            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Request timed out')), 5000);
            });


            await Promise.race([fetchPromise, timeoutPromise])
                .then(() => {
                    console.log('Request sent to Google Apps Script');
                })
                .catch((error) => {
                    console.log('Fetch failed but continuing:', error.message);
                });

        } catch (fetchError) {
            console.error('Error during fetch operation:', fetchError);
        }

        console.log('Sending success response to client');
        return NextResponse.json({
            success: true,
            redirectUrl: '/'
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error in API route:', error.message);
        } else {
            console.error('Unknown error in API route:', error);
        }
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return NextResponse.json(
            { success: false, message: `Failed to submit form: ${errorMessage}` },
            { status: 500 }
        );
    }
}