// app/api/replicate/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const predictionData = await request.json();
    console.log('Webhook received:', predictionData);

    // Check if the webhook request contains new logs
    if (predictionData.logs) {
        console.log('New logs:', predictionData.logs);
    }

    // Log the prediction status
    if (predictionData.status) {
        console.log('Prediction status:', predictionData.status);
    }

    // Log the prediction output
    if (predictionData.output) {
        console.log('Prediction output:', predictionData.output);
    }

    return NextResponse.json({ message: 'Webhook processed successfully' });
}