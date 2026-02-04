# CDP Webhook Registration Complete ✅

## Registered Webhooks

### 1. Quantum Internet (Luxbin)
- **URL**: https://quantum-internet.vercel.app/api/webhooks/coinbase
- **Subscription ID**: `70850ae8-728c-485a-82d8-de239a657d45`
- **Webhook Secret**: `b7ee57d5-87f9-49c4-bc0c-3652862a426f`
- **Event Types**: onramp/offramp transaction events
- **Status**: ✅ Active & Verified

### 2. NicheAI
- **URL**: https://nicheai-nx5p.vercel.app/api/webhooks/coinbase
- **Subscription ID**: `3a1939ac-7eae-4f92-afdd-d932001efa61`
- **Webhook Secret**: `0d51c878-019d-400c-a8ba-59997f6bb017`
- **Event Types**: onramp/offramp transaction events
- **Status**: ✅ Active & Verified

## Environment Variables

✅ **NicheAI** - `CDP_WEBHOOK_SECRET` added to Vercel production
✅ **Quantum Internet** - `CDP_WEBHOOK_SECRET` added to Vercel production

## Deployments

✅ Both projects redeployed with webhook secrets:
- NicheAI: https://nicheai-nx5p.vercel.app
- Quantum Internet: https://quantum-internet.vercel.app

## Testing

Both webhooks tested and responding with `{"received":true}`:
```bash
curl -X POST https://quantum-internet.vercel.app/api/webhooks/coinbase \
  -H "Content-Type: application/json" -d '{"eventType": "test"}'

curl -X POST https://nicheai-nx5p.vercel.app/api/webhooks/coinbase \
  -H "Content-Type: application/json" -d '{"eventType": "test"}'
```

## Webhook Event Types Subscribed

- `onramp.transaction.created`
- `onramp.transaction.success`
- `onramp.transaction.failed`
- `offramp.transaction.created`
- `offramp.transaction.success`
- `offramp.transaction.failed`
