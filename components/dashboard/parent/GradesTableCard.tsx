'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Grade {
  id: string;
  subject: string;
  exam: string;
  score: number;
  totalMarks: number;
  grade: string;
  date: string;
}

const mockGrades: Grade[] = [
  { id: '1', subject: 'Mathematics', exam: 'Mid-Term', score: 92, totalMarks: 100, grade: 'A', date: '2025-09-28' },
  { id: '2', subject: 'Science', exam: 'Mid-Term', score: 88, totalMarks: 100, grade: 'A', date: '2025-09-29' },
  { id: '3', subject: 'English', exam: 'Mid-Term', score: 85, totalMarks: 100, grade: 'B+', date: '2025-09-30' },
  { id: '4', subject: 'History', exam: 'Mid-Term', score: 90, totalMarks: 100, grade: 'A', date: '2025-10-01' },
  { id: '5', subject: 'Geography', exam: 'Mid-Term', score: 87, totalMarks: 100, grade: 'B+', date: '2025-10-02' },
];

const getGradeColor = (grade: string) => {
  if (grade === 'A' || grade === 'A+') return 'bg-green-100 text-green-700';
  if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700';
  if (grade.startsWith('C')) return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
};

export default function GradesTableCard() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Recent Exam Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Subject</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Exam</th>
                <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Score</th>
                <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Grade</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {mockGrades.map((grade) => (
                <tr key={grade.id} className="border-b border-border hover:bg-accent transition-colors">
                  <td className="py-3 px-2 font-medium text-card-foreground">{grade.subject}</td>
                  <td className="py-3 px-2 text-muted-foreground">{grade.exam}</td>
                  <td className="py-3 px-2 text-center text-muted-foreground">
                    {grade.score}/{grade.totalMarks}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <Badge className={getGradeColor(grade.grade)}>
                      {grade.grade}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-right text-sm text-muted-foreground">{grade.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
