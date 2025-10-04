'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

export interface LeaveRequest {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
}

interface LeaveManagementTableProps {
  leaveRequests: LeaveRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function LeaveManagementTable({
  leaveRequests,
  onApprove,
  onReject
}: LeaveManagementTableProps) {
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

  const pendingRequests = leaveRequests.filter(r => r.status === 'pending');
  const processedRequests = leaveRequests.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Pending Leave Requests
            {pendingRequests.length > 0 && (
              <Badge variant="destructive">{pendingRequests.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending leave requests
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={request.teacherAvatar} alt={request.teacherName} />
                        <AvatarFallback>{request.teacherName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-card-foreground">{request.teacherName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Submitted on {new Date(request.submittedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {getLeaveTypeBadge(request.leaveType)}
                      {getStatusBadge(request.status)}
                    </div>
                  </div>

                  <div className="mb-3 p-3 bg-background rounded-lg">
                    <div className="flex items-center gap-4 text-sm mb-2">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">
                        {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Reason:</span>
                      <p className="mt-1">{request.reason}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => onApprove(request.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => onReject(request.id)}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Processed Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {processedRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No processed requests
            </div>
          ) : (
            <div className="space-y-2">
              {processedRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 bg-accent/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={request.teacherAvatar} alt={request.teacherName} />
                      <AvatarFallback>{request.teacherName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-card-foreground">{request.teacherName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getLeaveTypeBadge(request.leaveType)}
                    {getStatusBadge(request.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
