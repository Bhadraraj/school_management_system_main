'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { authApi } from '@/lib/api/auth';

export type Theme = 'default' | 'ocean' | 'forest' | 'sunset' | 'royal';
export type UserRole = 'admin' | 'teacher' | 'parent';
export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleDark: () => void;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: { name: string; role: UserRole; phone?: string; address?: string }) => Promise<void>;
  getCurrentUser: () => Promise<void>;
}

interface AppState {
  sidebarCollapsed: boolean;
  isMobile: boolean;
  screenSize: ScreenSize;
  mobileMenuOpen: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setIsMobile: (mobile: boolean) => void;
  setScreenSize: (size: ScreenSize) => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  initializeResponsive: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    subscribeWithSelector(
    (set) => ({
      theme: 'default',
      isDark: false,
      setTheme: (theme) => set({ theme }),
      toggleDark: () => set((state) => ({ isDark: !state.isDark })),
    })),
    { name: 'theme-storage' }
  )
);

export const useAuthStore = create<AuthState>()(
  persist(
    subscribeWithSelector(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        set({ user: null, isAuthenticated: false });
        supabase.auth.signOut();
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('theme-storage');
        }
      },
      signIn: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const { profile } = await authApi.signIn(email, password);
          if (profile) {
            set({
              user: {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                role: profile.role,
                avatar: profile.avatar_url,
              },
              isAuthenticated: true,
              loading: false,
            });
          }
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
      signUp: async (email: string, password: string, userData) => {
        set({ loading: true });
        try {
          await authApi.signUp(email, password, userData);
          set({ loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
      getCurrentUser: async () => {
        set({ loading: true });
        try {
          const result = await authApi.getCurrentUser();
          if (result?.profile) {
            set({
              user: {
                id: result.profile.id,
                name: result.profile.name,
                email: result.profile.email,
                role: result.profile.role,
                avatar: result.profile.avatar_url,
              },
              isAuthenticated: true,
              loading: false,
            });
          } else {
            set({ user: null, isAuthenticated: false, loading: false });
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false, loading: false });
        }
      },
    })),
    { name: 'auth-storage' }
  )
);

export const useAppStore = create<AppState>()(
  subscribeWithSelector((set, get) => ({
    sidebarCollapsed: false,
    isMobile: false,
    screenSize: 'lg',
    mobileMenuOpen: false,
    
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    
    setIsMobile: (mobile) => {
      set({ isMobile: mobile });
      // Auto-close mobile menu when switching to desktop
      if (!mobile) {
        set({ mobileMenuOpen: false });
      }
    },
    
    setScreenSize: (size) => set({ screenSize: size }),
    
    setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
    
    // Unified toggle function that works for both mobile and desktop
    toggleSidebar: () => {
      const { isMobile, sidebarCollapsed, mobileMenuOpen } = get();
      
      if (isMobile) {
        // On mobile, toggle the mobile menu
        set({ mobileMenuOpen: !mobileMenuOpen });
      } else {
        // On desktop, toggle the sidebar collapse state
        set({ sidebarCollapsed: !sidebarCollapsed });
      }
    },
    
    toggleMobileMenu: () => {
      const { mobileMenuOpen } = get();
      set({ mobileMenuOpen: !mobileMenuOpen });
    },
    
    closeMobileMenu: () => {
      const { isMobile } = get();
      if (isMobile) {
        set({ mobileMenuOpen: false });
      }
    },

    initializeResponsive: () => {
      if (typeof window === 'undefined') return;
      
      const width = window.innerWidth;
      let size: ScreenSize;
      
      if (width < 640) {
        size = 'xs';
      } else if (width < 768) {
        size = 'sm';
      } else if (width < 1024) {
        size = 'md';
      } else if (width < 1280) {
        size = 'lg';
      } else if (width < 1536) {
        size = 'xl';
      } else {
        size = '2xl';
      }
      
      const mobile = width < 1024;
      
      set({ 
        screenSize: size,
        isMobile: mobile,
        sidebarCollapsed: mobile,
        mobileMenuOpen: false
      });
    },
  }))
);

// Utility hook to get responsive values
export const useResponsive = () => {
  const { screenSize, isMobile } = useAppStore();
  
  return {
    screenSize,
    isMobile,
    isTablet: screenSize === 'md',
    isDesktop: ['lg', 'xl', '2xl'].includes(screenSize),
    isSmallMobile: screenSize === 'xs',
    isLargeMobile: screenSize === 'sm',
    isXs: screenSize === 'xs',
    isSm: screenSize === 'sm',
    isMd: screenSize === 'md',
    isLg: screenSize === 'lg',
    isXl: screenSize === 'xl',
    is2Xl: screenSize === '2xl',
  };
};

// Screen size detector hook
export const useScreenSize = () => {
  const { setScreenSize, setIsMobile, initializeResponsive } = useAppStore();
  
  const detectScreenSize = () => {
    if (typeof window === 'undefined') return;
    
    const width = window.innerWidth;
    let size: ScreenSize;
    
    if (width < 640) {
      size = 'xs';
    } else if (width < 768) {
      size = 'sm';
    } else if (width < 1024) {
      size = 'md';
    } else if (width < 1280) {
      size = 'lg';
    } else if (width < 1536) {
      size = 'xl';
    } else {
      size = '2xl';
    }
    
    setScreenSize(size);
    setIsMobile(width < 1024);
  };
  
  return { detectScreenSize, initializeResponsive };
};