"use client";

import type { ResultsFull } from "./SimulatorPage";
import type { SimInputs } from "./SimulatorForm";
import Badge from "./ui/Badge";
import { exportSimulationPdf } from "../lib/pdf";
import { useMemo } from "react";

// -----------------------------
// Formatting helpers (FR locale)
// -----------------------------
const LOCALE = "fr-FR" as const;

const fmtEUR = (v?: number | null) => {
  if (typeof v !== "number" || Number.isNaN(v)) return "—";
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(v);
};

/**
 * Formats a percentage for FR locale, accepting either ratio (0–1)
 * or percentage value (e.g. 8.5 for 8.5%).
 */
const fmtPct = (v?: number | null) => {
  if (typeof v !== "number" || Number.isNaN(v)) return "—";
  const ratio = v > 1 ? v / 100 : v; // be lenient with inputs
  return new Intl.NumberFormat(LOCALE, {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(ratio);
};

// Mappe la source technique → libellé + ton de badge
function sourceBadge(source?: string) {
  const s = (source || "").toLowerCase();
  if (s.includes("airdna")) return { label: "AirDNA (live)", tone: "success" as const };
  if (s.includes("meilleursagents")) return { label: "MeilleursAgents (live)", tone: "success" as const };
  if (s.includes("local")) return { label: "Fallback local", tone: "warning" as const };
  return { label: "Source inconnue", tone: "info" as const };
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
  const canExport = !!(results && inputs);

  // Pré-calculs stables pour éviter de recalculer le badge à chaque render
  const source = useMemo(() => (results ? sourceBadge(results.source) : null), [results]);

  return (
    <aside
      className="bg-white rounded-xl shadow p-5 w-full lg:w-80 h-max lg:sticky lg:top-6"
      aria-label="Panneau des résultats de simulation"
    >
      {/* Entête + bouton PDF */}
      <div className="flex items-center justify-between mb-3">
        <h3 id="results-title" className="font-semibold text-lg">
          Résultats
        </h3>
        <button
          type="button"
          disabled={!canExport}
          onClick={() => canExport && exportSimulationPdf(inputs!, results!)}
          className={`text-xs px-3 py-1 rounded border transition ${
            canExport
              ? "border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
              : "border-slate-200 text-slate-400 cursor-not-allowed"
          }`}
          aria-disabled={!canExport}
          aria-describedby="results-title"
          title={canExport ? "Exporter la simulation en PDF" : "Renseignez d'abord les paramètres"}
        >
          📄 Exporter PDF
        </button>
      </div>

      {loading && (
        <div className="animate-pulse space-y-3" role="status" aria-live="polite">
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-10 bg-slate-200 rounded" />
          <div className="h-10 bg-slate-200 rounded w-5/6" />
          <div className="h-10 bg-slate-200 rounded w-2/3" />
          <span className="sr-only">Chargement…</span>
        </div>
      )}

      {/* Erreur */}
      {!loading && error && (
        <p className="text-red-600" role="alert">
          Erreur : {error}
        </p>
      )}

      {/* Vide */}
      {!loading && !error && !results && (
        <p className="text-slate-600">Définissez les paramètres pour voir les résultats.</p>
      )}

      {/* Résultats */}
      {!loading && !error && results && (
        <div className="space-y-4" aria-live="polite">
          {/* KPIs */}
          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-lg border p-3" aria-labelledby="kpi-rendement">
              <div id="kpi-rendement" className="text-xs text-slate-500">
                Rendement brut
              </div>
              <div className="text-xl font-semibold">{fmtPct(results.rendement)}</div>
            </div>
            <div className="rounded-lg border p-3" aria-labelledby="kpi-cashflow">
              <div id="kpi-cashflow" className="text-xs text-slate-500">
                Cash-flow mensuel
              </div>
              <div className="text-xl font-semibold">{fmtEUR(results.cashflow)}</div>
            </div>
            <div className="rounded-lg border p-3" aria-labelledby="kpi-invest">
              <div id="kpi-invest" className="text-xs text-slate-500">
                Investissement total
              </div>
              <div className="text-xl font-semibold">{fmtEUR(results.investissementTotal)}</div>
            </div>
          </div>

          {/* Frais */}
          <div className="border-t pt-3">
            <div className="text-sm font-medium mb-1">Frais inclus</div>
            <dl className="text-sm space-y-1">
              <div className="flex items-baseline justify-between gap-2">
                <dt>Notaire (9&nbsp;%)</dt>
                <dd className="font-semibold">{fmtEUR(results.fraisNotaire)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <dt>Commission A&amp;M (8,5&nbsp;%)</dt>
                <dd className="font-semibold">{fmtEUR(results.commissionAM)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <dt>Architecte</dt>
                <dd className="font-semibold">{fmtEUR(results.fraisArchitecte)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <dt>Total frais</dt>
                <dd className="font-semibold">{fmtEUR(results.fraisTotal)}</dd>
              </div>
            </dl>
          </div>

          {/* Revenus */}
          <div className="border-t pt-3">
            <div className="text-sm font-medium mb-1">Revenus estimés</div>
            <dl className="text-sm space-y-1">
              {typeof results.loyerMensuelParM2 === "number" && (
                <div className="flex items-baseline justify-between gap-2">
                  <dt>Loyer estimé (€/m²/mois)</dt>
                  <dd className="font-semibold">
                    {new Intl.NumberFormat(LOCALE, {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    }).format(results.loyerMensuelParM2)}
                  </dd>
                </div>
              )}
              <div className="flex items-baseline justify-between gap-2">
                <dt>Revenu mensuel</dt>
                <dd className="font-semibold">{fmtEUR(results.revenusMensuel)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <dt>Revenu annuel</dt>
                <dd className="font-semibold">{fmtEUR(results.revenusAnnuels)}</dd>
              </div>
            </dl>
          </div>

          {/* Source */}
          <div className="text-xs text-slate-500">
            Source données : {source ? <Badge tone={source.tone}>{source.label}</Badge> : "—"}
          </div>
        </div>
      )}
    </aside>
  );
}
