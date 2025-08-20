import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { KidsActivities } from './KidsActivities';
import { vi } from 'vitest';
import { ActivityCategory, Difficulty, ActivityStatus } from '@prisma/client';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as vi.Mocked<typeof axios>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Prevent retries in tests
    },
  },
});

// A wrapper component to provide the QueryClient
const TestWrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('KidsActivities Component', () => {

  beforeEach(() => {
    // Clear mocks before each test
    mockedAxios.get.mockClear();
    queryClient.clear();
  });

  it('should render the loading state initially', () => {
    // Arrange
    mockedAxios.get.mockResolvedValueOnce({ data: [] }); // Mock a pending promise
    render(
      <TestWrapper>
        <KidsActivities coupleId="test-couple-id" />
      </TestWrapper>
    );

    // Assert
    expect(screen.getAllByRole('status')).not.toBeNull(); // 'status' is the role for our pulsing skeletons
  });

  it('should render activities on successful data fetch', async () => {
    // Arrange
    const mockActivities = [
      {
        id: 'scheduled1',
        activity_template: {
          id: 'template1',
          title: 'My Test Activity',
          description: 'A great activity.',
          category: 'HANUMAN_HELPER' as ActivityCategory,
        },
        status: 'PENDING' as ActivityStatus,
        scheduled_for: new Date(),
      },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockActivities });

    // Act
    render(
      <TestWrapper>
        <KidsActivities coupleId="test-couple-id" />
      </TestWrapper>
    );

    // Assert
    // Use findByText to wait for the async operation to complete
    expect(await screen.findByText('My Test Activity')).toBeInTheDocument();
    expect(screen.getByText('A great activity.')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('should render an error message on failed data fetch', async () => {
    // Arrange
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    // Act
    render(
      <TestWrapper>
        <KidsActivities coupleId="test-couple-id" />
      </TestWrapper>
    );

    // Assert
    expect(await screen.findByText('Could Not Load Activities')).toBeInTheDocument();
    expect(screen.getByText('Network Error')).toBeInTheDocument();
  });

  it('should render a "no activities" message when data is an empty array', async () => {
    // Arrange
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    // Act
    render(
      <TestWrapper>
        <KidsActivities coupleId="test-couple-id" />
      </TestWrapper>
    );

    // Assert
    expect(await screen.findByText('No Activities Yet')).toBeInTheDocument();
  });

});
