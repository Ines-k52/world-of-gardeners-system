/* src/components/StandortList.tsx */

import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Standort } from '../types/api';

export default function StandortList() {
  const [list, setList] = useState<Standort[]>([]);
  const [loading, setLoading] = useState(true);

  /* Formular-State */
  const [bez,   setBez]   = useState('');
  const [desc,  setDesc]  = useState('');

  /* Standorte laden */
  async function laden() {
    const data = await apiService.getStandorte();
    setList(data);
    setLoading(false);
  }
  useEffect(() => { laden(); }, []);

  /* Neuen Standort anlegen */
  async function speichern(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiService.createStandort({ bezeichnung: bez, beschreibung: desc });
      setBez('');
      setDesc('');
      laden();                             
    } catch {
      alert('Fehler beim Speichern');
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold text-center">Meine Standorte</h1>

      {/* ---------- Formular ---------- */}
      <form onSubmit={speichern} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bezeichnung
          </label>
          <input value={bez} onChange={e => setBez(e.target.value)}
                 required
                 className="w-full rounded border px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Beschreibung (optional)
          </label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)}
                    rows={3}
                    className="w-full rounded border px-3 py-2" />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Hinzufügen
        </button>
      </form>

      {/* ---------- Liste ---------- */}
      {loading && <p>Lade …</p>}

      {!loading && list.length === 0 && (
        <p className="text-gray-500 italic text-center">Noch keine Standorte.</p>
      )}

      <ul className="space-y-4">
        {list.map(s => (
          <li key={s.standortID}
              className="p-4 bg-white rounded shadow border">
            <h2 className="font-semibold">{s.bezeichnung}</h2>
            {s.beschreibung && (
              <p className="text-sm text-gray-600">{s.beschreibung}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
