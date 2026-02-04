#!/usr/bin/env node
/**
 * CDP Webhook Registration using CDP SDK's JWT generator
 */

import { generateJwt } from '@coinbase/cdp-sdk/dist/utils/jwt.js';
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
    // Generate JWT using CDP SDK
    const jwt = await generateJwt({
      apiKeyId: apiKeyId,
      apiKeySecret: apiKeySecret,
      requestMethod: 'POST',
      requestHost: 'api.cdp.coinbase.com',
      requestPath: '/platform/v2/data/webhooks/subscriptions'
    });

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

    const response = await fetch('https://api.cdp.coinbase.com/platform/v2/data/webhooks/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
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
  console.log('   SUMMARY - Environment Variables');
  console.log('═══════════════════════════════════════════\n');

  if (results.quantumInternet?.success) {
    console.log('Quantum Internet (add to Vercel):');
    console.log(`  CDP_WEBHOOK_SECRET="${results.quantumInternet.data.secret}"\n`);
  }

  if (results.nicheai?.success) {
    console.log('NicheAI (add to Vercel):');
    console.log(`  CDP_WEBHOOK_SECRET="${results.nicheai.data.secret}"\n`);
  }

  // Save results
  const outputPath = '/Users/nicholechristie/Luxbin-Quantum-internet/webhook-results.json';
  writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`Results saved to: ${outputPath}`);
}

main().catch(console.error);
