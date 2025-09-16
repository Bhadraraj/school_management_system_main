'use client';

import { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Male', value: 8500, color: '#8B5CF6' },
  { name: 'Female', value: 6500, color: '#F97316' },
];

const StudentsChart = memo(function StudentsChart() {
  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), []);

  return (
    <Card className="w-full lg:w-80">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Students</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500">Total</span>
            <span className="text-lg font-bold text-gray-900">{total.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-600">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

export default StudentsChart;