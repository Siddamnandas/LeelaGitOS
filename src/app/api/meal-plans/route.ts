import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { 
  createMealPlanSchema, 
  mealPlanQuerySchema,
  validateRequestBody,
  validateQuery 
} from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validate query parameters with Zod
    const validatedQuery = validateQuery(mealPlanQuerySchema, searchParams);
    
    let whereClause: any = { couple_id: validatedQuery.coupleId };
    
    if (validatedQuery.startDate && validatedQuery.endDate) {
      whereClause.date = {
        gte: new Date(validatedQuery.startDate),
        lte: new Date(validatedQuery.endDate),
      };
    }

    const mealPlans = await db.mealPlan.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
    });

    // Transform JSON fields back to objects
    const transformedMealPlans = mealPlans.map(plan => ({
      ...plan,
      meals: JSON.parse(plan.meals as string),
      nutrition: JSON.parse(plan.nutrition as string),
    }));

    return NextResponse.json(transformedMealPlans);
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    
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
    const validatedData = validateRequestBody(createMealPlanSchema, body);

    const mealPlan = await db.mealPlan.create({
      data: {
        couple_id: validatedData.coupleId,
        name: validatedData.name,
        date: new Date(validatedData.date),
        meals: JSON.stringify(validatedData.meals),
        nutrition: JSON.stringify(validatedData.nutrition),
        budget: validatedData.budget,
        notes: validatedData.notes,
      },
    });

    const transformedMealPlan = {
      ...mealPlan,
      meals: JSON.parse(mealPlan.meals as string),
      nutrition: JSON.parse(mealPlan.nutrition as string),
    };

    return NextResponse.json(transformedMealPlan, { status: 201 });
  } catch (error) {
    console.error('Error creating meal plan:', error);
    
    // Return validation error with proper message
    if (error instanceof Error && error.message.includes('Validation failed')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
