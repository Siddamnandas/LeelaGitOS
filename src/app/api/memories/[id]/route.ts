import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const memory = await db.memory.findUnique({
      where: { id: params.id },
    });

    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    const transformedMemory = {
      ...memory,
      tags: JSON.parse(memory.tags as string),
      partners: JSON.parse(memory.partners as string),
    };

    return NextResponse.json(transformedMemory);
  } catch (error) {
    console.error('Error fetching memory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      tags,
      isPrivate,
    } = body;

    const existingMemory = await db.memory.findUnique({
      where: { id: params.id },
    });

    if (!existingMemory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = JSON.stringify(tags);
    if (isPrivate !== undefined) updateData.is_private = isPrivate;

    const updatedMemory = await db.memory.update({
      where: { id: params.id },
      data: updateData,
    });

    const transformedMemory = {
      ...updatedMemory,
      tags: JSON.parse(updatedMemory.tags as string),
      partners: JSON.parse(updatedMemory.partners as string),
    };

    return NextResponse.json(transformedMemory);
  } catch (error) {
    console.error('Error updating memory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingMemory = await db.memory.findUnique({
      where: { id: params.id },
    });

    if (!existingMemory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    await db.memory.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    console.error('Error deleting memory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}