'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Smile,
  CheckCircle,
  Brush,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import type { ScheduledActivity, ActivityTemplate, ActivityCategory, ActivityStatus } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';

// The component expects a ScheduledActivity with its template included
type ActivityWithTemplate = ScheduledActivity & {
  activity_template: ActivityTemplate;
};

// The component now needs a coupleId to fetch data
interface KidsActivitiesProps {
  coupleId: string;
}

// A map to associate activity categories with UI themes
const activityThemeMap: Record<ActivityCategory | 'default', { name: string; essence: string; icon: JSX.Element; color: string; }> = {
  KRISHNA_PRANK: {
    name: 'Krishna Prank Day',
    essence: 'Play & Joy',
    icon: <Smile className="w-8 h-8" />,
    color: 'from-purple-500 to-pink-500',
  },
  HANUMAN_HELPER: {
    name: 'Hanuman Helper Mission',
    essence: 'Service & Contribution',
    icon: <CheckCircle className="w-8 h-8" />,
    color: 'from-orange-500 to-red-500',
  },
  SARASWATI_CREATIVE: {
    name: 'Saraswati Creative Day',
    essence: 'Creativity & Curiosity',
    icon: <Brush className="w-8 h-8" />,
    color: 'from-teal-500 to-cyan-500',
  },
  default: {
    name: 'Family Activity',
    essence: 'Connection',
    icon: <BookOpen className="w-8 h-8" />,
    color: 'from-gray-500 to-slate-500',
  }
};

const fetchActivities = async (coupleId: string): Promise<ActivityWithTemplate[]> => {
  const { data } = await axios.get(`/api/parenting-activities?coupleId=${coupleId}`);
  return data;
};

const updateActivityStatus = async ({ id, status }: { id: string, status: ActivityStatus }) => {
  const { data } = await axios.patch(`/api/parenting-activities/${id}`, { status });
  return data;
}

export function KidsActivities({ coupleId }: KidsActivitiesProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: activities, isLoading, isError, error } = useQuery<ActivityWithTemplate[], Error>({
    queryKey: ['parenting-activities', coupleId],
    queryFn: () => fetchActivities(coupleId),
  });

  const mutation = useMutation<ActivityWithTemplate, Error, { id: string, status: ActivityStatus }>({
    mutationFn: updateActivityStatus,
    onMutate: async (newActivity) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['parenting-activities', coupleId] });

      // Snapshot the previous value
      const previousActivities = queryClient.getQueryData<ActivityWithTemplate[]>(['parenting-activities', coupleId]);

      // Optimistically update to the new value
      queryClient.setQueryData<ActivityWithTemplate[]>(['parenting-activities', coupleId], (old) =>
        old?.map(activity =>
          activity.id === newActivity.id
            ? { ...activity, status: newActivity.status, completed_at: new Date() }
            : activity
        )
      );

      // Return a context object with the snapshotted value
      return { previousActivities };
    },
    onError: (err, newActivity, context) => {
      // Rollback to the previous value on error
      queryClient.setQueryData(['parenting-activities', coupleId], context.previousActivities);
      toast({
        title: "Oh no! Something went wrong.",
        description: "Your activity could not be updated. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['parenting-activities', coupleId] });
    },
     onSuccess: () => {
      toast({
        title: "Activity Updated!",
        description: "Great job completing a family adventure!",
      });
    }
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-4 animate-pulse" role="status" aria-label="Loading activities...">
        <Skeleton className="h-10 w-1/2 rounded-lg" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 m-4 flex flex-col items-center justify-center bg-red-50 text-red-800 rounded-2xl border border-red-200">
        <AlertCircle className="w-10 h-10 mb-4" />
        <h2 className="text-xl font-bold mb-2">Could Not Load Activities</h2>
        <p className="text-center">{error?.message || 'An unexpected error occurred.'}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kids Activities</h1>
        <p className="text-gray-600">Mythology-inspired adventures for your family.</p>
      </div>

      <div className="space-y-4">
        {activities && activities.length > 0 ? (
          activities.map((activity) => {
            const theme = activityThemeMap[activity.activity_template.category] || activityThemeMap.default;
            return (
              <Card key={activity.id} className={`overflow-hidden hover:shadow-lg transition-shadow bg-gradient-to-r ${theme.color} bg-opacity-10`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r ${theme.color} text-white`}>
                      {theme.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900">{activity.activity_template.title}</h4>
                      <p className="text-sm text-gray-600">{activity.activity_template.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {activity.status === 'COMPLETED' ? (
                          <Badge className="bg-green-100 text-green-700">Completed</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                        )}
                         <Badge variant="outline">
                           Scheduled: {new Date(activity.scheduled_for).toLocaleDateString()}
                         </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    {activity.status !== 'COMPLETED' && (
                       <Button
                         onClick={() => mutation.mutate({ id: activity.id, status: 'COMPLETED' })}
                         disabled={mutation.isPending}
                       >
                         Mark as Complete
                       </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-semibold">No Activities Yet</h3>
              <p className="text-gray-500 mt-2">New family adventures will appear here soon!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}