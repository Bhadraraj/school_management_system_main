'use client';

import { memo, useCallback } from 'react';
import { teachersApi, type TeacherInsert, type TeacherUpdate } from '@/lib/api/teachers';
import { authApi } from '@/lib/api/auth';
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

const teacherSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  subject: z.string().min(1, 'Subject is required'),
  experience: z.string().min(1, 'Experience is required'),
  qualification: z.string().min(1, 'Qualification is required'),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

interface TeacherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  teacher?: any;
  subjects?: any[];
  onSaved?: () => void;
}

const TeacherModal = memo(function TeacherModal({ 
  open, 
  onOpenChange, 
  mode, 
  teacher, 
  subjects = [],
  onSaved 
}: TeacherModalProps) {
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: teacher ? {
      name: teacher.profiles?.name,
      email: teacher.profiles?.email,
      phone: teacher.profiles?.phone,
      subject: teacher.subject_id,
      experience: teacher.experience_years?.toString(),
      qualification: teacher.qualification,
    } : {},
  });

  const onSubmit = useCallback(async (data: TeacherFormData) => {
    try {
      if (mode === 'create') {
        // Create teacher record with demo profile
        const teacherData: TeacherInsert = {
          profile_id: `profile-${Date.now()}`,
          subject_id: data.subject,
          experience_years: parseInt(data.experience),
          qualification: data.qualification,
          join_date: new Date().toISOString().split('T')[0],
        };

        await teachersApi.create(teacherData);
        toast({
          title: "Success",
          description: "Teacher created successfully",
        });
      } else if (teacher) {
        // Update teacher record
        const teacherData: TeacherUpdate = {
          subject_id: data.subject,
          experience_years: parseInt(data.experience),
          qualification: data.qualification,
        };

        await teachersApi.update(teacher.id, teacherData);

        toast({
          title: "Success",
          description: "Teacher updated successfully",
        });
      }

      reset();
      onOpenChange(false);
      onSaved?.();
    } catch (error) {
      console.error('Error saving teacher:', error);
      toast({
        title: "Error",
        description: "Failed to save teacher",
        variant: "destructive",
      });
    }
  }, [mode, teacher, reset, onOpenChange, onSaved, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">
            {mode === 'create' ? 'Add New Teacher' : 'Edit Teacher'}
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
              <Label htmlFor="name">Teacher Name</Label>
              <Input
                id="name"
                placeholder="Enter name"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="Enter phone"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                placeholder="e.g., 5 years"
                {...register('experience')}
              />
              {errors.experience && (
                <p className="text-sm text-red-600">{errors.experience.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select 
              value={teacher?.subject_id}
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

          <div className="space-y-2">
            <Label htmlFor="qualification">Qualification</Label>
            <Input
              id="qualification"
              placeholder="e.g., M.Sc. Mathematics"
              {...register('qualification')}
            />
            {errors.qualification && (
              <p className="text-sm text-red-600">{errors.qualification.message}</p>
            )}
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
)
export default TeacherModal