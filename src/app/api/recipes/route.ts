import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { 
  createRecipeSchema, 
  recipeQuerySchema,
  validateRequestBody,
  validateQuery 
} from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validate query parameters with Zod
    const validatedQuery = validateQuery(recipeQuerySchema, searchParams);
    
    let whereClause: any = {};
    
    if (validatedQuery.cuisine && validatedQuery.cuisine !== 'all') {
      whereClause.cuisine = validatedQuery.cuisine;
    }
    
    if (validatedQuery.difficulty && validatedQuery.difficulty !== 'all') {
      whereClause.difficulty = validatedQuery.difficulty;
    }
    
    if (validatedQuery.isFavorite === 'true') {
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
    if (validatedQuery.tags) {
      const tagArray = validatedQuery.tags.split(',');
      filteredRecipes = transformedRecipes.filter(recipe =>
        tagArray.some(tag => recipe.tags.includes(tag))
      );
    }

    return NextResponse.json(filteredRecipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    
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
    const validatedData = validateRequestBody(createRecipeSchema, body);

    const recipe = await db.recipe.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        ingredients: JSON.stringify(validatedData.ingredients),
        instructions: validatedData.instructions,
        prep_time: validatedData.prepTime,
        cook_time: validatedData.cookTime,
        servings: validatedData.servings,
        difficulty: validatedData.difficulty,
        cuisine: validatedData.cuisine,
        tags: JSON.stringify(validatedData.tags || []),
        nutrition: JSON.stringify(validatedData.nutrition || {
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
        }),
        is_favorite: validatedData.isFavorite,
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
    
    // Return validation error with proper message
    if (error instanceof Error && error.message.includes('Validation failed')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
