import { GET } from './route';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { Difficulty, ActivityCategory } from '@prisma/client';

// Mock the entire db module to match the new schema
vi.mock('@/lib/db', () => ({
  db: {
    child: {
      findMany: vi.fn(),
    },
    scheduledActivity: {
      findMany: vi.fn(),
    },
  },
}));

describe('GET /api/parenting-activities', () => {
  // Reset mocks before each test to ensure test isolation
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return scheduled activities with templates for a valid coupleId', async () => {
    // Arrange: Setup mock data for the new schema
    const mockChildren = [{ id: 'child1' }];
    const mockScheduledActivities = [
      {
        id: 'scheduled1',
        child_id: 'child1',
        status: 'PENDING',
        scheduled_for: new Date(),
        activity_template: {
          id: 'template1',
          title: 'Hanuman Helper Mission',
          description: 'A fun task to help around the house.',
          category: ActivityCategory.HANUMAN_HELPER,
          difficulty: Difficulty.EASY,
          estimated_time_mins: 15,
        }
      },
    ];

    (db.child.findMany as vi.Mock).mockResolvedValue(mockChildren);
    (db.scheduledActivity.findMany as vi.Mock).mockResolvedValue(mockScheduledActivities);

    const coupleId = 'valid-couple-id';
    const request = new Request(`http://localhost/api/parenting-activities?coupleId=${coupleId}`);

    // Act: Call the API handler
    const response = await GET(request);
    const body = await response.json();

    // Assert: Verify the new response structure and DB calls
    expect(response.status).toBe(200);
    // The body now contains nested objects, so we check the structure.
    expect(body[0].id).toBe('scheduled1');
    expect(body[0].activity_template.title).toBe('Hanuman Helper Mission');

    expect(db.child.findMany).toHaveBeenCalledWith({
      where: { couple_id: coupleId },
      select: { id: true },
    });
    expect(db.scheduledActivity.findMany).toHaveBeenCalledWith({
      where: { child_id: { in: ['child1'] } },
      include: { activity_template: true },
      orderBy: { scheduled_for: 'asc' },
    });
  });

  it('should return a 400 error if coupleId is missing', async () => {
    // Arrange
    const request = new Request(`http://localhost/api/parenting-activities`);

    // Act
    const response = await GET(request);

    // Assert
    expect(response.status).toBe(400);
    expect(db.child.findMany).not.toHaveBeenCalled();
    expect(db.scheduledActivity.findMany).not.toHaveBeenCalled();
  });

  it('should return an empty array if the couple has no children', async () => {
    // Arrange
    (db.child.findMany as vi.Mock).mockResolvedValue([]); // No children found
    const coupleId = 'couple-with-no-children';
    const request = new Request(`http://localhost/api/parenting-activities?coupleId=${coupleId}`);

    // Act
    const response = await GET(request);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body).toEqual([]);
    expect(db.child.findMany).toHaveBeenCalledWith({
      where: { couple_id: coupleId },
      select: { id: true },
    });
    expect(db.scheduledActivity.findMany).not.toHaveBeenCalled();
  });

  it('should return a 500 error if the database throws an error', async () => {
    // Arrange
    (db.child.findMany as vi.Mock).mockRejectedValue(new Error('Database connection failed'));
    const coupleId = 'any-couple-id';
    const request = new Request(`http://localhost/api/parenting-activities?coupleId=${coupleId}`);

    // Act
    const response = await GET(request);

    // Assert
    expect(response.status).toBe(500);
  });
});
