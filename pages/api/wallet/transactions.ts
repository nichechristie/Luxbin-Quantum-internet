import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;
  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Missing address" });
  }

  try {
    const url = `https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=25&sort=desc&apikey=YourApiKeyToken`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "1" && Array.isArray(data.result)) {
      const transactions = data.result.map((tx: Record<string, string>) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: parseInt(tx.value) / 1e18,
        timestamp: parseInt(tx.timeStamp) * 1000,
        status: tx.txreceipt_status === "1" ? "success" : "failed",
        type: tx.from.toLowerCase() === address.toLowerCase() ? "send" : "receive",
        gasFee: (parseInt(tx.gasUsed) * parseInt(tx.gasPrice)) / 1e18,
      }));
      res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate");
      return res.status(200).json({ transactions });
    }

    return res.status(200).json({ transactions: [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch transactions" });
  }
}
