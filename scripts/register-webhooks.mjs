#!/usr/bin/env node
/**
 * CDP Webhook Registration using CDP SDK
 */

import { CdpClient } from '@coinbase/cdp-sdk';
import { readFileSync, writeFileSync } from 'fs';

// Load credentials
const credentials = JSON.parse(
  readFileSync('/Users/nicholechristie/.coinbase-credentials.json', 'utf-8')
);

const WEBHOOK_URLS = {
  quantumInternet: 'https://quantum-internet.vercel.app/api/webhooks/coinbase',
  nicheai: 'https://nicheai-nx5p.vercel.app/api/webhooks/coinbase'
};

async function registerWebhooksWithFetch(appName, webhookUrl, apiKeyId, apiKeySecret) {
  console.log(`\n📡 Registering webhook for ${appName}...`);
  console.log(`   URL: ${webhookUrl}`);

  // The CDP API uses Ed25519 or EC keys for JWT signing
  // For simplicity, we'll use the REST API directly with proper auth

  const crypto = await import('crypto');

  // Create JWT for authentication
  function createJWT() {
    const header = {
      alg: 'ES256',
      kid: apiKeyId,
      typ: 'JWT',
      nonce: crypto.randomBytes(16).toString('hex')
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      sub: apiKeyId,
      iss: 'cdp',
      aud: ['cdp_service'],
      nbf: now,
      exp: now + 120
    };

    // Base64url encode
    const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    const headerB64 = b64(header);
    const payloadB64 = b64(payload);
    const message = `${headerB64}.${payloadB64}`;

    // For EC keys, we need proper signing
    // The API key secret is base64-encoded
    const secretBuffer = Buffer.from(apiKeySecret, 'base64');

    try {
      // Try creating an EC private key
      const privateKey = crypto.createPrivateKey({
        key: secretBuffer,
        format: 'der',
        type: 'sec1'
      });

      const sign = crypto.createSign('SHA256');
      sign.update(message);
      const sig = sign.sign(privateKey);

      // Convert DER signature to raw format for ES256
      // DER format: 0x30 [len] 0x02 [r-len] [r] 0x02 [s-len] [s]
      let offset = 2;
      if (sig[1] > 0x80) offset += sig[1] - 0x80;
      offset += 1; // skip 0x02
      const rLen = sig[offset];
      offset += 1;
      let r = sig.slice(offset, offset + rLen);
      offset += rLen + 1; // skip to s
      const sLen = sig[offset];
      offset += 1;
      let s = sig.slice(offset, offset + sLen);

      // Ensure r and s are 32 bytes each
      if (r.length > 32) r = r.slice(r.length - 32);
      if (s.length > 32) s = s.slice(s.length - 32);
      if (r.length < 32) r = Buffer.concat([Buffer.alloc(32 - r.length), r]);
      if (s.length < 32) s = Buffer.concat([Buffer.alloc(32 - s.length), s]);

      const rawSig = Buffer.concat([r, s]);
      const sigB64 = rawSig.toString('base64')
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

      return `${message}.${sigB64}`;
    } catch (e) {
      console.log('   Note: Using fallback auth method');
      // Fallback: use HMAC
      const hmac = crypto.createHmac('sha256', apiKeySecret);
      hmac.update(message);
      const sigB64 = hmac.digest('base64')
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      return `${message}.${sigB64}`;
    }
  }

  const webhookPayload = {
    description: `${appName} - Transaction webhooks`,
    eventTypes: [
      'onramp.transaction.created',
      'onramp.transaction.success',
      'onramp.transaction.failed',
      'offramp.transaction.created',
      'offramp.transaction.success',
      'offramp.transaction.failed'
    ],
    target: {
      url: webhookUrl
    },
    labels: {},
    isEnabled: true
  };

  try {
    const token = createJWT();

    const response = await fetch('https://api.cdp.coinbase.com/platform/v2/data/webhooks/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookPayload)
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`   ✅ Webhook created successfully!`);
      console.log(`   Subscription ID: ${data.subscriptionId}`);
      console.log(`   Secret: ${data.secret}`);
      return { success: true, data };
    } else {
      console.log(`   ❌ Error: ${data.errorMessage || JSON.stringify(data)}`);
      return { success: false, error: data };
    }
  } catch (error) {
    console.log(`   ❌ Request failed: ${error.message}`);
    return { success: false, error };
  }
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('   CDP Webhook Registration');
  console.log('═══════════════════════════════════════════');

  const results = {};

  // Register for Quantum Internet (Luxbin)
  const luxbinCreds = credentials.apps.luxbin;
  results.quantumInternet = await registerWebhooksWithFetch(
    'Quantum Internet (Luxbin)',
    WEBHOOK_URLS.quantumInternet,
    luxbinCreds.api_key_id,
    luxbinCreds.api_key_secret
  );

  // Register for NicheAI
  const nicheaiCreds = credentials.apps.nicheai;
  results.nicheai = await registerWebhooksWithFetch(
    'NicheAI',
    WEBHOOK_URLS.nicheai,
    nicheaiCreds.api_key_id,
    nicheaiCreds.api_key_secret
  );

  // Summary
  console.log('\n═══════════════════════════════════════════');
  console.log('   SUMMARY - Add these to Vercel Env Vars');
  console.log('═══════════════════════════════════════════\n');

  if (results.quantumInternet?.success) {
    console.log('Quantum Internet:');
    console.log(`  CDP_WEBHOOK_SECRET="${results.quantumInternet.data.secret}"\n`);
  }

  if (results.nicheai?.success) {
    console.log('NicheAI:');
    console.log(`  CDP_WEBHOOK_SECRET="${results.nicheai.data.secret}"\n`);
  }

  // Save results
  const outputPath = '/Users/nicholechristie/Luxbin-Quantum-internet/webhook-registration-results.json';
  writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`Results saved to: ${outputPath}`);
}

main().catch(console.error);
