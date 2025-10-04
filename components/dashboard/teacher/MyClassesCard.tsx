'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ClassData {
  id: string;
  name: string;
  studentCount: number;
  href: string;
}

const mockClasses: ClassData[] = [
  { id: '1', name: 'Grade 10-A', studentCount: 35, href: '/class' },
  { id: '2', name: 'Grade 10-B', studentCount: 32, href: '/class' },
  { id: '3', name: 'Grade 9-A', studentCount: 38, href: '/class' },
  { id: '4', name: 'Grade 9-B', studentCount: 30, href: '/class' },
];

export default function MyClassesCard() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          My Classes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockClasses.map((classItem) => (
            <div
              key={classItem.id}
              className="flex items-center justify-between p-3 bg-accent/50 rounded-lg hover:bg-accent transition-colors group"
            >
              <div>
                <h4 className="font-semibold text-card-foreground">{classItem.name}</h4>
                <p className="text-sm text-muted-foreground">{classItem.studentCount} Students</p>
              </div>
              <Link href={classItem.href}>
                <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
