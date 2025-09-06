import { supabase } from './supabase';

export async function incrementClearedMemoriesIfLoggedIn(): Promise<void> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return;
  await supabase.rpc('increment_memory_cleared', { uid: user.id });
}

export async function getCurrentClearedMemories(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;
  const { data, error } = await supabase
    .from('profiles')
    .select('memory_cleared_count')
    .eq('id', user.id)
    .single();
  if (error) return 0;
  return data?.memory_cleared_count ?? 0;
}