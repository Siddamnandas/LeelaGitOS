'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Baby, 
  Target,
  AlertCircle
} from 'lucide-react';
import type { FamilyActivity } from '@prisma/client';

// The type of our data from the API, based on the actual Prisma schema.
type Activity = FamilyActivity;

// The component now accepts coupleId as a prop
interface ParentingActivityEngineProps {
  coupleId: string;
}

// The fetcher function for react-query
const fetchActivities = async (coupleId: string): Promise<Activity[]> => {
  const { data } = await axios.get(`/api/parenting-activities?coupleId=${coupleId}`);
  return data;
};

export function ParentingActivityEngine({ coupleId }: ParentingActivityEngineProps) {
  const { data: activities, isLoading, isError, error } = useQuery<Activity[], Error>({
    // The query key is an array that uniquely identifies this query.
    // When coupleId changes, react-query will refetch the data.
    queryKey: ['parenting-activities', coupleId],
    queryFn: () => fetchActivities(coupleId),
  });

  // 1. Handle the loading state
  if (isLoading) {
    return (
      <div className="p-4 space-y-6 animate-pulse">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  // 2. Handle the error state
  if (isError) {
    return (
      <div className="p-8 flex flex-col items-center justify-center bg-red-50 text-red-800 rounded-2xl border border-red-200">
        <AlertCircle className="w-10 h-10 mb-4" />
        <h2 className="text-xl font-bold mb-2">Could Not Load Activities</h2>
        <p className="text-center">{error?.message || 'An unexpected error occurred. Please try again later.'}</p>
      </div>
    );
  }

  const completedActivities = activities?.filter(a => a.completed_at !== null).length || 0;
  const totalActivities = activities?.length || 0;

  // 3. Render the UI with the fetched data
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-teal-600 to-green-600 p-6 shadow-xl">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white mb-1">Family Adventures</h1>
          <p className="text-white/80 text-sm">A journey of family bonding</p>
        </div>
      </div>

      {/* Simplified Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-4 rounded-2xl shadow-lg">
          <Baby className="w-6 h-6 mb-1" />
          <p className="text-2xl font-bold">{completedActivities}</p>
          <p className="text-xs opacity-90">Completed</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-4 rounded-2xl shadow-lg">
          <Target className="w-6 h-6 mb-1" />
          <p className="text-2xl font-bold">{totalActivities}</p>
          <p className="text-xs opacity-90">Total Activities</p>
        </div>
      </div>

      {/* Activity List - simplified to match the actual data model */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Your Activities</h3>
        {activities && activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="bg-white/90 backdrop-blur-lg border border-white/50 shadow-lg rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 capitalize">{activity.activity_type.replace(/_/g, ' ')}</h4>
                <p className="text-sm text-gray-600">
                  Created: {new Date(activity.created_at).toLocaleDateString()}
                </p>
                {activity.completed_at ? (
                  <Badge className="mt-2 bg-green-100 text-green-700">Completed</Badge>
                ) : (
                  <Badge className="mt-2 bg-yellow-100 text-yellow-700">Pending</Badge>
                )}
              </div>
               <Button size="sm" disabled>Mark as Complete</Button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-2xl">
            <p className="text-gray-500">No activities found for your family yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}