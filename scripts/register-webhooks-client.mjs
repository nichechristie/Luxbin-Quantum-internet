#!/usr/bin/env node
/**
 * CDP Webhook Registration using CdpClient
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

async function registerWebhook(appName, webhookUrl, apiKeyId, apiKeySecret) {
  console.log(`\n📡 Registering webhook for ${appName}...`);
  console.log(`   URL: ${webhookUrl}`);

  try {
    // Initialize CDP Client with credentials
    const cdp = new CdpClient({
      apiKeyId: apiKeyId,
      apiKeySecret: apiKeySecret
    });

    // Try to create webhook using the client's request method
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

    // Use the CDP client's internal request method
    const response = await cdp.request({
      method: 'POST',
      path: '/v2/data/webhooks/subscriptions',
      body: webhookPayload
    });

    console.log(`   ✅ Webhook created successfully!`);
    console.log(`   Subscription ID: ${response.subscriptionId}`);
    console.log(`   Secret: ${response.secret}`);

    await cdp.close();
    return { success: true, data: response };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);

    // Try alternative method - direct HTTP with proper JWT
    console.log(`   Trying alternative method...`);
    return await registerWebhookDirect(appName, webhookUrl, apiKeyId, apiKeySecret);
  }
}

async function registerWebhookDirect(appName, webhookUrl, apiKeyId, apiKeySecret) {
  const { sign } = await import('jsonwebtoken');
  const crypto = await import('crypto');

  try {
    // The apiKeySecret from CDP portal is base64-encoded
    // We need to convert it to PEM format for ES256
    const secretBuffer = Buffer.from(apiKeySecret, 'base64');

    // Try to create EC key from DER format
    let privateKey;
    try {
      privateKey = crypto.createPrivateKey({
        key: secretBuffer,
        format: 'der',
        type: 'sec1'
      });
    } catch (e) {
      // Try PKCS8 format
      try {
        privateKey = crypto.createPrivateKey({
          key: secretBuffer,
          format: 'der',
          type: 'pkcs8'
        });
      } catch (e2) {
        // The key might already be in PEM-like format
        const pemKey = `-----BEGIN EC PRIVATE KEY-----\n${apiKeySecret}\n-----END EC PRIVATE KEY-----`;
        privateKey = crypto.createPrivateKey(pemKey);
      }
    }

    const uri = 'POST api.cdp.coinbase.com/platform/v2/data/webhooks/subscriptions';

    const token = sign(
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
      console.log(`   ❌ API Error: ${JSON.stringify(data)}`);
      return { success: false, error: data };
    }
  } catch (error) {
    console.log(`   ❌ Direct method failed: ${error.message}`);
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
    'Quantum Internet (Luxbin)',
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
    console.log('✅ Quantum Internet webhook registered');
    console.log(`   CDP_WEBHOOK_SECRET="${results.quantumInternet.data.secret}"\n`);
  } else {
    console.log('❌ Quantum Internet webhook failed');
  }

  if (results.nicheai?.success) {
    console.log('✅ NicheAI webhook registered');
    console.log(`   CDP_WEBHOOK_SECRET="${results.nicheai.data.secret}"\n`);
  } else {
    console.log('❌ NicheAI webhook failed');
  }

  writeFileSync('/Users/nicholechristie/Luxbin-Quantum-internet/webhook-results.json',
    JSON.stringify(results, null, 2));
}

main().catch(console.error);
