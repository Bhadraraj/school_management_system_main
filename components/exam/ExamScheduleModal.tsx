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
import { cn } from '@/lib/utils';

const examSchema = z.object({
  examName: z.string().min(1, 'Exam name is required'),
  subjectType: z.string().min(1, 'Subject type is required'),
  class: z.string().min(1, 'Class is required'),
});

type ExamFormData = z.infer<typeof examSchema>;

const classes = [
  'Play',
  'Nursery',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
];

interface ExamScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExamScheduleModal({ open, onOpenChange }: ExamScheduleModalProps) {
  const [selectedClass, setSelectedClass] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
  });

  const onSubmit = (data: ExamFormData) => {
    console.log('Form submitted:', data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">Add New Exam</DialogTitle>
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
          <div className="space-y-2">
            <Label htmlFor="examName">Exam Name</Label>
            <Input
              id="examName"
              placeholder="Route Name"
              {...register('examName')}
              className="w-full"
            />
            {errors.examName && (
              <p className="text-sm text-red-600">{errors.examName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subjectType">Subject Type</Label>
            <Select onValueChange={(value) => setValue('subjectType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Please Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="class">Select Class</Label>
            <Select 
              value={selectedClass} 
              onValueChange={(value) => {
                setSelectedClass(value);
                setValue('class', value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Please Select" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((className) => (
                  <SelectItem key={className} value={className.toLowerCase()}>
                    {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Visual class selector */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {classes.map((className) => (
                <Button
                  key={className}
                  type="button"
                  variant={selectedClass === className.toLowerCase() ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedClass(className.toLowerCase())}
                  className={cn(
                    'h-8 text-xs',
                    selectedClass === className.toLowerCase() && 'bg-purple-600 hover:bg-purple-700'
                  )}
                >
                  {className}
                </Button>
              ))}
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
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}