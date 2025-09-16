import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type School = Database['public']['Tables']['schools']['Row'];
export type SchoolInsert = Database['public']['Tables']['schools']['Insert'];
export type SchoolUpdate = Database['public']['Tables']['schools']['Update'];

export type SchoolSubscription = Database['public']['Tables']['school_subscriptions']['Row'];
export type SchoolSubscriptionInsert = Database['public']['Tables']['school_subscriptions']['Insert'];

export const schoolsApi = {
  // Get all schools (for super admin)
  async getAll() {
    const { data, error } = await supabase
      .from('schools')
      .select(`
        *,
        school_subscriptions:school_subscriptions!school_id (
          id,
          plan_type,
          status,
          expires_at,
          max_students,
          max_teachers
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get school by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('schools')
      .select(`
        *,
        school_subscriptions:school_subscriptions!school_id (
          id,
          plan_type,
          status,
          expires_at,
          max_students,
          max_teachers
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new school
  async create(school: SchoolInsert) {
    const { data, error } = await supabase
      .from('schools')
      .insert(school)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update school
  async update(id: string, updates: SchoolUpdate) {
    const { data, error } = await supabase
      .from('schools')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete school
  async delete(id: string) {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get school statistics
  async getStats(schoolId: string) {
    const [
      studentsResult,
      teachersResult,
      classesResult,
      feesResult,
    ] = await Promise.all([
      supabase.from('students').select('id', { count: 'exact', head: true }).eq('school_id', schoolId),
      supabase.from('teachers').select('id', { count: 'exact', head: true }).eq('school_id', schoolId),
      supabase.from('classes').select('id', { count: 'exact', head: true }).eq('school_id', schoolId),
      supabase.from('fees').select('amount, status').eq('school_id', schoolId),
    ]);

    const paidFees = feesResult.data?.filter(fee => fee.status === 'paid') || [];
    const totalRevenue = paidFees.reduce((sum, fee) => sum + Number(fee.amount), 0);

    return {
      students: studentsResult.count || 0,
      teachers: teachersResult.count || 0,
      classes: classesResult.count || 0,
      revenue: totalRevenue,
    };
  },
};

export const subscriptionsApi = {
  // Create subscription for school
  async create(subscription: SchoolSubscriptionInsert) {
    const { data, error } = await supabase
      .from('school_subscriptions')
      .insert(subscription)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update subscription
  async update(id: string, updates: Partial<SchoolSubscription>) {
    const { data, error } = await supabase
      .from('school_subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get active subscriptions
  async getActive() {
    const { data, error } = await supabase
      .from('school_subscriptions')
      .select(`
        *,
        schools:school_id (
          id,
          name,
          email
        )
      `)
      .eq('status', 'active')
      .order('expires_at');

    if (error) throw error;
    return data;
  },

  // Check subscription limits
  async checkLimits(schoolId: string) {
    const { data: subscription, error } = await supabase
      .from('school_subscriptions')
      .select('max_students, max_teachers')
      .eq('school_id', schoolId)
      .eq('status', 'active')
      .single();

    if (error) throw error;

    const [studentsCount, teachersCount] = await Promise.all([
      supabase.from('students').select('id', { count: 'exact', head: true }).eq('school_id', schoolId),
      supabase.from('teachers').select('id', { count: 'exact', head: true }).eq('school_id', schoolId),
    ]);

    return {
      students: {
        current: studentsCount.count || 0,
        limit: subscription.max_students,
        canAdd: (studentsCount.count || 0) < subscription.max_students,
      },
      teachers: {
        current: teachersCount.count || 0,
        limit: subscription.max_teachers,
        canAdd: (teachersCount.count || 0) < subscription.max_teachers,
      },
    };
  },
};