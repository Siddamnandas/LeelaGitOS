import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coupleId = searchParams.get('coupleId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!coupleId) {
      return NextResponse.json({ error: 'Couple ID required' }, { status: 400 });
    }

    let whereClause: any = { couple_id: coupleId };

    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      coupleId,
      name,
      date,
      meals,
      nutrition,
      budget,
      notes,
    } = body;

    if (!coupleId || !name || !date || !meals || !nutrition || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const mealPlan = await db.mealPlan.create({
      data: {
        couple_id: coupleId,
        name,
        date: new Date(date),
        meals: JSON.stringify(meals),
        nutrition: JSON.stringify(nutrition),
        budget: parseFloat(budget),
        notes,
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}