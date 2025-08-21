import { NextResponse } from "next/server";

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
  montreuil2: { prixM2: 7200, loyerM2: 24 },
};

const coefficients: Record<string, number> = {
  studio: 1.39, // +39%
  t2: 1.0,      // base
  t3: 0.81,     // -19%
  t4: 0.80,     // -20%
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ville = (searchParams.get("ville") || "").toLowerCase();
  const pieces = (searchParams.get("pieces") || "t2").toLowerCase();

  const data = marketData[ville] || marketData["paris"]; // fallback Paris
  const coeff = coefficients[pieces] ?? 1;

  return NextResponse.json({
    ville,
    prixM2: data.prixM2,
    loyerM2: data.loyerM2 * coeff,
  });
}
