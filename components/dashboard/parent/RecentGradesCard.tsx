'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const gradesData = [
  { month: 'Jan', math: 85, science: 88, english: 82 },
  { month: 'Feb', math: 87, science: 90, english: 85 },
  { month: 'Mar', math: 90, science: 92, english: 88 },
  { month: 'Apr', math: 88, science: 89, english: 90 },
  { month: 'May', math: 92, science: 93, english: 91 },
  { month: 'Jun', math: 94, science: 95, english: 93 },
];

export default function RecentGradesCard() {
  const maxValue = 100;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Recent Grades Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {gradesData.map((data, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">{data.month}</span>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-primary">Math: {data.math}</span>
                  <span className="text-chart-2">Science: {data.science}</span>
                  <span className="text-chart-3">English: {data.english}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-accent rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(data.math / maxValue) * 100}%` }}
                  />
                </div>
                <div className="flex-1 bg-accent rounded-full h-2">
                  <div
                    className="bg-chart-2 h-2 rounded-full transition-all"
                    style={{ width: `${(data.science / maxValue) * 100}%` }}
                  />
                </div>
                <div className="flex-1 bg-accent rounded-full h-2">
                  <div
                    className="bg-chart-3 h-2 rounded-full transition-all"
                    style={{ width: `${(data.english / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Mathematics</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-2" />
            <span className="text-xs text-muted-foreground">Science</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-3" />
            <span className="text-xs text-muted-foreground">English</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
