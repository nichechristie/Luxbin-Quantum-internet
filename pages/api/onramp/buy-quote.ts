import type { NextApiRequest, NextApiResponse } from "next";
import { generateCDPJWT, getCDPCredentials, ONRAMP_API_BASE_URL } from "@/lib/cdp-auth";
import { convertSnakeToCamelCase } from "@/lib/to-camel-case";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    try {
      getCDPCredentials();
    } catch {
      return res.status(500).json({ error: "CDP API credentials not configured" });
    }

    const body = req.body;

    if (
      !body.purchaseCurrency ||
      !body.paymentAmount ||
      !body.paymentCurrency ||
      !body.paymentMethod ||
      !body.country
    ) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    if (body.country === "US" && !body.subdivision) {
      return res.status(400).json({ error: "State/subdivision is required for US" });
    }

    const jwt = await generateCDPJWT({
      requestMethod: "POST",
      requestHost: new URL(ONRAMP_API_BASE_URL).hostname,
      requestPath: "/onramp/v1/buy/quote",
    });

    const requestBody = {
      purchaseCurrency: body.purchaseCurrency,
      purchaseNetwork: body.purchaseNetwork,
      paymentAmount: body.paymentAmount,
      paymentCurrency: body.paymentCurrency,
      paymentMethod: body.paymentMethod,
      country: body.country,
      subdivision: body.subdivision,
      destinationAddress: body.destinationAddress,
    };

    const apiOrigin = new URL(ONRAMP_API_BASE_URL).origin;
    const response = await fetch(`${apiOrigin}/onramp/v1/buy/quote`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CDP Onramp API error:", response.status, errorText);
      return res.status(response.status).json({ error: "Failed to create buy quote" });
    }

    const data = await response.json();
    const camelData = convertSnakeToCamelCase(data);
    return res.status(200).json(camelData);
  } catch (error) {
    console.error("Error creating buy quote:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return res.status(500).json({ error: message });
  }
}
