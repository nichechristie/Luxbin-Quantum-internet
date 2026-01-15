const { ethers } = require("hardhat");

async function main() {
  console.log("⚙️  Configuring deployed contracts...\n");

  const oracleAddress = "0x8bcE16Ef26038f8EF673C3261a44230523014D4b";
  const tokenAddress = "0xe1Ba284CC77AD2FB7BC7C225d4A559B8D403Be32";

  // Get contract instances
  const oracle = await ethers.getContractAt("QuantumEntropyOracle", oracleAddress);
  const token = await ethers.getContractAt("LuxbinQuantumToken", tokenAddress);

  console.log("📝 Authorizing token to use oracle...");
  const authTx = await oracle.authorizeFeeder(tokenAddress);
  await authTx.wait();
  console.log("   ✅ Token authorized as oracle feeder");

  console.log("\n" + "=".repeat(60));
  console.log("🎉 CONFIGURATION COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📍 Your Deployed Contracts:\n");
  console.log("   QuantumEntropyOracle:", oracleAddress);
  console.log("   LuxbinQuantumToken:  ", tokenAddress);
  console.log("\n🔗 View on BaseScan:");
  console.log("   Oracle: https://sepolia.basescan.org/address/" + oracleAddress);
  console.log("   Token:  https://sepolia.basescan.org/address/" + tokenAddress);
  console.log("\n💎 Add LUX Token to MetaMask:");
  console.log("   Address: " + tokenAddress);
  console.log("   Symbol: LUX");
  console.log("   Decimals: 18");
  console.log("   Network: Base Sepolia");
  console.log("\n");

  // Save deployment
  const fs = require('fs');
  const deployment = {
    network: "Base Sepolia (Testnet)",
    chainId: 84532,
    timestamp: new Date().toISOString(),
    contracts: {
      QuantumEntropyOracle: oracleAddress,
      LuxbinQuantumToken: tokenAddress
    },
    urls: {
      oracle: `https://sepolia.basescan.org/address/${oracleAddress}`,
      token: `https://sepolia.basescan.org/address/${tokenAddress}`
    }
  };

  fs.writeFileSync('deployment-info.json', JSON.stringify(deployment, null, 2));
  console.log("💾 Deployment info saved to deployment-info.json\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
