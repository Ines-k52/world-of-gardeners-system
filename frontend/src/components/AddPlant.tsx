import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Pflanze, Standort } from '../types/api';

export default function AddPlant() {
  const [pflanzen,  setPflanzen]  = useState<Pflanze[]>([]);
  const [standorte, setStandorte] = useState<Standort[]>([]);

  const [form, setForm] = useState({
    pflanzenID: '',
    standortID: '',
    beschreibung: ''
  });

  useEffect(() => {
    apiService.getPflanzen().then(raw => {
      const uniq = Array.from(
        new Map(
          raw.map(p => [`${p.name}§${p.wissenschaftlicherName ?? ''}`, p])
        ).values()
      ).sort((a, b) => a.name.localeCompare(b.name));
      setPflanzen(uniq);
    });

    apiService.getStandorte().then(setStandorte);
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createBestand({
        pflanzenID: Number(form.pflanzenID),
        standortID: Number(form.standortID),
        jahr: new Date().getFullYear(),
        pflegehinweis: form.beschreibung
      });
      alert('Erfolgreich hinzugefügt');
      setForm({ pflanzenID: '', standortID: '', beschreibung: '' });
    } catch (err) {
      alert('Fehler beim Speichern');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 p-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white/70 backdrop-blur rounded-xl p-8 shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-xl font-bold text-center mb-4">Neue Pflanze hinzufügen</h2>

        {/* Pflanze auswählen */}
        <select
          required
          value={form.pflanzenID}
          onChange={e => setForm({ ...form, pflanzenID: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">– Pflanze auswählen –</option>
          {pflanzen.map(p => (
            <option key={p.pflanzenID} value={p.pflanzenID}>
              {p.name}
              {p.wissenschaftlicherName ? ` — ${p.wissenschaftlicherName}` : ''}
            </option>
          ))}
        </select>

        {/* Standort auswählen */}
        <select
          required
          value={form.standortID}
          onChange={e => setForm({ ...form, standortID: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">– Standort auswählen –</option>
          {standorte.map(s => (
            <option key={s.standortID} value={s.standortID}>
              {s.bezeichnung}
            </option>
          ))}
        </select>

        {/* Hinweis */}
        <textarea
          value={form.beschreibung}
          onChange={e => setForm({ ...form, beschreibung: e.target.value })}
          placeholder="Pflegehinweis (optional)"
          className="w-full border rounded px-3 py-2 h-24 resize-y"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
        >
          Speichern
        </button>
      </form>
    </div>
  );
}
