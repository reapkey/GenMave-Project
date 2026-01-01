import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-heading font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-heading font-semibold mb-4">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-text-light mb-8">
          Sepertinya kamu tersesat. Yuk kembali ke halaman utama.
        </p>
        <Link to="/">
          <Button>Kembali ke Home</Button>
        </Link>
      </div>
    </div>
  );
}
