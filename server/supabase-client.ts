import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Database types
export interface UserProgress {
  id: string;
  user_id: string;
  email: string;
  memories_cleared: number;
  created_at: string;
  updated_at: string;
}

export interface EmdrSession {
  id: string;
  user_id: string;
  current_script: number;
  session_type: string;
  has_completed_reprocessing: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

// Initialize Supabase clients
const supabaseUrl = 'https://jxhjghgectlpgrpwpkfd.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY as string;

if (!serviceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

if (!anonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Service role client for admin operations
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Regular client for user operations
export const supabase = createClient(supabaseUrl, anonKey);

// Supabase API functions
export class SupabaseAPI {
  
  // Get or create user progress
  static async getOrCreateUserProgress(userId: string, email: string): Promise<UserProgress> {
    const { data, error } = await supabaseAdmin
      .rpc('upsert_user_progress', { 
        p_user_id: userId, 
        p_email: email 
      });

    if (error) {
      console.error('Error upserting user progress:', error);
      throw error;
    }

    return data as UserProgress;
  }

  // Get user progress by user ID
  static async getUserProgress(userId: string): Promise<UserProgress | null> {
    const { data, error } = await supabaseAdmin
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Row not found
        return null;
      }
      console.error('Error fetching user progress:', error);
      throw error;
    }

    return data as UserProgress;
  }

  // Increment memory count
  static async incrementMemoryCount(userId: string): Promise<UserProgress> {
    const { data, error } = await supabaseAdmin
      .rpc('increment_memory_count', { p_user_id: userId });

    if (error) {
      console.error('Error incrementing memory count:', error);
      throw error;
    }

    return data as UserProgress;
  }

  // Create EMDR session
  static async createEmdrSession(userId: string, sessionData: Partial<EmdrSession>): Promise<EmdrSession> {
    const { data, error } = await supabaseAdmin
      .from('emdr_sessions')
      .insert({
        user_id: userId,
        current_script: sessionData.current_script || 1,
        session_type: sessionData.session_type || 'normal',
        has_completed_reprocessing: sessionData.has_completed_reprocessing || false,
        status: sessionData.status || 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating EMDR session:', error);
      throw error;
    }

    return data as EmdrSession;
  }

  // Get EMDR session by ID
  static async getEmdrSession(sessionId: string): Promise<EmdrSession | null> {
    const { data, error } = await supabaseAdmin
      .from('emdr_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Row not found
        return null;
      }
      console.error('Error fetching EMDR session:', error);
      throw error;
    }

    return data as EmdrSession;
  }

  // Update EMDR session
  static async updateEmdrSession(sessionId: string, updates: Partial<EmdrSession>): Promise<EmdrSession> {
    const { data, error } = await supabaseAdmin
      .from('emdr_sessions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating EMDR session:', error);
      throw error;
    }

    return data as EmdrSession;
  }

  // Get current active session for user
  static async getCurrentSession(userId: string): Promise<EmdrSession | null> {
    const { data, error } = await supabaseAdmin
      .from('emdr_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Row not found
        return null;
      }
      console.error('Error fetching current session:', error);
      throw error;
    }

    return data as EmdrSession;
  }

  // Verify JWT token and get user
  static async verifyUser(token: string): Promise<{ id: string; email: string } | null> {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      console.log('JWT verification failed:', error);
      return null;
    }

    return {
      id: user.id,
      email: user.email || ''
    };
  }
}