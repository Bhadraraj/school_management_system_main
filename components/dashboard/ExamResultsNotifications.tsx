'use client';

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, CreditCard, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const notifications = [
  {
    icon: GraduationCap,
    title: 'New Teacher',
    description: 'It is a long established readable.',
    time: 'Just now',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: CreditCard,
    title: 'Fees Structure',
    description: 'It is a long established readable.',
    time: 'Today',
    bgColor: 'bg-pink-100',
    iconColor: 'text-pink-600',
  },
  {
    icon: BookOpen,
    title: 'New Course',
    description: 'It is a long established readable.',
    time: '24 Sep 2023',
    bgColor: 'bg-teal-100',
    iconColor: 'text-teal-600',
  },
];

const ExamResultsNotifications = memo(function ExamResultsNotifications() {
  return (
    <Card className="w-full lg:w-80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Latest Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                notification.bgColor
              )}>
                <notification.icon className={cn('w-5 h-5', notification.iconColor)} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{notification.description}</p>
                <span className="text-xs text-gray-400 mt-1">{notification.time}</span>
              </div>
            </div>
          ))}
        </div>
        <Button 
          variant="ghost" 
          className="w-full mt-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          View All
        </Button>
      </CardContent>
    </Card>
  );
});

export default ExamResultsNotifications;