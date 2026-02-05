"use client";

import { Transaction } from "@/lib/types";
import TransactionRow from "./TransactionRow";

interface TransactionTableProps {
  transactions: Transaction[];
  flaggedKeys: Set<string>;
  onToggleFlag: (key: string) => void;
  onFlagAll: () => void;
  onClearFlags: () => void;
}

export default function TransactionTable({
  transactions,
  flaggedKeys,
  onToggleFlag,
  onFlagAll,
  onClearFlags,
}: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-luxbin-muted">
        No transactions found for this address.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-luxbin-muted">
          {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} found
          {flaggedKeys.size > 0 && (
            <span className="text-luxbin-danger ml-2">
              ({flaggedKeys.size} flagged)
            </span>
          )}
        </p>
        <div className="flex gap-2">
          <button
            onClick={onFlagAll}
            className="px-3 py-1.5 text-xs rounded-lg border border-luxbin-danger/50 text-luxbin-danger hover:bg-luxbin-danger/10 transition-colors"
          >
            Flag All
          </button>
          <button
            onClick={onClearFlags}
            className="px-3 py-1.5 text-xs rounded-lg border border-luxbin-border text-luxbin-muted hover:text-luxbin-text transition-colors"
          >
            Clear Flags
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-luxbin-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-luxbin-border bg-luxbin-card">
              <th className="py-3 px-3 text-left text-xs font-medium text-luxbin-muted uppercase tracking-wider w-10">
                Flag
              </th>
              <th className="py-3 px-3 text-left text-xs font-medium text-luxbin-muted uppercase tracking-wider">
                Date
              </th>
              <th className="py-3 px-3 text-left text-xs font-medium text-luxbin-muted uppercase tracking-wider">
                Type
              </th>
              <th className="py-3 px-3 text-left text-xs font-medium text-luxbin-muted uppercase tracking-wider">
                Amount
              </th>
              <th className="py-3 px-3 text-left text-xs font-medium text-luxbin-muted uppercase tracking-wider">
                From
              </th>
              <th className="py-3 px-3 text-left text-xs font-medium text-luxbin-muted uppercase tracking-wider">
                To
              </th>
              <th className="py-3 px-3 text-left text-xs font-medium text-luxbin-muted uppercase tracking-wider">
                TX Hash
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <TransactionRow
                key={tx.hash + tx.asset}
                tx={tx}
                flagged={flaggedKeys.has(tx.hash + tx.asset)}
                onToggleFlag={onToggleFlag}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
