import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { validateRequestBody } from '@/lib/validation';

/**
 * Zod schema for updating memory data
 */
const updateMemorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters').optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPrivate: z.boolean().optional(),
  partners: z.array(z.string()).optional(),
});

/**
 * GET /api/memories/[id] - Retrieve a specific memory by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memory = await db.memory.findUnique({
      where: { id },
    });

    if (!memory) {
      return NextResponse.json(
        { success: false, error: 'Memory not found' },
        { status: 404 }
      );
    }

    const transformedMemory = {
      ...memory,
      tags: JSON.parse(memory.tags as string),
      partners: JSON.parse(memory.partners as string),
    };

    return NextResponse.json({ success: true, data: transformedMemory });
  } catch (error) {
    console.error('Error fetching memory:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/memories/[id] - Update a specific memory by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate request body with Zod
    const validatedData = validateRequestBody(updateMemorySchema, body);

    // Check if memory exists
    const existingMemory = await db.memory.findUnique({
      where: { id },
    });

    if (!existingMemory) {
      return NextResponse.json(
        { success: false, error: 'Memory not found' },
        { status: 404 }
      );
    }

    // Build update data object with only provided fields
    const updateData: any = {};
    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.tags !== undefined) updateData.tags = JSON.stringify(validatedData.tags);
    if (validatedData.isPrivate !== undefined) updateData.is_private = validatedData.isPrivate;
    if (validatedData.partners !== undefined) updateData.partners = JSON.stringify(validatedData.partners);

    // Update memory in database
    const updatedMemory = await db.memory.update({
      where: { id },
      data: updateData,
    });

    // Transform response data
    const transformedMemory = {
      ...updatedMemory,
      tags: JSON.parse(updatedMemory.tags as string),
      partners: JSON.parse(updatedMemory.partners as string),
    };

    return NextResponse.json({ success: true, data: transformedMemory });
  } catch (error) {
    console.error('Error updating memory:', error);
    
    // Return validation error with proper message
    if (error instanceof Error && error.message.includes('validation failed')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/memories/[id] - Delete a specific memory by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if memory exists
    const existingMemory = await db.memory.findUnique({
      where: { id },
    });

    if (!existingMemory) {
      return NextResponse.json(
        { success: false, error: 'Memory not found' },
        { status: 404 }
      );
    }

    // Delete memory from database
    await db.memory.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Memory deleted successfully' }
    });
  } catch (error) {
    console.error('Error deleting memory:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}