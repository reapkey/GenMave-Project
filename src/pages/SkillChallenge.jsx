import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { getSkillById } from '../data/skillChallenges';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import {
  CheckCircle,
  Lock,
  ArrowLeft,
  BookOpen,
  ExternalLink,
  PartyPopper,
  AlertCircle,
} from 'lucide-react';

export default function SkillChallenge() {
  const { skillId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const skill = getSkillById(skillId);

  const [progress, setProgress] = useState(null);
  const [reflections, setReflections] = useState({});
  const [currentReflection, setCurrentReflection] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [surveyResponse, setSurveyResponse] = useState('');
  const [expandedDay, setExpandedDay] = useState(null);

  useEffect(() => {
    if (!skill) {
      navigate('/skills');
      return;
    }
    fetchProgress();
  }, [skillId, user]);

  const fetchProgress = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('skill_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('skill_id', skillId)
        .eq('status', 'active')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        // No active progress, redirect to skills page
        navigate('/skills');
        return;
      }

      setProgress(data);
      setReflections(data.reflections || {});
      setExpandedDay(data.current_day);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteDay = async (dayNumber) => {
    if (!currentReflection.trim()) {
      alert('Tulis reflection dulu sebelum complete day ini 🙂');
      return;
    }

    try {
      const updatedReflections = {
        ...reflections,
        [`day${dayNumber}`]: currentReflection,
      };

      const updatedCompletedDays = [...progress.completed_days, dayNumber];
      const nextDay = dayNumber < 7 ? dayNumber + 1 : 7;

      const updates = {
        completed_days: updatedCompletedDays,
        current_day: nextDay,
        reflections: updatedReflections,
      };

      // If Day 7 is completed, show completion modal
      if (dayNumber === 7) {
        updates.completed_at = new Date().toISOString();
        setShowCompletionModal(true);
      }

      const { error } = await supabase
        .from('skill_progress')
        .update(updates)
        .eq('id', progress.id);

      if (error) throw error;

      setProgress({ ...progress, ...updates });
      setReflections(updatedReflections);
      setCurrentReflection('');

      // Expand next day
      if (dayNumber < 7) {
        setExpandedDay(nextDay);
      }
    } catch (error) {
      console.error('Error completing day:', error);
      alert('Gagal save progress. Coba lagi?');
    }
  };

  const handleSaveReflection = async (dayNumber) => {
    try {
      const updatedReflections = {
        ...reflections,
        [`day${dayNumber}`]: currentReflection,
      };

      const { error } = await supabase
        .from('skill_progress')
        .update({ reflections: updatedReflections })
        .eq('id', progress.id);

      if (error) throw error;

      setReflections(updatedReflections);
      alert('Reflection tersimpan! ✅');
    } catch (error) {
      console.error('Error saving reflection:', error);
      alert('Gagal save reflection. Coba lagi?');
    }
  };

  const handleCompleteSurvey = async (response) => {
    try {
      const { error } = await supabase
        .from('skill_progress')
        .update({
          survey_response: response,
          status: 'completed',
        })
        .eq('id', progress.id);

      if (error) throw error;

      setSurveyResponse(response);

      // Wait 2 seconds then redirect
      setTimeout(() => {
        navigate('/skills');
      }, 2000);
    } catch (error) {
      console.error('Error completing survey:', error);
      alert('Gagal save survey. Coba lagi?');
    }
  };

  const handleQuitChallenge = async () => {
    const confirmQuit = window.confirm(
      'Yakin mau quit challenge ini? Progress kamu akan disimpan dan bisa dilanjutin nanti.'
    );

    if (!confirmQuit) return;

    try {
      const { error } = await supabase
        .from('skill_progress')
        .update({ status: 'abandoned' })
        .eq('id', progress.id);

      if (error) throw error;

      navigate('/skills');
    } catch (error) {
      console.error('Error quitting challenge:', error);
      alert('Gagal quit challenge. Coba lagi?');
    }
  };

  const getDayStatus = (dayNumber) => {
    if (progress.completed_days.includes(dayNumber)) {
      return 'completed';
    }
    if (dayNumber === progress.current_day) {
      return 'active';
    }
    if (dayNumber < progress.current_day) {
      return 'available'; // Past days that weren't completed
    }
    return 'locked';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-light">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (!skill || !progress) {
    return null;
  }

  const completionPercentage = (progress.completed_days.length / 7) * 100;

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/skills')}
          className="flex items-center gap-2 text-text-light hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Skills</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{skill.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-text">7-Hari Challenge: {skill.name}</h1>
              <p className="text-text-light">Day {progress.current_day} of 7</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-neutral rounded-full h-3 overflow-hidden">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-text-light mt-2">
            {progress.completed_days.length} of 7 days completed ({Math.round(completionPercentage)}%)
          </p>
        </div>

        {/* Day Cards */}
        <div className="space-y-4 mb-8">
          {skill.days.map((day) => {
            const status = getDayStatus(day.day);
            const isExpanded = expandedDay === day.day;

            return (
              <Card
                key={day.day}
                className={`transition-all ${
                  status === 'completed'
                    ? 'bg-green-50 border-green-200'
                    : status === 'active'
                    ? 'bg-primary/5 border-primary'
                    : status === 'locked'
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : ''
                }`}
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => {
                    if (status !== 'locked') {
                      setExpandedDay(isExpanded ? null : day.day);
                      if (status === 'active' || status === 'available') {
                        setCurrentReflection(reflections[`day${day.day}`] || '');
                      }
                    }
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Status Icon */}
                    {status === 'completed' ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : status === 'active' ? (
                      <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      </div>
                    ) : status === 'locked' ? (
                      <Lock className="w-6 h-6 text-gray-400" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                    )}

                    <div>
                      <h3 className="font-semibold text-text">
                        Day {day.day}: {day.title}
                      </h3>
                      {status === 'completed' && (
                        <p className="text-sm text-green-600">✓ Completed</p>
                      )}
                      {status === 'active' && (
                        <p className="text-sm text-primary">← Kamu di sini</p>
                      )}
                    </div>
                  </div>

                  {status !== 'locked' && (
                    <button className="text-text-light hover:text-primary transition-colors">
                      {isExpanded ? '▲' : '▼'}
                    </button>
                  )}
                </div>

                {/* Expanded Content */}
                {isExpanded && status !== 'locked' && (
                  <div className="mt-6 space-y-4 border-t border-gray-200 pt-6">
                    <div>
                      <h4 className="font-medium text-text mb-2">Task:</h4>
                      <p className="text-text-light">{day.description}</p>
                    </div>

                    {day.resources && day.resources.length > 0 && (
                      <div>
                        <h4 className="font-medium text-text mb-2 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" /> Resources:
                        </h4>
                        <ul className="space-y-1">
                          {day.resources.map((resource, idx) => (
                            <li key={idx} className="text-sm text-text-light flex items-center gap-2">
                              <ExternalLink className="w-3 h-3" />
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium text-text mb-2">Reflection:</h4>
                      <p className="text-sm text-text-light italic mb-3">{day.reflectionPrompt}</p>

                      {status === 'completed' ? (
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <p className="text-text">{reflections[`day${day.day}`]}</p>
                        </div>
                      ) : (
                        <>
                          <textarea
                            value={currentReflection}
                            onChange={(e) => setCurrentReflection(e.target.value)}
                            placeholder="Tulis reflection kamu di sini..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            rows={4}
                          />
                          <p className="text-xs text-text-light mt-1">
                            {currentReflection.length} characters
                          </p>

                          <div className="flex gap-3 mt-4">
                            {status === 'active' && (
                              <Button
                                onClick={() => handleCompleteDay(day.day)}
                                variant="primary"
                                disabled={!currentReflection.trim()}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Tandai Selesai
                              </Button>
                            )}

                            {currentReflection.trim() && (
                              <Button
                                onClick={() => handleSaveReflection(day.day)}
                                variant="outline"
                              >
                                Save Reflection
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Quit Button */}
        <div className="text-center">
          <button
            onClick={handleQuitChallenge}
            className="text-text-light hover:text-red-500 text-sm transition-colors"
          >
            Keluar Challenge
          </button>
        </div>

        {/* Completion Modal */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-lg w-full">
              <div className="text-center">
                <PartyPopper className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-text mb-2">
                  🎉 Selamat! Kamu Selesai 7-Day Challenge!
                </h2>
                <p className="text-text-light mb-6">
                  Kamu udah complete challenge {skill.name}. Gimana pengalaman kamu?
                </p>

                {surveyResponse ? (
                  <div className="text-center">
                    <p className="text-primary font-medium mb-2">
                      Thanks for your feedback! Redirecting...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      onClick={() => handleCompleteSurvey('love-it')}
                      variant="primary"
                      className="w-full"
                    >
                      😍 Suka banget, mau lanjut!
                    </Button>
                    <Button
                      onClick={() => handleCompleteSurvey('like-it')}
                      variant="outline"
                      className="w-full"
                    >
                      👍 Cukup suka, tapi nggak prioritas
                    </Button>
                    <Button
                      onClick={() => handleCompleteSurvey('not-for-me')}
                      variant="outline"
                      className="w-full"
                    >
                      🤔 Nggak cocok, mau coba skill lain
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
