// src/components/LoginPage.tsx
import { useState } from 'react';
import { ArrowLeft, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onLogin: (email: string, passwort: string) => Promise<boolean>;
  error?: string | null;
}

export default function LoginPage({ onLogin, error }: LoginPageProps) {
  const nav        = useNavigate();
  const [email,    setEmail]    = useState('');
  const [passwort, setPasswort] = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const ok = await onLogin(email, passwort);
      if (!ok) setLoading(false);          
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {/* Zurück → Welcome */}
      <button
        onClick={() => nav('/')}
        className="absolute top-6 left-6 p-2 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="bg-white/90 backdrop-blur rounded-3xl p-8 max-w-md w-full shadow-xl">
        {/* Logo */}
        <h1 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          W<Sprout className="text-green-600" size={28} />rld{' '}
          <Sprout className="text-green-500" size={28} />f Gardeners
        </h1>

        {/* Fehlermeldung */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Formular */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Passwort</label>
            <input
              type="password"
              value={passwort}
              onChange={e => setPasswort(e.target.value)}
              required
              className="w-full border rounded p-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Anmelden …' : 'Anmelden'}
          </button>
        </form>

        {/* Link zur Registrierung */}
        <p className="text-center mt-4 text-sm">
          Noch kein Konto?{' '}
          <button
            onClick={() => nav('/register')}
            className="text-green-600 hover:text-green-700 font-semibold underline"
          >
            Registrieren
          </button>
        </p>
      </div>
    </div>
  );
}
