"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SimulatorFormPro, { type SimInputs } from "./SimulatorForm";
import ResultsPanelPro from "./ResultsPanel";
import ContactSection from "./ContactSection";

const COEF = { studio: 1.39, t2: 1.0, t3: 0.81, t4: 0.8 } as const;

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

// Local pure calculator (renamed to avoid shadowing imports named `compute`)
function buildResults(
  prix: number,
  surface: number,
  type: SimInputs["type"],
  pieces: SimInputs["pieces"],
  revenuMensuelLong?: number,
  revenuMensuelCourt?: number,
  source: ResultsFull["source"] = "local"
): ResultsFull {
  const fraisNotaire = prix * 0.09;
  const commissionAM = prix * 0.085;
  const fraisArchitecte = surface * (type === "longue" ? 90 : 120);
  const fraisTotal = fraisNotaire + commissionAM + fraisArchitecte;
  const investissementTotal = prix + fraisTotal;

  let revenusMensuel: number;
  let loyerMensuelParM2: number | undefined;

  if (type === "longue") {
    if (typeof revenuMensuelLong === "number") {
      revenusMensuel = revenuMensuelLong;
    } else {
      const baseParM2 = 12;
      loyerMensuelParM2 = baseParM2 * COEF[pieces];
      revenusMensuel = loyerMensuelParM2 * surface;
    }
  } else {
    if (typeof revenuMensuelCourt === "number") {
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

export default function SimulatorPage() {
  const [inputs, setInputs] = useState<SimInputs | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResultsFull | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Keep references for debounce and cancellation
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  // Main runner — debounced, aborts in-flight, race-safe
  const run = useCallback((vals: SimInputs) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const { prix, surface, type, pieces, ville } = vals;

      const cleanedVille = (ville ?? "").trim();
      if (!cleanedVille) {
        // Reset if ville is empty
        abortRef.current?.abort();
        abortRef.current = null;
        setResults(null);
        setError(null);
        setLoading(false);
        return;
      }

      // Abort previous fetches
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      // Mark this request id to disregard stale responses
      const reqId = ++requestIdRef.current;

      setLoading(true);
      setError(null);
      setResults(null);

      try {
        if (type === "longue") {
          const res = await fetch(
            `/api/rent-data?ville=${encodeURIComponent(cleanedVille)}&pieces=${encodeURIComponent(pieces)}`,
            { cache: "no-store", signal: controller.signal }
          );
          if (!res.ok) throw new Error(`rent-data ${res.status}`);
          const data: { prixM2: number; loyerM2: number; source?: string } = await res.json();
          if (requestIdRef.current !== reqId) return; // stale

          const revenuMensuelLong = data.loyerM2 * surface;
          setResults(
            buildResults(
              prix,
              surface,
              type,
              pieces,
              revenuMensuelLong,
              undefined,
              (data.source ?? "meilleursagents|fallback").toLowerCase().includes("meilleurs")
                ? "meilleursagents|live"
                : data.source ?? "meilleursagents|fallback"
            )
          );
        } else {
          const res = await fetch(
            `/api/airbnb-data?ville=${encodeURIComponent(cleanedVille)}`,
            { cache: "no-store", signal: controller.signal }
          );
          if (!res.ok) throw new Error(`airbnb-data ${res.status}`);
          const data: { prixNuit: number; tauxOcc: number; revenuMensuel: number; source?: string } = await res.json();
          if (requestIdRef.current !== reqId) return; // stale

          setResults(
            buildResults(
              prix,
              surface,
              type,
              pieces,
              undefined,
              data.revenuMensuel,
              (data.source ?? "airdna|fallback").toLowerCase().includes("airdna")
                ? "airdna|live"
                : data.source ?? "airdna|fallback"
            )
          );
        }
      } catch (e: any) {
        if (e?.name === "AbortError") return; // superseded
        // Fallback to local compute
        setResults(buildResults(prix, surface, type, pieces, undefined, undefined, "local"));
        setError("Données temps réel indisponibles, fallback local utilisé.");
      } finally {
        if (requestIdRef.current === reqId) {
          setLoading(false);
        }
      }
    }, 500);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  // React to external input changes
  useEffect(() => {
    if (inputs) run(inputs);
  }, [inputs, run]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <SimulatorFormPro onChange={setInputs} />
        <ResultsPanelPro loading={loading} error={error} results={results} inputs={inputs} />
      </div>
      <ContactSection />
    </section>
  );
}
