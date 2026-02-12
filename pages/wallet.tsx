import Head from "next/head";
import dynamic from "next/dynamic";

const WalletApp = dynamic(
  () => import("../components/WalletApp"),
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
        <WalletApp />
      </div>
    </>
  );
}
