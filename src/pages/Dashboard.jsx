import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, BookOpen, Target, TrendingUp, RotateCcw, LogOut, Flame } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Dashboard() {
  const [compassData, setCompassData] = useState(null);
  const [reflectionPrompt, setReflectionPrompt] = useState(null);
  const [journalStreak, setJournalStreak] = useState(0);
  const [skillProgress, setSkillProgress] = useState(null);
  const [stats, setStats] = useState({ psikotes: 0, journals: 0, skills: 0 });
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch latest compass data
      const { data: compass } = await supabase
        .from('compass_data')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      setCompassData(compass);

      // Fetch random reflection prompt
      const { data: prompts } = await supabase
        .from('reflection_prompts')
        .select('*')
        .eq('active', true);
      if (prompts && prompts.length > 0) {
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        setReflectionPrompt(randomPrompt);
      }

      // Calculate journal streak
      const { data: journalEntries } = await supabase
        .from('journal_entries')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (journalEntries) {
        const streak = calculateStreak(journalEntries);
        setJournalStreak(streak);
      }

      // Fetch active skill progress
      const { data: skill } = await supabase
        .from('skill_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .limit(1)
        .single();
      setSkillProgress(skill);

      // Fetch stats
      const { count: psikotesCount } = await supabase
        .from('psikotes_results')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      const { count: journalsCount } = await supabase
        .from('journal_entries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      const { count: skillsCount } = await supabase
        .from('skill_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setStats({
        psikotes: psikotesCount || 0,
        journals: journalsCount || 0,
        skills: skillsCount || 0
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (entries) => {
    if (!entries || entries.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if there's an entry today or yesterday
    const sortedEntries = entries.map(e => {
      const date = new Date(e.created_at);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });

    let currentDate = today.getTime();
    const dayInMs = 24 * 60 * 60 * 1000;

    // If no entry today, check yesterday
    if (!sortedEntries.includes(currentDate)) {
      currentDate -= dayInMs;
      if (!sortedEntries.includes(currentDate)) {
        return 0; // Streak broken
      }
    }

    // Count consecutive days
    while (sortedEntries.includes(currentDate)) {
      streak++;
      currentDate -= dayInMs;
    }

    return streak;
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getStreakMessage = (streak) => {
    if (streak === 0) return "Mulai streak hari ini!";
    if (streak <= 2) return "Bagus! Keep going 🔥";
    if (streak <= 6) return "Streak kamu on fire! 🔥🔥";
    return `Amazing! ${streak} hari berturut-turut! 🔥🔥🔥`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Sidebar */}
      <nav className="fixed left-0 top-0 h-full w-64 bg-white border-r border-neutral p-6 hidden md:block">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-primary">GenMave</h1>
        </div>
        
        <div className="space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 bg-primary-light text-primary rounded-lg font-medium"
          >
            <Target size={20} />
            Dashboard
          </Link>
          <Link
            to="/compass"
            className="flex items-center gap-3 px-4 py-3 text-text-light hover:bg-neutral rounded-lg transition-colors"
          >
            <Compass size={20} />
            Compass
          </Link>
          <Link
            to="/journal"
            className="flex items-center gap-3 px-4 py-3 text-text-light hover:bg-neutral rounded-lg transition-colors"
          >
            <BookOpen size={20} />
            Journal
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 text-text-light hover:bg-neutral rounded-lg transition-colors"
          >
            <TrendingUp size={20} />
            Profile
          </Link>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-text-light hover:bg-neutral rounded-lg transition-colors w-full"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="md:ml-64 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">
            Selamat datang kembali, {user.email.split('@')[0]}! 👋
          </h1>
          <p className="text-text-light">Ini progress kamu hari ini</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="text-sm text-text-light mb-1">Psikotes Taken</div>
            <div className="text-3xl font-bold text-primary">{stats.psikotes}</div>
          </Card>
          <Card>
            <div className="text-sm text-text-light mb-1">Journal Entries</div>
            <div className="text-3xl font-bold text-primary">{stats.journals}</div>
          </Card>
          <Card>
            <div className="text-sm text-text-light mb-1">Skills Explored</div>
            <div className="text-3xl font-bold text-primary">{stats.skills}</div>
          </Card>
        </div>

        {/* Main Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Clarity Score Widget */}
          <Card>
            <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
              <Compass className="text-primary" size={24} />
              Clarity Score
            </h2>
            {compassData ? (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl font-bold text-primary">
                    {compassData.clarity_score}
                  </div>
                  <div className="text-sm text-text-light">/100</div>
                </div>
                <Button onClick={() => navigate('/compass')} variant="outline" size="sm">
                  Lihat Compass Lengkap
                </Button>
              </>
            ) : (
              <>
                <p className="text-text-light mb-4">Belum ada data compass</p>
                <Button onClick={() => navigate('/psikotes')} size="sm">
                  Mulai Psikotes
                </Button>
              </>
            )}
          </Card>

          {/* Journal Streak Widget */}
          <Card>
            <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
              <Flame className="text-secondary" size={24} />
              Journal Streak
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl font-bold text-secondary">
                {journalStreak}
              </div>
              <div className="text-sm text-text-light">hari 🔥</div>
            </div>
            <p className="text-sm text-text-light mb-4">{getStreakMessage(journalStreak)}</p>
            <Button onClick={() => navigate('/journal')} variant="outline" size="sm">
              Buka Journal
            </Button>
          </Card>
        </div>

        {/* Reflection Prompt */}
        {reflectionPrompt && (
          <Card className="mb-8 bg-gradient-to-br from-primary-light to-neutral">
            <h2 className="text-xl font-heading font-semibold mb-4">
              💭 Reflection Prompt
            </h2>
            <p className="text-lg mb-4">"{reflectionPrompt.prompt_text}"</p>
            <Button onClick={() => navigate('/journal')} size="sm">
              Tulis di Journal
            </Button>
          </Card>
        )}

        {/* Skill Progress */}
        <Card className="mb-8">
          <h2 className="text-xl font-heading font-semibold mb-4">Skill Progress</h2>
          {skillProgress ? (
            <>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{skillProgress.skill_id.toUpperCase()}</span>
                  <span className="text-sm text-text-light">
                    Day {skillProgress.current_day} of 7
                  </span>
                </div>
                <div className="w-full bg-neutral h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(skillProgress.completed_days.length / 7) * 100}%` }}
                  />
                </div>
              </div>
              <Button onClick={() => navigate(`/skills/${skillProgress.skill_id}`)} size="sm">
                Lanjutkan
              </Button>
            </>
          ) : (
            <>
              <p className="text-text-light mb-4">Belum mulai explore skill. Yuk mulai!</p>
              <Button onClick={() => navigate('/compass')} size="sm">
                Lihat Rekomendasi
              </Button>
            </>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => navigate('/psikotes')}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            Retake Psikotes
          </Button>
          <Button
            onClick={() => navigate('/compass')}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <Compass size={18} />
            View Compass
          </Button>
          <Button
            onClick={() => navigate('/manifesto')}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <BookOpen size={18} />
            Read Manifesto
          </Button>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral p-4 md:hidden flex justify-around">
        <Link to="/dashboard" className="flex flex-col items-center gap-1 text-primary">
          <Target size={24} />
          <span className="text-xs">Dashboard</span>
        </Link>
        <Link to="/compass" className="flex flex-col items-center gap-1 text-text-light">
          <Compass size={24} />
          <span className="text-xs">Compass</span>
        </Link>
        <Link to="/journal" className="flex flex-col items-center gap-1 text-text-light">
          <BookOpen size={24} />
          <span className="text-xs">Journal</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center gap-1 text-text-light">
          <TrendingUp size={24} />
          <span className="text-xs">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
