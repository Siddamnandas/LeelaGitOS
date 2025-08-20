import { z } from 'zod';

// Common schemas
const coupleIdSchema = z.string().min(1, 'Couple ID is required');
const dateSchema = z.string().datetime().or(z.date());
const positiveNumberSchema = z.number().positive();
const optionalDateSchema = z.string().datetime().or(z.date()).optional().nullable();

// Grocery List schemas
const groceryItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().optional(),
  price: z.number().min(0, 'Price cannot be negative').optional(),
  category: z.string().optional(),
  purchased: z.boolean().default(false)
});

export const createGroceryListSchema = z.object({
  coupleId: coupleIdSchema,
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  items: z.array(groceryItemSchema).min(1, 'At least one item is required'),
  totalBudget: z.number().positive('Budget must be positive'),
  assignedTo: z.string().min(1, 'Assigned user is required'),
  dueDate: optionalDateSchema
});

export const updateGroceryListSchema = createGroceryListSchema.partial().extend({
  id: z.string().min(1, 'ID is required')
});

// Meal Plan schemas
const mealSchema = z.object({
  breakfast: z.string().optional(),
  lunch: z.string().optional(),
  dinner: z.string().optional(),
  snacks: z.array(z.string()).default([])
});

const nutritionSchema = z.object({
  calories: z.number().min(0, 'Calories cannot be negative'),
  protein: z.number().min(0, 'Protein cannot be negative'),
  carbs: z.number().min(0, 'Carbs cannot be negative'),
  fats: z.number().min(0, 'Fats cannot be negative'),
  fiber: z.number().min(0, 'Fiber cannot be negative').optional(),
  sugar: z.number().min(0, 'Sugar cannot be negative').optional()
});

export const createMealPlanSchema = z.object({
  coupleId: coupleIdSchema,
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  date: dateSchema,
  meals: mealSchema,
  nutrition: nutritionSchema,
  budget: z.number().positive('Budget must be positive'),
  notes: z.string().max(1000, 'Notes too long').optional()
});

export const updateMealPlanSchema = createMealPlanSchema.partial().extend({
  id: z.string().min(1, 'ID is required')
});

// Memory schemas
const memoryTypeSchema = z.enum(['photo', 'video', 'text', 'milestone']);
const memoryTypeQuerySchema = z.enum(['photo', 'video', 'text', 'milestone', 'all']);
const sentimentSchema = z.enum(['positive', 'neutral', 'negative']);

export const createMemorySchema = z.object({
  coupleId: coupleIdSchema,
  type: memoryTypeSchema,
  content: z.string().min(1, 'Content is required').max(10000, 'Content too long'),
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  tags: z.array(z.string().max(50, 'Tag too long')).default([]),
  isPrivate: z.boolean().default(false)
});

export const updateMemorySchema = createMemorySchema.partial().extend({
  id: z.string().min(1, 'ID is required')
});

// Recipe schemas
const difficultySchema = z.enum(['easy', 'medium', 'hard']);
const difficultyQuerySchema = z.enum(['easy', 'medium', 'hard', 'all']);
const cuisines = ['italian', 'mexican', 'indian', 'chinese', 'american', 'mediterranean', 'french', 'thai', 'japanese', 'other'] as const;
const cuisineSchema = z.enum(cuisines);
const cuisineQuerySchema = z.enum(['all', ...cuisines]);

const ingredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required'),
  amount: z.string().min(1, 'Amount is required'),
  unit: z.string().optional(),
  notes: z.string().optional()
});

const recipeNutritionSchema = z.object({
  calories: z.number().min(0, 'Calories cannot be negative'),
  protein: z.number().min(0, 'Protein cannot be negative'),
  carbs: z.number().min(0, 'Carbs cannot be negative'),
  fats: z.number().min(0, 'Fats cannot be negative')
});

export const createRecipeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  ingredients: z.array(ingredientSchema).min(1, 'At least one ingredient is required'),
  instructions: z.string().min(1, 'Instructions are required').max(10000, 'Instructions too long'),
  prepTime: z.number().positive('Prep time must be positive'),
  cookTime: z.number().positive('Cook time must be positive'),
  servings: z.number().positive('Servings must be positive'),
  difficulty: difficultySchema,
  cuisine: cuisineSchema,
  tags: z.array(z.string().max(50, 'Tag too long')).default([]),
  nutrition: recipeNutritionSchema.optional(),
  isFavorite: z.boolean().default(false),
  imageUrl: z.string().url('Invalid URL').optional()
});

export const updateRecipeSchema = createRecipeSchema.partial().extend({
  id: z.string().min(1, 'ID is required')
});

// Query parameter schemas
export const groceryListQuerySchema = z.object({
  coupleId: coupleIdSchema,
  status: z.enum(['pending', 'in_progress', 'completed', 'all']).optional(),
  assignedTo: z.string().optional()
});

export const mealPlanQuerySchema = z.object({
  coupleId: coupleIdSchema,
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});

export const memoryQuerySchema = z.object({
  coupleId: coupleIdSchema,
  type: memoryTypeQuerySchema.optional(),
  sentiment: sentimentSchema.optional(),
  tags: z.string().optional() // Comma-separated string
});

export const recipeQuerySchema = z.object({
  cuisine: cuisineQuerySchema.optional(),
  difficulty: difficultyQuerySchema.optional(),
  tags: z.string().optional(), // Comma-separated string
  isFavorite: z.enum(['true', 'false']).optional()
});

// Utility function for validating request bodies
export function validateRequestBody<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Validation failed: ${errorMessages.join(', ')}`);
    }
    throw error;
  }
}

// Utility function for validating query parameters
export function validateQuery<T>(schema: z.ZodSchema<T>, searchParams: URLSearchParams): T {
  const data: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    data[key] = value;
  });

  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Query validation failed: ${errorMessages.join(', ')}`);
    }
    throw error;
  }
}