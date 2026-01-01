import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sunrise, Moon, Sun, Eye, Book, Headphones, Hand, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Compass() {
  const [compassData, setCompassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompassData();
  }, []);

  const fetchCompassData = async () => {
    try {
      const { data, error } = await supabase
        .from('compass_data')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setCompassData(data);
    } catch (error) {
      console.error('Error fetching compass:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score <= 40) return '#E07A5F'; // Terracotta (needs support)
    if (score <= 70) return '#F4A261'; // Amber (developing)
    return '#81B29A'; // Sage green (strong)
  };

  const getEnergyIcon = (pattern) => {
    if (pattern === 'Morning person') return <Sunrise className="text-primary" size={48} />;
    if (pattern === 'Night owl') return <Moon className="text-primary" size={48} />;
    return <Sun className="text-primary" size={48} />;
  };

  const getLearningIcon = (style) => {
    if (style === 'Visual') return <Eye className="text-primary" size={48} />;
    if (style === 'Reading') return <Book className="text-primary" size={48} />;
    if (style === 'Audio') return <Headphones className="text-primary" size={48} />;
    return <Hand className="text-primary" size={48} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!compassData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <Card className="text-center max-w-md">
          <h2 className="text-2xl font-heading font-bold mb-4">Belum Ada Compass</h2>
          <p className="text-text-light mb-6">
            Kamu belum mengambil psikotes. Yuk mulai untuk dapatkan personal compass kamu!
          </p>
          <Button onClick={() => navigate('/psikotes')}>Mulai Psikotes</Button>
        </Card>
      </div>
    );
  }

  const { clarity_score, narrative_text, energy_pattern, learning_style, recommended_skills, growth_edges } = compassData;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Greeting */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold mb-4">
            Halo, {user.email.split('@')[0]}! Ini Kompasmu 🧭
          </h1>
          <p className="text-lg text-text-light">
            Hasil refleksi dari psikotes kamu
          </p>
        </div>

        {/* Clarity Score */}
        <Card className="mb-8 text-center">
          <h2 className="text-2xl font-heading font-bold mb-6">Clarity Score</h2>
          
          {/* Circular Progress */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <svg className="transform -rotate-90" width="200" height="200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="#F4F1DE"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke={getScoreColor(clarity_score)}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - clarity_score / 100)}`}
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div className="absolute">
              <div className="text-5xl font-bold" style={{ color: getScoreColor(clarity_score) }}>
                {clarity_score}
              </div>
              <div className="text-sm text-text-light">/100</div>
            </div>
          </div>

          <p className="text-text-light max-w-md mx-auto">
            Ini bukan nilai. Ini refleksi seberapa jelas kamu lihat arah hidupmu.
          </p>
        </Card>

        {/* Personal Narrative */}
        <Card className="mb-8">
          <h2 className="text-2xl font-heading font-bold mb-4">Tentang Kamu</h2>
          <p className="text-base whitespace-pre-line text-text-light leading-relaxed">
            {narrative_text}
          </p>
        </Card>

        {/* Energy Pattern & Learning Style */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Energy Pattern */}
          <Card className="text-center">
            <div className="flex justify-center mb-4">
              {getEnergyIcon(energy_pattern)}
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2">
              {energy_pattern}
            </h3>
            <p className="text-text-light text-sm">
              Waktu produktif terbaik kamu
            </p>
          </Card>

          {/* Learning Style */}
          <Card className="text-center">
            <div className="flex justify-center mb-4">
              {getLearningIcon(learning_style)}
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2">
              {learning_style} Learner
            </h3>
            <p className="text-text-light text-sm">
              Cara belajar yang paling efektif
            </p>
          </Card>
        </div>

        {/* Recommended Skills */}
        {recommended_skills && recommended_skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-heading font-bold mb-6">Rekomendasi Skill Untuk Kamu</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recommended_skills.map((skill, index) => (
                <Card key={index} interactive>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-heading font-semibold">{skill.name}</h3>
                      <span className="text-sm font-medium text-primary">{skill.match}% match</span>
                    </div>
                    <p className="text-sm text-text-light mb-4">
                      {skill.reason}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/skills/${skill.slug}`)}
                  >
                    Coba 7 Hari
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Growth Edges */}
        {growth_edges && growth_edges.length > 0 && (
          <Card className="mb-8">
            <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="text-warning" size={24} />
              Growth Edges
            </h2>
            <div className="space-y-4">
              {growth_edges.map((edge, index) => (
                <div key={index} className="border-l-4 border-warning pl-4 py-2">
                  <p className="text-base mb-2">
                    Kamu cenderung <span className="font-semibold">{edge.pattern}</span>.
                  </p>
                  <p className="text-sm text-text-light">
                    <span className="font-medium text-text">Challenge:</span> {edge.tip}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" onClick={() => navigate('/dashboard')}>
            Ke Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
