'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Notice {
  id: string;
  title: string;
  date: string;
  type: 'notice' | 'event' | 'meeting';
  description: string;
}

const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'Parent-Teacher Meeting',
    date: '2025-10-15',
    type: 'meeting',
    description: 'Quarterly PTM scheduled. Please confirm attendance.'
  },
  {
    id: '2',
    title: 'Annual Sports Day',
    date: '2025-10-20',
    type: 'event',
    description: 'School sports day celebration. All students required.'
  },
  {
    id: '3',
    title: 'Mid-Term Results Published',
    date: '2025-10-02',
    type: 'notice',
    description: 'Mid-term examination results are now available.'
  },
  {
    id: '4',
    title: 'Science Fair',
    date: '2025-10-25',
    type: 'event',
    description: 'Annual science fair. Students to prepare projects.'
  },
];

const typeColors = {
  notice: 'bg-blue-100 text-blue-700',
  event: 'bg-green-100 text-green-700',
  meeting: 'bg-amber-100 text-amber-700'
};

export default function NoticesEventsCard() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Notices & Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockNotices.map((notice) => (
            <div
              key={notice.id}
              className="p-3 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-card-foreground flex-1">{notice.title}</h4>
                <Badge className={typeColors[notice.type]}>
                  {notice.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{notice.description}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{notice.date}</span>
              </div>
            </div>
          ))}
        </div>
        <Link href="/notice">
          <Button variant="ghost" className="w-full mt-4">
            View All Notices
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
