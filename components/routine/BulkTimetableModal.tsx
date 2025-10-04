'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, TriangleAlert as AlertTriangle } from 'lucide-react';

interface BulkTimetableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentClassId: string;
  onCopy: (data: { targetClassIds: string[]; days: string[] }) => void;
}

const mockClasses = [
  { id: '1', name: 'Grade 9-A', section: 'A', grade: '9' },
  { id: '2', name: 'Grade 9-B', section: 'B', grade: '9' },
  { id: '3', name: 'Grade 10-A', section: 'A', grade: '10' },
  { id: '4', name: 'Grade 10-B', section: 'B', grade: '10' },
  { id: '5', name: 'Grade 11-A', section: 'A', grade: '11' },
];

const days = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
];

export default function BulkTimetableModal({
  open,
  onOpenChange,
  currentClassId,
  onCopy,
}: BulkTimetableModalProps) {
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [copyMode, setCopyMode] = useState<'overwrite' | 'merge'>('overwrite');

  const availableClasses = mockClasses.filter(cls => cls.id !== currentClassId);
  const currentClass = mockClasses.find(cls => cls.id === currentClassId);

  const handleClassToggle = (classId: string) => {
    setSelectedClasses(prev =>
      prev.includes(classId)
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSelectAllClasses = () => {
    if (selectedClasses.length === availableClasses.length) {
      setSelectedClasses([]);
    } else {
      setSelectedClasses(availableClasses.map(cls => cls.id));
    }
  };

  const handleSelectAllDays = () => {
    if (selectedDays.length === days.length) {
      setSelectedDays([]);
    } else {
      setSelectedDays(days.map(day => day.value));
    }
  };

  const handleCopy = () => {
    if (selectedClasses.length === 0 || selectedDays.length === 0) {
      return;
    }

    onCopy({
      targetClassIds: selectedClasses,
      days: selectedDays,
    });

    setSelectedClasses([]);
    setSelectedDays([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="w-5 h-5" />
            Copy Timetable: {currentClass?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This will copy the selected days from {currentClass?.name} to the target classes.
              {copyMode === 'overwrite' && ' Existing schedules will be overwritten.'}
              {copyMode === 'merge' && ' Existing schedules will be preserved, empty slots will be filled.'}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label>Copy Mode</Label>
            <Select value={copyMode} onValueChange={(value: any) => setCopyMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overwrite">Overwrite Existing</SelectItem>
                <SelectItem value="merge">Merge (Keep Existing)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">Select Days to Copy</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSelectAllDays}
              >
                {selectedDays.length === days.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {days.map((day) => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day.value}`}
                    checked={selectedDays.includes(day.value)}
                    onCheckedChange={() => handleDayToggle(day.value)}
                  />
                  <label
                    htmlFor={`day-${day.value}`}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {day.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">Select Target Classes</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSelectAllClasses}
              >
                {selectedClasses.length === availableClasses.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            <div className="grid gap-2">
              {availableClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => handleClassToggle(cls.id)}
                >
                  <Checkbox
                    id={`class-${cls.id}`}
                    checked={selectedClasses.includes(cls.id)}
                    onCheckedChange={() => handleClassToggle(cls.id)}
                  />
                  <label
                    htmlFor={`class-${cls.id}`}
                    className="flex-1 text-sm font-medium cursor-pointer"
                  >
                    {cls.name}
                    <span className="text-muted-foreground ml-2">
                      (Grade {cls.grade}, Section {cls.section})
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setSelectedClasses([]);
                setSelectedDays([]);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCopy}
              disabled={selectedClasses.length === 0 || selectedDays.length === 0}
              className="gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Timetable
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
