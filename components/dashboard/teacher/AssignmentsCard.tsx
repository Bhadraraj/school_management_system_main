'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Assignment {
  id: string;
  title: string;
  class: string;
  dueDate: string;
  submitted: number;
  total: number;
  status: 'pending' | 'grading' | 'completed';
}

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Quadratic Equations Worksheet',
    class: 'Grade 10-A',
    dueDate: '2025-10-06',
    submitted: 28,
    total: 35,
    status: 'grading'
  },
  {
    id: '2',
    title: 'Algebra Problem Set',
    class: 'Grade 9-A',
    dueDate: '2025-10-05',
    submitted: 35,
    total: 38,
    status: 'grading'
  },
  {
    id: '3',
    title: 'Geometry Quiz',
    class: 'Grade 10-B',
    dueDate: '2025-10-08',
    submitted: 0,
    total: 32,
    status: 'pending'
  },
];

export default function AssignmentsCard() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Assignments & Grading
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="p-3 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-card-foreground flex-1">{assignment.title}</h4>
                <Badge variant={assignment.status === 'pending' ? 'secondary' : 'default'}>
                  {assignment.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{assignment.class}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Due: {assignment.dueDate}</span>
                <div className="flex items-center gap-1">
                  {assignment.submitted < assignment.total && (
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  )}
                  <span className="font-medium">
                    {assignment.submitted}/{assignment.total} submitted
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
