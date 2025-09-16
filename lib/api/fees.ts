import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type Fee = Database['public']['Tables']['fees']['Row'];
export type FeeInsert = Database['public']['Tables']['fees']['Insert'];
export type FeeUpdate = Database['public']['Tables']['fees']['Update'];

export const feesApi = {
  // Get all fees with student data
  async getAll() {
    const { data, error } = await supabase
      .from('fees')
      .select(`
        *,
        students:student_id (
          id,
          name,
          roll_number,
          avatar_url,
          classes:class_id (
            name
          )
        )
      `)
      .order('due_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get fee by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('fees')
      .select(`
        *,
        students:student_id (
          id,
          name,
          roll_number,
          email,
          phone,
          classes:class_id (
            name
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new fee record
  async create(fee: FeeInsert) {
    const { data, error } = await supabase
      .from('fees')
      .insert(fee)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update fee record
  async update(id: string, updates: FeeUpdate) {
    const { data, error } = await supabase
      .from('fees')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete fee record
  async delete(id: string) {
    const { error } = await supabase
      .from('fees')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get fees by student
  async getByStudent(studentId: string) {
    const { data, error } = await supabase
      .from('fees')
      .select('*')
      .eq('student_id', studentId)
      .order('due_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get overdue fees
  async getOverdue() {
    const { data, error } = await supabase
      .from('fees')
      .select(`
        *,
        students:student_id (
          id,
          name,
          roll_number,
          classes:class_id (
            name
          )
        )
      `)
      .eq('status', 'overdue')
      .order('due_date');

    if (error) throw error;
    return data;
  },

  // Get fee statistics
  async getStats() {
    const { data, error } = await supabase
      .from('fees')
      .select('status, amount');

    if (error) throw error;

    const stats = {
      total: data.length,
      paid: data.filter(fee => fee.status === 'paid').length,
      unpaid: data.filter(fee => fee.status === 'unpaid').length,
      overdue: data.filter(fee => fee.status === 'overdue').length,
      totalAmount: data.reduce((sum, fee) => sum + Number(fee.amount), 0),
      paidAmount: data
        .filter(fee => fee.status === 'paid')
        .reduce((sum, fee) => sum + Number(fee.amount), 0),
    };

    return stats;
  },

  // Mark fee as paid
  async markAsPaid(id: string, paymentMethod: string) {
    const { data, error } = await supabase
      .from('fees')
      .update({
        status: 'paid',
        paid_date: new Date().toISOString().split('T')[0],
        payment_method: paymentMethod,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};