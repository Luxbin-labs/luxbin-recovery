import { Transaction } from "./types";
import { getExplorerApi } from "./cdp-auth";
import { getNetwork } from "./networks";

interface EtherscanTx {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  blockNumber: string;
  isError: string;
  functionName?: string;
  tokenName?: string;
  tokenSymbol?: string;
  tokenDecimal?: string;
}

function classifyTx(
  tx: EtherscanTx,
  walletAddress: string
): "send" | "receive" | "contract" | "unknown" {
  const from = tx.from.toLowerCase();
  const to = (tx.to || "").toLowerCase();
  const wallet = walletAddress.toLowerCase();

  if (!to) return "contract";
  if (from === wallet && to !== wallet) return "send";
  if (to === wallet && from !== wallet) return "receive";
  return "unknown";
}

export async function fetchTransactions(
  address: string,
  networkId: string,
  page: number = 1,
  pageSize: number = 50
): Promise<{ transactions: Transaction[]; hasMore: boolean }> {
  const explorer = getExplorerApi(networkId);
  const network = getNetwork(networkId);

  if (!explorer || !network) {
    throw new Error(`Unsupported network: ${networkId}`);
  }

  // Fetch normal transactions and token transfers in parallel
  const [normalRes, tokenRes] = await Promise.all([
    fetch(
      `${explorer.url}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=${pageSize}&sort=desc`
    ),
    fetch(
      `${explorer.url}?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=${pageSize}&sort=desc`
    ),
  ]);

  const [normalData, tokenData] = await Promise.all([
    normalRes.json(),
    tokenRes.json(),
  ]);

  const transactions: Transaction[] = [];

  // Process normal transactions
  if (normalData.status === "1" && Array.isArray(normalData.result)) {
    for (const tx of normalData.result as EtherscanTx[]) {
      transactions.push({
        hash: tx.hash,
        from: tx.from,
        to: tx.to || "",
        value: tx.value,
        asset: network.nativeCurrency,
        timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        blockNumber: tx.blockNumber,
        network: networkId,
        type: classifyTx(tx, address),
        status: tx.isError === "0" ? "confirmed" : "failed",
      });
    }
  }

  // Process token transfers
  if (tokenData.status === "1" && Array.isArray(tokenData.result)) {
    for (const tx of tokenData.result as EtherscanTx[]) {
      transactions.push({
        hash: tx.hash,
        from: tx.from,
        to: tx.to || "",
        value: tx.value,
        asset: tx.tokenSymbol || "TOKEN",
        timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        blockNumber: tx.blockNumber,
        network: networkId,
        type: classifyTx(tx, address),
        status: "confirmed",
      });
    }
  }

  // Deduplicate by hash+asset (normal tx and token tx can share hash)
  const seen = new Set<string>();
  const deduplicated = transactions.filter((tx) => {
    const key = `${tx.hash}-${tx.asset}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by timestamp descending
  deduplicated.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return {
    transactions: deduplicated,
    hasMore: normalData.result?.length === pageSize || tokenData.result?.length === pageSize,
  };
}
