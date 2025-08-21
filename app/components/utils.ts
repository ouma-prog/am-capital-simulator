export const fmtEUR = (v: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

export const fmtPct = (v: number) =>
  `${v.toFixed(2).replace('.', ',')} %`;
