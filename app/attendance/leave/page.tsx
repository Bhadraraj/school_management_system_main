'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, GraduationCap } from 'lucide-react';
import dynamic from 'next/dynamic';

const LeaveRequestModal = dynamic(() => import('@/components/attendance/LeaveRequestModal'), { ssr: false });

interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
}

const mockLeaveHistory: LeaveRequest[] = [
  {
    id: '1',
    startDate: '2025-09-20',
    endDate: '2025-09-22',
    leaveType: 'sick',
    reason: 'Medical checkup',
    status: 'approved',
    submittedDate: '2025-09-15'
  },
  {
    id: '2',
    startDate: '2025-10-10',
    endDate: '2025-10-12',
    leaveType: 'personal',
    reason: 'Family event',
    status: 'pending',
    submittedDate: '2025-10-04'
  }
];

export default function TeacherLeavePage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaveHistory, setLeaveHistory] = useState(mockLeaveHistory);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }

    if (user.role !== 'teacher') {
      router.replace('/unauthorized');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2">
            <GraduationCap className="w-5 h-5 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSubmitLeave = (data: any) => {
    const newRequest: LeaveRequest = {
      id: String(Date.now()),
      ...data,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0]
    };
    setLeaveHistory([newRequest, ...leaveHistory]);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { color: 'bg-amber-100 text-amber-700', label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-700', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-700', label: 'Rejected' }
    };

    const variant = variants[status as keyof typeof variants];
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  const getLeaveTypeBadge = (type: string) => {
    const colors = {
      sick: 'bg-red-50 text-red-600',
      casual: 'bg-blue-50 text-blue-600',
      emergency: 'bg-orange-50 text-orange-600',
      personal: 'bg-purple-50 text-purple-600'
    };

    return (
      <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-600'}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const stats = {
    total: leaveHistory.length,
    pending: leaveHistory.filter(l => l.status === 'pending').length,
    approved: leaveHistory.filter(l => l.status === 'approved').length,
    rejected: leaveHistory.filter(l => l.status === 'rejected').length
  };

  return (
    <Layout allowedRoles={['teacher']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-card-foreground mb-2">Leave Management</h1>
            <p className="text-muted-foreground">Request and manage your leave applications.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Request Leave
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-card-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Requests</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-700">{stats.pending}</p>
                <p className="text-sm text-amber-600">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-700">{stats.approved}</p>
                <p className="text-sm text-green-600">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-700">{stats.rejected}</p>
                <p className="text-sm text-red-600">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Leave History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaveHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No leave requests yet
                </div>
              ) : (
                leaveHistory.map((leave) => (
                  <div
                    key={leave.id}
                    className="p-4 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getLeaveTypeBadge(leave.leaveType)}
                          {getStatusBadge(leave.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Submitted on {new Date(leave.submittedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="flex items-center gap-2 text-sm font-medium mb-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">{leave.reason}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <LeaveRequestModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleSubmitLeave}
      />
    </Layout>
  );
}
