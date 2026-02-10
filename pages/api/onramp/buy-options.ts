import type { NextApiRequest, NextApiResponse } from "next";
import { generateCDPJWT, getCDPCredentials, ONRAMP_API_BASE_URL } from "@/lib/cdp-auth";
import { convertSnakeToCamelCase } from "@/lib/to-camel-case";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    try {
      getCDPCredentials();
    } catch {
      return res.status(500).json({ error: "CDP API credentials not configured" });
    }

    const { country, subdivision, networks } = req.query;

    const queryParams = new URLSearchParams();
    if (country) queryParams.append("country", String(country));
    if (subdivision) queryParams.append("subdivision", String(subdivision));
    if (networks) queryParams.append("networks", String(networks));

    const queryString = queryParams.toString();
    const apiPath = "/onramp/v1/buy/options";
    const fullPath = apiPath + (queryString ? `?${queryString}` : "");

    const jwt = await generateCDPJWT({
      requestMethod: "GET",
      requestHost: new URL(ONRAMP_API_BASE_URL).hostname,
      requestPath: apiPath,
    });

    const apiOrigin = new URL(ONRAMP_API_BASE_URL).origin;
    const response = await fetch(`${apiOrigin}${fullPath}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CDP Onramp API error:", response.status, errorText);
      return res.status(response.status).json({ error: "Failed to fetch buy options" });
    }

    const data = await response.json();
    const camelData = convertSnakeToCamelCase(data);
    return res.status(200).json(camelData);
  } catch (error) {
    console.error("Error fetching buy options:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return res.status(500).json({ error: message });
  }
}
