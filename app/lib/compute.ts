// app/lib/compute.ts
export type PieceType = 'studio' | 't2' | 't3' | 't4';
export type ExploitType = 'longue' | 'courte';

const COEF: Record<PieceType, number> = { studio: 1.39, t2: 1.0, t3: 0.81, t4: 0.80 };

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

export function compute(
  prix: number,
  surface: number,
  type: ExploitType,
  pieces: PieceType,
  revenuMensuelLong?: number,
  revenuMensuelCourt?: number,
  source: ResultsFull['source'] = 'local'
): ResultsFull {
  // Frais
  const fraisNotaire = prix * 0.09;
  const commissionAM = prix * 0.085;
  const fraisArchitecte = surface * (type === 'longue' ? 90 : 120);
  const fraisTotal = fraisNotaire + commissionAM + fraisArchitecte;
  const investissementTotal = prix + fraisTotal;

  // Revenus
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
