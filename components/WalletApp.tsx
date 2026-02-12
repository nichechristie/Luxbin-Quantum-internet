import CDPWrapper from "./CDPWrapper";
import { EmbeddedWalletAuth } from "./EmbeddedWallet";

export default function WalletApp() {
  return (
    <CDPWrapper>
      <EmbeddedWalletAuth />
    </CDPWrapper>
  );
}
