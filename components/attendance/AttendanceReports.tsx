'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AttendanceReport {
  className: string;
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

interface AttendanceReportsProps {
  reports: AttendanceReport[];
  onExportCSV?: () => void;
  onExportPDF?: () => void;
}

export default function AttendanceReports({
  reports,
  onExportCSV,
  onExportPDF
}: AttendanceReportsProps) {
  const overallStats = reports.reduce(
    (acc, report) => ({
      totalStudents: acc.totalStudents + report.totalStudents,
      present: acc.present + report.present,
      absent: acc.absent + report.absent,
      late: acc.late + report.late
    }),
    { totalStudents: 0, present: 0, absent: 0, late: 0 }
  );

  const overallPercentage = overallStats.totalStudents > 0
    ? Math.round((overallStats.present / overallStats.totalStudents) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Overall Attendance Summary
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={onExportCSV} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={onExportPDF} variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="p-4 bg-accent/50 rounded-lg text-center">
              <p className="text-3xl font-bold text-card-foreground">{overallStats.totalStudents}</p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-3xl font-bold text-green-700">{overallStats.present}</p>
              <p className="text-sm text-green-600">Present</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg text-center">
              <p className="text-3xl font-bold text-red-700">{overallStats.absent}</p>
              <p className="text-sm text-red-600">Absent</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg text-center">
              <p className="text-3xl font-bold text-amber-700">{overallStats.late}</p>
              <p className="text-sm text-amber-600">Late</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg text-center">
              <p className="text-3xl font-bold text-primary">{overallPercentage}%</p>
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground ml-auto">{overallPercentage}%</span>
          </div>
          <Progress value={overallPercentage} className="h-3" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Class-wise Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report, index) => (
              <div key={index} className="p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-card-foreground">{report.className}</h4>
                  <span className="text-2xl font-bold text-primary">{report.percentage}%</span>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-card-foreground">{report.totalStudents}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-700">{report.present}</p>
                    <p className="text-xs text-green-600">Present</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-red-700">{report.absent}</p>
                    <p className="text-xs text-red-600">Absent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-amber-700">{report.late}</p>
                    <p className="text-xs text-amber-600">Late</p>
                  </div>
                </div>

                <Progress value={report.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
