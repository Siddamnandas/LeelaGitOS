import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  createTaskSchema,
  taskQuerySchema,
  validateRequestBody,
  validateQuery
} from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const validatedQuery = validateQuery(taskQuerySchema, searchParams);

    let whereClause: any = { couple_id: validatedQuery.coupleId };

    if (validatedQuery.status && validatedQuery.status !== 'all') {
      whereClause.status = validatedQuery.status;
    }

    if (validatedQuery.assignedTo && validatedQuery.assignedTo !== 'all') {
      whereClause.assigned_to = validatedQuery.assignedTo;
    }

    if (validatedQuery.category && validatedQuery.category !== 'all') {
      whereClause.category = validatedQuery.category;
    }

    const tasks = await db.task.findMany({
      where: whereClause,
      orderBy: [
        { due_at: 'asc' },
        { created_at: 'desc' }
      ],
    });

    const transformedTasks = tasks.map(task => ({
      ...task,
      ai_reasoning: task.ai_reasoning ? JSON.parse(task.ai_reasoning as string) : null,
    }));

    return NextResponse.json(transformedTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);

    if (error instanceof Error && error.message.includes('validation failed')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = validateRequestBody(createTaskSchema, body);

    const task = await db.task.create({
      data: {
        couple_id: validatedData.coupleId,
        title: validatedData.title,
        description: validatedData.description,
        assigned_to: validatedData.assignedTo,
        category: validatedData.category,
        status: validatedData.status || 'PENDING',
        ai_reasoning: validatedData.aiReasoning ? JSON.stringify(validatedData.aiReasoning) : undefined,
        due_at: validatedData.dueAt ? new Date(validatedData.dueAt) : null,
      },
    });

    const transformedTask = {
      ...task,
      ai_reasoning: task.ai_reasoning ? JSON.parse(task.ai_reasoning as string) : null,
    };

    return NextResponse.json(transformedTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);

    if (error instanceof Error && error.message.includes('Validation failed')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
