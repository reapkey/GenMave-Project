-- GenMave Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Table: psikotes_results
-- Purpose: Store user assessment answers
-- =====================================================
CREATE TABLE psikotes_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  answers JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for psikotes_results
CREATE INDEX idx_psikotes_results_user_id ON psikotes_results(user_id);
CREATE INDEX idx_psikotes_results_created_at ON psikotes_results(created_at DESC);

-- =====================================================
-- Table: compass_data
-- Purpose: Store personal compass results
-- =====================================================
CREATE TABLE compass_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  psikotes_result_id UUID REFERENCES psikotes_results(id) ON DELETE CASCADE NOT NULL,
  clarity_score INTEGER NOT NULL CHECK (clarity_score >= 0 AND clarity_score <= 100),
  narrative_text TEXT NOT NULL,
  energy_pattern VARCHAR(50) NOT NULL,
  learning_style VARCHAR(50) NOT NULL,
  recommended_skills JSONB NOT NULL DEFAULT '[]',
  growth_edges JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for compass_data
CREATE INDEX idx_compass_data_user_id ON compass_data(user_id);
CREATE INDEX idx_compass_data_psikotes_result_id ON compass_data(psikotes_result_id);
CREATE INDEX idx_compass_data_created_at ON compass_data(created_at DESC);

-- =====================================================
-- Table: journal_entries
-- Purpose: Store private journal entries
-- =====================================================
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for journal_entries
CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX idx_journal_entries_created_at ON journal_entries(created_at DESC);

-- =====================================================
-- Table: skill_progress
-- Purpose: Track 7-day skill challenge progress
-- =====================================================
CREATE TABLE skill_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  skill_id VARCHAR(50) NOT NULL,
  current_day INTEGER NOT NULL CHECK (current_day >= 1 AND current_day <= 7) DEFAULT 1,
  completed_days INTEGER[] NOT NULL DEFAULT ARRAY[]::INTEGER[],
  reflections JSONB NOT NULL DEFAULT '{}',
  survey_response VARCHAR(100),
  started_at TIMESTAMP DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for skill_progress
CREATE INDEX idx_skill_progress_user_id ON skill_progress(user_id);
CREATE INDEX idx_skill_progress_skill_id ON skill_progress(skill_id);
CREATE INDEX idx_skill_progress_status ON skill_progress(status);

-- =====================================================
-- Table: user_settings
-- Purpose: Store user preferences
-- =====================================================
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  reflection_reminders BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- =====================================================
-- Table: reflection_prompts
-- Purpose: Store weekly reflection prompts
-- =====================================================
CREATE TABLE reflection_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_text TEXT NOT NULL,
  category VARCHAR(50),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for reflection_prompts
CREATE INDEX idx_reflection_prompts_active ON reflection_prompts(active);
CREATE INDEX idx_reflection_prompts_category ON reflection_prompts(category);

-- =====================================================
-- Table: user_feedback (for admin dashboard)
-- Purpose: Store user feedback submissions
-- =====================================================
CREATE TABLE user_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  feedback_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for user_feedback
CREATE INDEX idx_user_feedback_created_at ON user_feedback(created_at DESC);

-- =====================================================
-- Function: Update updated_at timestamp automatically
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at column
CREATE TRIGGER update_psikotes_results_updated_at BEFORE UPDATE ON psikotes_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skill_progress_updated_at BEFORE UPDATE ON skill_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Success Message
-- =====================================================
-- All tables created successfully!
-- Next step: Run rls-policies.sql to enable Row Level Security
