'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const routineSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  teacher: z.string().min(1, 'Teacher is required'),
  day: z.string().min(1, 'Day is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  room: z.string().min(1, 'Room is required'),
  type: z.enum(['class', 'break', 'lunch']),
}).refine(
  (data) => {
    const start = data.startTime.split(':').map(Number);
    const end = data.endTime.split(':').map(Number);
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];
    return endMinutes > startMinutes;
  },
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
);

type RoutineFormData = z.infer<typeof routineSchema>;

interface RoutineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  routine?: any;
  selectedClass: string;
  onSave: (data: any) => void;
}

const mockTeachers = [
  { id: '1', name: 'Dr. Sarah Wilson', subject: 'Mathematics' },
  { id: '2', name: 'Mr. John Davis', subject: 'Physics' },
  { id: '3', name: 'Ms. Emily Chen', subject: 'Chemistry' },
  { id: '4', name: 'Dr. Michael Brown', subject: 'Biology' },
  { id: '5', name: 'Ms. Jennifer Lee', subject: 'English' },
  { id: '6', name: 'Mr. David Martinez', subject: 'History' },
  { id: '7', name: 'Ms. Laura Garcia', subject: 'Geography' },
  { id: '8', name: 'Mr. James Anderson', subject: 'Physical Education' },
];

const mockSubjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
  'Geography',
  'Computer Science',
  'Physical Education',
  'Art',
  'Music',
];

const mockRooms = [
  '101', '102', '103', '104', '105', '106', '107', '108',
  '201', '202', '203', '204', '205',
  'Lab-1', 'Lab-2', 'Lab-3',
  'Gym', 'Auditorium', 'Library',
];

const days = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
];

export default function RoutineModal({
  open,
  onOpenChange,
  mode,
  routine,
  selectedClass,
  onSave
}: RoutineModalProps) {
  const [conflict, setConflict] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<RoutineFormData>({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      subject: routine?.subject || '',
      teacher: routine?.teacher || '',
      day: routine?.day || '',
      startTime: routine?.startTime || '',
      endTime: routine?.endTime || '',
      room: routine?.room || '',
      type: routine?.type || 'class',
    },
  });

  const watchTeacher = watch('teacher');
  const watchDay = watch('day');
  const watchStartTime = watch('startTime');
  const watchEndTime = watch('endTime');
  const watchRoom = watch('room');

  useEffect(() => {
    if (routine) {
      setValue('subject', routine.subject || '');
      setValue('teacher', routine.teacher || '');
      setValue('day', routine.day || '');
      setValue('startTime', routine.startTime || '');
      setValue('endTime', routine.endTime || '');
      setValue('room', routine.room || '');
      setValue('type', routine.type || 'class');
      setSelectedSubject(routine.subject || '');
    } else {
      reset({
        subject: '',
        teacher: '',
        day: '',
        startTime: '',
        endTime: '',
        room: '',
        type: 'class',
      });
      setSelectedSubject('');
    }
  }, [routine, reset, setValue]);

  useEffect(() => {
    if (watchTeacher && watchDay && watchStartTime && watchEndTime) {
      const hasConflict = checkTeacherConflict(watchTeacher, watchDay, watchStartTime, watchEndTime);
      if (hasConflict) {
        setConflict(`Teacher ${watchTeacher} already has a class at this time`);
      } else {
        setConflict(null);
      }
    }

    if (watchRoom && watchDay && watchStartTime && watchEndTime) {
      const hasRoomConflict = checkRoomConflict(watchRoom, watchDay, watchStartTime, watchEndTime);
      if (hasRoomConflict) {
        setConflict(`Room ${watchRoom} is already booked at this time`);
      }
    }
  }, [watchTeacher, watchDay, watchStartTime, watchEndTime, watchRoom]);

  const checkTeacherConflict = (teacher: string, day: string, start: string, end: string) => {
    return false;
  };

  const checkRoomConflict = (room: string, day: string, start: string, end: string) => {
    return false;
  };

  const onSubmit = (data: RoutineFormData) => {
    if (conflict) {
      return;
    }

    const scheduleData = {
      ...data,
      classId: selectedClass,
      slotId: routine?.slotId,
      time: `${data.startTime} - ${data.endTime}`,
    };

    onSave(scheduleData);
    reset();
    setConflict(null);
    setSelectedSubject('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {mode === 'create' ? 'Add New Schedule Slot' : 'Edit Schedule Slot'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {conflict && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{conflict}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Controller
                name="subject"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedSubject(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSubjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.subject && (
                <p className="text-sm text-destructive">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacher">Teacher *</Label>
              <Controller
                name="teacher"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTeachers
                        .filter(
                          (teacher) =>
                            !selectedSubject || teacher.subject === selectedSubject
                        )
                        .map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.name}>
                            {teacher.name} ({teacher.subject})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.teacher && (
                <p className="text-sm text-destructive">{errors.teacher.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="day">Day *</Label>
              <Controller
                name="day"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.day && (
                <p className="text-sm text-destructive">{errors.day.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="room">Room *</Label>
              <Controller
                name="room"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockRooms.map((room) => (
                        <SelectItem key={room} value={room}>
                          {room}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.room && (
                <p className="text-sm text-destructive">{errors.room.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                {...register('startTime')}
                className="w-full"
              />
              {errors.startTime && (
                <p className="text-sm text-destructive">{errors.startTime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                {...register('endTime')}
                className="w-full"
              />
              {errors.endTime && (
                <p className="text-sm text-destructive">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="class">Class</SelectItem>
                    <SelectItem value="break">Break</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                reset();
                setConflict(null);
                setSelectedSubject('');
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!!conflict}
              className="gap-2"
            >
              {!conflict && <CheckCircle2 className="w-4 h-4" />}
              {mode === 'create' ? 'Add Schedule' : 'Update Schedule'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}