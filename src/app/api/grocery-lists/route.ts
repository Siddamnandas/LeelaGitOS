import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coupleId = searchParams.get('coupleId');
    const status = searchParams.get('status');
    const assignedTo = searchParams.get('assignedTo');

    if (!coupleId) {
      return NextResponse.json({ error: 'Couple ID required' }, { status: 400 });
    }

    let whereClause: any = { couple_id: coupleId };

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    if (assignedTo && assignedTo !== 'all') {
      whereClause.assigned_to = assignedTo;
    }

    const groceryLists = await db.groceryList.findMany({
      where: whereClause,
      orderBy: [
        { status: 'asc' },
        { due_date: 'asc' },
        { created_at: 'desc' }
      ],
    });

    // Transform JSON fields back to objects
    const transformedGroceryLists = groceryLists.map(list => ({
      ...list,
      items: JSON.parse(list.items as string),
    }));

    return NextResponse.json(transformedGroceryLists);
  } catch (error) {
    console.error('Error fetching grocery lists:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      coupleId,
      name,
      items,
      totalBudget,
      assignedTo,
      dueDate,
    } = body;

    if (!coupleId || !name || !items || !totalBudget || !assignedTo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const groceryList = await db.groceryList.create({
      data: {
        couple_id: coupleId,
        name,
        items: JSON.stringify(items),
        total_budget: parseFloat(totalBudget),
        assigned_to: assignedTo,
        due_date: dueDate ? new Date(dueDate) : null,
        status: 'pending',
      },
    });

    const transformedGroceryList = {
      ...groceryList,
      items: JSON.parse(groceryList.items as string),
    };

    return NextResponse.json(transformedGroceryList, { status: 201 });
  } catch (error) {
    console.error('Error creating grocery list:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}