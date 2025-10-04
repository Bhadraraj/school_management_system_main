'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, Clock, User, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Conflict {
  type: 'teacher' | 'room';
  message: string;
  details: string[];
  severity: 'warning' | 'error';
}

interface TeacherSchedule {
  teacher: string;
  classes: {
    class: string;
    subject: string;
    day: string;
    time: string;
    room: string;
  }[];
  totalHours: number;
}

const mockConflicts: Conflict[] = [
  {
    type: 'teacher',
    message: 'Dr. Sarah Wilson has overlapping classes',
    details: [
      'Monday 9:00-10:00 AM: Grade 9-A (Math) and Grade 10-B (Math)',
    ],
    severity: 'error',
  },
];

const mockTeacherSchedules: TeacherSchedule[] = [
  {
    teacher: 'Dr. Sarah Wilson',
    totalHours: 24,
    classes: [
      { class: 'Grade 9-A', subject: 'Math', day: 'Monday', time: '8:00-9:00 AM', room: '101' },
      { class: 'Grade 9-A', subject: 'Math', day: 'Tuesday', time: '9:00-10:00 AM', room: '101' },
      { class: 'Grade 9-A', subject: 'Math', day: 'Wednesday', time: '10:00-11:00 AM', room: '101' },
      { class: 'Grade 10-A', subject: 'Math', day: 'Thursday', time: '11:30-12:30 PM', room: '101' },
      { class: 'Grade 9-A', subject: 'Math', day: 'Friday', time: '8:00-9:00 AM', room: '101' },
    ],
  },
  {
    teacher: 'Mr. John Davis',
    totalHours: 20,
    classes: [
      { class: 'Grade 9-A', subject: 'Physics', day: 'Monday', time: '10:00-11:00 AM', room: '102' },
      { class: 'Grade 9-A', subject: 'Physics', day: 'Tuesday', time: '8:00-9:00 AM', room: '102' },
      { class: 'Grade 9-A', subject: 'Physics', day: 'Wednesday', time: '9:00-10:00 AM', room: '102' },
      { class: 'Grade 10-A', subject: 'Physics', day: 'Thursday', time: '10:00-11:00 AM', room: '102' },
    ],
  },
];

export default function TimetableConflictChecker() {
  const hasConflicts = mockConflicts.length > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {hasConflicts ? (
              <>
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Timetable Conflicts
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                No Conflicts Detected
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasConflicts ? (
            <div className="space-y-3">
              {mockConflicts.map((conflict, index) => (
                <Alert key={index} variant={conflict.severity === 'error' ? 'destructive' : 'default'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-semibold mb-2">{conflict.message}</div>
                    <ul className="text-sm space-y-1 ml-4 list-disc">
                      {conflict.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <p className="text-muted-foreground">
                All schedules are properly configured with no conflicts
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Teacher Schedules Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockTeacherSchedules.map((schedule, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-card-foreground">{schedule.teacher}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {schedule.totalHours} hours/week ({schedule.classes.length} classes)
                    </p>
                  </div>
                  <Badge
                    variant={schedule.totalHours > 25 ? 'destructive' : 'default'}
                  >
                    {schedule.totalHours > 25 ? 'Overloaded' : 'Normal Load'}
                  </Badge>
                </div>

                <div className="grid gap-2">
                  {schedule.classes.map((cls, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-accent/50 rounded-md text-sm"
                    >
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{cls.day}</Badge>
                        <span className="font-medium">{cls.time}</span>
                        <span>{cls.class}</span>
                        <span className="text-muted-foreground">({cls.subject})</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {cls.room}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
