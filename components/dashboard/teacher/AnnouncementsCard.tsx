'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Announcement {
  id: string;
  title: string;
  date: string;
  category: string;
}

const mockAnnouncements: Announcement[] = [
  { id: '1', title: 'Parent-Teacher Meeting scheduled for Oct 15', date: '2025-10-03', category: 'Meeting' },
  { id: '2', title: 'Mid-term exam results published', date: '2025-10-02', category: 'Exam' },
  { id: '3', title: 'School sports day on Oct 20', date: '2025-10-01', category: 'Event' },
];

export default function AnnouncementsCard() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Announcements
          </CardTitle>
          <Link href="/notice">
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Create
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className="p-3 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-semibold text-card-foreground flex-1">{announcement.title}</h4>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{announcement.category}</span>
                <span>{announcement.date}</span>
              </div>
            </div>
          ))}
        </div>
        <Link href="/notice">
          <Button variant="ghost" className="w-full mt-4">
            View All Announcements
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
