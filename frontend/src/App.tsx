import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

/* Seiten-Komponenten */
import WelcomePage     from './components/WelcomePage';
import RegisterPage    from './components/RegisterPage';
import LoginPage       from './components/LoginPage';
import Dashboard       from './components/Dashboard';
import AllPlants       from './components/AllPlants';
import AddPlant        from './components/AddPlant';
import StandortList    from './components/StandortList';
import MyPlants        from './components/MyPlants';          // ➜ NEU
import LoadingSpinner  from './components/LoadingSpinner';

export default function App() {
  const { user, loading, error, login, register, logout, isAuthenticated } = useAuth();
  const nav = useNavigate();

  /* ---------- Handler ---------- */
  async function handleLogin(email: string, passwort: string) {
    const ok = await login(email, passwort);
    if (ok) nav('/dashboard');
    return ok;
  }

  async function handleRegister(v: string, n: string, e: string, p: string) {
    const ok = await register(v, n, e, p);
    if (ok) nav('/dashboard');
    return ok;
  }

  function handleLogout() {
    logout();
    nav('/');
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-purple-100">
      <Routes>
        {/* öffentliche Pfade */}
        <Route path="/"          element={<WelcomePage />} />
        <Route path="/login"     element={<LoginPage  onLogin={handleLogin}      error={error} />} />
        <Route path="/register"  element={<RegisterPage onRegister={handleRegister} error={error} />} />

        {/* geschützte Pfade */}
        <Route
          path="/dashboard"
          element={isAuthenticated
            ? <Dashboard user={user} onLogout={handleLogout} />
            : <Navigate to="/login" replace />}
        />

        <Route
          path="/pflanzen"
          element={isAuthenticated ? <AllPlants /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/pflanzen/neue"
          element={isAuthenticated ? <AddPlant /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/standorte"
          element={isAuthenticated ? <StandortList /> : <Navigate to="/login" replace />}
        />

        {/* ➜ NEU: Meine Pflanzen */}
        <Route
          path="/meine-pflanzen"
          element={isAuthenticated ? <MyPlants /> : <Navigate to="/login" replace />}
        />

        {/* Fallback 404 */}
        <Route path="*" element={<h1 className="mt-20 text-center">Seite nicht gefunden</h1>} />
      </Routes>
    </div>
  );
}
