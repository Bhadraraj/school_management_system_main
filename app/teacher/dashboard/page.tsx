'use client';

import { useState, memo, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import TeacherModal from '@/components/teachers/TeacherModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';

const teachersData = [
  {
    id: 'TEA001',
    name: 'Dr. Sarah Wilson',
    subject: 'Mathematics',
    class: 'Grade 10A, 10B',
    phone: '+1 234 567 8901',
    email: 'sarah.wilson@school.edu',
    experience: '8 years',
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'TEA002',
    name: 'Mr. John Davis',
    subject: 'Physics',
    class: 'Grade 11A, 12A',
    phone: '+1 234 567 8902',
    email: 'john.davis@school.edu',
    experience: '12 years',
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'TEA003',
    name: 'Ms. Emily Chen',
    subject: 'English Literature',
    class: 'Grade 9A, 9B',
    phone: '+1 234 567 8903',
    email: 'emily.chen@school.edu',
    experience: '5 years',
    status: 'On Leave',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

const TeachersPage = memo(function TeachersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const handleCreate = useCallback(() => {
    setModalMode('create');
    setSelectedTeacher(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((teacher: any) => {
    setModalMode('edit');
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((teacher: any) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      console.log('Delete teacher:', teacher);
    }
  }, []);

  return (
    <>
      <Layout allowedRoles={['admin']}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900 mb-2">Teachers</h1>
              <p className="text-gray-600">Manage teaching staff and their assignments</p>
            </div>
            <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Teacher
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Teachers</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search teachers..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Teacher</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Subject</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Classes</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Phone</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Experience</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachersData.map((teacher) => (
                      <tr key={teacher.id} className="border-b border-border hover:bg-accent transition-colors group">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={teacher.avatar} alt={teacher.name} />
                              <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground group-hover:text-accent-foreground whitespace-nowrap">{teacher.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">{teacher.id}</td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">{teacher.subject}</td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">{teacher.class}</td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground whitespace-nowrap">{teacher.phone}</td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">{teacher.experience}</td>
                        <td className="py-4 px-4">
                          <Badge 
                            variant={teacher.status === 'Active' ? 'default' : 'secondary'}
                            className={teacher.status === 'Active' 
                              ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                            }
                          >
                            {teacher.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(teacher)}>
                              <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(teacher)}>
                              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
      
      <TeacherModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode={modalMode}
        teacher={selectedTeacher}
      />
    </>
  );
});

export default TeachersPage;