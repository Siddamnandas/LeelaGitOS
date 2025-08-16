import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cuisine = searchParams.get('cuisine');
    const difficulty = searchParams.get('difficulty');
    const tags = searchParams.get('tags');
    const isFavorite = searchParams.get('isFavorite');

    let whereClause: any = {};

    if (cuisine && cuisine !== 'all') {
      whereClause.cuisine = cuisine;
    }

    if (difficulty && difficulty !== 'all') {
      whereClause.difficulty = difficulty;
    }

    if (isFavorite === 'true') {
      whereClause.is_favorite = true;
    }

    const recipes = await db.recipe.findMany({
      where: whereClause,
      orderBy: [
        { is_favorite: 'desc' },
        { created_at: 'desc' }
      ],
    });

    // Transform JSON fields back to arrays
    const transformedRecipes = recipes.map(recipe => ({
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients as string),
      tags: JSON.parse(recipe.tags as string),
      nutrition: JSON.parse(recipe.nutrition as string),
    }));

    // Filter by tags if specified
    let filteredRecipes = transformedRecipes;
    if (tags) {
      const tagArray = tags.split(',');
      filteredRecipes = transformedRecipes.filter(recipe =>
        tagArray.some(tag => recipe.tags.includes(tag))
      );
    }

    return NextResponse.json(filteredRecipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      servings,
      difficulty,
      cuisine,
      tags,
      nutrition,
      isFavorite = false,
      imageUrl,
    } = body;

    if (!name || !ingredients || !instructions || !prepTime || !cookTime || !servings || !difficulty || !cuisine) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const recipe = await db.recipe.create({
      data: {
        name,
        description,
        ingredients: JSON.stringify(ingredients),
        instructions,
        prep_time: prepTime,
        cook_time: cookTime,
        servings,
        difficulty,
        cuisine,
        tags: JSON.stringify(tags || []),
        nutrition: JSON.stringify(nutrition || {
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
        }),
        is_favorite: isFavorite,
      },
    });

    const transformedRecipe = {
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients as string),
      tags: JSON.parse(recipe.tags as string),
      nutrition: JSON.parse(recipe.nutrition as string),
    };

    return NextResponse.json(transformedRecipe, { status: 201 });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}