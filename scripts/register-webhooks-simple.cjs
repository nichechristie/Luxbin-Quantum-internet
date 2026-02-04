#!/usr/bin/env node
/**
 * CDP Webhook Registration - Simple CommonJS version
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const https = require('https');

// Load credentials
const credentials = JSON.parse(
  fs.readFileSync('/Users/nicholechristie/.coinbase-credentials.json', 'utf-8')
);

const WEBHOOK_URLS = {
  quantumInternet: 'https://quantum-internet.vercel.app/api/webhooks/coinbase',
  nicheai: 'https://nicheai-nx5p.vercel.app/api/webhooks/coinbase'
};

function base64ToPrivateKey(base64Secret) {
  // The CDP API key secret is a base64-encoded EC private key
  const buffer = Buffer.from(base64Secret, 'base64');

  // Try different formats
  const formats = [
    { format: 'der', type: 'sec1' },
    { format: 'der', type: 'pkcs8' },
  ];

  for (const { format, type } of formats) {
    try {
      return crypto.createPrivateKey({ key: buffer, format, type });
    } catch (e) {
      continue;
    }
  }

  // Try PEM format
  try {
    const pem = `-----BEGIN EC PRIVATE KEY-----\n${base64Secret}\n-----END EC PRIVATE KEY-----`;
    return crypto.createPrivateKey(pem);
  } catch (e) {
    // As final fallback, try wrapping as PKCS8
    const pkcs8Header = Buffer.from('302e0201010420', 'hex');
    const pkcs8Tail = Buffer.from('a00706052b8104000a', 'hex');
    const pkcs8 = Buffer.concat([pkcs8Header, buffer.slice(0, 32), pkcs8Tail]);
    return crypto.createPrivateKey({ key: pkcs8, format: 'der', type: 'pkcs8' });
  }
}

function createJWT(apiKeyId, apiKeySecret, method, path) {
  const uri = `${method} api.cdp.coinbase.com${path}`;

  try {
    const privateKey = base64ToPrivateKey(apiKeySecret);

    return jwt.sign(
      {
        iss: 'cdp',
        nbf: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 120,
        sub: apiKeyId,
        uri,
      },
      privateKey,
      {
        algorithm: 'ES256',
        header: {
          kid: apiKeyId,
          nonce: crypto.randomBytes(16).toString('hex'),
        },
      }
    );
  } catch (error) {
    console.log(`   JWT creation error: ${error.message}`);
    throw error;
  }
}

function makeRequest(token, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);

    const options = {
      hostname: 'api.cdp.coinbase.com',
      port: 443,
      path: '/platform/v2/data/webhooks/subscriptions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function registerWebhook(appName, webhookUrl, apiKeyId, apiKeySecret) {
  console.log(`\n📡 Registering webhook for ${appName}...`);
  console.log(`   URL: ${webhookUrl}`);

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
    target: { url: webhookUrl },
    labels: {},
    isEnabled: true
  };

  try {
    const token = createJWT(apiKeyId, apiKeySecret, 'POST', '/platform/v2/data/webhooks/subscriptions');
    const response = await makeRequest(token, webhookPayload);

    if (response.status >= 200 && response.status < 300) {
      console.log(`   ✅ Webhook created successfully!`);
      console.log(`   Subscription ID: ${response.data.subscriptionId}`);
      console.log(`   Secret: ${response.data.secret}`);
      return { success: true, data: response.data };
    } else {
      console.log(`   ❌ Error (${response.status}): ${JSON.stringify(response.data)}`);
      return { success: false, error: response.data };
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('   CDP Webhook Registration');
  console.log('═══════════════════════════════════════════');

  const results = {};

  // Register for Quantum Internet (Luxbin)
  const luxbinCreds = credentials.apps.luxbin;
  results.quantumInternet = await registerWebhook(
    'Quantum Internet',
    WEBHOOK_URLS.quantumInternet,
    luxbinCreds.api_key_id,
    luxbinCreds.api_key_secret
  );

  // Register for NicheAI
  const nicheaiCreds = credentials.apps.nicheai;
  results.nicheai = await registerWebhook(
    'NicheAI',
    WEBHOOK_URLS.nicheai,
    nicheaiCreds.api_key_id,
    nicheaiCreds.api_key_secret
  );

  // Summary
  console.log('\n═══════════════════════════════════════════');
  console.log('   RESULTS');
  console.log('═══════════════════════════════════════════\n');

  if (results.quantumInternet?.success) {
    console.log('✅ Quantum Internet:');
    console.log(`   CDP_WEBHOOK_SECRET="${results.quantumInternet.data.secret}"\n`);
  } else {
    console.log('❌ Quantum Internet: Failed\n');
  }

  if (results.nicheai?.success) {
    console.log('✅ NicheAI:');
    console.log(`   CDP_WEBHOOK_SECRET="${results.nicheai.data.secret}"\n`);
  } else {
    console.log('❌ NicheAI: Failed\n');
  }

  fs.writeFileSync('/Users/nicholechristie/Luxbin-Quantum-internet/webhook-results.json',
    JSON.stringify(results, null, 2));
  console.log('Results saved to webhook-results.json');
}

main().catch(console.error);
