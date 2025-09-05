-- Create user_progress table to track memory clearing and authentication
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  memories_cleared INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create emdr_sessions table to track session progress and reprocessing completion
CREATE TABLE IF NOT EXISTS emdr_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_script INTEGER NOT NULL DEFAULT 1,
  session_type TEXT DEFAULT 'normal', -- normal, resumed
  has_completed_reprocessing BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'active', -- active, paused, complete
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE emdr_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_progress
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for emdr_sessions
CREATE POLICY "Users can view own sessions" ON emdr_sessions
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own sessions" ON emdr_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update own sessions" ON emdr_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to upsert user progress
CREATE OR REPLACE FUNCTION upsert_user_progress(p_user_id UUID, p_email TEXT)
RETURNS user_progress AS $$
DECLARE
  result user_progress;
BEGIN
  INSERT INTO user_progress (user_id, email, memories_cleared)
  VALUES (p_user_id, p_email, 0)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    email = EXCLUDED.email,
    updated_at = NOW()
  RETURNING * INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to increment memory count
CREATE OR REPLACE FUNCTION increment_memory_count(p_user_id UUID)
RETURNS user_progress AS $$
DECLARE
  result user_progress;
BEGIN
  UPDATE user_progress 
  SET 
    memories_cleared = memories_cleared + 1,
    updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING * INTO result;
  
  IF result IS NULL THEN
    RAISE EXCEPTION 'User progress not found for user_id: %', p_user_id;
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;