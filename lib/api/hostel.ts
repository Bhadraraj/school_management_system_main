import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type HostelRoom = Database['public']['Tables']['hostel_rooms']['Row'];
export type HostelRoomInsert = Database['public']['Tables']['hostel_rooms']['Insert'];
export type HostelRoomUpdate = Database['public']['Tables']['hostel_rooms']['Update'];

export const hostelApi = {
  // Get all hostel rooms
  async getAll() {
    const { data, error } = await supabase
      .from('hostel_rooms')
      .select(`
        *,
        profiles:warden_id (
          id,
          name,
          phone
        )
      `)
      .order('room_number');

    if (error) throw error;
    return data;
  },

  // Get room by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('hostel_rooms')
      .select(`
        *,
        profiles:warden_id (
          id,
          name,
          phone,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new room
  async create(room: HostelRoomInsert) {
    const { data, error } = await supabase
      .from('hostel_rooms')
      .insert(room)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update room
  async update(id: string, updates: HostelRoomUpdate) {
    const { data, error } = await supabase
      .from('hostel_rooms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete room
  async delete(id: string) {
    const { error } = await supabase
      .from('hostel_rooms')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get available rooms
  async getAvailable() {
    const { data, error } = await supabase
      .from('hostel_rooms')
      .select(`
        *,
        profiles:warden_id (
          name
        )
      `)
      .lt('occupied', supabase.rpc('capacity'))
      .order('room_number');

    if (error) throw error;
    return data;
  },

  // Get rooms by type
  async getByType(roomType: string) {
    const { data, error } = await supabase
      .from('hostel_rooms')
      .select(`
        *,
        profiles:warden_id (
          name
        )
      `)
      .eq('room_type', roomType)
      .order('room_number');

    if (error) throw error;
    return data;
  },

  // Get hostel statistics
  async getStats() {
    const { data, error } = await supabase
      .from('hostel_rooms')
      .select('capacity, occupied, status, room_type');

    if (error) throw error;

    const stats = {
      totalRooms: data.length,
      totalCapacity: data.reduce((sum, room) => sum + room.capacity, 0),
      totalOccupied: data.reduce((sum, room) => sum + room.occupied, 0),
      availableRooms: data.filter(room => room.occupied < room.capacity).length,
      occupancyRate: data.reduce((sum, room) => sum + room.capacity, 0) > 0 
        ? (data.reduce((sum, room) => sum + room.occupied, 0) / 
           data.reduce((sum, room) => sum + room.capacity, 0)) * 100 
        : 0,
      roomTypeStats: data.reduce((acc, room) => {
        const type = room.room_type;
        if (!acc[type]) {
          acc[type] = { count: 0, capacity: 0, occupied: 0 };
        }
        acc[type].count += 1;
        acc[type].capacity += room.capacity;
        acc[type].occupied += room.occupied;
        return acc;
      }, {} as Record<string, { count: number; capacity: number; occupied: number }>),
    };

    return stats;
  },

  // Search rooms
  async search(query: string) {
    const { data, error } = await supabase
      .from('hostel_rooms')
      .select(`
        *,
        profiles:warden_id (
          name
        )
      `)
      .or(`room_number.ilike.%${query}%,facilities.ilike.%${query}%`)
      .order('room_number');

    if (error) throw error;
    return data;
  },
};