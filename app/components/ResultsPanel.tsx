'use client';

import type { ResultsFull } from './SimulatorPage';
import type { SimInputs } from './SimulatorForm';
import Badge from './ui/Badge';
import { exportSimulationPdf } from '../lib/pdf';

const fmtEUR = (v: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(v);

const fmtPct = (v: number) => `${v.toFixed(2).replace('.', ',')} %`;

// Mappe la source technique → libellé + ton de badge
function sourceBadge(source?: string) {
  const s = (source || '').toLowerCase();
  if (s.includes('airdna')) return { label: 'AirDNA (live)', tone: 'success' as const };
  if (s.includes('meilleursagents')) return { label: 'MeilleursAgents (live)', tone: 'success' as const };
  if (s.includes('local')) return { label: 'Fallback local', tone: 'warning' as const };
  return { label: 'Source inconnue', tone: 'info' as const };
}

export default function ResultsPanelPro({
  loading,
  error,
  results,
  inputs,
}: {
  loading: boolean;
  error: string | null;
  results: ResultsFull | null;
  inputs: SimInputs | null;
}) {
  return (
    <aside className="bg-white rounded-xl shadow p-5 w-full lg:w-80 h-max lg:sticky lg:top-6">
      {/* Entête + bouton PDF */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">Résultats</h3>
        <button
          disabled={!results || !inputs}
          onClick={() => results && inputs && exportSimulationPdf(inputs, results)}
          className={`text-xs px-3 py-1 rounded border transition ${
            results && inputs
              ? 'border-slate-300 hover:bg-slate-50'
              : 'border-slate-200 text-slate-400 cursor-not-allowed'
          }`}
          aria-disabled={!results || !inputs}
        >
          📄 Exporter PDF
        </button>
      </div>

      {/* Loader skeleton */}
      {loading && (
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-10 bg-slate-200 rounded" />
          <div className="h-10 bg-slate-200 rounded w-5/6" />
          <div className="h-10 bg-slate-200 rounded w-2/3" />
        </div>
      )}

      {/* Erreur */}
      {!loading && error && <p className="text-red-600">Erreur : {error}</p>}

      {/* Vide */}
      {!loading && !error && !results && (
        <p className="text-slate-600">Définissez les paramètres pour voir les résultats.</p>
      )}

      {/* Résultats */}
      {!loading && !error && results && (
        <div className="space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-lg border p-3">
              <div className="text-xs text-slate-500">Rendement brut</div>
              <div className="text-xl font-semibold">{fmtPct(results.rendement)}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-slate-500">Cash-flow mensuel</div>
              <div className="text-xl font-semibold">{fmtEUR(results.cashflow)}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-slate-500">Investissement total</div>
              <div className="text-xl font-semibold">{fmtEUR(results.investissementTotal)}</div>
            </div>
          </div>

          {/* Frais */}
          <div className="border-t pt-3">
            <div className="text-sm font-medium mb-1">Frais inclus</div>
            <ul className="text-sm space-y-1">
              <li>Notaire (9%) : <b>{fmtEUR(results.fraisNotaire)}</b></li>
              <li>Commission A&M (8,5%) : <b>{fmtEUR(results.commissionAM)}</b></li>
              <li>Architecte : <b>{fmtEUR(results.fraisArchitecte)}</b></li>
              <li>Total frais : <b>{fmtEUR(results.fraisTotal)}</b></li>
            </ul>
          </div>

          {/* Revenus */}
          <div className="border-t pt-3">
            <div className="text-sm font-medium mb-1">Revenus estimés</div>
            <ul className="text-sm space-y-1">
              {typeof results.loyerMensuelParM2 === 'number' && (
                <li>Loyer estimé (€/m²/mois) : <b>{results.loyerMensuelParM2.toFixed(1).replace('.', ',')}</b></li>
              )}
              <li>Revenu mensuel : <b>{fmtEUR(results.revenusMensuel)}</b></li>
              <li>Revenu annuel : <b>{fmtEUR(results.revenusAnnuels)}</b></li>
            </ul>
          </div>

          {/* Source */}
          <div className="text-xs text-slate-500">
            Source données :{' '}
            {(() => {
              const { label, tone } = sourceBadge(results.source);
              return <Badge tone={tone}>{label}</Badge>;
            })()}
          </div>
        </div>
      )}
    </aside>
  );
}
