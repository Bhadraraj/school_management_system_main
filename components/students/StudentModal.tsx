"use client";

import { memo, useCallback } from "react";
import { studentsApi, type StudentInsert, type StudentUpdate } from "@/lib/api/students";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  class: z.string().min(1, "Class is required"),
  roll: z.string().min(1, "Roll number is required"),
  address: z.string().min(1, "Address is required"),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  student?: any;
  classes?: any[];
  onSaved?: () => void;
}

const StudentModal = memo(function StudentModal({
  open,
  onOpenChange,
  mode,
  student,
  classes = [],
  onSaved,
}: StudentModalProps) {
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: student ? {
      name: student.name,
      email: student.email,
      phone: student.phone,
      class: student.class_id,
      roll: student.roll_number,
      address: student.address,
    } : {},
  });

  const onSubmit = useCallback(
    (data: StudentFormData) => {
      try {
        const studentData = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          class_id: data.class,
          roll_number: data.roll,
          address: data.address,
          date_of_birth: '2008-01-01', // Default date, should be added to form
          admission_date: new Date().toISOString().split('T')[0],
        };

        if (mode === 'create') {
          await studentsApi.create(studentData as StudentInsert);
          toast({
            title: "Success",
            description: "Student created successfully",
          });
        } else if (student) {
          await studentsApi.update(student.id, studentData as StudentUpdate);
          toast({
            title: "Success",
            description: "Student updated successfully",
          });
        }

        reset();
        onOpenChange(false);
        onSaved?.();
      } catch (error) {
        console.error('Error saving student:', error);
        toast({
          title: "Error",
          description: "Failed to save student",
          variant: "destructive",
        });
      }
    },
    [mode, student, reset, onOpenChange, onSaved, toast]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">
            {mode === "create" ? "Add New Student" : "Edit Student"}
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
              <Label htmlFor="name">Student Name</Label>
              <Input id="name" placeholder="Enter name" {...register("name")} />
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
                {...register("email")}
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
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="roll">Roll Number</Label>
              <Input id="roll" placeholder="Enter roll" {...register("roll")} />
              {errors.roll && (
                <p className="text-sm text-red-600">{errors.roll.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select 
              value={student?.class_id}
              onValueChange={(value) => setValue('class', value)}
            >
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
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Enter address"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-sm text-red-600">{errors.address.message}</p>
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
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              {mode === "create" ? "Save" : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});
export default StudentModal;
