import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage } from '@/lib/gemini';
import { findAuthority, reverseGeocode } from '@/lib/authorities';
import { z } from 'zod';

const analyzeSchema = z.object({
  image: z.string().min(100, 'Image data is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = analyzeSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request: ' + validated.error.issues.map((e) => e.message).join(', '),
        },
        { status: 400 }
      );
    }

    const { image, latitude, longitude } = validated.data;

    // Step 1: Analyze the image with Gemini
    const analysis = await analyzeImage(image);

    // Step 2: Reverse geocode to get city + state
    const { city, state } = await reverseGeocode(latitude, longitude);

    // Step 3: Find the responsible authority (3-tier: jurisdiction → city → state)
    const authority = await findAuthority(latitude, longitude, city, state);

    return NextResponse.json({
      success: true,
      data: {
        ...analysis,
        authority,
        city,
        state,
      },
    });
  } catch (error) {
    console.error('Analysis error:', error);

    const message =
      error instanceof Error ? error.message : 'Internal server error';

    // Check for specific error types
    if (message.includes('API key')) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI service is not configured. Please set up your Gemini API key.',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: message || 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
