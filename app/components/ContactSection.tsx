'use client';

import { useState } from 'react';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function ContactSection() {
  const [state, setState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('loading');
    setErrorMsg('');

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      city: String(fd.get('city') || ''),
      message: String(fd.get('message') || ''),
      consent: fd.get('consent') === 'on',
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Server error');
      setState('success');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setState('error');
      setErrorMsg(
        err instanceof Error ? err.message : "Une erreur est survenue. Merci de réessayer."
      );
    }
  }

  return (
    <section id="contact" className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Contact
          </h2>
          <p className="mt-2 text-slate-600">
            Parlez-nous de votre projet d’investissement. Réponse sous 24 h ouvrées.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Carte infos */}
          <div className="rounded-xl border bg-white p-6">
            <img src="/images/logoA&M.png" alt="A&M Capital" className="h-8 w-auto mb-4" />
            <div className="space-y-3 text-sm text-slate-700">
              <p>📍 20 Rue Ampère, 91300 Massy</p>
              <p>📧 contact@amcapital.com</p>
              <div className="pt-3 border-t">
                <p className="text-xs text-slate-500">
                  Données marché 2025 — mises à jour en temps réel. Démo technique.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
                  MeilleursAgents
                </span>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                  AirDNA
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                  A&M Verified
                </span>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-2 rounded-xl border bg-white p-6">
            <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={onSubmit}>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-700">Nom complet</label>
                <input
                  name="name"
                  required
                  className="mt-1 w-full h-10 rounded border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-am-gold)]"
                  placeholder="Jane Dupont"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full h-10 rounded border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-am-gold)]"
                  placeholder="jane@example.com"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-700">Téléphone (optionnel)</label>
                <input
                  name="phone"
                  className="mt-1 w-full h-10 rounded border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-am-gold)]"
                  placeholder="+33 6 00 00 00 00"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-700">Ville</label>
                <input
                  name="city"
                  className="mt-1 w-full h-10 rounded border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-am-gold)]"
                  placeholder="Paris, Arcueil, Montrouge…"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Message</label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-am-gold)]"
                  placeholder="Parlez-nous de votre budget, surface, horizon…"
                />
              </div>

              <div className="md:col-span-2 flex items-start gap-2 text-sm">
                <input id="consent" name="consent" type="checkbox" required className="mt-1" />
                <label htmlFor="consent" className="text-slate-600">
                  J’accepte que A&M Capital me contacte au sujet de mon projet. (RGPD)
                </label>
              </div>

              <div className="md:col-span-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={state === 'loading'}
                  className="rounded-full bg-[#003049] px-5 py-2 text-white hover:bg-[#15406A] transition disabled:opacity-60"
                >
                  {state === 'loading' ? 'Envoi…' : 'Envoyer'}
                </button>
                {state === 'success' && (
                  <span className="text-emerald-700 text-sm">Merci, nous revenons vers vous sous 24 h.</span>
                )}
                {state === 'error' && (
                  <span className="text-red-600 text-sm">Erreur : {errorMsg}</span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
