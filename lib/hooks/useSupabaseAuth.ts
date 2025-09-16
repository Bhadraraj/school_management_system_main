'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import { isSupabaseConfigured } from '@/lib/supabase';

export function useSupabaseAuth() {
  const { login, logout, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Skip Supabase auth if not configured (demo mode)
    if (!isSupabaseConfigured()) {
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          login({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            avatar: profile.avatar_url,
          });
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Get user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            login({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role,
              avatar: profile.avatar_url,
            });

            // Redirect based on role
            if (profile.role === 'admin') {
              router.push('/');
            } else if (profile.role === 'teacher') {
              router.push('/teacher/dashboard');
            } else if (profile.role === 'parent') {
              router.push('/parent/dashboard');
            }
          }
        } else if (event === 'SIGNED_OUT') {
          logout();
          router.push('/login');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [login, logout, router]);

  return { isAuthenticated };
}