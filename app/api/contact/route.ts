import { NextResponse } from 'next/server';

// ============================
// Type du payload attendu dans la requête POST
// - name : nom de l’utilisateur (obligatoire)
// - email : email de contact (obligatoire)
// - phone : numéro de téléphone (optionnel)
// - city : ville de l’utilisateur (optionnel)
// - message : contenu du message (obligatoire)
// - consent : confirmation RGPD (obligatoire)
// ============================
type Payload = {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  message: string;
  consent: boolean;
};

// ============================
// API POST /api/contact
// Reçoit et traite les données du formulaire de contact
// ============================
export async function POST(req: Request) {
  try {
    // Lecture du corps de la requête en JSON et cast en Payload
    const body = (await req.json()) as Payload;

    // Vérification des champs obligatoires
    if (!body.name || !body.email || !body.message || !body.consent) {
      return NextResponse.json(
        { ok: false, error: 'Champs manquants' }, // message d’erreur
        { status: 400 } // statut HTTP "Bad Request"
      );
    }

    // Ici, normalement, on enverrait le message par email
    // ou on l’enregistrerait dans une base de données.
    // Pour la démo, on simule un délai réseau (600ms).
    await new Promise((r) => setTimeout(r, 600));

    // Si tout va bien → succès
    return NextResponse.json({ ok: true });
  } catch {
    // Si le JSON reçu est invalide ou cassé
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON' },
      { status: 400 }
    );
  }
}
