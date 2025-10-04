'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  rollNo: string;
  avatar: string;
}

interface AttendanceStatus {
  [studentId: string]: 'present' | 'absent' | 'late' | null;
}

interface StudentAttendanceListProps {
  students: Student[];
  isLocked: boolean;
  onAttendanceChange?: (attendance: AttendanceStatus) => void;
}

export default function StudentAttendanceList({
  students,
  isLocked,
  onAttendanceChange
}: StudentAttendanceListProps) {
  const [attendance, setAttendance] = useState<AttendanceStatus>({});

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    if (isLocked) return;

    const newAttendance = {
      ...attendance,
      [studentId]: attendance[studentId] === status ? null : status
    };
    setAttendance(newAttendance);
    onAttendanceChange?.(newAttendance);
  };

  const handleMarkAllPresent = () => {
    if (isLocked) return;

    const allPresent = students.reduce((acc, student) => {
      acc[student.id] = 'present';
      return acc;
    }, {} as AttendanceStatus);
    setAttendance(allPresent);
    onAttendanceChange?.(allPresent);
  };

  const handleClearAll = () => {
    if (isLocked) return;

    setAttendance({});
    onAttendanceChange?.({});
  };

  const getStatusBadge = (status: 'present' | 'absent' | 'late' | null) => {
    if (!status) return null;

    const variants = {
      present: { color: 'bg-green-100 text-green-700', label: 'Present' },
      absent: { color: 'bg-red-100 text-red-700', label: 'Absent' },
      late: { color: 'bg-amber-100 text-amber-700', label: 'Late' }
    };

    const variant = variants[status];
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  const stats = {
    present: Object.values(attendance).filter(s => s === 'present').length,
    absent: Object.values(attendance).filter(s => s === 'absent').length,
    late: Object.values(attendance).filter(s => s === 'late').length,
    total: students.length
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Student Attendance
            {isLocked && (
              <Badge variant="destructive" className="ml-2">Locked</Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={handleMarkAllPresent}
              variant="outline"
              size="sm"
              disabled={isLocked}
            >
              Mark All Present
            </Button>
            <Button
              onClick={handleClearAll}
              variant="outline"
              size="sm"
              disabled={isLocked}
            >
              Clear All
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
          <div className="p-3 bg-amber-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-amber-700">{stats.late}</p>
            <p className="text-xs text-amber-600">Late</p>
          </div>
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {students.map((student) => (
            <div
              key={student.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                isLocked ? 'bg-accent/30' : 'bg-accent/50 hover:bg-accent'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-card-foreground">{student.name}</h4>
                  <p className="text-sm text-muted-foreground">Roll No: {student.rollNo}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusBadge(attendance[student.id])}

                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={attendance[student.id] === 'present' ? 'default' : 'outline'}
                    className={attendance[student.id] === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                    onClick={() => handleStatusChange(student.id, 'present')}
                    disabled={isLocked}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={attendance[student.id] === 'late' ? 'default' : 'outline'}
                    className={attendance[student.id] === 'late' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                    onClick={() => handleStatusChange(student.id, 'late')}
                    disabled={isLocked}
                  >
                    <Clock className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={attendance[student.id] === 'absent' ? 'destructive' : 'outline'}
                    onClick={() => handleStatusChange(student.id, 'absent')}
                    disabled={isLocked}
                  >
                    <XCircle className="w-4 h-4" />
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
