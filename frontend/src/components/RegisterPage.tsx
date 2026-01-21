// src/components/RegisterPage.tsx
import { useState } from 'react';
import { ArrowLeft, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RegisterPageProps {
  onRegister: (
    vorname: string,
    nachname: string,
    email: string,
    passwort: string
  ) => Promise<boolean>;
  error?: string | null;
}

export default function RegisterPage({ onRegister, error }: RegisterPageProps) {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    vorname: '',
    nachname: '',
    email: '',
    passwort: ''
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onRegister(form.vorname, form.nachname, form.email, form.passwort);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <button
        onClick={() => nav('/')}
        className="absolute top-6 left-6 p-2 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="bg-white/90 backdrop-blur rounded-3xl p-8 max-w-md w-full shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          W<Sprout className="text-green-600" size={28} />rld{' '}
          <Sprout className="text-green-500" size={28} />f Gardeners
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {['vorname', 'nachname', 'email', 'passwort'].map(field => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1 capitalize">
                {field}
              </label>
              <input
                type={field === 'passwort' ? 'password' : field === 'email' ? 'email' : 'text'}
                name={field}
                value={(form as any)[field]}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Registrieren …' : 'Registrieren'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Schon registriert?{' '}
          <button
            onClick={() => nav('/login')}
            className="text-green-600 hover:text-green-700 font-semibold underline"
          >
            Einloggen
          </button>
        </p>
      </div>
    </div>
  );
}
