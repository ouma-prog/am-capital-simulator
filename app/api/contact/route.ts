import { NextResponse } from 'next/server';

type Payload = {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  message: string;
  consent: boolean;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;

    if (!body.name || !body.email || !body.message || !body.consent) {
      return NextResponse.json({ ok: false, error: 'Champs manquants' }, { status: 400 });
    }

    

    await new Promise((r) => setTimeout(r, 600));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }
}
