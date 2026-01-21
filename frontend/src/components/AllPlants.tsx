// src/components/AllPlants.tsx
import { useEffect, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { apiService } from '../services/api';
import { Pflanze } from '../types/api';

export default function AllPlants() {
  const [all,   setAll]   = useState<Pflanze[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    apiService.getPflanzen().then(raw => {
      const unique = Array.from(
        new Map(raw.map(p => [`${p.name}§${p.wissenschaftlicherName ?? ''}`, p])).values()
      );
      setAll(unique);
    });
  }, []);

  /* Suche (case-insensitiv) */
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? all.filter(p =>
          p.name.toLowerCase().includes(q) ||
          (p.wissenschaftlicherName ?? '').toLowerCase().includes(q)
        )
      : all;
  }, [all, query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 p-6">
      {/* Suchfeld */}
      <div className="max-w-md mx-auto mb-8 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Pflanzen suchen…"
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full shadow
                     focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Karten-Grid */}
      {list.length === 0 ? (
        <p className="text-center text-gray-600">Keine Treffer.</p>
      ) : (
        <div className="grid gap-6
                        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {list.map(p => (
            <div
              key={p.pflanzenID}
              className="bg-white/70 backdrop-blur rounded-xl p-4 shadow hover:shadow-lg
                         transition transform hover:-translate-y-1"
            >
              <h3 className="font-semibold text-green-700">{p.name}</h3>
              {p.wissenschaftlicherName && (
                <p className="italic text-sm text-gray-700">
                  {p.wissenschaftlicherName}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
