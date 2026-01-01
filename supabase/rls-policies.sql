-- GenMave Row Level Security (RLS) Policies
-- Run this AFTER schema.sql to enable data security
-- This ensures users can only access their own data

-- =====================================================
-- Enable RLS on all tables
-- =====================================================
ALTER TABLE psikotes_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE compass_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflection_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Policies for psikotes_results
-- =====================================================
CREATE POLICY "Users can view own psikotes results"
ON psikotes_results FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own psikotes results"
ON psikotes_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own psikotes results"
ON psikotes_results FOR UPDATE
USING (auth.uid() = user_id);

-- =====================================================
-- Policies for compass_data
-- =====================================================
CREATE POLICY "Users can view own compass data"
ON compass_data FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own compass data"
ON compass_data FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own compass data"
ON compass_data FOR UPDATE
USING (auth.uid() = user_id);

-- =====================================================
-- Policies for journal_entries
-- =====================================================
CREATE POLICY "Users can view own journal entries"
ON journal_entries FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries"
ON journal_entries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries"
ON journal_entries FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries"
ON journal_entries FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- Policies for skill_progress
-- =====================================================
CREATE POLICY "Users can view own skill progress"
ON skill_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skill progress"
ON skill_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skill progress"
ON skill_progress FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own skill progress"
ON skill_progress FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- Policies for user_settings
-- =====================================================
CREATE POLICY "Users can view own settings"
ON user_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
ON user_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
ON user_settings FOR UPDATE
USING (auth.uid() = user_id);

-- =====================================================
-- Policies for reflection_prompts
-- =====================================================
-- Everyone can view active prompts (no auth required)
CREATE POLICY "Anyone can view active prompts"
ON reflection_prompts FOR SELECT
USING (active = true);

-- Admin-only insert/update/delete (implement after admin role system)
-- CREATE POLICY "Admins can manage prompts"
-- ON reflection_prompts FOR ALL
-- USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- =====================================================
-- Policies for user_feedback
-- =====================================================
CREATE POLICY "Users can view own feedback"
ON user_feedback FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feedback"
ON user_feedback FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all feedback (implement after admin role system)
-- CREATE POLICY "Admins can view all feedback"
-- ON user_feedback FOR SELECT
-- USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- =====================================================
-- Success Message
-- =====================================================
-- Row Level Security policies created successfully!
-- Users can now only access their own data.
-- Next step: Run seed.sql to add initial data
