"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { ResponsiveContainer } from "recharts";
const data = [
  { name: "Mon", Girls: 65, Boys: 45 },
  { name: "Tue", Girls: 45, Boys: 75 },
  { name: "Wed", Girls: 85, Boys: 65 },
  { name: "Thu", Girls: 70, Boys: 85 },
  { name: "Fri", Girls: 95, Boys: 70 },
  { name: "Sat", Girls: 75, Boys: 90 },
  { name: "Sun", Girls: 60, Boys: 50 },
];

const ExamResultsChart = memo(function ExamResultsChart() {
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          All Exam Results
        </CardTitle>
        <Select defaultValue="monthly">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {/* @ts-ignore */}
          <ResponsiveContainer width="100%" height="100%">
            {/* @ts-ignore */}
            <LineChart data={data}>
              {/* @ts-ignore */}
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              {/* @ts-ignore */}
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              {/* @ts-ignore */}
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              {/* @ts-ignore */}
              <Legend />
              {/* @ts-ignore */}
              <Line
                type="monotone"
                dataKey="Girls"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#8B5CF6", strokeWidth: 2 }}
              />
              {/* @ts-ignore */}
              <Line
                type="monotone"
                dataKey="Boys"
                stroke="#06B6D4"
                strokeWidth={3}
                dot={{ fill: "#06B6D4", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#06B6D4", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});

export default ExamResultsChart;
