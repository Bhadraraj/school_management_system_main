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

const transportSchema = z.object({
  routeName: z.string().min(1, 'Route name is required'),
  vehicleNumber: z.string().min(1, 'Vehicle number is required'),
  driverName: z.string().min(1, 'Driver name is required'),
  driverPhone: z.string().min(1, 'Driver phone is required'),
  capacity: z.string().min(1, 'Capacity is required'),
  fare: z.string().min(1, 'Fare is required'),
});

type TransportFormData = z.infer<typeof transportSchema>;

interface TransportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  transport?: any;
}

export default function TransportModal({ open, onOpenChange, mode, transport }: TransportModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TransportFormData>({
    resolver: zodResolver(transportSchema),
    defaultValues: transport || {},
  });

  const onSubmit = (data: TransportFormData) => {
    console.log('Transport form submitted:', data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">
            {mode === 'create' ? 'Add New Route' : 'Edit Route'}
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
              <Label htmlFor="routeName">Route Name</Label>
              <Input
                id="routeName"
                placeholder="Enter route name"
                {...register('routeName')}
              />
              {errors.routeName && (
                <p className="text-sm text-red-600">{errors.routeName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleNumber">Vehicle Number</Label>
              <Input
                id="vehicleNumber"
                placeholder="e.g., ABC-1234"
                {...register('vehicleNumber')}
              />
              {errors.vehicleNumber && (
                <p className="text-sm text-red-600">{errors.vehicleNumber.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="driverName">Driver Name</Label>
              <Input
                id="driverName"
                placeholder="Enter driver name"
                {...register('driverName')}
              />
              {errors.driverName && (
                <p className="text-sm text-red-600">{errors.driverName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="driverPhone">Driver Phone</Label>
              <Input
                id="driverPhone"
                placeholder="Enter phone number"
                {...register('driverPhone')}
              />
              {errors.driverPhone && (
                <p className="text-sm text-red-600">{errors.driverPhone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="e.g., 40"
                {...register('capacity')}
              />
              {errors.capacity && (
                <p className="text-sm text-red-600">{errors.capacity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fare">Monthly Fare</Label>
              <Input
                id="fare"
                placeholder="e.g., $50"
                {...register('fare')}
              />
              {errors.fare && (
                <p className="text-sm text-red-600">{errors.fare.message}</p>
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