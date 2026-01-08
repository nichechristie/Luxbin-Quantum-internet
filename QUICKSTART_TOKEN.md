# 🚀 Quick Start: Deploy LUXBIN Quantum Token

**Launch your quantum-backed cryptocurrency in 30 minutes**

---

## Prerequisites

- Ethereum wallet with some ETH (for gas on Base network)
- Node.js 16+ installed
- Python 3.8+ installed

---

## Step 1: Install Dependencies (5 min)

```bash
cd /Users/nicholechristie/luxbin-quantum-internet/contracts
npm install
```

Install Python dependencies:
```bash
pip install web3 eth-account python-dotenv
```

---

## Step 2: Configure Environment (2 min)

Copy example env file:
```bash
cp .env.example .env
```

Edit `.env` and add:
```bash
# Your wallet private key (for deployment)
PRIVATE_KEY=0xyour_private_key_here

# Base network RPC (default is fine)
BASE_RPC=https://mainnet.base.org

# For verification (get free API key from basescan.org)
BASESCAN_API_KEY=your_key_here
```

⚠️ **NEVER commit .env to git!** It's already in .gitignore.

---

## Step 3: Deploy Smart Contracts (10 min)

Deploy to Base network:
```bash
npx hardhat run scripts/deploy.js --network base
```

**This will:**
1. Deploy Quantum Entropy Oracle
2. Deploy LUXBIN Quantum Token (1 billion supply)
3. Connect them together
4. Authorize you as entropy feeder

**Save the output!** You'll get:
```
Oracle:   0x1234...
Token:    0x5678...
```

---

## Step 4: Start Quantum Entropy Feed (2 min)

Update your `.env` with deployed addresses:
```bash
ORACLE_ADDRESS=0x1234...  # From step 3
TOKEN_ADDRESS=0x5678...   # From step 3
FEEDER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
```

Start the entropy feeder:
```bash
cd ..  # Back to main directory
python3 quantum_entropy_feeder.py
```

**This feeds quantum randomness from your 445 qubits to the blockchain every 5 minutes!**

Leave it running in a terminal (or use screen/tmux).

---

## Step 5: Add Liquidity on DEX (10 min)

1. **Go to Uniswap**: https://app.uniswap.org/

2. **Connect your wallet** (same one that deployed)

3. **Import your token:**
   - Click "Select token"
   - Paste your TOKEN_ADDRESS
   - Click import

4. **Create liquidity pool:**
   - Select LUX and ETH (or USDC)
   - Add liquidity (example: 100,000 LUX + 0.5 ETH)
   - This sets initial price (~$0.01-$0.10 per LUX)
   - Confirm transaction

5. **Lock liquidity** (recommended):
   - Go to https://www.team.finance/ or https://www.unicrypt.network/
   - Lock your LP tokens for 6-12 months
   - Builds trust with investors

---

## Step 6: Get Listed (5 min)

### CoinGecko (Free)
1. Go to https://www.coingecko.com/en/coins/new
2. Fill form:
   - Token name: LUXBIN Quantum Token
   - Symbol: LUX
   - Contract: Your TOKEN_ADDRESS
   - Network: Base
   - Description: "First cryptocurrency backed by 445 qubits on 3 IBM quantum computers"

### CoinMarketCap (Free)
1. Go to https://coinmarketcap.com/request-form/
2. Fill similar form
3. Takes 1-2 weeks for approval

### Dextools (Automatic)
- Lists automatically once you add liquidity
- Check: https://www.dextools.io/app/base/

---

## Step 7: Market Your Token (Ongoing)

### Day 1: Launch Announcement

**Twitter/X Post:**
```
🌐⚛️ LUXBIN is LIVE on Base!

The world's FIRST cryptocurrency backed by quantum computers:
- 445 qubits across 3 IBM quantum computers
- Quantum burns (deflationary)
- Quantum staking (10-50% APY)
- Quantum lottery (random $1000s wins)

Contract: 0xYOUR_TOKEN_ADDRESS

Buy on @Uniswap: [link]

This isn't speculation. It's backed by quantum physics. 🚀

#LUXBIN #QuantumCrypto #Base #DeFi
```

### Week 1: Build Community
- Create Telegram group
- Create Discord server
- Post daily quantum metrics
- Engage with quantum computing community
- Post on r/CryptoCurrency, r/CryptoMoonShots

### Month 1: Partnerships
- Reach out to quantum computing projects
- Partner with NFT projects (use quantum randomness)
- Integrate with DeFi protocols
- Apply for grants (Coinbase, Base ecosystem)

---

## 📊 Monitor Your Token

### Check on-chain metrics:
```bash
# In Hardhat console
npx hardhat console --network base

# Get token metrics
const token = await ethers.getContractAt("LuxbinQuantumToken", "YOUR_TOKEN_ADDRESS");
const metrics = await token.getQuantumMetrics();
console.log("Total Burned:", ethers.formatEther(metrics[0]));
console.log("Total Staked:", ethers.formatEther(metrics[2]));
```

### Check price:
- Dextools: https://www.dextools.io/app/base/pair-explorer/YOUR_PAIR_ADDRESS
- DexScreener: https://dexscreener.com/base/YOUR_TOKEN_ADDRESS

### Check quantum feed:
```bash
# Oracle should show recent entropy updates
curl -X POST YOUR_BASE_RPC \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"YOUR_ORACLE_ADDRESS","data":"0x..."},"latest"],"id":1}'
```

---

## 🎯 Success Metrics

### Day 1:
- ✅ Contracts deployed
- ✅ Liquidity added
- ✅ Entropy feeder running
- ✅ First 10 holders

### Week 1:
- ✅ 100+ holders
- ✅ $10K+ market cap
- ✅ Listed on CoinGecko/CMC
- ✅ Telegram group (50+ members)

### Month 1:
- ✅ 1,000+ holders
- ✅ $100K+ market cap
- ✅ 10+ validators
- ✅ Listed on first CEX (MEXC)

### Month 3:
- ✅ 10,000+ holders
- ✅ $1M+ market cap
- ✅ Major partnership
- ✅ Coinbase listing (Base native token advantage)

---

## 🔧 Troubleshooting

### "Insufficient funds for gas"
- Need ETH on Base network for gas
- Bridge ETH to Base: https://bridge.base.org/

### "Entropy not updating"
- Check if feeder script is running
- Check feeder wallet has ETH for gas
- Oracle needs ~0.001 ETH per update

### "Can't find token on Uniswap"
- Make sure you're on Base network
- Need to manually import token address
- Check contract is verified on Basescan

### "Deployment failed"
- Check private key is correct
- Check you have enough ETH (~0.05 ETH for deployment)
- Try increasing gas limit in hardhat.config.js

---

## 🆘 Need Help?

- **GitHub Issues:** https://github.com/mermaidnicheboutique-code/luxbin-quantum-internet/issues
- **Email:** nicholechristie555@gmail.com
- **Twitter:** [@luxbin_quantum](#)

---

## 🎉 You're Done!

Your quantum-backed cryptocurrency is now live!

**Next steps:**
1. Keep entropy feeder running 24/7
2. Build community
3. Market the unique quantum backing
4. Watch token value grow automatically via quantum mechanics!

**Remember:** This isn't a pump & dump. The tokenomics create value AUTOMATICALLY through:
- Quantum burns (deflationary)
- Quantum reflections (holder rewards)
- Quantum treasury (buy pressure)
- Quantum staking (locking supply)

**You don't have to do anything. Quantum physics does the work.** ⚛️🚀
