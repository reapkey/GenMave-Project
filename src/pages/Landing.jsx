import { Link } from 'react-router-dom';
import { Home, Target, TrendingUp, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-light to-background px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-text mb-6">
            Capek ngebanding-bandingin diri sama orang lain?
          </h1>
          <p className="text-xl md:text-2xl text-text-light mb-8">
            GenMave adalah ruang untuk kembali ke diri sendiri
          </p>
          <Link to="/signup">
            <Button size="lg" className="px-8">
              Mulai Psikotes Gratis <ArrowRight className="ml-2 inline" size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Problem Validation Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Kamu Nggak Sendirian
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="text-4xl font-bold text-primary mb-4">48%</div>
              <p className="text-lg text-text-light">
                Gen Z feeling lost hampir tiap hari
              </p>
            </Card>
            <Card className="text-center">
              <div className="text-4xl font-bold text-primary mb-4">72%</div>
              <p className="text-lg text-text-light">
                Capek ngebanding-bandingin diri
              </p>
            </Card>
            <Card className="text-center">
              <div className="text-4xl font-bold text-primary mb-4">76%</div>
              <p className="text-lg text-text-light">
                Scroll sosmed & feel insecure
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Yang Bisa Kamu Lakukan Di Sini
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <Home className="mx-auto mb-4 text-primary" size={48} />
              <h3 className="text-xl font-heading font-semibold mb-2">
                Psikotes Reflektif
              </h3>
              <p className="text-text-light">
                Pahami diri lebih dalam dengan 15 pertanyaan yang mindful
              </p>
            </Card>
            <Card className="text-center">
              <Target className="mx-auto mb-4 text-primary" size={48} />
              <h3 className="text-xl font-heading font-semibold mb-2">
                Jurnal Pribadi
              </h3>
              <p className="text-text-light">
                Safe space tanpa judgment untuk menulis perasaan kamu
              </p>
            </Card>
            <Card className="text-center">
              <TrendingUp className="mx-auto mb-4 text-primary" size={48} />
              <h3 className="text-xl font-heading font-semibold mb-2">
                Eksplorasi Skill
              </h3>
              <p className="text-text-light">
                Coba skill baru dalam 7 hari tanpa tekanan
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Cara Kerjanya
          </h2>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Ambil Psikotes (10 menit)</h3>
                <p className="text-text-light">Jawab 15 pertanyaan yang membantu kamu memahami diri sendiri</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Dapat Personal Compass</h3>
                <p className="text-text-light">Lihat clarity score dan rekomendasi skill yang cocok untuk kamu</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Eksplorasi Diri & Skill</h3>
                <p className="text-text-light">Tulis jurnal, coba skill baru, dan track progress kamu</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Siap Untuk Kembali Ke Diri Sendiri?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Mulai perjalanan self-discovery kamu hari ini. Gratis.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="px-8">
              Mulai Sekarang
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-text text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm">
            © 2024 GenMave. A space to return to yourself.
          </div>
          <div className="flex gap-6">
            <Link to="/manifesto" className="text-sm hover:text-primary-light transition-colors">
              Manifesto
            </Link>
            <Link to="/help" className="text-sm hover:text-primary-light transition-colors">
              Help
            </Link>
            <a href="mailto:support@genmave.app" className="text-sm hover:text-primary-light transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
