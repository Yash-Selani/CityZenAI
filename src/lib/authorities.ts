import prisma from './db';
import type { Authority } from '@/types';
import type { FallbackContact } from '@/types';

/**
 * Look up the responsible authority by GPS coordinates.
 * 3-tier: PostGIS jurisdiction → city match → state-level fallback.
 */
export async function findAuthority(
  latitude: number,
  longitude: number,
  city?: string,
  state?: string
): Promise<Authority | null> {
  // Tier 1: PostGIS jurisdiction lookup
  try {
    const results = await prisma.$queryRaw<Authority[]>`
      SELECT id, name, email, phone, city, state, department
      FROM "Authority"
      WHERE ST_Contains(
        jurisdiction,
        ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)
      )
      LIMIT 1
    `;

    if (results.length > 0) {
      return results[0];
    }
  } catch (error) {
    console.warn('PostGIS jurisdiction lookup failed, falling back to city match:', error);
  }

  // Tier 2: City-based lookup
  if (city && city !== 'Unknown') {
    const authority = await prisma.authority.findFirst({
      where: {
        city: {
          contains: city,
          mode: 'insensitive',
        },
        NOT: { city: '_STATE_FALLBACK_' },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        state: true,
        department: true,
      },
    });

    if (authority) {
      return authority;
    }
  }

  // Tier 3: State-level fallback
  if (state && state !== 'Unknown') {
    const stateAuthority = await prisma.authority.findFirst({
      where: {
        city: '_STATE_FALLBACK_',
        state: {
          contains: state,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        state: true,
        department: true,
      },
    });

    if (stateAuthority) {
      // Replace the internal marker with the actual city name for display
      return {
        ...stateAuthority,
        city: city || 'Unknown',
      };
    }
  }

  return null;
}

/**
 * Reverse geocode coordinates to city + state using Nominatim (free).
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<{ city: string; state: string }> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`,
      {
        headers: {
          'User-Agent': 'CityZenAI/1.0',
        },
      }
    );
    const data = await response.json();
    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.county ||
      'Unknown';
    const state = data.address?.state || 'Unknown';
    return { city, state };
  } catch {
    return { city: 'Unknown', state: 'Unknown' };
  }
}

/**
 * Fallback contacts when authority lookup fails.
 */
export function getFallbackContacts(state?: string): FallbackContact[] {
  const contacts: FallbackContact[] = [
    {
      type: 'helpline',
      name: 'National Municipal Helpline',
      value: '1800-111-555',
      description: 'Toll-free helpline for civic complaints across India',
    },
    {
      type: 'helpline',
      name: 'Swachh Bharat Helpline',
      value: '1969',
      description: 'Cleanliness and sanitation related complaints',
    },
    {
      type: 'portal',
      name: 'CPGRAMS',
      value: 'https://pgportal.gov.in/',
      description: 'Centralized Public Grievance Redress and Monitoring System',
    },
    {
      type: 'portal',
      name: 'MyGov',
      value: 'https://www.mygov.in/',
      description: 'Government of India citizen engagement platform',
    },
  ];

  // Add state-specific contacts
  if (state?.toLowerCase().includes('madhya pradesh')) {
    contacts.unshift({
      type: 'helpline',
      name: 'MP CM Helpline',
      value: '181',
      description: 'Madhya Pradesh Chief Minister Helpline',
    });
    contacts.push({
      type: 'portal',
      name: 'MP e-Nagarpalika',
      value: 'https://enagarpalika.mponline.gov.in/',
      description: 'Madhya Pradesh Urban Local Body portal',
    });
  }

  return contacts;
}
