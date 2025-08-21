'use client';

import { useEffect, useMemo, useState } from 'react';
import CityAutocomplete from './CityAutocomplete';

// --- Types métiers ---
export type PieceType = 'studio' | 't2' | 't3' | 't4';
export type ExploitType = 'longue' | 'courte';

// Structure des données que le formulaire renvoie au parent
export type SimInputs = {
  prix: number;       // prix du bien (en euros)
  surface: number;    // surface en m²
  pieces: PieceType;  // type de logement (studio, T2, …)
  type: ExploitType;  // type d’exploitation (location longue ou courte durée)
  ville: string;      // ville choisie
};

export default function SimulatorForm({ onChange }: { onChange: (v: SimInputs) => void }) {
  // --- États internes pour chaque champ du formulaire ---
  const [prix, setPrix] = useState(200_000);     // valeur par défaut : 200 000 €
  const [surface, setSurface] = useState(50);    // valeur par défaut : 50 m²
  const [pieces, setPieces] = useState<PieceType>('t2');     // par défaut T2
  const [type, setType] = useState<ExploitType>('longue');   // par défaut longue durée
  const [ville, setVille] = useState('paris');               // par défaut Paris

  // --- Émetteur avec debounce ---
  // useMemo renvoie une fonction stable qui attend 500ms avant d’appeler onChange
  const debouncedEmit = useMemo(() => {
    let t: any;
    return (payload: SimInputs) => {
      clearTimeout(t);
      t = setTimeout(() => onChange(payload), 500);
    };
  }, [onChange]);

  // --- Synchronisation ---
  // Chaque fois qu’un champ change, on déclenche debouncedEmit avec les valeurs actuelles
  useEffect(() => {
    debouncedEmit({ prix, surface, pieces, type, ville });
  }, [prix, surface, pieces, type, ville, debouncedEmit]);

  // --- Rendu ---
  return (
    <div className="bg-white rounded-xl shadow p-5 space-y-6 w-full lg:w-[620px]">

      {/* --- PRIX --- */}
      <div>
        <label className="block text-sm font-medium mb-2">Prix du bien (€)</label>
        <div className="flex gap-3 items-center">
          {/* slider */}
          <input
            type="range" min={50_000} max={1_000_000} step={1_000}
            value={prix}
            onChange={e => setPrix(Math.min(1_000_000, Math.max(50_000, Number(e.target.value))))}
            className="w-full accent-[var(--color-am-gold)]"
            aria-label="Prix du bien"
          />
          {/* saisie manuelle */}
          <input
            type="number" min={50_000} max={1_000_000} step={1_000}
            value={prix}
            onChange={e => setPrix(Math.min(1_000_000, Math.max(50_000, Number(e.target.value))))}
            className="w-36 h-10 px-3 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-am-gold)]"
            aria-label="Prix du bien, saisie manuelle"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">Entre 50 000 € et 1 000 000 €</p>
      </div>

      {/* --- SURFACE --- */}
      <div>
        <label className="block text-sm font-medium mb-2">Surface (m²)</label>
        <div className="flex gap-3 items-center">
          <input
            type="range" min={10} max={200} step={1}
            value={surface}
            onChange={e => setSurface(Math.min(200, Math.max(10, Number(e.target.value))))}
            className="w-full accent-[var(--color-am-gold)]"
            aria-label="Surface du bien"
          />
          <input
            type="number" min={10} max={200} step={1}
            value={surface}
            onChange={e => setSurface(Math.min(200, Math.max(10, Number(e.target.value))))}
            className="w-24 h-10 px-3 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-am-gold)]"
            aria-label="Surface du bien, saisie manuelle"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">Entre 10 et 200 m²</p>
      </div>

      {/* --- NOMBRE DE PIÈCES --- */}
      <div>
        <label className="block text-sm font-medium mb-2">Nombre de pièces</label>
        <div className="flex flex-wrap gap-2">
          {(['studio','t2','t3','t4'] as PieceType[]).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setPieces(p)}
              className={`px-3 py-1.5 rounded-full text-sm border transition
                ${pieces===p
                  ? 'bg-[var(--color-am-gold)] text-[var(--color-am-blue)] border-transparent'
                  : 'border-slate-300 hover:bg-slate-50'}`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* --- TYPE D’EXPLOITATION --- */}
      <div>
        <label className="block text-sm font-medium mb-2">Type d’exploitation</label>
        <div className="flex gap-2">
          {(['longue','courte'] as ExploitType[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`px-3 py-1.5 rounded-full text-sm border transition
                ${type===t
                  ? 'bg-[var(--color-am-blue)] text-white border-transparent'
                  : 'border-slate-300 hover:bg-slate-50'}`}
            >
              {t === 'longue' ? 'Longue durée' : 'Courte durée'}
            </button>
          ))}
        </div>
      </div>

      {/* --- VILLE --- */}
      <div>
        <label className="block text-sm font-medium mb-1">Ville</label>
        <CityAutocomplete
          value={ville}
          onChange={setVille}
        />
      </div>
    </div>
  );
}
