import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const getActivitiesQuerySchema = z.object({
  coupleId: z.string().min(1, 'Couple ID is required'),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const validatedQuery = getActivitiesQuerySchema.safeParse({
      coupleId: searchParams.get('coupleId'),
    });

    if (!validatedQuery.success) {
      // Return a more informative error
      return new NextResponse(JSON.stringify({ error: 'Invalid query parameters', details: validatedQuery.error.flatten() }), { status: 400 });
    }

    const { coupleId } = validatedQuery.data;

    // First, find the children associated with the couple
    const children = await db.child.findMany({
      where: {
        couple_id: coupleId,
      },
      select: {
        id: true,
      },
    });

    if (!children.length) {
      return NextResponse.json([]);
    }

    const childrenIds = children.map(child => child.id);

    // Then, find all scheduled activities for those children, including the template data
    const scheduledActivities = await db.scheduledActivity.findMany({
      where: {
        child_id: {
          in: childrenIds,
        },
      },
      include: {
        activity_template: true, // Include the full template object
      },
      orderBy: {
        scheduled_for: 'asc',
      },
    });

    return NextResponse.json(scheduledActivities);
  } catch (error) {
    console.error('[PARENTING_ACTIVITIES_GET]', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
