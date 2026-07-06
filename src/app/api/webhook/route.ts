import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    // 1. Grab the secure validation signature header sent by Nomba
    const nombaSignature = req.headers.get('nomba-signature');
    
    if (!nombaSignature) {
      return NextResponse.json({ error: 'Missing verification signature' }, { status: 401 });
    }

    // 2. Capture the exact raw body string (required for hashing accuracy)
    const rawBody = await req.text();

    // 3. Extract our private shared signing key from our environments
    const secretKey = process.env.NOMBA_WEBHOOK_SIGNING_KEY || 'NombaHackathon2026';

    // 4. Calculate the expected HMAC SHA256 signature
    const computedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(rawBody)
      .digest('hex');

    // 5. Securely compare signatures using a timing-safe method to avoid side-channel tracking
    const isVerified = crypto.timingSafeEqual(
      Buffer.from(computedSignature, 'hex'),
      Buffer.from(nombaSignature, 'hex')
    );

    if (!isVerified) {
      console.error('[SECURITY MATCH FAILURE]: Webhook signature mismatch.');
      return NextResponse.json({ error: 'Invalid security verification' }, { status: 403 });
    }

    // 6. Signature valid! Parse payload for processing
    const payload = JSON.parse(rawBody);
    console.log('[VERIFIED]: Safe Nomba Webhook payload received:', payload.event);

    // If a payment succeeds, capture the tokenized card details for recurring logic
    if (payload.event === 'payment_success') {
      const tokenKey = payload.data?.tokenizedCardData?.tokenKey;
      console.log('Successfully extracted recurring billing tokenKey:', tokenKey);
    }

    // Respond with 200 OK so Nomba knows we processed the message safely
    return NextResponse.json({ verified: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook endpoint internal exception error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}