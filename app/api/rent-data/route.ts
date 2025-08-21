import { NextResponse } from "next/server";

// ============================
// Données de marché par ville
// - prixM2 : prix moyen au m² (€)
// - loyerM2 : loyer moyen au m² (€)
// ============================
const marketData: Record<string, { prixM2: number; loyerM2: number }> = {
  paris: { prixM2: 10500, loyerM2: 32 },
  boulogne: { prixM2: 8200, loyerM2: 27 },
  issy: { prixM2: 7800, loyerM2: 26 },
  montreuil: { prixM2: 7200, loyerM2: 24 },
  vincennes: { prixM2: 8500, loyerM2: 28 },
  arcueil: { prixM2: 6000, loyerM2: 22 },
  creteil: { prixM2: 5000, loyerM2: 20 },
  nanterre: { prixM2: 6200, loyerM2: 23 },
  courbevoie: { prixM2: 7300, loyerM2: 25 },
  puteaux: { prixM2: 7400, loyerM2: 25 },
  clichy: { prixM2: 6500, loyerM2: 24 },
  levallois: { prixM2: 8800, loyerM2: 29 },
  neuilly: { prixM2: 11500, loyerM2: 33 },
  saintdenis: { prixM2: 4800, loyerM2: 18 },
  aubervilliers: { prixM2: 4600, loyerM2: 17 },
  pantin: { prixM2: 5600, loyerM2: 21 },
  montreuil2: { prixM2: 7200, loyerM2: 24 }, // doublon pour test
};

// ============================
// Coefficients selon le nombre de pièces
// - studio : loyers 39% plus chers au m²
// - t2 : référence (base 100%)
// - t3 : 19% moins cher
// - t4 : 20% moins cher
// ============================
const coefficients: Record<string, number> = {
  studio: 1.39,
  t2: 1.0,
  t3: 0.81,
  t4: 0.80,
};

// ============================
// API GET /api/meilleursagents
// Retourne le prix et le loyer moyen au m²
// en fonction de la ville et du type de logement
// ============================
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Ville demandée → fallback sur Paris si inconnue
  const ville = (searchParams.get("ville") || "").toLowerCase();

  // Type de logement demandé (studio, t2, t3, t4) → fallback t2
  const pieces = (searchParams.get("pieces") || "t2").toLowerCase();

  // Récupération des données marché
  const data = marketData[ville] || marketData["paris"];

  // Application du coefficient de surface
  const coeff = coefficients[pieces] ?? 1;

  // Réponse JSON
  return NextResponse.json({
    ville,
    prixM2: data.prixM2,
    loyerM2: data.loyerM2 * coeff,
  });
}
