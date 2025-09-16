'use client';

import { useState, useCallback } from 'react';
import { classesApi, type ClassInsert, type ClassUpdate } from '@/lib/api/classes';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const classSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  teacher: z.string().min(1, 'Teacher is required'),
  subject: z.string().min(1, 'Subject is required'),
  room: z.string().min(1, 'Room is required'),
  schedule: z.string().min(1, 'Schedule is required'),
  capacity: z.string().min(1, 'Capacity is required'),
});

type ClassFormData = z.infer<typeof classSchema>;

interface ClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  classData?: any;
  teachers?: any[];
  subjects?: any[];
  onSaved?: () => void;
}

export default function ClassModal({ 
  open, 
  onOpenChange, 
  mode, 
  classData, 
  teachers = [],
  subjects = [],
  onSaved 
}: ClassModalProps) {
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: classData ? {
      name: classData.name,
      teacher: classData.teacher_id,
      subject: classData.subject_id,
      room: classData.room,
      schedule: classData.schedule,
      capacity: classData.capacity?.toString(),
    } : {},
  });

  const onSubmit = useCallback(async (data: ClassFormData) => {
    try {
      const classDataToSave = {
        name: data.name,
        teacher_id: data.teacher,
        subject_id: data.subject,
        room: data.room,
        schedule: data.schedule,
        capacity: parseInt(data.capacity),
      };

      if (mode === 'create') {
        await classesApi.create(classDataToSave as ClassInsert);
        toast({
          title: "Success",
          description: "Class created successfully",
        });
      } else if (classData) {
        await classesApi.update(classData.id, classDataToSave as ClassUpdate);
        toast({
          title: "Success",
          description: "Class updated successfully",
        });
      }

      reset();
      onOpenChange(false);
      onSaved?.();
    } catch (error) {
      console.error('Error saving class:', error);
      toast({
        title: "Error",
        description: "Failed to save class",
        variant: "destructive",
      });
    }
  }, [mode, classData, reset, onOpenChange, onSaved, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">
            {mode === 'create' ? 'Add New Class' : 'Edit Class'}
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
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Class Name</Label>
              <Input
                id="name"
                placeholder="e.g., Grade 10A"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                placeholder="e.g., Room 101"
                {...register('room')}
              />
              {errors.room && (
                <p className="text-sm text-red-600">{errors.room.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher">Assign Teacher</Label>
            <Select 
              value={classData?.teacher_id}
              onValueChange={(value) => setValue('teacher', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.profiles?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.teacher && (
              <p className="text-sm text-red-600">{errors.teacher.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select 
              value={classData?.subject_id}
              onValueChange={(value) => setValue('subject', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject && (
              <p className="text-sm text-red-600">{errors.subject.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule</Label>
              <Input
                id="schedule"
                placeholder="e.g., Mon-Fri 9:00-10:00"
                {...register('schedule')}
              />
              {errors.schedule && (
                <p className="text-sm text-red-600">{errors.schedule.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="e.g., 30"
                {...register('capacity')}
              />
              {errors.capacity && (
                <p className="text-sm text-red-600">{errors.capacity.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
            >
              {mode === 'create' ? 'Save' : 'Update'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}