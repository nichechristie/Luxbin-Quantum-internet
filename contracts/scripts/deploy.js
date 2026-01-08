const hre = require("hardhat");

async function main() {
  console.log("🌐⚛️ LUXBIN Quantum Token Deployment");
  console.log("=" + "=".repeat(59));
  console.log();

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());
  console.log();

  // Step 1: Deploy Quantum Entropy Oracle
  console.log("Step 1: Deploying Quantum Entropy Oracle...");
  const QuantumEntropyOracle = await hre.ethers.getContractFactory("QuantumEntropyOracle");
  const oracle = await QuantumEntropyOracle.deploy();
  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();
  console.log("✅ Oracle deployed to:", oracleAddress);
  console.log();

  // Step 2: Deploy LUXBIN Quantum Token
  console.log("Step 2: Deploying LUXBIN Quantum Token...");
  const LuxbinQuantumToken = await hre.ethers.getContractFactory("LuxbinQuantumToken");
  const token = await LuxbinQuantumToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ Token deployed to:", tokenAddress);
  console.log();

  // Step 3: Connect Token to Oracle
  console.log("Step 3: Connecting Token to Oracle...");
  const setOracleTx = await token.setQuantumOracle(oracleAddress);
  await setOracleTx.wait();
  console.log("✅ Token connected to Oracle");
  console.log();

  // Step 4: Subscribe Token to Oracle
  console.log("Step 4: Subscribing Token to Oracle updates...");
  const subscribeTx = await oracle.subscribe(tokenAddress);
  await subscribeTx.wait();
  console.log("✅ Token subscribed to Oracle");
  console.log();

  // Step 5: Authorize deployer as Oracle feeder
  console.log("Step 5: Authorizing entropy feeder...");
  const authorizeTx = await oracle.authorizeFeeder(deployer.address);
  await authorizeTx.wait();
  console.log("✅ Feeder authorized:", deployer.address);
  console.log();

  // Display summary
  console.log("=" + "=".repeat(59));
  console.log("🎉 Deployment Complete!");
  console.log("=" + "=".repeat(59));
  console.log();
  console.log("📝 Contract Addresses:");
  console.log("   Oracle:  ", oracleAddress);
  console.log("   Token:   ", tokenAddress);
  console.log();
  console.log("💰 Token Info:");
  const name = await token.name();
  const symbol = await token.symbol();
  const totalSupply = await token.totalSupply();
  console.log("   Name:    ", name);
  console.log("   Symbol:  ", symbol);
  console.log("   Supply:  ", hre.ethers.formatEther(totalSupply), symbol);
  console.log();
  console.log("⚛️  Quantum Info:");
  const metrics = await token.getQuantumMetrics();
  console.log("   Qubits:           ", metrics[5].toString());
  console.log("   Quantum Computers:", metrics[6].toString());
  console.log();
  console.log("🚀 Next Steps:");
  console.log("   1. Update .env with addresses:");
  console.log("      ORACLE_ADDRESS=" + oracleAddress);
  console.log("      TOKEN_ADDRESS=" + tokenAddress);
  console.log();
  console.log("   2. Start entropy feeder:");
  console.log("      python3 ../quantum_entropy_feeder.py");
  console.log();
  console.log("   3. Add liquidity to DEX:");
  console.log("      - Uniswap (Base): https://app.uniswap.org/");
  console.log("      - Create LUX/ETH or LUX/USDC pool");
  console.log();
  console.log("   4. Verify contracts:");
  console.log("      npx hardhat verify --network base " + oracleAddress);
  console.log("      npx hardhat verify --network base " + tokenAddress);
  console.log();
  console.log("=" + "=".repeat(59));

  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    network: hre.network.name,
    oracle: oracleAddress,
    token: tokenAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    quantumComputers: 3,
    totalQubits: 445
  };

  fs.writeFileSync(
    'deployment.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("💾 Deployment info saved to deployment.json");
  console.log();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
