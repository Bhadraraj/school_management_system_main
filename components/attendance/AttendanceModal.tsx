'use client';

import { memo, useCallback, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Check, X as XIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const attendanceSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  class: z.string().min(1, 'Class is required'),
  subject: z.string().min(1, 'Subject is required'),
  students: z.array(z.object({
    id: z.string(),
    name: z.string(),
    status: z.enum(['present', 'absent', 'late']),
  })),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

interface AttendanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  attendance?: any;
  classes?: any[];
  students?: any[];
}

const AttendanceModal = memo(function AttendanceModal({ 
  open, 
  onOpenChange, 
  mode, 
  attendance, 
  classes = [],
  students = [] 
}: AttendanceModalProps) {
  const [studentAttendance, setStudentAttendance] = useState(
    students.slice(0, 10).map(student => ({
      ...student,
      status: 'present' as 'present' | 'absent' | 'late'
    }))
  );

  // Update student attendance when students prop changes
  useEffect(() => {
    setStudentAttendance(
      students.slice(0, 10).map(student => ({
        ...student,
        status: 'present' as 'present' | 'absent' | 'late'
      }))
    );
  }, [students]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: attendance || {},
  });

  const updateStudentStatus = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setStudentAttendance(prev => 
      prev.map(student => 
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const markAllPresent = () => {
    setStudentAttendance(prev => 
      prev.map(student => ({ ...student, status: 'present' as const }))
    );
  };

  const markAllAbsent = () => {
    setStudentAttendance(prev => 
      prev.map(student => ({ ...student, status: 'absent' as const }))
    );
  };

  const onSubmit = useCallback((data: AttendanceFormData) => {
    const formData = {
      ...data,
      students: studentAttendance
    };
    console.log('Attendance form submitted:', formData);
    reset();
    onOpenChange(false);
  }, [reset, onOpenChange, studentAttendance]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">
            {mode === 'create' ? 'Mark Attendance' : 'Edit Attendance'}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
              />
              {errors.date && (
                <p className="text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select onValueChange={(value) => setValue('class', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.class && (
                <p className="text-sm text-red-600">{errors.class.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select onValueChange={(value) => setValue('subject', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {classes.find(c => c.id === watch('class'))?.subjects ? (
                    <SelectItem value={classes.find(c => c.id === watch('class'))?.subjects?.id}>
                      {classes.find(c => c.id === watch('class'))?.subjects?.name}
                    </SelectItem>
                  ) : (
                    <SelectItem value="" disabled>Select class first</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.subject && (
                <p className="text-sm text-red-600">{errors.subject.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <Label className="text-base font-medium">Student Attendance</Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={markAllPresent}
                  className="text-xs"
                >
                  Mark All Present
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={markAllAbsent}
                  className="text-xs"
                >
                  Mark All Absent
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
              <div className="space-y-3">
                {studentAttendance.map((student) => (
                  <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-purple-600">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{student.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={student.status === 'present' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateStudentStatus(student.id, 'present')}
                        className={`text-xs ${student.status === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Present
                      </Button>
                      <Button
                        type="button"
                        variant={student.status === 'absent' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateStudentStatus(student.id, 'absent')}
                        className={`text-xs ${student.status === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                      >
                        <XIcon className="w-3 h-3 mr-1" />
                        Absent
                      </Button>
                      <Button
                        type="button"
                        variant={student.status === 'late' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateStudentStatus(student.id, 'late')}
                        className={`text-xs ${student.status === 'late' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}
                      >
                        Late
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
            >
              {mode === 'create' ? 'Save Attendance' : 'Update Attendance'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});

export default AttendanceModal;