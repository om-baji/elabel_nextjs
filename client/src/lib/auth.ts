import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string) => {
        try {
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) {
            return { success: false, error: error.message };
          }

          return { success: true };
        } catch (error: any) {
          console.error('Login error:', error);
          return { success: false, error: error.message || 'Login failed' };
        }
      },
      register: async (email: string) => {
        try {
          const { error } = await supabase.auth.signUp({
            email,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) {
            return { success: false, error: error.message };
          }

          return { success: true };
        } catch (error: any) {
          console.error('Registration error:', error);
          return { success: false, error: error.message || 'Registration failed' };
        }
      },
      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);