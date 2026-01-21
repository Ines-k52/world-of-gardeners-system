// src/components/Dashboard.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Menu, LogOut, User, Calendar, Star
} from 'lucide-react';
import { User as UserType } from '../types/api';

import allPlantsImg   from '@/assets/AllPlants.jpg';
import newPlantImg    from '@/assets/meine_neue_pflanze.jpg';
import standortImg    from '@/assets/standort.jpg';
import myPlantsImg    from '@/assets/MyPlants.jpg';

interface DashboardProps {
  user: UserType | null;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const nav = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const gardenModules = [
    {
      id: 1,
      title: 'Alle Pflanzen anzeigen',
      desc : 'Übersicht über alle deine Gartenpflanzen',
      to   : '/pflanzen',
      color: 'from-green-200 to-green-300',
      img  : allPlantsImg
    },
    {
      id: 2,
      title: 'Neue Pflanze hinzufügen',
      desc : 'Füge eine neue Pflanze zu deinem Garten hinzu',
      to   : '/pflanzen/neue',
      color: 'from-orange-200 to-red-200',
      img  : newPlantImg
    },
    {
      id: 3,
      title: 'Standorte verwalten',
      desc : 'Verwalte die Standorte in deinem Garten',
      to   : '/standorte',
      color: 'from-yellow-200 to-orange-200',
      img  : standortImg
    },
    {
      id: 4,
      title: 'Meine Pflanzen',
      desc : 'Alle von dir angelegten Einträge',
      to   : '/meine-pflanzen',
      color: 'from-rose-200 to-pink-300',
      img  : myPlantsImg
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Menu size={24} className="text-gray-600" />
            <Calendar size={24} className="text-gray-600" />
          </div>
          <div className="flex items-center gap-4">
            <User size={24} className="text-gray-600" />
            <button onClick={onLogout} className="text-gray-600 hover:text-red-600">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        {/* Begrüßung */}
        <h1 className="text-center text-2xl font-bold">
          Willkommen, {user?.vorname} {user?.nachname}!
        </h1>

        

        {/* Suchleiste */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Suchen…"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full shadow focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Grid mit Bildern */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {gardenModules.map(m => (
            <button
              key={m.id}
              onClick={() => nav(m.to)}
              className="rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
            >
              {/* Bildbereich */}
              <div className={`h-32 bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                <img src={m.img} alt={m.title} className="h-20 object-contain" />
              </div>

              {/* Textbereich */}
              <div className="bg-white p-4 text-left">
                <h3 className="font-bold mb-1">{m.title}</h3>
                <p className="text-sm text-gray-600">{m.desc}</p>
                <div className="flex justify-end mt-3">
                  <Star size={16} className="text-yellow-400" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
