import { createClient } from '@supabase/supabase-js';
import { storage } from './storage';
import type { User } from '@shared/schema';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface AuthResponse {
  success: boolean;
  user?: Omit<User, 'password'>;
  message?: string;
}

export class AuthService {
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error in getUserByEmail:', error);
      return null;
    }
  }

  static async createUser(userData: { email: string; username: string }): Promise<User | null> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error in createUser:', error);
      return null;
    }
  }

  static async updateUser(userId: number, updates: Partial<User>): Promise<User | null> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user:', error);
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error in updateUser:', error);
      return null;
    }
  }
}
