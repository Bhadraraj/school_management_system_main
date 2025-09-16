import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type TransportRoute = Database['public']['Tables']['transport_routes']['Row'];
export type TransportRouteInsert = Database['public']['Tables']['transport_routes']['Insert'];
export type TransportRouteUpdate = Database['public']['Tables']['transport_routes']['Update'];

export const transportApi = {
  // Get all transport routes
  async getAll() {
    const { data, error } = await supabase
      .from('transport_routes')
      .select('*')
      .order('route_name');

    if (error) throw error;
    return data;
  },

  // Get route by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('transport_routes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new route
  async create(route: TransportRouteInsert) {
    const { data, error } = await supabase
      .from('transport_routes')
      .insert(route)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update route
  async update(id: string, updates: TransportRouteUpdate) {
    const { data, error } = await supabase
      .from('transport_routes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete route
  async delete(id: string) {
    const { error } = await supabase
      .from('transport_routes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Search routes
  async search(query: string) {
    const { data, error } = await supabase
      .from('transport_routes')
      .select('*')
      .or(`route_name.ilike.%${query}%,vehicle_number.ilike.%${query}%,driver_name.ilike.%${query}%`)
      .order('route_name');

    if (error) throw error;
    return data;
  },

  // Get route statistics
  async getStats() {
    const { data, error } = await supabase
      .from('transport_routes')
      .select('capacity, current_students, status');

    if (error) throw error;

    const stats = {
      totalRoutes: data.length,
      activeRoutes: data.filter(route => route.status === 'active').length,
      totalCapacity: data.reduce((sum, route) => sum + route.capacity, 0),
      totalStudents: data.reduce((sum, route) => sum + route.current_students, 0),
      utilizationRate: data.reduce((sum, route) => sum + route.capacity, 0) > 0 
        ? (data.reduce((sum, route) => sum + route.current_students, 0) / 
           data.reduce((sum, route) => sum + route.capacity, 0)) * 100 
        : 0,
    };

    return stats;
  },
};