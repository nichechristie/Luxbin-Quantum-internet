const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying LUXBIN Contracts to Base with Coinbase Paymaster...\n");

  const [deployer] = await ethers.getSigners();

  console.log("📍 Deploying from address:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Step 1: Deploy Quantum Entropy Oracle
  console.log("1️⃣  Deploying QuantumEntropyOracle...");
  const QuantumEntropyOracle = await ethers.getContractFactory("QuantumEntropyOracle");
  const oracle = await QuantumEntropyOracle.deploy();
  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();
  console.log("   ✅ QuantumEntropyOracle deployed to:", oracleAddress);

  // Step 2: Deploy Quantum Token
  console.log("\n2️⃣  Deploying LuxbinQuantumToken...");
  const LuxbinQuantumToken = await ethers.getContractFactory("LuxbinQuantumToken");
  const token = await LuxbinQuantumToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("   ✅ LuxbinQuantumToken deployed to:", tokenAddress);

  // Step 3: Configure the token with oracle
  console.log("\n3️⃣  Configuring contracts...");
  const setOracleTx = await token.setQuantumOracle(oracleAddress);
  await setOracleTx.wait();
  console.log("   ✅ Oracle connected to token");

  // Step 4: Authorize token to use oracle
  const authorizeTx = await oracle.addAuthorizedCaller(tokenAddress);
  await authorizeTx.wait();
  console.log("   ✅ Token authorized to use oracle");

  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📝 Contract Addresses:\n");
  console.log("   QuantumEntropyOracle:", oracleAddress);
  console.log("   LuxbinQuantumToken:  ", tokenAddress);
  console.log("\n🔗 Add to MetaMask:");
  console.log("   Token Address:", tokenAddress);
  console.log("   Token Symbol: LUX");
  console.log("   Decimals: 18");
  console.log("\n🌐 View on BaseScan:");
  console.log("   Oracle: https://basescan.org/address/" + oracleAddress);
  console.log("   Token:  https://basescan.org/address/" + tokenAddress);
  console.log("\n✅ Verify contracts:");
  console.log(`   npx hardhat verify --network base ${oracleAddress}`);
  console.log(`   npx hardhat verify --network base ${tokenAddress}`);
  console.log("\n");

  // Save deployment info
  const deployment = {
    network: "base",
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      QuantumEntropyOracle: oracleAddress,
      LuxbinQuantumToken: tokenAddress
    }
  };

  const fs = require('fs');
  fs.writeFileSync(
    'deployment-info.json',
    JSON.stringify(deployment, null, 2)
  );
  console.log("💾 Deployment info saved to deployment-info.json\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
