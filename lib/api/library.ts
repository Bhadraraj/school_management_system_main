import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type LibraryBook = Database['public']['Tables']['library_books']['Row'];
export type LibraryBookInsert = Database['public']['Tables']['library_books']['Insert'];
export type LibraryBookUpdate = Database['public']['Tables']['library_books']['Update'];

export const libraryApi = {
  // Get all books
  async getAll() {
    const { data, error } = await supabase
      .from('library_books')
      .select(`
        *,
        subjects:subject_id (
          id,
          name
        )
      `)
      .order('name');

    if (error) throw error;
    return data;
  },

  // Get book by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('library_books')
      .select(`
        *,
        subjects:subject_id (
          id,
          name,
          code
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new book
  async create(book: LibraryBookInsert) {
    const { data, error } = await supabase
      .from('library_books')
      .insert({
        ...book,
        available_quantity: book.quantity || 1,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update book
  async update(id: string, updates: LibraryBookUpdate) {
    const { data, error } = await supabase
      .from('library_books')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete book
  async delete(id: string) {
    const { error } = await supabase
      .from('library_books')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Search books
  async search(query: string) {
    const { data, error } = await supabase
      .from('library_books')
      .select(`
        *,
        subjects:subject_id (
          name
        )
      `)
      .or(`name.ilike.%${query}%,author.ilike.%${query}%,isbn.ilike.%${query}%`)
      .order('name');

    if (error) throw error;
    return data;
  },

  // Get books by subject
  async getBySubject(subjectId: string) {
    const { data, error } = await supabase
      .from('library_books')
      .select('*')
      .eq('subject_id', subjectId)
      .order('name');

    if (error) throw error;
    return data;
  },

  // Get available books
  async getAvailable() {
    const { data, error } = await supabase
      .from('library_books')
      .select(`
        *,
        subjects:subject_id (
          name
        )
      `)
      .gt('available_quantity', 0)
      .order('name');

    if (error) throw error;
    return data;
  },

  // Update book availability
  async updateAvailability(id: string, change: number) {
    const { data: book, error: fetchError } = await supabase
      .from('library_books')
      .select('available_quantity')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const newQuantity = book.available_quantity + change;
    
    if (newQuantity < 0) {
      throw new Error('Not enough books available');
    }

    const { data, error } = await supabase
      .from('library_books')
      .update({ available_quantity: newQuantity })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};