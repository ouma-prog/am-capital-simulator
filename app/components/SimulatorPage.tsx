'use client';

import { useEffect, useMemo, useState } from 'react';
import SimulatorFormPro, { type SimInputs } from './SimulatorForm';
import ResultsPanelPro from './ResultsPanel';
import ContactSection from './ContactSection';

const COEF = { studio: 1.39, t2: 1.0, t3: 0.81, t4: 0.80 } as const;

export type ResultsFull = {
  rendement: number;
  cashflow: number;
  fraisTotal: number;
  fraisNotaire: number;
  commissionAM: number;
  fraisArchitecte: number;
  investissementTotal: number;
  revenusMensuel: number;
  revenusAnnuels: number;
  loyerMensuelParM2?: number;
  source: string; 
};

export default function SimulatorPage() {
  const [inputs, setInputs] = useState<SimInputs | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResultsFull | null>(null);
  const [error, setError] = useState<string | null>(null);

  function compute(
    prix: number,
    surface: number,
    type: SimInputs['type'],
    pieces: SimInputs['pieces'],
    revenuMensuelLong?: number,
    revenuMensuelCourt?: number,
    source: ResultsFull['source'] = 'local'
  ): ResultsFull {

    const fraisNotaire = prix * 0.09;
    const commissionAM = prix * 0.085;
    const fraisArchitecte = surface * (type === 'longue' ? 90 : 120);
    const fraisTotal = fraisNotaire + commissionAM + fraisArchitecte;
    const investissementTotal = prix + fraisTotal;

    let revenusMensuel: number;
    let loyerMensuelParM2: number | undefined;

    if (type === 'longue') {
      if (typeof revenuMensuelLong === 'number') {
        revenusMensuel = revenuMensuelLong;
      } else {
        const baseParM2 = 12;
        loyerMensuelParM2 = baseParM2 * COEF[pieces];
        revenusMensuel = loyerMensuelParM2 * surface;
      }
    } else {
      if (typeof revenuMensuelCourt === 'number') {
        revenusMensuel = revenuMensuelCourt;
      } else {
        const baseParM2 = 12;
        loyerMensuelParM2 = baseParM2 * COEF[pieces] * 3 * 0.7;
        revenusMensuel = loyerMensuelParM2 * surface;
      }
    }

    const revenusAnnuels = revenusMensuel * 12;
    const rendement = (revenusAnnuels / investissementTotal) * 100;
    const cashflow = revenusMensuel - fraisTotal / 12;

    return {
      rendement,
      cashflow,
      fraisTotal,
      fraisNotaire,
      commissionAM,
      fraisArchitecte,
      investissementTotal,
      revenusMensuel,
      revenusAnnuels,
      loyerMensuelParM2,
      source,
    };
  }

  const run = useMemo(() => {
    let t: ReturnType<typeof setTimeout> | null = null;

    return (vals: SimInputs) => {
      if (t) clearTimeout(t);
      t = setTimeout(async () => {
        const { prix, surface, type, pieces, ville } = vals;

        if (!ville || !ville.trim()) {
          setResults(null);
          setError(null);
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);
        setResults(null);

        try {
          if (type === 'longue') {
            const res = await fetch(
              `/api/rent-data?ville=${encodeURIComponent(ville)}&pieces=${encodeURIComponent(pieces)}`,
              { cache: 'no-store' }
            );
            if (!res.ok) throw new Error('rent-data error');
            const data: { prixM2: number; loyerM2: number; source?: string } = await res.json();
            const revenuMensuelLong = data.loyerM2 * surface;

            setResults(
              compute(
                prix,
                surface,
                type,
                pieces,
                revenuMensuelLong,
                undefined,
                (data.source ?? 'meilleursagents|fallback').toLowerCase().includes('meilleurs')
                  ? 'meilleursagents|live'
                  : (data.source ?? 'meilleursagents|fallback')
              )
            );
          } else {
            const res = await fetch(
              `/api/airbnb-data?ville=${encodeURIComponent(ville)}`,
              { cache: 'no-store' }
            );
            if (!res.ok) throw new Error('airbnb-data error');
            const data: { prixNuit: number; tauxOcc: number; revenuMensuel: number; source?: string } = await res.json();

            setResults(
              compute(
                prix,
                surface,
                type,
                pieces,
                undefined,
                data.revenuMensuel,
                (data.source ?? 'airdna|fallback').toLowerCase().includes('airdna')
                  ? 'airdna|live'
                  : (data.source ?? 'airdna|fallback')
              )
            );
          }
        } catch (e: any) {
          setResults(compute(prix, surface, type, pieces, undefined, undefined, 'local'));
          setError('Données temps réel indisponibles, fallback local utilisé.');
        } finally {
          setLoading(false);
        }
      }, 500);
    };
  }, []);

  useEffect(() => {
    if (inputs) run(inputs);
  }, [inputs, run]);

  return (
    <section className="space-y-6">

      <div className="flex flex-col lg:flex-row gap-6">
        <SimulatorFormPro onChange={setInputs} />
        <ResultsPanelPro
          loading={loading}
          error={error}
          results={results}
          inputs={inputs}  
        />
      </div>
      <ContactSection />

    </section>
  );
}
