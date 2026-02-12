import type { NextApiRequest, NextApiResponse } from "next";

const BASE_RPC = "https://mainnet.base.org";
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const CBETH_ADDRESS = "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22";

async function rpcCall(method: string, params: unknown[]) {
  const res = await fetch(BASE_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const data = await res.json();
  return data.result;
}

async function getERC20Balance(tokenAddress: string, walletAddress: string): Promise<string> {
  const padded = walletAddress.slice(2).padStart(64, "0");
  const data = "0x70a08231" + padded;
  return rpcCall("eth_call", [{ to: tokenAddress, data }, "latest"]);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;
  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Missing address" });
  }

  try {
    const [ethHex, usdcHex, cbethHex, priceRes] = await Promise.all([
      rpcCall("eth_getBalance", [address, "latest"]),
      getERC20Balance(USDC_ADDRESS, address),
      getERC20Balance(CBETH_ADDRESS, address),
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum,coinbase-wrapped-staked-eth&vs_currencies=usd"),
    ]);

    const prices = await (priceRes as Response).json();
    const ethPrice: number = prices?.ethereum?.usd || 0;
    const cbethPrice: number = prices?.["coinbase-wrapped-staked-eth"]?.usd || ethPrice;

    const ethBalance = parseInt(ethHex || "0x0", 16) / 1e18;
    const usdcBalance = parseInt(usdcHex || "0x0", 16) / 1e6;
    const cbethBalance = parseInt(cbethHex || "0x0", 16) / 1e18;

    const tokens = [
      { symbol: "ETH", name: "Ethereum", balance: ethBalance, usdValue: ethBalance * ethPrice, price: ethPrice, color: "#627eea" },
      { symbol: "USDC", name: "USD Coin", balance: usdcBalance, usdValue: usdcBalance, price: 1, color: "#2775ca" },
      { symbol: "cbETH", name: "Coinbase ETH", balance: cbethBalance, usdValue: cbethBalance * cbethPrice, price: cbethPrice, color: "#0052ff" },
    ].filter((t) => t.balance > 0.000001);

    const totalUsd = tokens.reduce((sum, t) => sum + t.usdValue, 0);
    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate");
    return res.status(200).json({ tokens, totalUsd, ethPrice });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch balances" });
  }
}
