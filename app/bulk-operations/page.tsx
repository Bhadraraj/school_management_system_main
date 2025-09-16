'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { bulkOperationsApi } from '@/lib/api/bulk-operations';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Users, 
  GraduationCap, 
  CreditCard, 
  TrendingUp,
  FileText,
  Download
} from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function BulkOperationsPage() {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<any>(null);

  const handleFileUpload = async (file: File, type: 'students' | 'teachers') => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Parse CSV file
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = values[index];
          });
          return obj;
        });

      // Simulate progress
      for (let i = 0; i <= 50; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      let results;
      if (type === 'students') {
        results = await bulkOperationsApi.importStudents(data, 'school1-1111-1111-1111-111111111111');
      } else {
        results = await bulkOperationsApi.importTeachers(data, 'school1-1111-1111-1111-111111111111');
      }

      setUploadProgress(100);
      setUploadResults(results);

      toast({
        title: "Import completed",
        description: `Successfully imported ${results.success} ${type}. ${results.errors} errors.`,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Import failed",
        description: "Failed to import data. Please check your file format.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const downloadTemplate = (type: 'students' | 'teachers') => {
    const templates = {
      students: 'name,email,phone,class_id,roll_number,date_of_birth,address\nJohn Doe,john@example.com,+1234567890,class-id,001,2008-01-01,123 Main St',
      teachers: 'name,email,phone,subject_id,experience_years,qualification,join_date\nJane Smith,jane@example.com,+1234567890,subject-id,5,M.Sc. Mathematics,2020-01-01',
    };

    const blob = new Blob([templates[type]], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900 mb-2">Bulk Operations</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Bulk Operations</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <Tabs defaultValue="import" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="import">Import Data</TabsTrigger>
            <TabsTrigger value="fees">Generate Fees</TabsTrigger>
            <TabsTrigger value="attendance">Mark Attendance</TabsTrigger>
            <TabsTrigger value="promotion">Student Promotion</TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Students Import */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Import Students</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="students-file">Upload CSV File</Label>
                    <Input
                      id="students-file"
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'students');
                      }}
                      disabled={uploading}
                    />
                  </div>
                  
                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Importing students...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}

                  {uploadResults && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">
                        ✅ {uploadResults.success} students imported successfully
                      </p>
                      {uploadResults.errors > 0 && (
                        <p className="text-sm text-red-700">
                          ❌ {uploadResults.errors} errors occurred
                        </p>
                      )}
                    </div>
                  )}

                  <Button 
                    variant="outline" 
                    onClick={() => downloadTemplate('students')}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </CardContent>
              </Card>

              {/* Teachers Import */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5" />
                    <span>Import Teachers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="teachers-file">Upload CSV File</Label>
                    <Input
                      id="teachers-file"
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'teachers');
                      }}
                      disabled={uploading}
                    />
                  </div>

                  <Button 
                    variant="outline" 
                    onClick={() => downloadTemplate('teachers')}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fees" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Generate Bulk Fees</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fee Type</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="tuition">Tuition Fee</option>
                      <option value="library">Library Fee</option>
                      <option value="transport">Transport Fee</option>
                      <option value="exam">Exam Fee</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input type="number" placeholder="Enter amount" />
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Class</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="">All Classes</option>
                      <option value="grade-10a">Grade 10A</option>
                      <option value="grade-10b">Grade 10B</option>
                    </select>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                  Generate Fees for Selected Students
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Bulk Attendance Marking</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Class</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="grade-10a">Grade 10A</option>
                        <option value="grade-10b">Grade 10B</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Default Status</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                      </select>
                    </div>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Mark Attendance for All Students
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="promotion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Student Promotion</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>From Class</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="grade-9a">Grade 9A</option>
                        <option value="grade-9b">Grade 9B</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>To Class</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="grade-10a">Grade 10A</option>
                        <option value="grade-10b">Grade 10B</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Academic Year</Label>
                    <Input placeholder="e.g., 2024-2025" />
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Promote Selected Students
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}