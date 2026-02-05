// Block explorer API endpoints (free tier, no auth needed for basic queries)
// These allow looking up any public wallet address's transaction history

export const EXPLORER_APIS: Record<string, { url: string; apiKeyParam?: string }> = {
  "ethereum-mainnet": {
    url: "https://api.etherscan.io/api",
  },
  "base-mainnet": {
    url: "https://api.basescan.org/api",
  },
  "polygon-mainnet": {
    url: "https://api.polygonscan.com/api",
  },
  "arbitrum-mainnet": {
    url: "https://api.arbiscan.io/api",
  },
  "optimism-mainnet": {
    url: "https://api-optimistic.etherscan.io/api",
  },
};

export function getExplorerApi(networkId: string) {
  return EXPLORER_APIS[networkId];
}
