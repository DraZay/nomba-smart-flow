const crypto = require('crypto');

// 1. Target URL (Switch to http://localhost:3000/api/webhook if testing locally)
const TARGET_URL = 'https://nomba-smart-flow.vercel.app/api/webhook';

// 2. Secret Key matching your environment variable (Fallback: NombaHackathon2026)
const SECRET_KEY = 'NombaHackathon2026'; 

// 3. Mock Payload mimicking a successful Nomba payment tokenization event
const mockPayload = JSON.stringify({
  event: 'payment_success',
  data: {
    amount: 5000,
    currency: 'NGN',
    tokenizedCardData: {
      tokenKey: 'tok_sandbox_devcareer_2026_flow_validated'
    }
  }
});

// 4. Compute HMAC SHA256 Signature
const signature = crypto
  .createHmac('sha256', SECRET_KEY)
  .update(mockPayload)
  .digest('hex');

console.log('🚀 Initiating Simulated Nomba Webhook Broadcast...');
console.log(`🔑 Computed Secure Signature: ${signature}\n`);

// 5. Execute HTTP POST Request
fetch(TARGET_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'nomba-signature': signature // Injected security header
  },
  body: mockPayload
})
  .then(async (res) => {
    const data = await res.json();
    console.log(`📡 Server Response Status: ${res.status}`);
    console.log('📦 Server Response Payload:', data);
    
    if (res.status === 200 && data.verified === true) {
      console.log('\n✅ SUCCESS: The webhook securely passed cryptographic evaluation!');
    } else {
      console.log('\n❌ FAILURE: Check your signature configurations or secret keys.');
    }
  })
  .catch((err) => console.error('Error executing test runner:', err));