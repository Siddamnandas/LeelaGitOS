import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { 
  createMemorySchema, 
  memoryQuerySchema,
  validateRequestBody,
  validateQuery 
} from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validate query parameters with Zod
    const validatedQuery = validateQuery(memoryQuerySchema, searchParams);
    
    let whereClause: any = { couple_id: validatedQuery.coupleId };
    
    if (validatedQuery.type && validatedQuery.type !== 'all') {
      whereClause.type = validatedQuery.type;
    }
    
    if (validatedQuery.sentiment && validatedQuery.sentiment !== 'all') {
      whereClause.sentiment = validatedQuery.sentiment;
    }

    // For SQLite, we'll handle tags filtering in JavaScript
    const memories = await db.memory.findMany({
      where: whereClause,
      orderBy: [
        { date: 'desc' },
        { created_at: 'desc' }
      ],
    });

    // Transform JSON fields back to arrays and filter by tags if needed
    let transformedMemories = memories.map(memory => ({
      ...memory,
      tags: JSON.parse(memory.tags as string),
      partners: JSON.parse(memory.partners as string),
    }));

    // Filter by tags if specified
    if (validatedQuery.tags) {
      const tagArray = validatedQuery.tags.split(',');
      transformedMemories = transformedMemories.filter(memory =>
        tagArray.some(tag => memory.tags.includes(tag))
      );
    }

    return NextResponse.json(transformedMemories);
  } catch (error) {
    console.error('Error fetching memories:', error);
    
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
    const validatedData = validateRequestBody(createMemorySchema, body);

    // Simple sentiment analysis (in a real app, this would use AI)
    const sentiment = analyzeSentiment(validatedData.content + ' ' + (validatedData.description || ''));

    const memory = await db.memory.create({
      data: {
        couple_id: validatedData.coupleId,
        type: validatedData.type,
        content: validatedData.content,
        title: validatedData.title,
        description: validatedData.description,
        date: new Date(),
        tags: JSON.stringify(validatedData.tags),
        sentiment,
        partners: JSON.stringify(['partner_a']), // Current user
        is_private: validatedData.isPrivate,
      },
    });

    // Award coins for creating memory
    await db.rewardTransaction.create({
      data: {
        couple_id: validatedData.coupleId,
        coins_earned: 10,
        activity: 'Created memory: ' + validatedData.title,
      },
    });

    const transformedMemory = {
      ...memory,
      tags: JSON.parse(memory.tags as string),
      partners: JSON.parse(memory.partners as string),
    };

    return NextResponse.json(transformedMemory, { status: 201 });
  } catch (error) {
    console.error('Error creating memory:', error);
    
    // Return validation error with proper message
    if (error instanceof Error && error.message.includes('Validation failed')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const positiveWords = ['love', 'happy', 'joy', 'wonderful', 'amazing', 'beautiful', 'great', 'fantastic', 'perfect', 'best'];
  const negativeWords = ['sad', 'angry', 'frustrated', 'disappointed', 'terrible', 'awful', 'bad', 'worst', 'hate', 'horrible'];
  
  const words = text.toLowerCase().split(/\s+/);
  const positiveCount = words.filter(word => positiveWords.includes(word)).length;
  const negativeCount = words.filter(word => negativeWords.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}
