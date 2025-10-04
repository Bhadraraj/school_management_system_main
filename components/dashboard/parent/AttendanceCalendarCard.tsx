'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Check, X } from 'lucide-react';

interface AttendanceDay {
  date: string;
  status: 'present' | 'absent';
  day: number;
}

const mockAttendance: AttendanceDay[] = [
  { date: '2025-10-01', status: 'present', day: 1 },
  { date: '2025-10-02', status: 'present', day: 2 },
  { date: '2025-10-03', status: 'present', day: 3 },
  { date: '2025-10-04', status: 'present', day: 4 },
];

const generateMonthDays = () => {
  const days = [];
  for (let i = 1; i <= 30; i++) {
    const attendance = mockAttendance.find(a => a.day === i);
    days.push({
      day: i,
      status: attendance ? attendance.status : (i < 5 ? 'present' : undefined)
    });
  }
  return days;
};

export default function AttendanceCalendarCard() {
  const days = generateMonthDays();
  const presentDays = mockAttendance.filter(a => a.status === 'present').length;
  const absentDays = mockAttendance.filter(a => a.status === 'absent').length;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Attendance Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm font-medium">Present</span>
            </div>
            <span className="font-bold">{presentDays} days</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm font-medium">Absent</span>
            </div>
            <span className="font-bold">{absentDays} days</span>
          </div>

          <div className="grid grid-cols-7 gap-2 mt-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
              <div key={idx} className="text-center text-xs font-semibold text-muted-foreground p-2">
                {day}
              </div>
            ))}
            {days.slice(0, 28).map((day) => (
              <div
                key={day.day}
                className={`
                  aspect-square flex items-center justify-center text-xs rounded-lg
                  ${day.status === 'present' ? 'bg-green-100 text-green-700' : ''}
                  ${day.status === 'absent' ? 'bg-red-100 text-red-700' : ''}
                  ${!day.status ? 'bg-accent text-muted-foreground' : ''}
                `}
              >
                {day.day}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
