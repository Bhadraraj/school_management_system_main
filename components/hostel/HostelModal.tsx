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

const hostelSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  roomType: z.string().min(1, 'Room type is required'),
  capacity: z.string().min(1, 'Capacity is required'),
  rent: z.string().min(1, 'Rent is required'),
  facilities: z.string().min(1, 'Facilities is required'),
  warden: z.string().min(1, 'Warden is required'),
});

type HostelFormData = z.infer<typeof hostelSchema>;

interface HostelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  hostel?: any;
}

export default function HostelModal({ open, onOpenChange, mode, hostel }: HostelModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HostelFormData>({
    resolver: zodResolver(hostelSchema),
    defaultValues: hostel || {},
  });

  const onSubmit = (data: HostelFormData) => {
    console.log('Hostel form submitted:', data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">
            {mode === 'create' ? 'Add New Room' : 'Edit Room'}
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
              <Label htmlFor="roomNumber">Room Number</Label>
              <Input
                id="roomNumber"
                placeholder="e.g., H-101"
                {...register('roomNumber')}
              />
              {errors.roomNumber && (
                <p className="text-sm text-red-600">{errors.roomNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomType">Room Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="triple">Triple</SelectItem>
                  <SelectItem value="quad">Quad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="e.g., 2"
                {...register('capacity')}
              />
              {errors.capacity && (
                <p className="text-sm text-red-600">{errors.capacity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rent">Monthly Rent</Label>
              <Input
                id="rent"
                placeholder="e.g., $200"
                {...register('rent')}
              />
              {errors.rent && (
                <p className="text-sm text-red-600">{errors.rent.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="warden">Warden</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select warden" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mr-james-wilson">Mr. James Wilson</SelectItem>
                <SelectItem value="ms-sarah-davis">Ms. Sarah Davis</SelectItem>
                <SelectItem value="dr-michael-brown">Dr. Michael Brown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facilities">Facilities</Label>
            <Input
              id="facilities"
              placeholder="e.g., WiFi, AC, Study Table"
              {...register('facilities')}
            />
            {errors.facilities && (
              <p className="text-sm text-red-600">{errors.facilities.message}</p>
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