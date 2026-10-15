import { NextResponse } from 'next/server';

const DERIV_ENV = process.env.NEXT_PUBLIC_DERIV_ENV || 'production';
const DERIV_OAUTH_URL = DERIV_ENV === 'staging' ? 'https://staging-oauth.deriv.com' : 'https://auth.deriv.com';
const DERIV_OAUTH_CLIENT_ID = process.env.NEXT_PUBLIC_DERIV_OAUTH_CLIENT_ID;
const DERIV_REDIRECT_URI = process.env.NEXT_PUBLIC_DERIV_REDIRECT_URI;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, code_verifier, client_id, redirect_uri } = body;

    if (!code || !code_verifier) {
      return NextResponse.json({ error: 'Missing code or code_verifier' }, { status: 400 });
    }

    if (!DERIV_OAUTH_CLIENT_ID || !DERIV_REDIRECT_URI) {
      return NextResponse.json(
        { error: 'Deriv OAuth is not configured. Set NEXT_PUBLIC_DERIV_OAUTH_CLIENT_ID and NEXT_PUBLIC_DERIV_REDIRECT_URI.' },
        { status: 503 }
      );
    }

    if (client_id !== DERIV_OAUTH_CLIENT_ID || redirect_uri !== DERIV_REDIRECT_URI) {
      return NextResponse.json({ error: 'OAuth client or redirect URI does not match the server configuration.' }, { status: 400 });
    }

    const params = new URLSearchParams();
    params.set('grant_type', 'authorization_code');
    params.set('client_id', DERIV_OAUTH_CLIENT_ID);
    params.set('code', code);
    params.set('redirect_uri', DERIV_REDIRECT_URI);
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
