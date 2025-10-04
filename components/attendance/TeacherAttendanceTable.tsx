'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, CircleCheck as CheckCircle, Circle as XCircle, Calendar } from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  subject: string;
  avatar: string;
  email: string;
}

interface TeacherAttendanceStatus {
  [teacherId: string]: 'present' | 'absent' | 'leave' | null;
}

interface TeacherAttendanceTableProps {
  teachers: Teacher[];
  date: string;
  onAttendanceChange?: (attendance: TeacherAttendanceStatus) => void;
}

export default function TeacherAttendanceTable({
  teachers,
  date,
  onAttendanceChange
}: TeacherAttendanceTableProps) {
  const [attendance, setAttendance] = useState<TeacherAttendanceStatus>({});

  const handleStatusChange = (teacherId: string, status: 'present' | 'absent' | 'leave') => {
    const newAttendance = {
      ...attendance,
      [teacherId]: attendance[teacherId] === status ? null : status
    };
    setAttendance(newAttendance);
    onAttendanceChange?.(newAttendance);
  };

  const handleMarkAllPresent = () => {
    const allPresent = teachers.reduce((acc, teacher) => {
      acc[teacher.id] = 'present';
      return acc;
    }, {} as TeacherAttendanceStatus);
    setAttendance(allPresent);
    onAttendanceChange?.(allPresent);
  };

  const getStatusBadge = (status: 'present' | 'absent' | 'leave' | null) => {
    if (!status) return <Badge variant="outline">Not Marked</Badge>;

    const variants = {
      present: { color: 'bg-green-100 text-green-700', label: 'Present' },
      absent: { color: 'bg-red-100 text-red-700', label: 'Absent' },
      leave: { color: 'bg-blue-100 text-blue-700', label: 'On Leave' }
    };

    const variant = variants[status];
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  const stats = {
    present: Object.values(attendance).filter(s => s === 'present').length,
    absent: Object.values(attendance).filter(s => s === 'absent').length,
    leave: Object.values(attendance).filter(s => s === 'leave').length,
    total: teachers.length
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Teacher Attendance
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <Button
              onClick={handleMarkAllPresent}
              variant="outline"
              size="sm"
            >
              Mark All Present
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="p-3 bg-accent/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-card-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-700">{stats.present}</p>
            <p className="text-xs text-green-600">Present</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
            <p className="text-xs text-red-600">Absent</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-700">{stats.leave}</p>
            <p className="text-xs text-blue-600">On Leave</p>
          </div>
        </div>

        <div className="space-y-2">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="flex items-center justify-between p-4 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={teacher.avatar} alt={teacher.name} />
                  <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-card-foreground">{teacher.name}</h4>
                  <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(attendance[teacher.id])}

                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={attendance[teacher.id] === 'present' ? 'default' : 'outline'}
                    className={attendance[teacher.id] === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                    onClick={() => handleStatusChange(teacher.id, 'present')}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={attendance[teacher.id] === 'absent' ? 'destructive' : 'outline'}
                    onClick={() => handleStatusChange(teacher.id, 'absent')}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={attendance[teacher.id] === 'leave' ? 'default' : 'outline'}
                    className={attendance[teacher.id] === 'leave' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                    onClick={() => handleStatusChange(teacher.id, 'leave')}
                  >
                    <Calendar className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
