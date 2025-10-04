'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  phone: string;
  photo: string;
}

const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    subject: 'Mathematics',
    email: 'sarah.wilson@school.edu',
    phone: '+1 234 567 8901',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Mr. John Davis',
    subject: 'Science',
    email: 'john.davis@school.edu',
    phone: '+1 234 567 8902',
    photo: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Ms. Emily Chen',
    subject: 'English',
    email: 'emily.chen@school.edu',
    phone: '+1 234 567 8903',
    photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
];

export default function TeacherContactCard() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Contact Teachers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="p-3 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={teacher.photo} alt={teacher.name} />
                  <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-card-foreground">{teacher.name}</h4>
                  <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" asChild>
                  <a href={`mailto:${teacher.email}`}>
                    <Mail className="w-3 h-3 mr-1" />
                    Email
                  </a>
                </Button>
                <Button size="sm" variant="outline" className="flex-1" asChild>
                  <a href={`tel:${teacher.phone}`}>
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
