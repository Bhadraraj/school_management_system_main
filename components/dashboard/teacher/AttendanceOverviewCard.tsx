'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AttendanceData {
  id: string;
  class: string;
  present: number;
  total: number;
  percentage: number;
}

const mockAttendance: AttendanceData[] = [
  { id: '1', class: 'Grade 10-A', present: 32, total: 35, percentage: 91 },
  { id: '2', class: 'Grade 10-B', present: 30, total: 32, percentage: 94 },
  { id: '3', class: 'Grade 9-A', present: 35, total: 38, percentage: 92 },
  { id: '4', class: 'Grade 9-B', present: 28, total: 30, percentage: 93 },
];

export default function AttendanceOverviewCard() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          Today's Attendance Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAttendance.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-card-foreground">{item.class}</span>
                <span className="text-sm text-muted-foreground">
                  {item.present}/{item.total} ({item.percentage}%)
                </span>
              </div>
              <Progress value={item.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
