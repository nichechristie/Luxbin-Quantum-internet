#!/usr/bin/env node
/**
 * CDP Webhook Registration Script
 * Registers webhooks with Coinbase Developer Platform
 */

const crypto = require('crypto');
const https = require('https');

// Load credentials from the credentials file
const credentials = require('/Users/nicholechristie/.coinbase-credentials.json');

// Configuration
const CDP_API_BASE = 'https://api.cdp.coinbase.com/platform';
const WEBHOOK_ENDPOINTS = {
  nicheai: 'https://nicheai-nx5p.vercel.app/api/webhooks/coinbase',
  luxbin: 'https://luxbin-quantum-internet.vercel.app/api/webhooks/coinbase'
};

/**
 * Generate JWT Bearer token for CDP API authentication
 */
function generateBearerToken(apiKeyId, apiKeySecret) {
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
    exp: now + 120, // 2 minute expiry
    uris: [`POST ${CDP_API_BASE}/v2/data/webhooks/subscriptions`]
  };

  // For ES256 (ECDSA), we need to use the secret properly
  // The CDP API key secret is base64 encoded
  const secretBuffer = Buffer.from(apiKeySecret, 'base64');

  const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const message = `${headerB64}.${payloadB64}`;

  // Create ECDSA signature
  const sign = crypto.createSign('SHA256');
  sign.update(message);

  try {
    // Try to create EC key from the secret
    const ecKey = crypto.createPrivateKey({
      key: secretBuffer,
      format: 'der',
      type: 'sec1'
    });
    const signature = sign.sign(ecKey);
    const sigB64 = signature.toString('base64url');
    return `${message}.${sigB64}`;
  } catch (e) {
    // If that fails, the secret might be in a different format
    // Use HMAC as fallback (some CDP keys use this)
    const hmac = crypto.createHmac('sha256', apiKeySecret);
    hmac.update(message);
    const sigB64 = hmac.digest('base64url');
    return `${message}.${sigB64}`;
  }
}

/**
 * Make HTTP request to CDP API
 */
function makeRequest(method, path, body, apiKeyId, apiKeySecret) {
  return new Promise((resolve, reject) => {
    const token = generateBearerToken(apiKeyId, apiKeySecret);
    const bodyStr = body ? JSON.stringify(body) : '';

    const options = {
      hostname: 'api.cdp.coinbase.com',
      port: 443,
      path: `/platform${path}`,
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            reject({ statusCode: res.statusCode, body: json });
          }
        } catch (e) {
          reject({ statusCode: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

/**
 * Create a webhook subscription
 */
async function createWebhook(appName, webhookUrl, apiKeyId, apiKeySecret) {
  console.log(`\nCreating webhook for ${appName}...`);
  console.log(`  URL: ${webhookUrl}`);

  // Create onramp/offramp webhook (no labels required)
  const rampWebhook = {
    description: `${appName} - Onramp/Offramp transactions`,
    eventTypes: [
      'onramp.transaction.created',
      'onramp.transaction.updated',
      'onramp.transaction.success',
      'onramp.transaction.failed',
      'offramp.transaction.created',
      'offramp.transaction.updated',
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
    const result = await makeRequest(
      'POST',
      '/v2/data/webhooks/subscriptions',
      rampWebhook,
      apiKeyId,
      apiKeySecret
    );
    console.log(`  ✓ Ramp webhook created!`);
    console.log(`    Subscription ID: ${result.subscriptionId}`);
    console.log(`    Secret: ${result.secret}`);
    return result;
  } catch (error) {
    console.error(`  ✗ Failed to create webhook:`, error);
    return null;
  }
}

/**
 * List existing webhooks
 */
async function listWebhooks(apiKeyId, apiKeySecret) {
  try {
    const result = await makeRequest(
      'GET',
      '/v2/data/webhooks/subscriptions',
      null,
      apiKeyId,
      apiKeySecret
    );
    return result.subscriptions || [];
  } catch (error) {
    console.error('Failed to list webhooks:', error);
    return [];
  }
}

async function main() {
  console.log('CDP Webhook Registration');
  console.log('========================\n');

  const results = {};

  // Register for NicheAI
  const nicheaiCreds = credentials.apps.nicheai;
  console.log('Processing NicheAI...');
  console.log(`  API Key ID: ${nicheaiCreds.api_key_id}`);

  const nicheaiResult = await createWebhook(
    'NicheAI',
    WEBHOOK_ENDPOINTS.nicheai,
    nicheaiCreds.api_key_id,
    nicheaiCreds.api_key_secret
  );
  if (nicheaiResult) {
    results.nicheai = nicheaiResult;
  }

  // Register for Luxbin
  const luxbinCreds = credentials.apps.luxbin;
  console.log('\nProcessing Luxbin...');
  console.log(`  API Key ID: ${luxbinCreds.api_key_id}`);

  const luxbinResult = await createWebhook(
    'Luxbin',
    WEBHOOK_ENDPOINTS.luxbin,
    luxbinCreds.api_key_id,
    luxbinCreds.api_key_secret
  );
  if (luxbinResult) {
    results.luxbin = luxbinResult;
  }

  // Output summary
  console.log('\n\n========== SUMMARY ==========\n');

  if (results.nicheai) {
    console.log('NicheAI Webhook:');
    console.log(`  CDP_WEBHOOK_SECRET=${results.nicheai.secret}`);
  }

  if (results.luxbin) {
    console.log('\nLuxbin Webhook:');
    console.log(`  CDP_WEBHOOK_SECRET=${results.luxbin.secret}`);
  }

  console.log('\nAdd these secrets to your Vercel environment variables.');
}

main().catch(console.error);
