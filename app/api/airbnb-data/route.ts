import { NextResponse } from "next/server";

const airbnbData: Record<string, { prixNuit: number; tauxOcc: number }> = {
  paris: { prixNuit: 120, tauxOcc: 0.75 },
  boulogne: { prixNuit: 90, tauxOcc: 0.68 },
  issy: { prixNuit: 85, tauxOcc: 0.65 },
  montreuil: { prixNuit: 70, tauxOcc: 0.60 },
  vincennes: { prixNuit: 100, tauxOcc: 0.72 },
  arcueil: { prixNuit: 65, tauxOcc: 0.55 },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ville = (searchParams.get("ville") || "").toLowerCase();

  const data = airbnbData[ville] || airbnbData["paris"]; // fallback Paris

  // revenu mensuel = prixNuit × taux d’occupation × 30 nuits
  const revenuMensuel = data.prixNuit * data.tauxOcc * 30;

  return NextResponse.json({
    ville,
    prixNuit: data.prixNuit,
    tauxOcc: data.tauxOcc,
    revenuMensuel,
  });
}
