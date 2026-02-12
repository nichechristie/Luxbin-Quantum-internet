import { SignIn, SignOutButton, FundModal, type FundModalProps } from "@coinbase/cdp-react";
import { useIsSignedIn, useEvmAddress, useSolanaAddress } from "@coinbase/cdp-hooks";
import { useCallback, useState } from "react";
import { getBuyOptions, createBuyQuote } from "@/lib/onramp-api";

export function EmbeddedWalletAuth() {
  const { isSignedIn } = useIsSignedIn();

  if (isSignedIn) {
    return <EmbeddedWalletDashboard />;
  }

  return (
    <div style={{ padding: "24px", maxWidth: "440px" }}>
      <SignIn authMethods={["email", "sms"]} />
      <p style={{ marginTop: "12px", fontSize: "12px", color: "#999", textAlign: "center" }}>
        A wallet will be created automatically when you sign in.
        No extensions or seed phrases needed.
      </p>
    </div>
  );
}

function EmbeddedWalletDashboard() {
  const { evmAddress } = useEvmAddress();
  const { solanaAddress } = useSolanaAddress();
  const [fundSuccess, setFundSuccess] = useState(false);

  const fetchBuyQuote: FundModalProps["fetchBuyQuote"] = useCallback(async (params) => {
    return createBuyQuote(params);
  }, []);

  const fetchBuyOptions: FundModalProps["fetchBuyOptions"] = useCallback(async (params) => {
    return getBuyOptions(params);
  }, []);

  return (
    <div style={{ padding: "24px", maxWidth: "480px", width: "100%" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
        Your Embedded Wallet
      </h2>

      {evmAddress && (
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", color: "#999", display: "block", marginBottom: "4px" }}>
            EVM Address (Base)
          </label>
          <code style={{
            display: "block",
            padding: "8px",
            background: "#111",
            borderRadius: "8px",
            fontSize: "13px",
            wordBreak: "break-all",
          }}>
            {evmAddress}
          </code>
        </div>
      )}

      {solanaAddress && (
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", color: "#999", display: "block", marginBottom: "4px" }}>
            Solana Address
          </label>
          <code style={{
            display: "block",
            padding: "8px",
            background: "#111",
            borderRadius: "8px",
            fontSize: "13px",
            wordBreak: "break-all",
          }}>
            {solanaAddress}
          </code>
        </div>
      )}

      {/* Onramp - Buy Crypto */}
      <div style={{
        marginTop: "24px",
        padding: "20px",
        background: "linear-gradient(135deg, rgba(0, 245, 160, 0.1), rgba(0, 217, 245, 0.1))",
        border: "1px solid rgba(0, 245, 160, 0.3)",
        borderRadius: "12px",
      }}>
        <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "#00f5a0" }}>
          Buy Crypto (Onramp)
        </h3>
        <p style={{ fontSize: "13px", color: "#999", marginBottom: "16px" }}>
          Purchase crypto with your Coinbase account or debit card. Funds go directly to your embedded wallet.
        </p>

        {fundSuccess && (
          <div style={{
            padding: "8px 12px",
            background: "rgba(0, 245, 160, 0.15)",
            borderRadius: "8px",
            marginBottom: "12px",
            fontSize: "13px",
            color: "#00f5a0",
          }}>
            Purchase successful! Funds are on their way to your wallet.
          </div>
        )}

        <FundModal
          country="US"
          subdivision="CA"
          cryptoCurrency="eth"
          fiatCurrency="usd"
          fetchBuyQuote={fetchBuyQuote}
          fetchBuyOptions={fetchBuyOptions}
          network="base"
          presetAmountInputs={[10, 25, 50]}
          onSuccess={() => setFundSuccess(true)}
          destinationAddress={evmAddress as string}
        >
          <button style={{
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            background: "linear-gradient(90deg, #00f5a0, #00d9f5)",
            color: "#000",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "15px",
          }}>
            Buy ETH on Base
          </button>
        </FundModal>
      </div>

      <div style={{ marginTop: "24px" }}>
        <SignOutButton
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            background: "transparent",
            color: "#ff4444",
            border: "1px solid #ff4444",
            cursor: "pointer",
            marginTop: "8px",
          }}
        >
          Sign Out
        </SignOutButton>
      </div>
    </div>
  );
}
