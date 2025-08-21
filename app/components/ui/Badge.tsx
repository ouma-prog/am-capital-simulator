'use client';

export default function Badge({
  children,
  tone = 'info', // 'success' | 'warning' | 'error' | 'info'
}: { children: React.ReactNode; tone?: 'success'|'warning'|'error'|'info' }) {
  const tones = {
    success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    warning: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
    error:   'bg-red-50 text-red-700 ring-1 ring-red-200',
    info:    'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
  } as const;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
