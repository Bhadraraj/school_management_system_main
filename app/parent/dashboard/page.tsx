'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BookOpen, TrendingUp, User, Phone, GraduationCap } from 'lucide-react';

const childData = {
  name: 'Alice Johnson',
  class: 'Grade 10A',
  roll: '001',
  avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  attendance: '95%',
  grades: [
    { subject: 'Mathematics', grade: 'A+', marks: '95/100' },
    { subject: 'Physics', grade: 'A', marks: '88/100' },
    { subject: 'Chemistry', grade: 'A+', marks: '92/100' },
    { subject: 'English', grade: 'A', marks: '89/100' },
  ],
  upcomingExams: [
    { subject: 'Biology', date: '2024-01-15', time: '10:00 AM' },
    { subject: 'History', date: '2024-01-18', time: '2:00 PM' },
  ],
  notices: [
    { title: 'Parent-Teacher Meeting', date: '2024-01-20', priority: 'High' },
    { title: 'Winter Break Notice', date: '2024-01-25', priority: 'Medium' },
  ]
};

export default function ParentDashboard() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect logic can be added here if needed
  }, []);

  return (
    <Layout allowedRoles={['parent']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-lg font-bold text-foreground mb-2">Parent Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || 'Parent'}! Monitor your child's academic progress and school activities.</p>
        </div>

        {/* Child Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Child Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={childData.avatar} alt={childData.name} />
                <AvatarFallback>{childData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{childData.name}</h3>
                <p className="text-gray-600">{childData.class} • Roll #{childData.roll}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Attendance: {childData.attendance}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Grades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Recent Grades</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {childData.grades.map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{grade.subject}</h4>
                      <p className="text-sm text-gray-600">{grade.marks}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      {grade.grade}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Exams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Upcoming Exams</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {childData.upcomingExams.map((exam, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{exam.subject}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(exam.date).toLocaleDateString()}</span>
                        <Clock className="w-3 h-3 ml-2" />
                        <span>{exam.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* School Notices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>School Notices</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {childData.notices.map((notice, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{notice.title}</h4>
                    <p className="text-sm text-gray-600">{new Date(notice.date).toLocaleDateString()}</p>
                  </div>
                  <Badge className={notice.priority === 'High' 
                    ? 'bg-red-100 text-red-700 hover:bg-red-100'
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                  }>
                    {notice.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}