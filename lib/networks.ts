import { Network } from "./types";

export const SUPPORTED_NETWORKS: Network[] = [
  {
    id: "base-mainnet",
    name: "Base",
    explorerUrl: "https://basescan.org",
    nativeCurrency: "ETH",
    decimals: 18,
  },
  {
    id: "ethereum-mainnet",
    name: "Ethereum",
    explorerUrl: "https://etherscan.io",
    nativeCurrency: "ETH",
    decimals: 18,
  },
  {
    id: "polygon-mainnet",
    name: "Polygon",
    explorerUrl: "https://polygonscan.com",
    nativeCurrency: "MATIC",
    decimals: 18,
  },
  {
    id: "arbitrum-mainnet",
    name: "Arbitrum",
    explorerUrl: "https://arbiscan.io",
    nativeCurrency: "ETH",
    decimals: 18,
  },
  {
    id: "optimism-mainnet",
    name: "Optimism",
    explorerUrl: "https://optimistic.etherscan.io",
    nativeCurrency: "ETH",
    decimals: 18,
  },
  {
    id: "solana-mainnet",
    name: "Solana",
    explorerUrl: "https://solscan.io",
    nativeCurrency: "SOL",
    decimals: 9,
  },
];

export function getNetwork(id: string): Network | undefined {
  return SUPPORTED_NETWORKS.find((n) => n.id === id);
}

export function getExplorerTxUrl(networkId: string, txHash: string): string {
  const network = getNetwork(networkId);
  if (!network) return "#";
  if (networkId === "solana-mainnet") {
    return `${network.explorerUrl}/tx/${txHash}`;
  }
  return `${network.explorerUrl}/tx/${txHash}`;
}
