// app/lib/compute.ts

// --- Types de base ---
export type PieceType = 'studio' | 't2' | 't3' | 't4';
export type ExploitType = 'longue' | 'courte';

// Coefficients multiplicateurs de rendement selon le type de logement
// (utilisés pour estimer le loyer par m²)
const COEF: Record<PieceType, number> = { 
  studio: 1.39, 
  t2: 1.0, 
  t3: 0.81, 
  t4: 0.80 
};

// Structure des résultats retournés par la fonction compute
export type ResultsFull = {
  rendement: number;          // rendement brut annuel en %
  cashflow: number;           // cashflow mensuel (revenus - charges mensuelles)
  fraisTotal: number;         // frais totaux (notaire + commission + architecte)
  fraisNotaire: number;       // frais de notaire (~9 % du prix)
  commissionAM: number;       // commission agence AM (~8,5 % du prix)
  fraisArchitecte: number;    // frais architecte (€/m² selon type)
  investissementTotal: number;// prix + tous les frais
  revenusMensuel: number;     // revenus locatifs estimés (mensuels)
  revenusAnnuels: number;     // revenus locatifs annuels
  loyerMensuelParM2?: number; // loyer moyen estimé au m² (facultatif)
  source: string;             // origine des données (API, fallback local…)
};

// --- Fonction principale ---
// Calcule tous les indicateurs financiers en fonction des inputs
export function compute(
  prix: number,                       // prix du bien
  surface: number,                    // surface du bien
  type: ExploitType,                  // type d’exploitation (longue ou courte durée)
  pieces: PieceType,                  // nombre/type de pièces
  revenuMensuelLong?: number,         // revenu mensuel fourni (longue durée, optionnel)
  revenuMensuelCourt?: number,        // revenu mensuel fourni (courte durée, optionnel)
  source: ResultsFull['source'] = 'local' // source des données (par défaut "local")
): ResultsFull {
  
  // --- Frais d’acquisition ---
  const fraisNotaire = prix * 0.09;                  // ~9 % du prix
  const commissionAM = prix * 0.085;                 // ~8,5 % du prix
  const fraisArchitecte = surface * (type === 'longue' ? 90 : 120); 
  // 90 €/m² si longue durée, 120 €/m² si courte durée
  
  const fraisTotal = fraisNotaire + commissionAM + fraisArchitecte;
  const investissementTotal = prix + fraisTotal;     // prix + frais

  // --- Revenus locatifs ---
  let revenusMensuel: number;
  let loyerMensuelParM2: number | undefined;

  if (type === 'longue') {
    // Si une valeur précise est fournie (ex. API MeilleursAgents), on l’utilise
    if (typeof revenuMensuelLong === 'number') {
      revenusMensuel = revenuMensuelLong;
    } else {
      // Sinon, on calcule une estimation locale
      const baseParM2 = 12;                           // hypothèse de 12 €/m²
      loyerMensuelParM2 = baseParM2 * COEF[pieces];  // ajusté selon le type de logement
      revenusMensuel = loyerMensuelParM2 * surface;
    }
  } else {
    // Cas "courte durée" (type Airbnb)
    if (typeof revenuMensuelCourt === 'number') {
      revenusMensuel = revenuMensuelCourt;
    } else {
      // Estimation locale : base 12 €/m² × coef × 3 (nuitées) × 0.7 (taux d’occupation)
      const baseParM2 = 12;
      loyerMensuelParM2 = baseParM2 * COEF[pieces] * 3 * 0.7;
      revenusMensuel = loyerMensuelParM2 * surface;
    }
  }

  // --- Indicateurs dérivés ---
  const revenusAnnuels = revenusMensuel * 12;
  const rendement = (revenusAnnuels / investissementTotal) * 100; // rendement brut %
  const cashflow = revenusMensuel - fraisTotal / 12;              // cashflow mensuel

  // --- Retour des résultats ---
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
