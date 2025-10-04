'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

interface Schedule {
  id: string;
  time: string;
  class: string;
  subject: string;
  room: string;
}

const mockSchedule: Schedule[] = [
  { id: '1', time: '08:00 - 08:45', class: 'Grade 10-A', subject: 'Mathematics', room: 'Room 201' },
  { id: '2', time: '09:00 - 09:45', class: 'Grade 10-B', subject: 'Mathematics', room: 'Room 202' },
  { id: '3', time: '10:15 - 11:00', class: 'Grade 9-A', subject: 'Algebra', room: 'Room 203' },
  { id: '4', time: '11:15 - 12:00', class: 'Grade 9-B', subject: 'Algebra', room: 'Room 204' },
  { id: '5', time: '13:00 - 13:45', class: 'Grade 10-A', subject: 'Geometry', room: 'Room 201' },
];

export default function TodayScheduleCard() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Today's Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockSchedule.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-1.5 text-primary min-w-[100px]">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{item.time}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-card-foreground">{item.subject}</h4>
                <p className="text-sm text-muted-foreground">{item.class} • {item.room}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
