import { PATCH } from './route';
import { db } from '@/lib/db';
import { ActivityStatus, ActivityCategory, Difficulty } from '@prisma/client';

// Mock the db module
vi.mock('@/lib/db', () => ({
  db: {
    scheduledActivity: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    storybookEntry: {
      create: vi.fn(),
    },
    // Mock the transaction function directly
    $transaction: vi.fn(),
  },
}));

describe('PATCH /api/parenting-activities/[id]', () => {
  const mockActivityId = 'test-activity-id';
  const mockExistingActivity = {
    id: mockActivityId,
    child_id: 'test-child-id',
    activity_template: {
      title: 'Test Template',
      category: ActivityCategory.HANUMAN_HELPER,
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should complete an activity and create a storybook entry', async () => {
    // Arrange
    (db.scheduledActivity.findUnique as vi.Mock).mockResolvedValue(mockExistingActivity);

    // Mock the transaction to return the result of the first operation (the update)
    const updatedActivity = { ...mockExistingActivity, status: ActivityStatus.COMPLETED };
    (db.$transaction as vi.Mock).mockResolvedValue([updatedActivity]);

    const request = new Request(`http://localhost/api/parenting-activities/${mockActivityId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: ActivityStatus.COMPLETED }),
    });

    // Act
    const response = await PATCH(request, { params: { id: mockActivityId } });
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body.status).toBe(ActivityStatus.COMPLETED);
    // Expect the transaction to have been called with two operations
    expect(db.$transaction).toHaveBeenCalledTimes(1);
    expect((db.$transaction as vi.Mock).mock.calls[0][0]).toHaveLength(2);
  });

  it('should skip an activity and not create a storybook entry', async () => {
    // Arrange
    (db.scheduledActivity.findUnique as vi.Mock).mockResolvedValue(mockExistingActivity);
    const updatedActivity = { ...mockExistingActivity, status: ActivityStatus.SKIPPED };
    (db.$transaction as vi.Mock).mockResolvedValue([updatedActivity]);

    const request = new Request(`http://localhost/api/parenting-activities/${mockActivityId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: ActivityStatus.SKIPPED }),
    });

    // Act
    const response = await PATCH(request, { params: { id: mockActivityId } });

    // Assert
    expect(response.status).toBe(200);
    // Expect the transaction to have been called with only one operation
    expect(db.$transaction).toHaveBeenCalledTimes(1);
    expect((db.$transaction as vi.Mock).mock.calls[0][0]).toHaveLength(1);
  });

  it('should return 404 if activity is not found', async () => {
    // Arrange
    (db.scheduledActivity.findUnique as vi.Mock).mockResolvedValue(null);
    const request = new Request(`http://localhost/api/parenting-activities/${mockActivityId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: ActivityStatus.COMPLETED }),
    });

    // Act
    const response = await PATCH(request, { params: { id: mockActivityId } });

    // Assert
    expect(response.status).toBe(404);
  });

  it('should return 400 for an invalid request body', async () => {
    // Arrange
    const request = new Request(`http://localhost/api/parenting-activities/${mockActivityId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'INVALID_STATUS' }),
    });

    // Act
    const response = await PATCH(request, { params: { id: mockActivityId } });

    // Assert
    expect(response.status).toBe(400);
  });
});
