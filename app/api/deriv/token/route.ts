import { NextResponse } from 'next/server';

const DERIV_ENV = process.env.NEXT_PUBLIC_DERIV_ENV || 'production';
const DERIV_OAUTH_URL = DERIV_ENV === 'staging' ? 'https://staging-oauth.deriv.com' : 'https://oauth.deriv.com';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, code_verifier, client_id, redirect_uri } = body;

    if (!code || !code_verifier) {
      return NextResponse.json({ error: 'Missing code or code_verifier' }, { status: 400 });
    }

    if (!client_id || !redirect_uri) {
      return NextResponse.json({ error: 'Missing client_id or redirect_uri' }, { status: 400 });
    }

    const params = new URLSearchParams();
    params.set('grant_type', 'authorization_code');
    params.set('client_id', client_id);
    params.set('code', code);
    params.set('redirect_uri', redirect_uri);
    params.set('code_verifier', code_verifier);

    const response = await fetch(`${DERIV_OAUTH_URL}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error_description || data.error || 'Deriv rejected the authorization code.' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error exchanging Deriv token:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error exchanging token' },
      { status: 500 }
    );
  }
}
