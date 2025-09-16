import { supabase } from '@/lib/supabase';

export type Permission = 
  | 'read_students'
  | 'write_students'
  | 'read_teachers'
  | 'write_teachers'
  | 'read_classes'
  | 'write_classes'
  | 'read_attendance'
  | 'write_attendance'
  | 'read_exams'
  | 'write_exams'
  | 'read_fees'
  | 'write_fees'
  | 'read_reports'
  | 'manage_school'
  | 'super_admin';

export const rolePermissions: Record<string, Permission[]> = {
  super_admin: [
    'read_students', 'write_students',
    'read_teachers', 'write_teachers',
    'read_classes', 'write_classes',
    'read_attendance', 'write_attendance',
    'read_exams', 'write_exams',
    'read_fees', 'write_fees',
    'read_reports',
    'manage_school',
    'super_admin',
  ],
  admin: [
    'read_students', 'write_students',
    'read_teachers', 'write_teachers',
    'read_classes', 'write_classes',
    'read_attendance', 'write_attendance',
    'read_exams', 'write_exams',
    'read_fees', 'write_fees',
    'read_reports',
    'manage_school',
  ],
  teacher: [
    'read_students',
    'read_classes',
    'read_attendance', 'write_attendance',
    'read_exams', 'write_exams',
  ],
  parent: [
    'read_students', // Only their children
    'read_attendance', // Only their children
    'read_exams', // Only their children's exams
    'read_fees', // Only their children's fees
  ],
};

export const checkPermission = async (userId: string, permission: Permission): Promise<boolean> => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !profile) return false;

    const userPermissions = rolePermissions[profile.role] || [];
    return userPermissions.includes(permission);
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

export const requirePermission = (permission: Permission) => {
  return async (userId: string) => {
    const hasPermission = await checkPermission(userId, permission);
    if (!hasPermission) {
      throw new Error(`Insufficient permissions: ${permission} required`);
    }
    return true;
  };
};

export const checkSubscriptionLimits = async (schoolId: string, resource: 'students' | 'teachers' | 'classes') => {
  try {
    const { data: subscription, error } = await supabase
      .from('school_subscriptions')
      .select('max_students, max_teachers, max_classes')
      .eq('school_id', schoolId)
      .eq('status', 'active')
      .single();

    if (error) throw error;

    const limitField = `max_${resource}`;
    const currentCountResult = await supabase
      .from(resource)
      .select('id', { count: 'exact', head: true })
      .eq('school_id', schoolId);

    const currentCount = currentCountResult.count || 0;
    const limit = subscription[limitField as keyof typeof subscription] as number;

    return {
      current: currentCount,
      limit,
      canAdd: currentCount < limit,
      remaining: limit - currentCount,
    };
  } catch (error) {
    console.error('Error checking subscription limits:', error);
    throw error;
  }
};