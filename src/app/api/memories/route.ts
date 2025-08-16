import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coupleId = searchParams.get('coupleId');
    const type = searchParams.get('type');
    const sentiment = searchParams.get('sentiment');
    const tags = searchParams.get('tags');

    if (!coupleId) {
      return NextResponse.json({ error: 'Couple ID required' }, { status: 400 });
    }

    let whereClause: any = { couple_id: coupleId };

    if (type && type !== 'all') {
      whereClause.type = type;
    }

    if (sentiment && sentiment !== 'all') {
      whereClause.sentiment = sentiment;
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
    if (tags) {
      const tagArray = tags.split(',');
      transformedMemories = transformedMemories.filter(memory =>
        tagArray.some(tag => memory.tags.includes(tag))
      );
    }

    return NextResponse.json(transformedMemories);
  } catch (error) {
    console.error('Error fetching memories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      coupleId,
      type,
      content,
      title,
      description,
      tags = [],
      isPrivate = false,
    } = body;

    if (!coupleId || !type || !content || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Simple sentiment analysis (in a real app, this would use AI)
    const sentiment = analyzeSentiment(content + ' ' + (description || ''));

    const memory = await db.memory.create({
      data: {
        couple_id: coupleId,
        type,
        content,
        title,
        description,
        date: new Date(),
        tags: JSON.stringify(tags),
        sentiment,
        partners: JSON.stringify(['partner_a']), // Current user
        is_private: isPrivate,
      },
    });

    // Award coins for creating memory
    await db.rewardTransaction.create({
      data: {
        couple_id: coupleId,
        coins_earned: 10,
        activity: 'Created memory: ' + title,
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