import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { z } from 'zod';

const userSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  name: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal('')),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('Fetch user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = userSchema.safeParse(body);

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

    // Upsert the user profile
    const user = await prisma.user.upsert({
      where: { id: data.id },
      update: {
        name: data.name || null,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
      },
      create: {
        id: data.id,
        name: data.name || null,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
      },
    });

    return NextResponse.json(
      { success: true, data: user },
      { status: 200 }
    );
  } catch (error) {
    console.error('Save user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save user profile' },
      { status: 500 }
    );
  }
}
