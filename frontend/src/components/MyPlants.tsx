import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Bestand } from '../types/api';

export default function MyPlants() {
  const [list, setList]  = useState<Bestand[]>([]);
  const [loading, setLo] = useState(true);

  useEffect(() => {
    apiService.getBestand().then(setList).finally(() => setLo(false));
  }, []);

  if (loading) return <p className="p-6">Lade …</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Meine Pflanzen</h1>

      {list.length === 0 && <p className="text-gray-600">Keine Einträge.</p>}

      {list.length > 0 && (
        <ul className="space-y-4">
          {list.map(b => (
            <li key={b.id} className="bg-white shadow rounded p-4">
              <h2 className="font-semibold">
                {b.pflanze?.name ?? '(unbekannt)'}
                {b.pflanzdatum && (
                  <span className="text-sm text-gray-500 ml-2">
                    {new Date(b.pflanzdatum).toLocaleDateString()}
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-600">
                Standort: {b.standort?.bezeichnung ?? '–'} · Jahr: {b.jahr}
                {b.pflegehinweis && ` · Hinweis: ${b.pflegehinweis}`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
