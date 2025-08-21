'use client'; 
// Directive Next.js → ce composant est un composant client (interactif)

export default function Badge({
  children,
  tone = 'info', 
  // tone = variante visuelle (success | warning | error | info)
}: { 
  children: React.ReactNode; 
  tone?: 'success' | 'warning' | 'error' | 'info'; 
}) {
  
  // Styles Tailwind par type de badge
  const tones = {
    success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', // vert
    warning: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',       // jaune/orangé
    error:   'bg-red-50 text-red-700 ring-1 ring-red-200',             // rouge
    info:    'bg-slate-100 text-slate-700 ring-1 ring-slate-200',      // gris/bleu neutre
  } as const;

  // Rendu final → span stylisé qui entoure le contenu (children)
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
