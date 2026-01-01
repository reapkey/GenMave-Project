import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { psikotesQuestions } from '../data/psikotesQuestions';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Psikotes() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('psikotes_progress');
    if (saved) {
      const { answers: savedAnswers, currentQuestion: savedQuestion } = JSON.parse(saved);
      setAnswers(savedAnswers);
      setCurrentQuestion(savedQuestion);
    }
  }, []);

  // Save to localStorage on every answer
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('psikotes_progress', JSON.stringify({
        answers,
        currentQuestion
      }));
    }
  }, [answers, currentQuestion]);

  const question = psikotesQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / psikotesQuestions.length) * 100;
  const isAnswered = answers[question.id] !== undefined;

  const handleAnswer = (value) => {
    if (question.type === 'checkbox') {
      const current = answers[question.id] || [];
      let newValue;
      
      if (current.includes(value)) {
        newValue = current.filter(v => v !== value);
      } else {
        if (question.maxSelect && current.length >= question.maxSelect) {
          return; // Don't allow more selections
        }
        newValue = [...current, value];
      }
      
      setAnswers({ ...answers, [question.id]: newValue });
    } else {
      setAnswers({ ...answers, [question.id]: value });
    }
  };

  const handleNext = () => {
    if (currentQuestion < psikotesQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateClarityScore = (answers) => {
    let score = 50; // base score

    // Q3: Feeling lost frequency
    const q3 = answers[3];
    if (q3 === 'Hampir tiap hari') score -= 20;
    else if (q3 === 'Seminggu beberapa kali') score -= 10;
    else if (q3 === 'Jarang') score += 20;

    // Q4: Self-understanding (1-5 scale)
    const q4 = answers[4];
    score += (q4 - 3) * 10;

    // Q5: Number of "hilang" factors
    const q5 = answers[5] || [];
    score -= q5.length * 3;

    // Cap at 0-100
    return Math.max(0, Math.min(100, score));
  };

  const generateNarrative = (answers) => {
    const q3 = answers[3];
    const q4 = answers[4];
    const q10 = answers[10];
    const q13 = answers[13];
    const q14 = answers[14];
    const q15 = answers[15];

    let narrative = "Berdasarkan jawaban kamu, kamu termasuk orang yang:\n\n";

    // Self-awareness pattern
    if (q3 === 'Hampir tiap hari' || q3 === 'Seminggu beberapa kali') {
      narrative += "- Sering merasa lost dan mencari arah yang lebih jelas\n";
    } else {
      narrative += "- Sudah cukup jelas dengan arah hidupmu\n";
    }

    // Learning style
    if (q10) {
      const learningMap = {
        'Visual': 'belajar paling efektif dengan video dan visualisasi',
        'Hands-on': 'belajar paling efektif dengan hands-on practice',
        'Reading': 'belajar paling efektif dengan membaca dan refleksi',
        'Audio': 'belajar paling efektif dengan mendengar dan diskusi'
      };
      narrative += `- ${learningMap[q10]}\n`;
    }

    // Energy pattern
    if (q14) {
      const energyMap = {
        'Morning person': 'paling produktif di pagi hari',
        'Night owl': 'paling produktif di malam hari',
        'Flexible': 'bisa fleksibel dengan waktu produktif'
      };
      narrative += `- ${energyMap[q14]}\n`;
    }

    // Work preference
    if (q15) {
      const workMap = {
        'Solo': 'lebih suka bekerja sendiri',
        'Bareng tim': 'lebih suka bekerja dalam tim',
        'Depends on task': 'fleksibel antara solo dan tim tergantung tugas'
      };
      narrative += `- ${workMap[q15]}\n`;
    }

    // Primary need
    if (q13) {
      narrative += `- Saat ini butuh: ${q13.toLowerCase()}\n`;
    }

    narrative += "\nKamu nggak sendirian dalam perjalanan ini. Ribuan Gen Z lainnya juga sedang mencari cara untuk kembali ke diri sendiri.";

    return narrative;
  };

  const getRecommendedSkills = (answers) => {
    const q5 = answers[5] || [];
    const q10 = answers[10];
    const q13 = answers[13];

    const skills = [];

    // Skill matching logic
    if (q10 === 'Visual' || q5.includes('skill_bingung')) {
      skills.push({
        name: 'UI/UX Design',
        match: 87,
        reason: 'Visual thinking + creative exploration',
        slug: 'uiux'
      });
    }

    if (q10 === 'Hands-on' || q5.includes('terlalu_banyak_pilihan')) {
      skills.push({
        name: 'Web Development',
        match: 85,
        reason: 'Practical, immediate feedback, clear path',
        slug: 'webdev'
      });
    }

    if (q10 === 'Reading' || q13 === 'Memahami diri lebih dalam') {
      skills.push({
        name: 'Creative Writing',
        match: 82,
        reason: 'Deep reflection, self-expression',
        slug: 'writing'
      });
    }

    if (q10 === 'Audio' || q13 === 'Komunitas kecil') {
      skills.push({
        name: 'Podcasting',
        match: 80,
        reason: 'Social connection through storytelling',
        slug: 'podcasting'
      });
    }

    // Always add at least 3 skills
    if (skills.length < 3) {
      skills.push({
        name: 'Content Creation',
        match: 75,
        reason: 'Self-expression and creativity',
        slug: 'content'
      });
    }

    return skills.slice(0, 3);
  };

  const getGrowthEdges = (answers) => {
    const q9 = answers[9] || [];
    const edges = [];

    const edgeMap = {
      'nggak_tau_mulai': {
        pattern: 'overwhelmed by options',
        tip: 'Pick one small step hari ini. Nggak harus sempurna.'
      },
      'terlalu_banyak_resources': {
        pattern: 'analysis paralysis',
        tip: 'Batasi diri cuma 1 resource per minggu.'
      },
      'nggak_ada_support': {
        pattern: 'isolation',
        tip: 'Share progress kamu, even kecil-kecilan, di komunitas.'
      },
      'cepet_bosan': {
        pattern: 'low sustained interest',
        tip: 'Coba format belajar yang beda dari biasanya.'
      },
      'nggak_ada_waktu': {
        pattern: 'time management',
        tip: 'Start with 15 menit/hari. Consistency > duration.'
      }
    };

    q9.forEach(obstacle => {
      if (edgeMap[obstacle]) {
        edges.push(edgeMap[obstacle]);
      }
    });

    return edges;
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Calculate compass data
      const clarityScore = calculateClarityScore(answers);
      const narrative = generateNarrative(answers);
      const recommendedSkills = getRecommendedSkills(answers);
      const growthEdges = getGrowthEdges(answers);
      const energyPattern = answers[14] || 'Flexible';
      const learningStyle = answers[10] || 'Visual';

      // Save to psikotes_results
      const { data: psikotesData, error: psikotesError } = await supabase
        .from('psikotes_results')
        .insert({
          user_id: user.id,
          answers: answers
        })
        .select()
        .single();

      if (psikotesError) throw psikotesError;

      // Save to compass_data
      const { error: compassError } = await supabase
        .from('compass_data')
        .insert({
          user_id: user.id,
          psikotes_result_id: psikotesData.id,
          clarity_score: clarityScore,
          narrative_text: narrative,
          energy_pattern: energyPattern,
          learning_style: learningStyle,
          recommended_skills: recommendedSkills,
          growth_edges: growthEdges
        });

      if (compassError) throw compassError;

      // Clear localStorage
      localStorage.removeItem('psikotes_progress');

      // Navigate to compass
      navigate('/compass');
    } catch (error) {
      console.error('Error saving psikotes:', error);
      alert('Terjadi kesalahan saat menyimpan hasil. Coba lagi?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-text-light">
              Pertanyaan {currentQuestion + 1} dari {psikotesQuestions.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-neutral h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <h2 className="text-2xl font-heading font-bold mb-6">
            {question.question}
          </h2>

          {/* Radio/Scale Options */}
          {(question.type === 'radio' || question.type === 'scale') && (
            <div className="space-y-3">
              {question.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary"
                  style={{
                    borderColor: answers[question.id] === option.value ? '#81B29A' : '#F4F1DE',
                    backgroundColor: answers[question.id] === option.value ? '#F0F7F4' : 'white'
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.value}
                    checked={answers[question.id] === option.value}
                    onChange={() => handleAnswer(option.value)}
                    className="mr-3 w-5 h-5 text-primary"
                  />
                  <span className="text-base">{option.label}</span>
                </label>
              ))}
            </div>
          )}

          {/* Checkbox Options */}
          {question.type === 'checkbox' && (
            <div className="space-y-3">
              {question.maxSelect && (
                <p className="text-sm text-text-light mb-4">
                  Pilih maksimal {question.maxSelect} opsi
                </p>
              )}
              {question.options.map((option) => {
                const isChecked = (answers[question.id] || []).includes(option.value);
                return (
                  <label
                    key={option.value}
                    className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary"
                    style={{
                      borderColor: isChecked ? '#81B29A' : '#F4F1DE',
                      backgroundColor: isChecked ? '#F0F7F4' : 'white'
                    }}
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={isChecked}
                      onChange={() => handleAnswer(option.value)}
                      className="mr-3 w-5 h-5 text-primary rounded"
                    />
                    <span className="text-base">{option.label}</span>
                  </label>
                );
              })}
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={20} />
            Kembali
          </Button>

          {currentQuestion === psikotesQuestions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!isAnswered || loading}
              loading={loading}
              className="flex items-center gap-2"
            >
              Selesai
              <ChevronRight size={20} />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex items-center gap-2"
            >
              Lanjut
              <ChevronRight size={20} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
