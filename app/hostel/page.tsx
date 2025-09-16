'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import HostelModal from '@/components/hostel/HostelModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Building2, Users, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';

const hostelData = [
  {
    id: 'H001',
    roomNumber: 'H-101',
    roomType: 'Double',
    capacity: 2,
    occupied: 2,
    rent: '$200',
    warden: 'Mr. James Wilson',
    facilities: 'WiFi, AC, Study Table',
    status: 'Occupied',
    students: ['Alice Johnson', 'Bob Smith'],
  },
  {
    id: 'H002',
    roomNumber: 'H-102',
    roomType: 'Single',
    capacity: 1,
    occupied: 1,
    rent: '$300',
    warden: 'Ms. Sarah Davis',
    facilities: 'WiFi, AC, Private Bath',
    status: 'Occupied',
    students: ['Carol Davis'],
  },
  {
    id: 'H003',
    roomNumber: 'H-103',
    roomType: 'Triple',
    capacity: 3,
    occupied: 0,
    rent: '$150',
    warden: 'Mr. James Wilson',
    facilities: 'WiFi, Fan, Study Table',
    status: 'Available',
    students: [],
  },
  {
    id: 'H004',
    roomNumber: 'H-104',
    roomType: 'Quad',
    capacity: 4,
    occupied: 3,
    rent: '$120',
    warden: 'Dr. Michael Brown',
    facilities: 'WiFi, AC, Study Table',
    status: 'Partially Occupied',
    students: ['David Wilson', 'Emma Davis', 'Frank Miller'],
  },
];

export default function HostelPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreate = () => {
    setModalMode('create');
    setSelectedHostel(null);
    setIsModalOpen(true);
  };

  const handleEdit = (hostel: any) => {
    setModalMode('edit');
    setSelectedHostel(hostel);
    setIsModalOpen(true);
  };

  const handleDelete = (hostel: any) => {
    if (confirm('Are you sure you want to delete this hostel room?')) {
      console.log('Delete hostel:', hostel);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'Occupied':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      case 'Partially Occupied':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  return (
    <>
      <Layout allowedRoles={['admin']}>
        <div className="space-y-6">
         
   <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900 mb-2">
        Hostel Management
              </h1>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage> Hostel</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">Add </span>
            </Button>
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                 <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search rooms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Room</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Occupancy</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Rent</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Warden</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Facilities</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hostelData.map((hostel) => (
                      <tr key={hostel.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-purple-600" />
                            </div>
                            <span className="font-medium text-gray-900 whitespace-nowrap">{hostel.roomNumber}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{hostel.roomType}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{hostel.occupied}/{hostel.capacity}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{hostel.rent}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{hostel.warden}</td>
                        <td className="py-4 px-4 text-gray-600 max-w-xs truncate">{hostel.facilities}</td>
                        <td className="py-4 px-4">
                          <Badge className={getStatusColor(hostel.status)}>
                            {hostel.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(hostel)}>
                              <Edit className="w-4 h-4 text-gray-400" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(hostel)}>
                              <Trash2 className="w-4 h-4 text-gray-400" />
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
      
      <HostelModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode={modalMode}
        hostel={selectedHostel}
      />
    </>
  );
}