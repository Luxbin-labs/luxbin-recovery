"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "@/components/StepIndicator";
import TransactionTable from "@/components/TransactionTable";
import { SessionData, Transaction } from "@/lib/types";
import { truncateAddress } from "@/lib/format-utils";
import { getNetwork } from "@/lib/networks";

export default function TransactionsPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [flaggedKeys, setFlaggedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const raw = sessionStorage.getItem("luxbin_session");
    if (!raw) {
      router.push("/lookup");
      return;
    }
    const data = JSON.parse(raw) as SessionData;
    setSession(data);
    // Restore any previously flagged
    const prevFlagged = data.flaggedTransactions?.map((tx: Transaction) => tx.hash + tx.asset) || [];
    setFlaggedKeys(new Set(prevFlagged));
  }, [router]);

  function toggleFlag(key: string) {
    setFlaggedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function flagAll() {
    if (!session) return;
    setFlaggedKeys(new Set(session.transactions.map((tx) => tx.hash + tx.asset)));
  }

  function clearFlags() {
    setFlaggedKeys(new Set());
  }

  function handleContinue() {
    if (!session) return;
    const flagged = session.transactions.filter((tx) =>
      flaggedKeys.has(tx.hash + tx.asset)
    );
    const updated = { ...session, flaggedTransactions: flagged };
    sessionStorage.setItem("luxbin_session", JSON.stringify(updated));
    router.push("/generate");
  }

  if (!session) return null;

  const network = getNetwork(session.network);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <StepIndicator currentStep={2} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Transaction History</h1>
        <p className="text-sm text-luxbin-muted">
          <span className="font-mono text-luxbin-text">{truncateAddress(session.walletAddress)}</span>
          {" on "}
          <span className="text-luxbin-gold">{network?.name || session.network}</span>
          {" \u2014 Flag any unauthorized or suspicious transactions."}
        </p>
      </div>

      <TransactionTable
        transactions={session.transactions}
        flaggedKeys={flaggedKeys}
        onToggleFlag={toggleFlag}
        onFlagAll={flagAll}
        onClearFlags={clearFlags}
      />

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => router.push("/lookup")}
          className="px-4 py-2 text-sm rounded-lg border border-luxbin-border text-luxbin-muted hover:text-luxbin-text transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={flaggedKeys.size === 0}
          className="px-6 py-3 rounded-lg bg-luxbin-gold text-luxbin-dark font-semibold hover:bg-luxbin-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue with {flaggedKeys.size} Flagged Transaction{flaggedKeys.size !== 1 ? "s" : ""}
        </button>
      </div>
    </div>
  );
}
