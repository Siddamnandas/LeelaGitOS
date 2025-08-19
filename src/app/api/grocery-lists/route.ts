import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { 
  createGroceryListSchema, 
  groceryListQuerySchema,
  validateRequestBody,
  validateQuery 
} from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validate query parameters with Zod
    const validatedQuery = validateQuery(groceryListQuerySchema, searchParams);
    
    let whereClause: any = { couple_id: validatedQuery.coupleId };
    
    if (validatedQuery.status && validatedQuery.status !== 'all') {
      whereClause.status = validatedQuery.status;
    }
    
    if (validatedQuery.assignedTo && validatedQuery.assignedTo !== 'all') {
      whereClause.assigned_to = validatedQuery.assignedTo;
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
    
    // Return validation error with proper message
    if (error instanceof Error && error.message.includes('validation failed')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body with Zod
    const validatedData = validateRequestBody(createGroceryListSchema, body);

    const groceryList = await db.groceryList.create({
      data: {
        couple_id: validatedData.coupleId,
        name: validatedData.name,
        items: JSON.stringify(validatedData.items),
        total_budget: validatedData.totalBudget,
        assigned_to: validatedData.assignedTo,
        due_date: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
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
    
    // Return validation error with proper message
    if (error instanceof Error && error.message.includes('Validation failed')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
