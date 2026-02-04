import { Attribution } from "ox/erc8021";

// Base Builder Code for Luxbin Quantum Internet
// Registered at base.dev — used for onchain activity attribution
const BUILDER_CODE = "bc_tdsr5gi8";

export const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: [BUILDER_CODE],
});

export { BUILDER_CODE };
