'use client';

import { memo, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const gradeSchema = z.object({
  studentName: z.string().min(1, 'Student name is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  subject: z.string().min(1, 'Subject is required'),
  examType: z.string().min(1, 'Exam type is required'),
  totalMarks: z.string().min(1, 'Total marks is required'),
  obtainedMarks: z.string().min(1, 'Obtained marks is required'),
  date: z.string().min(1, 'Date is required'),
});

type GradeFormData = z.infer<typeof gradeSchema>;

interface ExamGradesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  grade?: any;
}

const ExamGradesModal = memo(function ExamGradesModal({ open, onOpenChange, mode, grade }: ExamGradesModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<GradeFormData>({
    resolver: zodResolver(gradeSchema),
    defaultValues: grade || {},
  });

  const totalMarks = watch('totalMarks');
  const obtainedMarks = watch('obtainedMarks');

  const calculateGrade = (obtained: number, total: number) => {
    const percentage = (obtained / total) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
  };

  const onSubmit = useCallback((data: GradeFormData) => {
    const obtained = parseInt(data.obtainedMarks);
    const total = parseInt(data.totalMarks);
    const percentage = ((obtained / total) * 100).toFixed(1);
    const grade = calculateGrade(obtained, total);

    const formData = {
      ...data,
      percentage: `${percentage}%`,
      grade,
    };

    console.log('Grade form submitted:', formData);
    reset();
    onOpenChange(false);
  }, [reset, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">
            {mode === 'create' ? 'Add Exam Grade' : 'Edit Exam Grade'}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name</Label>
              <Select onValueChange={(value) => setValue('studentName', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alice-johnson">Alice Johnson</SelectItem>
                  <SelectItem value="bob-smith">Bob Smith</SelectItem>
                  <SelectItem value="carol-davis">Carol Davis</SelectItem>
                  <SelectItem value="david-wilson">David Wilson</SelectItem>
                </SelectContent>
              </Select>
              {errors.studentName && (
                <p className="text-sm text-red-600">{errors.studentName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                placeholder="Enter student ID"
                {...register('studentId')}
              />
              {errors.studentId && (
                <p className="text-sm text-red-600">{errors.studentId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select onValueChange={(value) => setValue('subject', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                </SelectContent>
              </Select>
              {errors.subject && (
                <p className="text-sm text-red-600">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="examType">Exam Type</Label>
              <Select onValueChange={(value) => setValue('examType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mid-term">Mid Term</SelectItem>
                  <SelectItem value="final-term">Final Term</SelectItem>
                  <SelectItem value="class-test">Class Test</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                </SelectContent>
              </Select>
              {errors.examType && (
                <p className="text-sm text-red-600">{errors.examType.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks</Label>
              <Input
                id="totalMarks"
                type="number"
                placeholder="Enter total marks"
                {...register('totalMarks')}
              />
              {errors.totalMarks && (
                <p className="text-sm text-red-600">{errors.totalMarks.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="obtainedMarks">Obtained Marks</Label>
              <Input
                id="obtainedMarks"
                type="number"
                placeholder="Enter obtained marks"
                {...register('obtainedMarks')}
              />
              {errors.obtainedMarks && (
                <p className="text-sm text-red-600">{errors.obtainedMarks.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Exam Date</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
              />
              {errors.date && (
                <p className="text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>
          </div>

          {/* Grade Preview */}
          {totalMarks && obtainedMarks && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Percentage:</span>
                  <span className="ml-2 font-medium">
                    {((parseInt(obtainedMarks) / parseInt(totalMarks)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Grade:</span>
                  <span className="ml-2 font-medium">
                    {calculateGrade(parseInt(obtainedMarks), parseInt(totalMarks))}
                  </span>
                </div>
              </div>
            </div>
          )}

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
              {mode === 'create' ? 'Save Grade' : 'Update Grade'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});

export default ExamGradesModal;