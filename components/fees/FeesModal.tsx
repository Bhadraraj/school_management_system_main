'use client';

import { memo, useCallback } from 'react';
import { feesApi, type FeeInsert, type FeeUpdate } from '@/lib/api/fees';
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

const feesSchema = z.object({
  student: z.string().min(1, 'Student is required'),
  feeType: z.string().min(1, 'Fee type is required'),
  amount: z.string().min(1, 'Amount is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  status: z.string().min(1, 'Status is required'),
  paymentMethod: z.string().optional(),
});

type FeesFormData = z.infer<typeof feesSchema>;

interface FeesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  fees?: any;
  students?: any[];
  onSaved?: () => void;
}

const FeesModal = memo(function FeesModal({ 
  open, 
  onOpenChange, 
  mode, 
  fees, 
  students = [],
  onSaved 
}: FeesModalProps) {
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FeesFormData>({
    resolver: zodResolver(feesSchema),
    defaultValues: fees ? {
      student: fees.student_id,
      feeType: fees.fee_type,
      amount: fees.amount?.toString(),
      dueDate: fees.due_date,
      status: fees.status,
      paymentMethod: fees.payment_method,
    } : {},
  });

  const onSubmit = useCallback(async (data: FeesFormData) => {
    try {
      const feeData = {
        student_id: data.student,
        fee_type: data.feeType as any,
        amount: parseFloat(data.amount),
        due_date: data.dueDate,
        status: data.status as any,
        payment_method: data.paymentMethod,
      };

      if (mode === 'create') {
        await feesApi.create(feeData as FeeInsert);
        toast({
          title: "Success",
          description: "Fee record created successfully",
        });
      } else if (fees) {
        await feesApi.update(fees.id, feeData as FeeUpdate);
        toast({
          title: "Success",
          description: "Fee record updated successfully",
        });
      }

      reset();
      onOpenChange(false);
      onSaved?.();
    } catch (error) {
      console.error('Error saving fee:', error);
      toast({
        title: "Error",
        description: "Failed to save fee record",
        variant: "destructive",
      });
    }
  }, [mode, fees, reset, onOpenChange, onSaved, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">
            {mode === 'create' ? 'Add New Fee Record' : 'Edit Fee Record'}
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
          <div className="space-y-2">
            <Label htmlFor="student">Student</Label>
            <Select 
              value={fees?.student_id}
              onValueChange={(value) => setValue('student', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} - {student.classes?.name || 'No Class'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.student && (
              <p className="text-sm text-red-600">{errors.student.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feeType">Fee Type</Label>
              <Select 
                value={fees?.fee_type}
                onValueChange={(value) => setValue('feeType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fee type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tuition">Tuition Fee</SelectItem>
                  <SelectItem value="library">Library Fee</SelectItem>
                  <SelectItem value="transport">Transport Fee</SelectItem>
                  <SelectItem value="hostel">Hostel Fee</SelectItem>
                  <SelectItem value="exam">Exam Fee</SelectItem>
                  <SelectItem value="activity">Activity Fee</SelectItem>
                </SelectContent>
              </Select>
              {errors.feeType && (
                <p className="text-sm text-red-600">{errors.feeType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="Enter amount"
                {...register('amount')}
              />
              {errors.amount && (
                <p className="text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                {...register('dueDate')}
              />
              {errors.dueDate && (
                <p className="text-sm text-red-600">{errors.dueDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Payment Status</Label>
              <Select 
                value={fees?.status}
                onValueChange={(value) => setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          </div>

          {(fees?.status === 'paid' || fees?.status === 'partial') && (
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select 
                value={fees?.payment_method}
                onValueChange={(value) => setValue('paymentMethod', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="online">Online Payment</SelectItem>
                </SelectContent>
              </Select>
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
              {mode === 'create' ? 'Save' : 'Update'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});

export default FeesModal;