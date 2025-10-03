'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().min(1, 'Subject code is required'),
  teacher: z.string().min(1, 'Teacher is required'),
  credits: z.string().min(1, 'Credits is required'),
  description: z.string().min(1, 'Description is required'),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

interface SubjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  subject?: any;
}

export default function SubjectModal({ open, onOpenChange, mode, subject }: SubjectModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: subject || {},
  });

  const onSubmit = (data: SubjectFormData) => {
    console.log('Subject form submitted:', data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">
            {mode === 'create' ? 'Add New Subject' : 'Edit Subject'}
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
              <Label htmlFor="name">Subject Name</Label>
              <Input
                id="name"
                placeholder="e.g., Mathematics"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Subject Code</Label>
              <Input
                id="code"
                placeholder="e.g., MATH101"
                {...register('code')}
              />
              {errors.code && (
                <p className="text-sm text-red-600">{errors.code.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher">Assign Teacher</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dr-sarah-wilson">Dr. Sarah Wilson</SelectItem>
                <SelectItem value="mr-john-davis">Mr. John Davis</SelectItem>
                <SelectItem value="ms-emily-chen">Ms. Emily Chen</SelectItem>
                <SelectItem value="dr-michael-brown">Dr. Michael Brown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="credits">Credits</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select credits" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Credit</SelectItem>
                <SelectItem value="2">2 Credits</SelectItem>
                <SelectItem value="3">3 Credits</SelectItem>
                <SelectItem value="4">4 Credits</SelectItem>
                <SelectItem value="5">5 Credits</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter subject description"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
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