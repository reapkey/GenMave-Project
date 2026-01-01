import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { getAllSkills } from '../data/skillChallenges';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { BookOpen, Clock, CheckCircle, Lock, ArrowRight } from 'lucide-react';

export default function SkillPathway() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeProgress, setActiveProgress] = useState(null);
  const [completedSkills, setCompletedSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const skills = getAllSkills();

  useEffect(() => {
    fetchUserProgress();
  }, [user]);

  const fetchUserProgress = async () => {
    try {
      setLoading(true);

      // Fetch active challenge
      const { data: activeData, error: activeError } = await supabase
        .from('skill_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (activeError && activeError.code !== 'PGRST116') throw activeError;
      setActiveProgress(activeData);

      // Fetch completed challenges
      const { data: completedData, error: completedError } = await supabase
        .from('skill_progress')
        .select('skill_id')
        .eq('user_id', user.id)
        .eq('status', 'completed');

      if (completedError) throw completedError;
      setCompletedSkills(completedData.map(item => item.skill_id));
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChallenge = async (skillId) => {
    try {
      // Check if already have active challenge
      if (activeProgress) {
        const confirmSwitch = window.confirm(
          'Kamu sudah punya challenge yang aktif. Yakin mau start challenge baru? Progress challenge lama akan di-pause.'
        );
        if (!confirmSwitch) return;

        // Update old challenge to paused/abandoned
        await supabase
          .from('skill_progress')
          .update({ status: 'abandoned' })
          .eq('id', activeProgress.id);
      }

      // Create new progress entry
      const { data, error } = await supabase
        .from('skill_progress')
        .insert([
          {
            user_id: user.id,
            skill_id: skillId,
            current_day: 1,
            completed_days: [],
            reflections: {},
            status: 'active',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Navigate to challenge page
      navigate(`/skills/${skillId}`);
    } catch (error) {
      console.error('Error starting challenge:', error);
      alert('Gagal start challenge. Coba lagi?');
    }
  };

  const handleContinueChallenge = () => {
    if (activeProgress) {
      navigate(`/skills/${activeProgress.skill_id}`);
    }
  };

  const getSkillStatus = (skillId) => {
    if (activeProgress && activeProgress.skill_id === skillId) {
      return 'active';
    }
    if (completedSkills.includes(skillId)) {
      return 'completed';
    }
    return 'available';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-light">Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Skill Pathway</h1>
          <p className="text-text-light">
            Explore skills melalui 7-day challenge yang low-pressure dan fun. Pilih skill yang pengen kamu coba!
          </p>
        </div>

        {/* Active Challenge Banner */}
        {activeProgress && (
          <Card className="mb-8 bg-primary/10 border-primary">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl">
                  {skills.find(s => s.id === activeProgress.skill_id)?.icon || '🎯'}
                </div>
                <div>
                  <h3 className="font-semibold text-text">
                    Challenge Aktif: {skills.find(s => s.id === activeProgress.skill_id)?.name}
                  </h3>
                  <p className="text-sm text-text-light">
                    Day {activeProgress.current_day} of 7 · {activeProgress.completed_days.length} days completed
                  </p>
                  <div className="mt-2 bg-neutral rounded-full h-2 w-64">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(activeProgress.completed_days.length / 7) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <Button onClick={handleContinueChallenge} className="whitespace-nowrap">
                Lanjutkan Challenge <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => {
            const status = getSkillStatus(skill.id);

            return (
              <Card
                key={skill.id}
                className={`hover:shadow-lg transition-shadow ${
                  status === 'active' ? 'border-primary' : ''
                } ${status === 'completed' ? 'bg-primary/5' : ''}`}
              >
                <div className="text-5xl mb-4">{skill.icon}</div>

                <h3 className="text-xl font-semibold text-text mb-2">{skill.name}</h3>
                <p className="text-text-light text-sm mb-4">{skill.description}</p>

                <div className="flex items-center gap-4 text-sm text-text-light mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>7 days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>Beginner</span>
                  </div>
                </div>

                {/* Status Badge */}
                {status === 'active' && (
                  <div className="mb-4 inline-flex items-center gap-1 px-3 py-1 bg-primary text-white rounded-full text-sm">
                    <span className="animate-pulse">●</span> Challenge Aktif
                  </div>
                )}

                {status === 'completed' && (
                  <div className="mb-4 inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-full text-sm">
                    <CheckCircle className="w-4 h-4" /> Completed
                  </div>
                )}

                {/* Action Button */}
                {status === 'active' ? (
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleContinueChallenge}
                  >
                    Lanjutkan Challenge
                  </Button>
                ) : status === 'completed' ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleStartChallenge(skill.id)}
                  >
                    Retake Challenge
                  </Button>
                ) : (
                  <Button
                    variant={activeProgress ? 'outline' : 'primary'}
                    className="w-full"
                    onClick={() => handleStartChallenge(skill.id)}
                    disabled={!!activeProgress}
                  >
                    {activeProgress ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" /> Complete Active First
                      </>
                    ) : (
                      'Start Challenge'
                    )}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-neutral/50">
          <h3 className="font-semibold text-text mb-3">💡 How It Works</h3>
          <ul className="space-y-2 text-text-light text-sm">
            <li>✓ Pilih skill yang pengen kamu explore</li>
            <li>✓ Complete daily tasks selama 7 hari (flexible, no pressure!)</li>
            <li>✓ Tulis reflection setiap hari (private, cuma kamu yang baca)</li>
            <li>✓ Nggak ada deadline atau penalty—lanjutin kapanpun kamu siap</li>
            <li>✓ Setelah selesai, decide apakah mau deep-dive atau try skill lain</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
