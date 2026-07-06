import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const nombaSignature = req.headers.get('nomba-signature');
    if (!nombaSignature) {
      return NextResponse.json({ error: 'Missing verification signature' }, { status: 401 });
    }

    const rawBody = await req.text();
    const secretKey = process.env.NOMBA_WEBHOOK_SIGNING_KEY || 'NombaHackathon2026';

    const computedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(rawBody)
      .digest('hex');

    const computedBuffer = Buffer.from(computedSignature, 'hex');
    const incomingBuffer = Buffer.from(nombaSignature, 'hex');

    if (computedBuffer.length !== incomingBuffer.length) {
      console.warn('[SECURITY ALERT]: Incoming signature header length mismatch.');
      return NextResponse.json({ error: 'Invalid security verification' }, { status: 403 });
    }

    const isVerified = crypto.timingSafeEqual(computedBuffer, incomingBuffer);
    if (!isVerified) {
      console.error('[SECURITY MATCH FAILURE]: Webhook signature content mismatch.');
      return NextResponse.json({ error: 'Invalid security verification' }, { status: 403 });
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload structure' }, { status: 400 });
    }

    console.log('[VERIFIED]: Safe Nomba Webhook payload received:', payload.event);

    if (payload.event === 'payment_success') {
      const tokenKey = payload.data?.tokenizedCardData?.tokenKey;
      console.log('Successfully extracted recurring billing tokenKey:', tokenKey);
    }

    return NextResponse.json({ verified: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook endpoint internal exception error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 👑 Elegant addition: Handles manual browser checks beautifully
export async function GET() {
  return NextResponse.json({
    status: "online",
    service: "Nomba Smart-Flow Webhook Receiver Engine",
    protocol: "Requires cryptographic HMAC-SHA256 signed POST requests from the Nomba Gateway.",
    timestamp: new Date().toISOString()
  }, { status: 200 });
}