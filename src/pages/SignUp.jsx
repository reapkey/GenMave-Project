import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreeTerms) {
      setError('Kamu harus setuju dengan Terms & Privacy');
      return;
    }

    if (password.length < 8) {
      setError('Password minimal 8 karakter');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);

    if (error) {
      if (error.message.includes('already registered')) {
        setError('Email sudah terdaftar');
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else {
      navigate('/psikotes');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background py-12">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-heading font-bold text-center mb-6">
          Daftar
        </h1>
        <p className="text-center text-text-light mb-8">
          Mulai perjalanan self-discovery kamu 🌱
        </p>

        {error && (
          <div className="bg-error/10 border border-error text-error px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Minimal 8 karakter"
          />

          <Input
            label="Konfirmasi Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Ketik ulang password"
          />

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-text-light">
              Saya setuju dengan <a href="/terms" className="text-primary hover:underline">Terms & Privacy</a>
            </label>
          </div>

          <Button type="submit" className="w-full" loading={loading}>
            Daftar
          </Button>
        </form>

        <p className="text-center text-sm text-text-light mt-6">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}