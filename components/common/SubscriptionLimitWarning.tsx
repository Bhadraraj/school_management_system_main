'use client';

import { useState, useEffect } from 'react';
import { checkSubscriptionLimits } from '@/lib/utils/permissions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Crown } from 'lucide-react';

interface SubscriptionLimitWarningProps {
  schoolId: string;
  resource: 'students' | 'teachers' | 'classes';
  onUpgrade?: () => void;
}

export default function SubscriptionLimitWarning({ 
  schoolId, 
  resource, 
  onUpgrade 
}: SubscriptionLimitWarningProps) {
  const [limits, setLimits] = useState<any>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const limitsData = await checkSubscriptionLimits(schoolId, resource);
        setLimits(limitsData);
        
        // Show warning if close to limit (90% or more)
        const usagePercentage = (limitsData.current / limitsData.limit) * 100;
        setShowWarning(usagePercentage >= 90);
      } catch (error) {
        console.error('Error fetching subscription limits:', error);
      }
    };

    fetchLimits();
  }, [schoolId, resource]);

  if (!showWarning || !limits) return null;

  const isAtLimit = !limits.canAdd;
  const usagePercentage = Math.round((limits.current / limits.limit) * 100);

  return (
    <Alert className={`mb-4 ${isAtLimit ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'}`}>
      <AlertTriangle className={`h-4 w-4 ${isAtLimit ? 'text-red-600' : 'text-yellow-600'}`} />
      <AlertTitle className={isAtLimit ? 'text-red-800' : 'text-yellow-800'}>
        {isAtLimit ? 'Subscription Limit Reached' : 'Approaching Subscription Limit'}
      </AlertTitle>
      <AlertDescription className={`${isAtLimit ? 'text-red-700' : 'text-yellow-700'} space-y-2`}>
        <p>
          You're using {limits.current} of {limits.limit} {resource} ({usagePercentage}% of your limit).
          {isAtLimit && ' You cannot add more until you upgrade your plan.'}
        </p>
        {onUpgrade && (
          <Button 
            size="sm" 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={onUpgrade}
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade Plan
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}