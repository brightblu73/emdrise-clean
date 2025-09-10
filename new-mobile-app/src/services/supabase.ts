import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Using the same Supabase configuration as the web app
// Environment variables would be handled via Expo's secure storage in production
const supabaseUrl = 'https://jxhjghgectlpgrpwpkfd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4aGpnaGdlY3RscGdycHdwa2ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTczMzUsImV4cCI6MjA2NjU3MzMzNX0.YixIxif9zj0VQJGMJrKe5qY8bKMCaV9PmJAZBxNl2XU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper functions for video streaming
export const getVideoUrl = (fileName: string) => {
  return supabase.storage.from('videos').getPublicUrl(fileName).data.publicUrl;
};

export const getTherapistVideoUrl = (therapist: 'maria' | 'alistair', script: string) => {
  return getVideoUrl(`${therapist}-${script}.mp4`);
};