'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { reportsApi } from '@/lib/api/reports';
import { analyticsApi } from '@/lib/api/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  Tooltip
} from 'recharts';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  Users, 
  GraduationCap,
  DollarSign,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [reportData, setReportData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const [
          enrollmentTrends,
          attendanceAnalytics,
          gradeDistribution,
          feeAnalytics,
          teacherPerformance,
        ] = await Promise.all([
          analyticsApi.getEnrollmentTrends(12),
          analyticsApi.getAttendanceAnalytics(selectedClass, parseInt(dateRange)),
          analyticsApi.getGradeDistribution(selectedClass, selectedSubject),
          analyticsApi.getFeeCollectionAnalytics(12),
          analyticsApi.getTeacherPerformanceAnalytics(),
        ]);

        setReportData({
          enrollmentTrends,
          attendanceAnalytics,
          gradeDistribution,
          feeAnalytics,
          teacherPerformance,
        });
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [dateRange, selectedClass, selectedSubject]);

  const exportReport = async (type: 'csv' | 'pdf') => {
    try {
      const data = await reportsApi.exportStudentData(type);
      // Handle export logic here
      console.log('Exporting data:', data);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  return (
    <Layout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900 mb-2">Reports & Analytics</h1>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Reports</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => exportReport('csv')}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => exportReport('pdf')}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                      <p className="text-2xl font-bold text-foreground">1,234</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Teachers</p>
                      <p className="text-2xl font-bold text-foreground">89</p>
                    </div>
                    <GraduationCap className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                      <p className="text-2xl font-bold text-foreground">94.5%</p>
                    </div>
                    <Calendar className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                      <p className="text-2xl font-bold text-foreground">$45,678</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enrollment Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reportData.enrollmentTrends || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="enrollments" 
                        stroke="#8B5CF6" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Performance Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Class</Label>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Classes</SelectItem>
                        <SelectItem value="grade-10a">Grade 10A</SelectItem>
                        <SelectItem value="grade-10b">Grade 10B</SelectItem>
                        <SelectItem value="grade-9a">Grade 9A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Subjects</SelectItem>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Time Period</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="90">Last 90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grade Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(reportData.gradeDistribution?.gradeDistribution || {}).map(([grade, count]) => ({
                            name: grade,
                            value: count,
                          }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {Object.entries(reportData.gradeDistribution?.gradeDistribution || {}).map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Ranges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={Object.entries(reportData.gradeDistribution?.percentageRanges || {}).map(([range, count]) => ({
                        range,
                        count,
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reportData.attendanceAnalytics || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="attendanceRate" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        name="Attendance Rate (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Fee Collection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportData.feeAnalytics?.monthlyCollection || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fee Type Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(reportData.feeAnalytics?.breakdown?.feeTypes || {}).map(([type, amount]) => ({
                            name: type.replace('_', ' ').toUpperCase(),
                            value: amount,
                          }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {Object.entries(reportData.feeAnalytics?.breakdown?.feeTypes || {}).map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Total Fees</p>
                    <p className="text-xl font-bold text-green-700">
                      ${reportData.feeAnalytics?.summary?.totalFees || 0}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Collected</p>
                    <p className="text-xl font-bold text-blue-700">
                      ${reportData.feeAnalytics?.summary?.collectedFees || 0}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-600">Pending</p>
                    <p className="text-xl font-bold text-yellow-700">
                      ${reportData.feeAnalytics?.summary?.pendingFees || 0}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600">Collection Rate</p>
                    <p className="text-xl font-bold text-purple-700">
                      {Math.round(reportData.feeAnalytics?.summary?.collectionRate || 0)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Teacher Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.teacherPerformance?.map((teacher: any) => (
                    <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{teacher.profiles?.name}</h3>
                          <p className="text-sm text-muted-foreground">{teacher.subjects?.name}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Classes</p>
                          <p className="font-semibold">{teacher.analytics?.totalClasses}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Students</p>
                          <p className="font-semibold">{teacher.analytics?.totalStudents}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Performance</p>
                          <p className="font-semibold">{teacher.analytics?.averagePerformance}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Experience</p>
                          <p className="font-semibold">{teacher.experience_years}y</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}