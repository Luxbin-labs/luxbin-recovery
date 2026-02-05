"use client";

import { Transaction } from "@/lib/types";
import { formatDate, truncateAddress, weiToEth } from "@/lib/format-utils";
import { getNetwork, getExplorerTxUrl } from "@/lib/networks";

interface TransactionRowProps {
  tx: Transaction;
  flagged: boolean;
  onToggleFlag: (hash: string) => void;
}

export default function TransactionRow({ tx, flagged, onToggleFlag }: TransactionRowProps) {
  const network = getNetwork(tx.network);
  const decimals = network?.decimals || 18;
  const amount = weiToEth(tx.value, decimals);
  const explorerUrl = getExplorerTxUrl(tx.network, tx.hash);

  const typeColors: Record<string, string> = {
    send: "text-red-400",
    receive: "text-green-400",
    contract: "text-blue-400",
    unknown: "text-luxbin-muted",
  };

  return (
    <tr className={`border-b border-luxbin-border hover:bg-luxbin-card/50 transition-colors ${flagged ? "bg-red-950/20" : ""}`}>
      <td className="py-3 px-3">
        <input
          type="checkbox"
          checked={flagged}
          onChange={() => onToggleFlag(tx.hash + tx.asset)}
          className="w-4 h-4 accent-luxbin-danger cursor-pointer"
        />
      </td>
      <td className="py-3 px-3 text-sm text-luxbin-muted whitespace-nowrap">
        {formatDate(tx.timestamp)}
      </td>
      <td className="py-3 px-3">
        <span className={`text-sm font-medium uppercase ${typeColors[tx.type]}`}>
          {tx.type}
        </span>
      </td>
      <td className="py-3 px-3 text-sm font-mono">
        {amount} <span className="text-luxbin-muted">{tx.asset}</span>
      </td>
      <td className="py-3 px-3 text-sm font-mono text-luxbin-muted">
        {truncateAddress(tx.from)}
      </td>
      <td className="py-3 px-3 text-sm font-mono text-luxbin-muted">
        {truncateAddress(tx.to)}
      </td>
      <td className="py-3 px-3">
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-luxbin-gold hover:text-luxbin-gold-light transition-colors font-mono"
        >
          {truncateAddress(tx.hash, 4)}
        </a>
      </td>
    </tr>
  );
}
