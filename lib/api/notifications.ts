import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type Notification = Database['public']['Tables']['notifications']['Row'];
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];

export const notificationsApi = {
  // Get notifications for user
  async getForUser(userId: string, limit: number = 20) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Create notification
  async create(notification: NotificationInsert) {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mark as read
  async markAsRead(id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mark all as read for user
  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  },

  // Get unread count
  async getUnreadCount(userId: string) {
    const { count, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  },

  // Send bulk notifications
  async sendBulk(notifications: NotificationInsert[]) {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notifications)
      .select();

    if (error) throw error;
    return data;
  },

  // Send notification to all users of a role
  async sendToRole(
    role: 'admin' | 'teacher' | 'parent',
    title: string,
    message: string,
    type: 'info' | 'warning' | 'success' | 'error' = 'info'
  ) {
    // Get all users with the specified role
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', role);

    if (usersError) throw usersError;

    // Create notifications for all users
    const notifications: NotificationInsert[] = users.map(user => ({
      user_id: user.id,
      title,
      message,
      type,
      read: false,
    }));

    return this.sendBulk(notifications);
  },
};