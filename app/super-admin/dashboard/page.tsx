'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { schoolsApi } from '@/lib/api/multi-school';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Globe,
  Phone,
  Mail
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSchools: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    totalStudents: 0,
  });

  useEffect(() => {
    if (user?.role !== 'super_admin') {
      router.replace('/unauthorized');
      return;
    }

    const fetchData = async () => {
      try {
        const schoolsData = await schoolsApi.getAll();
        setSchools(schoolsData);

        // Calculate stats
        const totalSchools = schoolsData.length;
        const activeSubscriptions = schoolsData.filter(school => 
          school.school_subscriptions?.[0]?.status === 'active'
        ).length;
        const totalRevenue = schoolsData.reduce((sum, school) => 
          sum + (school.school_subscriptions?.[0]?.price_per_month || 0), 0
        );

        // Get total students across all schools
        const schoolStats = await Promise.all(
          schoolsData.map(school => schoolsApi.getStats(school.id))
        );
        const totalStudents = schoolStats.reduce((sum, stat) => sum + stat.students, 0);

        setStats({
          totalSchools,
          activeSubscriptions,
          totalRevenue,
          totalStudents,
        });
      } catch (error) {
        console.error('Error fetching super admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const getSubscriptionColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'expired':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'premium':
        return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
      case 'standard':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'basic':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-8 h-8 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage all schools and subscriptions</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Add School
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Schools</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalSchools}</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-foreground">{stats.activeSubscriptions}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-foreground">${stats.totalRevenue}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalStudents}</p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schools List */}
        <Card>
          <CardHeader>
            <CardTitle>All Schools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schools.map((school) => {
                const subscription = school.school_subscriptions?.[0];
                return (
                  <div
                    key={school.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={school.logo_url} alt={school.name} />
                        <AvatarFallback>
                          <Building2 className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">{school.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>{school.email}</span>
                          </div>
                          {school.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span>{school.phone}</span>
                            </div>
                          )}
                          {school.website && (
                            <div className="flex items-center space-x-1">
                              <Globe className="w-3 h-3" />
                              <span>{school.website}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {subscription && (
                        <div className="text-right">
                          <Badge className={getPlanColor(subscription.plan_type)}>
                            {subscription.plan_type.charAt(0).toUpperCase() + subscription.plan_type.slice(1)}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            ${subscription.price_per_month}/month
                          </p>
                        </div>
                      )}

                      <Badge className={getSubscriptionColor(subscription?.status || 'inactive')}>
                        {subscription?.status || 'No Subscription'}
                      </Badge>

                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}