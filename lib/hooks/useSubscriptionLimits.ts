'use client';

import { useState, useEffect } from 'react';
import { checkSubscriptionLimits } from '@/lib/utils/permissions';
import { useAuthStore } from '@/lib/store';

export function useSubscriptionLimits(resource: 'students' | 'teachers' | 'classes') {
  const { user } = useAuthStore();
  const [limits, setLimits] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLimits = async () => {
      if (!user?.school_id) return;

      try {
        const limitsData = await checkSubscriptionLimits(user.school_id, resource);
        setLimits(limitsData);
      } catch (error) {
        console.error('Error fetching subscription limits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLimits();
  }, [user?.school_id, resource]);

  const checkCanAdd = () => {
    return limits?.canAdd || false;
  };

  const getUsagePercentage = () => {
    if (!limits) return 0;
    return Math.round((limits.current / limits.limit) * 100);
  };

  const isNearLimit = () => {
    return getUsagePercentage() >= 90;
  };

  const isAtLimit = () => {
    return !checkCanAdd();
  };

  return {
    limits,
    loading,
    checkCanAdd,
    getUsagePercentage,
    isNearLimit,
    isAtLimit,
  };
}