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

// --- XRPL transaction fetching ---

interface XrplTxResult {
  tx_json?: {
    hash: string;
    Account: string;
    Destination?: string;
    Amount?: string | { value: string; currency: string; issuer: string };
    TransactionType: string;
    date?: number;
  };
  // Older API format
  tx?: {
    hash: string;
    Account: string;
    Destination?: string;
    Amount?: string | { value: string; currency: string; issuer: string };
    TransactionType: string;
    date?: number;
  };
  meta?: {
    TransactionResult: string;
    delivered_amount?: string | { value: string; currency: string; issuer: string };
  };
  validated?: boolean;
}

async function fetchXrplTransactions(
  address: string,
  limit: number = 50
): Promise<{ transactions: Transaction[]; hasMore: boolean }> {
  const XRPL_RPC = "https://s1.ripple.com:51234/";

  const body = {
    method: "account_tx",
    params: [
      {
        account: address,
        ledger_index_min: -1,
        ledger_index_max: -1,
        limit,
        forward: false,
      },
    ],
  };

  const res = await fetch(XRPL_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (data.result?.error) {
    throw new Error(data.result.error_message || data.result.error);
  }

  const txs: XrplTxResult[] = data.result?.transactions || [];
  const transactions: Transaction[] = [];

  // XRPL epoch starts Jan 1, 2000 00:00:00 UTC (946684800 seconds after Unix epoch)
  const RIPPLE_EPOCH = 946684800;

  for (const entry of txs) {
    const txData = entry.tx_json || entry.tx;
    if (!txData) continue;

    const txType = txData.TransactionType;
    const hash = txData.hash;
    const from = txData.Account || "";
    const to = txData.Destination || "";
    const date = txData.date
      ? new Date((txData.date + RIPPLE_EPOCH) * 1000).toISOString()
      : "";
    const metaResult = entry.meta?.TransactionResult || "tesSUCCESS";

    // Parse amount - can be drops (string) or issued currency (object)
    let value = "0";
    let asset = "XRP";
    const rawAmount = entry.meta?.delivered_amount || txData.Amount;

    if (typeof rawAmount === "string") {
      // Native XRP in drops (1 XRP = 1,000,000 drops)
      value = rawAmount;
      asset = "XRP";
    } else if (rawAmount && typeof rawAmount === "object") {
      // Issued currency / token
      // Convert to drops-equivalent for consistent display
      const floatVal = parseFloat(rawAmount.value);
      value = Math.round(floatVal * 1_000_000).toString();
      asset = rawAmount.currency.length > 3
        ? Buffer.from(rawAmount.currency, "hex").toString("utf-8").replace(/\0/g, "")
        : rawAmount.currency;
    }

    // Classify
    let type: "send" | "receive" | "contract" | "unknown" = "unknown";
    if (txType === "Payment") {
      if (from.toLowerCase() === address.toLowerCase()) type = "send";
      else if (to.toLowerCase() === address.toLowerCase()) type = "receive";
    } else {
      type = "contract"; // OfferCreate, TrustSet, etc.
    }

    transactions.push({
      hash,
      from,
      to,
      value,
      asset,
      timestamp: date,
      blockNumber: "",
      network: "xrpl-mainnet",
      type,
      status: metaResult === "tesSUCCESS" ? "confirmed" : "failed",
    });
  }

  return {
    transactions,
    hasMore: txs.length === limit,
  };
}

// --- EVM transaction fetching ---

export async function fetchTransactions(
  address: string,
  networkId: string,
  page: number = 1,
  pageSize: number = 50
): Promise<{ transactions: Transaction[]; hasMore: boolean }> {
  // XRPL has its own fetch path
  if (networkId === "xrpl-mainnet") {
    return fetchXrplTransactions(address, pageSize);
  }

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
