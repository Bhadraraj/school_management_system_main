import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type Expense = Database['public']['Tables']['expenses']['Row'];
export type ExpenseInsert = Database['public']['Tables']['expenses']['Insert'];
export type ExpenseUpdate = Database['public']['Tables']['expenses']['Update'];

export const expensesApi = {
  // Get all expenses
  async getAll() {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        profiles:approved_by (
          id,
          name
        )
      `)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get expense by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        profiles:approved_by (
          id,
          name,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new expense
  async create(expense: ExpenseInsert) {
    const { data, error } = await supabase
      .from('expenses')
      .insert(expense)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update expense
  async update(id: string, updates: ExpenseUpdate) {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete expense
  async delete(id: string) {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get expenses by category
  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('category', category)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get expense statistics
  async getStats(startDate?: string, endDate?: string) {
    let query = supabase
      .from('expenses')
      .select('category, amount, status');

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Calculate statistics by category
    const categoryStats = data.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = { total: 0, count: 0 };
      }
      acc[category].total += Number(expense.amount);
      acc[category].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const totalAmount = data.reduce((sum, expense) => sum + Number(expense.amount), 0);

    return {
      totalAmount,
      totalCount: data.length,
      categoryStats,
    };
  },

  // Search expenses
  async search(query: string) {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        profiles:approved_by (
          name
        )
      `)
      .or(`description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  },
};