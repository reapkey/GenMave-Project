-- GenMave Seed Data
-- Run this AFTER schema.sql and rls-policies.sql
-- This adds initial reflection prompts and sample data

-- =====================================================
-- Seed reflection_prompts table
-- =====================================================
INSERT INTO reflection_prompts (prompt_text, category, active) VALUES
  -- Gratitude prompts
  ('Apa yang bikin kamu grateful minggu ini?', 'gratitude', true),
  ('Siapa yang pengen kamu thank hari ini, dan kenapa?', 'gratitude', true),
  ('Apa yang bikin kamu proud hari ini, sekecil apapun?', 'gratitude', true),
  ('Hal kecil apa yang bikin hari ini lebih baik?', 'gratitude', true),
  
  -- Growth prompts
  ('Apa satu hal yang kamu pelajari tentang diri sendiri minggu ini?', 'growth', true),
  ('Kapan terakhir kali kamu keluar dari comfort zone?', 'growth', true),
  ('Apa yang berbeda dari diri kamu sekarang dibanding sebulan lalu?', 'growth', true),
  ('Challenge apa yang lagi kamu hadapi dan apa yang bisa kamu pelajari?', 'growth', true),
  
  -- Skill prompts
  ('Skill apa yang pengen kamu pelajari bulan ini?', 'skill', true),
  ('Apa yang bikin kamu excited untuk belajar?', 'skill', true),
  ('Skill apa yang kamu udah punya tapi sering kamu abaikan?', 'skill', true),
  ('Kalau waktu nggak jadi masalah, skill apa yang pengen kamu kuasai?', 'skill', true),
  
  -- Emotion prompts
  ('Perasaan apa yang lagi dominan hari ini?', 'emotion', true),
  ('Kapan terakhir kali kamu merasa "ini gue banget"?', 'emotion', true),
  ('Apa yang bikin kamu feel alive akhir-akhir ini?', 'emotion', true),
  ('Gimana cara kamu merawat diri sendiri ketika lagi down?', 'emotion', true),
  
  -- Self-awareness prompts
  ('Apa yang jadi prioritas utama kamu saat ini?', 'self-awareness', true),
  ('Nilai apa yang paling penting buat kamu dalam hidup?', 'self-awareness', true),
  ('Kapan kamu merasa paling jadi diri sendiri?', 'self-awareness', true),
  ('Apa yang bikin kamu berbeda dari orang lain?', 'self-awareness', true),
  
  -- Relationship prompts
  ('Siapa yang paling ngerti kamu, dan kenapa?', 'relationship', true),
  ('Apa yang pengen kamu sampaikan ke orang terdekat tapi belum sempat?', 'relationship', true),
  ('Hubungan seperti apa yang bikin kamu grow?', 'relationship', true),
  
  -- Future prompts
  ('Kalau kamu bisa kirim pesan ke diri sendiri 5 tahun lagi, apa pesannya?', 'future', true),
  ('Apa yang pengen kamu capai di akhir tahun ini?', 'future', true),
  ('Versi terbaik dari diri kamu itu seperti apa?', 'future', true),
  
  -- Mindfulness prompts
  ('Apa yang kamu syukuri dari tubuh kamu hari ini?', 'mindfulness', true),
  ('Moment apa yang bikin kamu smile hari ini?', 'mindfulness', true),
  ('Apa yang lagi kamu butuhkan sekarang: rest atau action?', 'mindfulness', true),
  
  -- Creative prompts
  ('Kalau hidup kamu jadi buku, judulnya apa?', 'creative', true),
  ('Warna apa yang menggambarkan mood kamu hari ini?', 'creative', true),
  ('Kalau kamu bisa punya superpower, apa dan kenapa?', 'creative', true);

-- =====================================================
-- Optional: Add sample skills for testing
-- (Commented out - add only for development/testing)
-- =====================================================
-- You can manually add skills to test the skill pathway feature
-- Example skill IDs: 'uiux', 'webdev', 'writing', 'podcasting', 'photography'

-- =====================================================
-- Success Message
-- =====================================================
-- Seed data inserted successfully!
-- Database is now ready to use.
-- 
-- Next steps:
-- 1. Configure Supabase Auth (email templates, site URL)
-- 2. Copy your Supabase URL and anon key
-- 3. Add them to .env.local in your project
-- 4. Start building! 🚀
