import { NextRequest, NextResponse } from 'next/server';
import { findAuthority, getFallbackContacts, reverseGeocode } from '@/lib/authorities';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');

    if (lat === 0 && lng === 0) {
      return NextResponse.json(
        { success: false, error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const { city, state } = await reverseGeocode(lat, lng);
    const authority = await findAuthority(lat, lng, city, state);

    if (authority) {
      return NextResponse.json({
        success: true,
        data: {
          authority,
          city,
          state,
          fallbackContacts: [],
        },
      });
    }

    // No authority found — return fallbacks
    const fallbackContacts = getFallbackContacts(state);

    return NextResponse.json({
      success: true,
      data: {
        authority: null,
        city,
        state,
        fallbackContacts,
      },
    });
  } catch (error) {
    console.error('Authority lookup error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to look up authority' },
      { status: 500 }
    );
  }
}
