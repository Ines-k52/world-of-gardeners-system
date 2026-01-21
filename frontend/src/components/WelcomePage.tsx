// src/components/WelcomePage.tsx
import { Sprout, Github, Youtube, Instagram, Twitter } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function WelcomePage() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* --- (dekoratives SVG bleibt) ------------------------------------ */}
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          W<Sprout className="text-green-600" size={48} />rld <Sprout className="text-green-500" size={48} />f Gardeners
        </h1>
        <div className="w-full h-2 bg-gradient-to-r from-purple-500 via-green-500 to-purple-500 rounded-full mx-auto"></div>
      </div>
{/* Plant Character */}
      <div className="mb-8 relative">
        <div className="w-24 h-16 bg-amber-800 rounded-lg relative shadow-lg">
          {/* Eyes */}
          <div className="absolute top-3 left-3 w-3 h-3 bg-white rounded-full shadow-inner">
            <div className="w-2 h-2 bg-gray-800 rounded-full m-0.5"></div>
          </div>
          <div className="absolute top-3 right-3 w-3 h-3 bg-white rounded-full shadow-inner">
            <div className="w-2 h-2 bg-gray-800 rounded-full m-0.5"></div>
          </div>
          {/* Smile */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-4 border-b-2 border-gray-700 rounded-full"></div>
        </div>
        {/* Plant */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <svg width="40" height="30" viewBox="0 0 40 30">
            <path d="M20 30 Q10 15 5 5 Q15 10 20 30" fill="#10B981" />
            <path d="M20 30 Q30 15 35 5 Q25 10 20 30" fill="#059669" />
          </svg>
        </div>
      </div>
      {/* Welcome Text */}
      <div className="bg-green-100 bg-opacity-80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl text-center mb-8 shadow-lg border border-green-200">
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          <strong>Willkommen bei World of Gardeners!</strong> Die einzige Plattform, die du für deinen Gartenclub brauchst!
        </p>
        <p className="text-gray-600 mb-4">
          Hier ist alles einfach, übersichtlich und genau auf dich zugeschnitten.
        </p>
        <p className="text-gray-600 mb-2">
          Um loszulegen, klick einfach auf den Button unten und logg dich ein.
        </p>
        <p className="text-gray-600 mb-2">
          Noch kein offizielles Konto?
        </p>
        <p className="text-gray-600">
          Kein Problem!
        </p>
        <p className="text-green-600 font-semibold mt-4">
          Registriere dich einfach mit deiner Gartenclub-ID.
        </p>
        <p className="text-gray-500 italic mt-2">
          Bereit? 🌱
        </p>
      </div>

      

      {/* Action Buttons */}
      <div className="flex gap-4 mb-12">
        <button
          onClick={() => nav('/login')}
          className="px-8 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition"
        >
          Log in
        </button>

        <Link
          to="/register"
          className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:bg-green-700 transition"
        >
          Registrieren
        </Link>
      </div>

      {/* Social Media (gekürzt) */}
      <div className="absolute bottom-8 left-8 flex flex-col gap-3 text-gray-600">
        <Github  className="w-5 h-5 hover:text-gray-800 cursor-pointer" />
        <Youtube className="w-5 h-5 hover:text-red-600  cursor-pointer" />
        <Instagram className="w-5 h-5 hover:text-pink-600 cursor-pointer" />
        <Twitter   className="w-5 h-5 hover:text-blue-500 cursor-pointer" />
      </div>
    </div>
  );
}
