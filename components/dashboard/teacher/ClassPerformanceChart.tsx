'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const performanceData = [
  { class: 'Grade 10-A', avgScore: 85, highScore: 96, lowScore: 65 },
  { class: 'Grade 10-B', avgScore: 82, highScore: 94, lowScore: 68 },
  { class: 'Grade 9-A', avgScore: 78, highScore: 92, lowScore: 60 },
  { class: 'Grade 9-B', avgScore: 80, highScore: 90, lowScore: 62 },
];

export default function ClassPerformanceChart() {
  const maxValue = 100;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Class Performance Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {performanceData.map((data, index) => (
            <div key={index}>
              <div className="mb-3">
                <h4 className="font-semibold text-card-foreground mb-2">{data.class}</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Avg: {data.avgScore}</span>
                  <span>High: {data.highScore}</span>
                  <span>Low: {data.lowScore}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20">Average</span>
                  <div className="flex-1 bg-accent rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all"
                      style={{ width: `${(data.avgScore / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8 text-right">{data.avgScore}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20">Highest</span>
                  <div className="flex-1 bg-accent rounded-full h-3">
                    <div
                      className="bg-chart-2 h-3 rounded-full transition-all"
                      style={{ width: `${(data.highScore / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8 text-right">{data.highScore}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20">Lowest</span>
                  <div className="flex-1 bg-accent rounded-full h-3">
                    <div
                      className="bg-chart-3 h-3 rounded-full transition-all"
                      style={{ width: `${(data.lowScore / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8 text-right">{data.lowScore}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
