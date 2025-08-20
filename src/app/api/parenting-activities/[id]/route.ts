import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { ActivityStatus } from '@prisma/client';

// Schema to validate the request body for updating an activity
const updateActivityBodySchema = z.object({
  status: z.nativeEnum(ActivityStatus),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return new NextResponse(JSON.stringify({ error: 'Activity ID is required' }), { status: 400 });
    }

    const body = await request.json();
    const validatedBody = updateActivityBodySchema.safeParse(body);

    if (!validatedBody.success) {
      return new NextResponse(JSON.stringify({ error: 'Invalid request body', details: validatedBody.error.flatten() }), { status: 400 });
    }

    const { status } = validatedBody.data;

    // 1. Fetch the activity first to ensure it exists and get its related data
    const existingActivity = await db.scheduledActivity.findUnique({
      where: { id },
      include: { activity_template: true },
    });

    if (!existingActivity) {
      return new NextResponse(JSON.stringify({ error: 'Activity not found' }), { status: 404 });
    }

    // 2. Use a transaction to perform the updates atomically
    const [updatedActivity] = await db.$transaction([
      db.scheduledActivity.update({
        where: { id },
        data: {
          status: status,
          completed_at: status === 'COMPLETED' ? new Date() : null,
        },
        include: { activity_template: true }
      }),
      // Conditionally create a storybook entry if the activity is being completed
      ...(status === 'COMPLETED' ? [
        db.storybookEntry.create({
          data: {
            child_id: existingActivity.child_id,
            activity_type: existingActivity.activity_template.category,
            completion_data: {
              title: existingActivity.activity_template.title
            }
          }
        })
      ] : [])
    ]);

    return NextResponse.json(updatedActivity);
  } catch (error) {
    console.error('[ACTIVITY_PATCH]', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
