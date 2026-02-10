import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const keyId = process.env.CDP_API_KEY_ID;
  const keySecret = process.env.CDP_API_KEY_SECRET;
  const projectId = process.env.NEXT_PUBLIC_COINBASE_PROJECT_ID;

  // Don't reveal actual values, just check format
  const info: Record<string, unknown> = {
    hasKeyId: !!keyId,
    keyIdPrefix: keyId ? keyId.substring(0, 8) + "..." : null,
    hasKeySecret: !!keySecret,
    keySecretLength: keySecret?.length ?? 0,
    hasProjectId: !!projectId,
  };

  if (keySecret) {
    // Check if it looks like Ed25519 (base64-encoded 64 bytes)
    try {
      const decoded = Buffer.from(keySecret, "base64");
      info.keySecretDecodedLength = decoded.length;
      info.looksLikeEd25519 = decoded.length === 64;
    } catch {
      info.keySecretDecodedLength = "decode_error";
      info.looksLikeEd25519 = false;
    }

    // Check if it looks like a PEM key
    info.looksLikePEM = keySecret.includes("-----BEGIN");
    info.keySecretFirstChars = keySecret.substring(0, 20) + "...";
    info.keySecretLastChars = "..." + keySecret.substring(keySecret.length - 20);
  }

  return res.status(200).json(info);
}
