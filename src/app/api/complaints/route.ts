import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { z } from 'zod';

const createComplaintSchema = z.object({
  userId: z.string(),
  imageUrl: z.string().url(),
  category: z.string(),
  severity: z.string(),
  description: z.string(),
  aiDraft: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  city: z.string(),
  authorityId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (city) where.city = { contains: city, mode: 'insensitive' };

    const complaints = await prisma.complaint.findMany({
      where,
      include: { authority: true },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100),
    });

    return NextResponse.json({ success: true, data: complaints });
  } catch (error) {
    console.error('Fetch complaints error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createComplaintSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: validated.error.issues.map((e) => e.message).join(', '),
        },
        { status: 400 }
      );
    }

    const data = validated.data;

    const complaint = await prisma.$executeRaw`
      INSERT INTO "Complaint" (
        id, "userId", "imageUrl", category, severity, description,
        "aiDraft", status, coords, latitude, longitude, city,
        "authorityId", "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid(),
        ${data.userId},
        ${data.imageUrl},
        ${data.category},
        ${data.severity},
        ${data.description},
        ${data.aiDraft || null},
        'pending',
        ST_SetSRID(ST_MakePoint(${data.longitude}, ${data.latitude}), 4326),
        ${data.latitude},
        ${data.longitude},
        ${data.city},
        ${data.authorityId || null},
        NOW(),
        NOW()
      )
    `;

    return NextResponse.json(
      { success: true, data: { created: complaint } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create complaint error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create complaint' },
      { status: 500 }
    );
  }
}
