"use client";

import { useState } from "react";
import Layout from "@/components/layout/Layout";
import RoutineModal from "@/components/routine/RoutineModal";
import BulkTimetableModal from "@/components/routine/BulkTimetableModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Clock, CreditCard as Edit, Trash2, Copy, Calendar, ChartBar as BarChart3 } from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useAuthStore } from '@/lib/store';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ScheduleSlot {
  id: string;
  time: string;
  monday?: { subject: string; teacher: string; room: string; type?: 'class' | 'break' | 'lunch' };
  tuesday?: { subject: string; teacher: string; room: string; type?: 'class' | 'break' | 'lunch' };
  wednesday?: { subject: string; teacher: string; room: string; type?: 'class' | 'break' | 'lunch' };
  thursday?: { subject: string; teacher: string; room: string; type?: 'class' | 'break' | 'lunch' };
  friday?: { subject: string; teacher: string; room: string; type?: 'class' | 'break' | 'lunch' };
}

const mockClasses = [
  { id: '1', name: 'Grade 9-A', section: 'A', grade: '9' },
  { id: '2', name: 'Grade 9-B', section: 'B', grade: '9' },
  { id: '3', name: 'Grade 10-A', section: 'A', grade: '10' },
  { id: '4', name: 'Grade 10-B', section: 'B', grade: '10' },
  { id: '5', name: 'Grade 11-A', section: 'A', grade: '11' },
];

const mockScheduleData: Record<string, ScheduleSlot[]> = {
  '1': [
    {
      id: '1',
      time: '8:00 - 9:00 AM',
      monday: { subject: 'Math', teacher: 'Dr. Sarah Wilson', room: '101', type: 'class' },
      tuesday: { subject: 'Physics', teacher: 'Mr. John Davis', room: '102', type: 'class' },
      wednesday: { subject: 'Chemistry', teacher: 'Ms. Emily Chen', room: '103', type: 'class' },
      thursday: { subject: 'Biology', teacher: 'Dr. Michael Brown', room: '104', type: 'class' },
      friday: { subject: 'Math', teacher: 'Dr. Sarah Wilson', room: '101', type: 'class' },
    },
    {
      id: '2',
      time: '9:00 - 10:00 AM',
      monday: { subject: 'English', teacher: 'Ms. Jennifer Lee', room: '105', type: 'class' },
      tuesday: { subject: 'Math', teacher: 'Dr. Sarah Wilson', room: '101', type: 'class' },
      wednesday: { subject: 'Physics', teacher: 'Mr. John Davis', room: '102', type: 'class' },
      thursday: { subject: 'Chemistry', teacher: 'Ms. Emily Chen', room: '103', type: 'class' },
      friday: { subject: 'English', teacher: 'Ms. Jennifer Lee', room: '105', type: 'class' },
    },
    {
      id: '3',
      time: '10:00 - 11:00 AM',
      monday: { subject: 'Physics', teacher: 'Mr. John Davis', room: '102', type: 'class' },
      tuesday: { subject: 'English', teacher: 'Ms. Jennifer Lee', room: '105', type: 'class' },
      wednesday: { subject: 'Math', teacher: 'Dr. Sarah Wilson', room: '101', type: 'class' },
      thursday: { subject: 'Physics', teacher: 'Mr. John Davis', room: '102', type: 'class' },
      friday: { subject: 'History', teacher: 'Mr. David Martinez', room: '106', type: 'class' },
    },
    {
      id: '4',
      time: '11:00 - 11:30 AM',
      monday: { subject: 'Break', teacher: '', room: '', type: 'break' },
      tuesday: { subject: 'Break', teacher: '', room: '', type: 'break' },
      wednesday: { subject: 'Break', teacher: '', room: '', type: 'break' },
      thursday: { subject: 'Break', teacher: '', room: '', type: 'break' },
      friday: { subject: 'Break', teacher: '', room: '', type: 'break' },
    },
    {
      id: '5',
      time: '11:30 - 12:30 PM',
      monday: { subject: 'Chemistry', teacher: 'Ms. Emily Chen', room: '103', type: 'class' },
      tuesday: { subject: 'Biology', teacher: 'Dr. Michael Brown', room: '104', type: 'class' },
      wednesday: { subject: 'English', teacher: 'Ms. Jennifer Lee', room: '105', type: 'class' },
      thursday: { subject: 'Math', teacher: 'Dr. Sarah Wilson', room: '101', type: 'class' },
      friday: { subject: 'Geography', teacher: 'Ms. Laura Garcia', room: '107', type: 'class' },
    },
    {
      id: '6',
      time: '12:30 - 1:30 PM',
      monday: { subject: 'Lunch Break', teacher: '', room: '', type: 'lunch' },
      tuesday: { subject: 'Lunch Break', teacher: '', room: '', type: 'lunch' },
      wednesday: { subject: 'Lunch Break', teacher: '', room: '', type: 'lunch' },
      thursday: { subject: 'Lunch Break', teacher: '', room: '', type: 'lunch' },
      friday: { subject: 'Lunch Break', teacher: '', room: '', type: 'lunch' },
    },
    {
      id: '7',
      time: '1:30 - 2:30 PM',
      monday: { subject: 'History', teacher: 'Mr. David Martinez', room: '106', type: 'class' },
      tuesday: { subject: 'Geography', teacher: 'Ms. Laura Garcia', room: '107', type: 'class' },
      wednesday: { subject: 'History', teacher: 'Mr. David Martinez', room: '106', type: 'class' },
      thursday: { subject: 'Geography', teacher: 'Ms. Laura Garcia', room: '107', type: 'class' },
      friday: { subject: 'PE', teacher: 'Mr. James Anderson', room: 'Gym', type: 'class' },
    },
  ],
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function RoutinePage() {
  const { user } = useAuthStore();
  const [selectedClass, setSelectedClass] = useState('1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkCopyOpen, setIsBulkCopyOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<any>(null);
  const [deleteSlot, setDeleteSlot] = useState<{ slotId: string; day: string } | null>(null);
  const [scheduleData, setScheduleData] = useState<Record<string, ScheduleSlot[]>>(mockScheduleData);

  const selectedSchedule = scheduleData[selectedClass] || [];
  const isAdmin = user?.role === 'admin';

  const handleEdit = (slot: ScheduleSlot, day: string) => {
    const dayData = slot[day as keyof Omit<ScheduleSlot, 'id' | 'time'>];
    if (dayData) {
      setEditingSlot({
        ...dayData,
        slotId: slot.id,
        day,
        time: slot.time,
        classId: selectedClass,
      });
      setIsModalOpen(true);
    }
  };

  const handleDelete = (slotId: string, day: string) => {
    setDeleteSlot({ slotId, day });
  };

  const confirmDelete = () => {
    if (deleteSlot) {
      setScheduleData(prev => {
        const newData = { ...prev };
        const classSchedule = [...(newData[selectedClass] || [])];
        const slotIndex = classSchedule.findIndex(s => s.id === deleteSlot.slotId);
        if (slotIndex !== -1) {
          const updatedSlot = { ...classSchedule[slotIndex] };
          delete updatedSlot[deleteSlot.day as keyof Omit<ScheduleSlot, 'id' | 'time'>];
          classSchedule[slotIndex] = updatedSlot;
          newData[selectedClass] = classSchedule;
        }
        return newData;
      });
      setDeleteSlot(null);
    }
  };

  const handleAddNew = () => {
    setEditingSlot(null);
    setIsModalOpen(true);
  };

  const handleCopyTimetable = () => {
    setIsBulkCopyOpen(true);
  };

  const handleBulkCopy = (data: { targetClassIds: string[]; days: string[] }) => {
    console.log('Bulk copy timetable:', data);
    setIsBulkCopyOpen(false);
  };

  const getSlotColor = (type?: 'class' | 'break' | 'lunch') => {
    switch (type) {
      case 'break':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'lunch':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'class':
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <>
      <Layout allowedRoles={["admin", "teacher", "parent"]}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-card-foreground mb-2">Class Timetable</h1>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Timetable</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <Link href="/routine/analysis">
                  <Button variant="outline" className="gap-2">
                    <BarChart3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Analysis</span>
                  </Button>
                </Link>
                <Button
                  onClick={handleCopyTimetable}
                  variant="outline"
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copy</span>
                </Button>
                <Button
                  onClick={handleAddNew}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Slot</span>
                </Button>
              </div>
            )}
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Weekly Schedule</span>
              </CardTitle>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {mockClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground min-w-[120px]">
                        Time
                      </th>
                      {days.map((day) => (
                        <th
                          key={day}
                          className="text-center py-3 px-2 text-sm font-medium text-muted-foreground min-w-[140px]"
                        >
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSchedule.map((slot) => (
                      <tr key={slot.id} className="border-b hover:bg-accent/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-card-foreground text-sm">
                          {slot.time}
                        </td>
                        {days.map((day) => {
                          const dayKey = day.toLowerCase() as keyof Omit<ScheduleSlot, 'id' | 'time'>;
                          const dayData = slot[dayKey];

                          return (
                            <td key={day} className="py-3 px-2">
                              {dayData ? (
                                <div className="group relative">
                                  <div
                                    className={`rounded-lg border p-2 text-xs transition-all hover:shadow-md ${
                                      getSlotColor(dayData.type)
                                    }`}
                                  >
                                    <div className="font-semibold mb-1">{dayData.subject}</div>
                                    {dayData.teacher && (
                                      <div className="text-xs opacity-75">{dayData.teacher}</div>
                                    )}
                                    {dayData.room && (
                                      <div className="text-xs opacity-75 mt-1">
                                        Room: {dayData.room}
                                      </div>
                                    )}
                                  </div>
                                  {isAdmin && dayData.type === 'class' && (
                                    <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 bg-background/90 hover:bg-background"
                                        onClick={() => handleEdit(slot, dayKey)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 bg-background/90 hover:bg-background text-destructive"
                                        onClick={() => handleDelete(slot.id, dayKey)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                isAdmin && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-xs h-16 border-dashed"
                                    onClick={() => {
                                      setEditingSlot({ slotId: slot.id, day: dayKey, time: slot.time, classId: selectedClass });
                                      setIsModalOpen(true);
                                    }}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                )
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>

      <RoutineModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode={editingSlot ? "edit" : "create"}
        routine={editingSlot}
        selectedClass={selectedClass}
        onSave={(data) => {
          console.log('Timetable data saved:', data);
          setIsModalOpen(false);
          setEditingSlot(null);
        }}
      />

      <AlertDialog open={!!deleteSlot} onOpenChange={() => setDeleteSlot(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schedule Slot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this schedule slot? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BulkTimetableModal
        open={isBulkCopyOpen}
        onOpenChange={setIsBulkCopyOpen}
        currentClassId={selectedClass}
        onCopy={handleBulkCopy}
      />
    </>
  );
}
