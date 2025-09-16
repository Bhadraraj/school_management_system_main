'use client';

import { memo, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Users, GraduationCap, UserCheck, DollarSign } from 'lucide-react';

interface StatsCardsProps {
  data?: {
    students: number;
    teachers: number;
    parents: number;
    earnings: number;
    expenses: number;
    attendanceRate: number;
  };
  loading?: boolean;
}

const StatsCards = memo(function StatsCards({ data, loading }: StatsCardsProps) {
  const stats = useMemo(() => [
    {
      title: 'Students',
      value: data ? (data.students >= 1000 ? `${(data.students / 1000).toFixed(1)}K` : data.students.toString()) : '0',
      icon: Users,
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      textColor: 'text-purple-900 dark:text-purple-100',
    },
    {
      title: 'Teachers',
      value: data ? (data.teachers >= 1000 ? `${(data.teachers / 1000).toFixed(1)}K` : data.teachers.toString()) : '0',
      icon: GraduationCap,
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      textColor: 'text-blue-900 dark:text-blue-100',
    },
    {
      title: 'Parents',
      value: data ? (data.parents >= 1000 ? `${(data.parents / 1000).toFixed(1)}K` : data.parents.toString()) : '0',
      icon: UserCheck,
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
      textColor: 'text-orange-900 dark:text-orange-100',
    },
    {
      title: 'Earnings',
      value: data ? `$${(data.earnings / 1000).toFixed(1)}K` : '$0',
      icon: DollarSign,
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      textColor: 'text-green-900 dark:text-green-100',
    },
  ], [data]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>
              <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg" />
            </div>
          </Card>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className={cn(
          'p-4 sm:p-6 border-0 transition-all duration-200 hover:shadow-lg dark:hover:shadow-xl',
          stat.bgColor
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn('text-sm font-medium', stat.textColor, 'opacity-70')}>
                {stat.title}
              </p>
              <p className={cn('text-xl sm:text-lg font-bold mt-1', stat.textColor)}>
                {stat.value}
              </p>
            </div>
            <div className={cn(
              'w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center',
              'bg-white/50 dark:bg-white/10'
            )}>
              <stat.icon className={cn('w-5 h-5 sm:w-6 sm:h-6', stat.iconColor)} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
});

export default StatsCards;