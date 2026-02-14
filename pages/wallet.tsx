import Head from "next/head";
import dynamic from "next/dynamic";

const EmbeddedWalletAuth = dynamic(
  () => import("../components/EmbeddedWallet").then((mod) => mod.EmbeddedWalletAuth),
  { ssr: false }
);

export default function WalletPage() {
  return (
    <>
      <Head>
        <title>Luxbin Wallet | Embedded Wallet</title>
        <meta name="description" content="Sign in with email or SMS to access your Luxbin embedded wallet" />
      </Head>
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0f",
        color: "white",
      }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }}>
          Luxbin Wallet
        </h1>
        <p style={{ color: "#999", marginBottom: "32px" }}>
          Sign in with email or SMS to access your embedded wallet
        </p>
        <EmbeddedWalletAuth />
      </div>
    </>
  );
}
