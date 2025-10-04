'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, TrendingUp, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ChildData {
  id: string;
  name: string;
  grade: string;
  attendance: number;
  gpa: number;
  photo: string;
}

const mockChild: ChildData = {
  id: 'STU001',
  name: 'Emma Johnson',
  grade: 'Grade 10-A',
  attendance: 94,
  gpa: 3.8,
  photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
};

export default function ChildOverviewCard() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Child Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4 mb-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={mockChild.photo} alt={mockChild.name} />
            <AvatarFallback>{mockChild.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-card-foreground">{mockChild.name}</h3>
            <p className="text-muted-foreground">{mockChild.grade}</p>
            <p className="text-sm text-muted-foreground">ID: {mockChild.id}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-accent/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Attendance Rate</span>
              </div>
              <span className="text-lg font-bold text-card-foreground">{mockChild.attendance}%</span>
            </div>
            <Progress value={mockChild.attendance} className="h-2" />
          </div>

          <div className="p-3 bg-accent/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Current GPA</span>
              </div>
              <span className="text-lg font-bold text-card-foreground">{mockChild.gpa}/4.0</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
