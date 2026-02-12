import { SignIn, SignOutButton, FundModal, type FundModalProps } from "@coinbase/cdp-react";
import { useIsSignedIn, useEvmAddress, useSolanaAddress } from "@coinbase/cdp-hooks";
import { useCallback, useState, useEffect } from "react";
import { getBuyOptions, createBuyQuote } from "@/lib/onramp-api";

const projectId = process.env.NEXT_PUBLIC_COINBASE_PROJECT_ID;

interface Token {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  price: number;
  color: string;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: number;
  timestamp: number;
  status: string;
  type: "send" | "receive";
  gasFee: number;
}

function shortenAddress(addr: string) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
}

function formatUsd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function EmbeddedWalletAuth() {
  const { isSignedIn } = useIsSignedIn();

  if (!projectId) {
    return (
      <div style={{ padding: "32px", maxWidth: "480px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚙️</div>
        <h3 style={{ color: "#ff9900", marginBottom: "12px", fontSize: "18px" }}>
          CDP Project ID Not Configured
        </h3>
        <p style={{ color: "#999", fontSize: "14px", lineHeight: 1.6, marginBottom: "16px" }}>
          To enable wallet sign-in, add <code style={{ background: "#222", padding: "2px 6px", borderRadius: "4px", color: "#00f5a0" }}>NEXT_PUBLIC_COINBASE_PROJECT_ID</code> to your Vercel environment variables.
        </p>
        <a
          href="https://portal.cdp.coinbase.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0052ff", textDecoration: "underline", fontSize: "14px" }}
        >
          Get your Project ID at portal.cdp.coinbase.com →
        </a>
      </div>
    );
  }

  if (isSignedIn) {
    return <WalletDashboard />;
  }

  return (
    <div style={{ padding: "32px", maxWidth: "440px", width: "100%" }}>
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "16px",
        padding: "32px",
      }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>💳</div>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>
            Sign in to your Wallet
          </h2>
          <p style={{ color: "#999", fontSize: "14px" }}>
            No seed phrases. No extensions needed.
          </p>
        </div>
        <SignIn authMethods={["email", "sms"]} />
      </div>
    </div>
  );
}

function WalletDashboard() {
  const { evmAddress } = useEvmAddress();
  const { solanaAddress } = useSolanaAddress();
  const [activeTab, setActiveTab] = useState<"assets" | "transactions">("assets");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalUsd, setTotalUsd] = useState(0);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [loadingTxns, setLoadingTxns] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fundSuccess, setFundSuccess] = useState(false);

  const fetchBuyQuote: FundModalProps["fetchBuyQuote"] = useCallback(
    (params) => createBuyQuote(params), []
  );
  const fetchBuyOptions: FundModalProps["fetchBuyOptions"] = useCallback(
    (params) => getBuyOptions(params), []
  );

  useEffect(() => {
    if (!evmAddress) return;
    setLoadingBalances(true);
    fetch(`/api/wallet/balances?address=${evmAddress}`)
      .then((r) => r.json())
      .then((d) => { setTokens(d.tokens || []); setTotalUsd(d.totalUsd || 0); })
      .catch(console.error)
      .finally(() => setLoadingBalances(false));
  }, [evmAddress]);

  useEffect(() => {
    if (!evmAddress || activeTab !== "transactions") return;
    setLoadingTxns(true);
    fetch(`/api/wallet/transactions?address=${evmAddress}`)
      .then((r) => r.json())
      .then((d) => setTransactions(d.transactions || []))
      .catch(console.error)
      .finally(() => setLoadingTxns(false));
  }, [evmAddress, activeTab]);

  function copyAddress() {
    if (evmAddress) {
      navigator.clipboard.writeText(evmAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div style={{ width: "100%", maxWidth: "520px", padding: "0 16px" }}>

      {/* Portfolio Header */}
      <div style={{
        background: "linear-gradient(135deg, rgba(0,82,255,0.2), rgba(0,245,160,0.1))",
        border: "1px solid rgba(0,245,160,0.2)",
        borderRadius: "20px",
        padding: "28px",
        marginBottom: "16px",
        textAlign: "center",
      }}>
        <p style={{ color: "#999", fontSize: "13px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
          Total Balance
        </p>
        <h2 style={{ fontSize: "42px", fontWeight: "800", color: "#fff", marginBottom: "4px" }}>
          {loadingBalances ? "..." : formatUsd(totalUsd)}
        </h2>
        <p style={{ color: "#00f5a0", fontSize: "13px" }}>Base Network</p>
      </div>

      {/* Addresses */}
      {evmAddress && (
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "14px",
          padding: "16px",
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <p style={{ color: "#999", fontSize: "11px", marginBottom: "4px" }}>EVM Address (Base)</p>
            <code style={{ color: "#fff", fontSize: "13px" }}>{shortenAddress(evmAddress)}</code>
          </div>
          <button
            onClick={copyAddress}
            style={{
              background: copied ? "rgba(0,245,160,0.2)" : "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              color: copied ? "#00f5a0" : "#aaa",
              cursor: "pointer",
              padding: "6px 12px",
              fontSize: "12px",
              transition: "all 0.2s",
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}

      {solanaAddress && (
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "14px",
          padding: "16px",
          marginBottom: "8px",
        }}>
          <p style={{ color: "#999", fontSize: "11px", marginBottom: "4px" }}>Solana Address</p>
          <code style={{ color: "#fff", fontSize: "13px" }}>{shortenAddress(solanaAddress)}</code>
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: "4px",
        background: "rgba(255,255,255,0.04)",
        borderRadius: "12px",
        padding: "4px",
        marginTop: "20px",
        marginBottom: "16px",
      }}>
        {(["assets", "transactions"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              background: activeTab === tab ? "linear-gradient(90deg, #0052ff, #00d9f5)" : "transparent",
              color: activeTab === tab ? "#fff" : "#666",
              transition: "all 0.2s",
              textTransform: "capitalize",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Assets Tab */}
      {activeTab === "assets" && (
        <div>
          {loadingBalances ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>Loading balances...</div>
          ) : tokens.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "40px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "14px",
              border: "1px dashed rgba(255,255,255,0.1)",
            }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>💸</div>
              <p style={{ color: "#666", fontSize: "14px" }}>No tokens yet. Buy some crypto below!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {tokens.map((token) => (
                <div key={token.symbol} style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "14px",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background: `${token.color}33`,
                      border: `2px solid ${token.color}66`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: token.color,
                    }}>
                      {token.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p style={{ color: "#fff", fontWeight: "600", fontSize: "15px", marginBottom: "2px" }}>{token.symbol}</p>
                      <p style={{ color: "#666", fontSize: "12px" }}>{token.name}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#fff", fontWeight: "600", fontSize: "15px", marginBottom: "2px" }}>
                      {token.balance < 0.0001 ? token.balance.toFixed(8) : token.balance.toFixed(4)} {token.symbol}
                    </p>
                    <p style={{ color: "#999", fontSize: "12px" }}>{formatUsd(token.usdValue)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Buy Button */}
          {fundSuccess && (
            <div style={{
              marginTop: "16px",
              padding: "12px",
              background: "rgba(0,245,160,0.1)",
              borderRadius: "10px",
              color: "#00f5a0",
              fontSize: "13px",
              textAlign: "center",
            }}>
              ✓ Purchase successful! Funds are on their way.
            </div>
          )}
          <div style={{ marginTop: "20px" }}>
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
                padding: "16px",
                borderRadius: "12px",
                background: "linear-gradient(90deg, #00f5a0, #00d9f5)",
                color: "#000",
                border: "none",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "16px",
              }}>
                + Buy Crypto
              </button>
            </FundModal>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div>
          {loadingTxns ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "40px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "14px",
              border: "1px dashed rgba(255,255,255,0.1)",
            }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
              <p style={{ color: "#666", fontSize: "14px" }}>No transactions found on Base.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {transactions.map((tx) => (
                <a
                  key={tx.hash}
                  href={`https://basescan.org/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <div style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "14px",
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "border-color 0.2s",
                    cursor: "pointer",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: tx.type === "receive" ? "rgba(0,245,160,0.15)" : "rgba(239,68,68,0.15)",
                        border: `2px solid ${tx.type === "receive" ? "rgba(0,245,160,0.4)" : "rgba(239,68,68,0.4)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                      }}>
                        {tx.type === "receive" ? "↓" : "↑"}
                      </div>
                      <div>
                        <p style={{ color: "#fff", fontWeight: "600", fontSize: "14px", marginBottom: "2px", textTransform: "capitalize" }}>
                          {tx.type === "receive" ? "Received" : "Sent"}{" "}
                          <span style={{ color: tx.status === "success" ? "#00f5a0" : "#ef4444", fontSize: "11px" }}>
                            {tx.status === "success" ? "✓" : "✗"}
                          </span>
                        </p>
                        <p style={{ color: "#666", fontSize: "12px" }}>
                          {tx.type === "receive" ? `From ${shortenAddress(tx.from)}` : `To ${shortenAddress(tx.to)}`}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{
                        fontWeight: "600",
                        fontSize: "14px",
                        marginBottom: "2px",
                        color: tx.type === "receive" ? "#00f5a0" : "#fff",
                      }}>
                        {tx.type === "receive" ? "+" : "-"}{tx.value.toFixed(4)} ETH
                      </p>
                      <p style={{ color: "#666", fontSize: "11px" }}>{formatDate(tx.timestamp)}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sign Out */}
      <div style={{ marginTop: "24px", paddingBottom: "32px" }}>
        <SignOutButton style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          background: "transparent",
          color: "#ef4444",
          border: "1px solid rgba(239,68,68,0.4)",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
        }}>
          Sign Out
        </SignOutButton>
      </div>
    </div>
  );
}
