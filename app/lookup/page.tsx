"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "@/components/StepIndicator";
import WalletInput from "@/components/WalletInput";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Transaction } from "@/lib/types";

export default function LookupPage() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState("base-mainnet");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `/api/transactions?address=${encodeURIComponent(address)}&network=${encodeURIComponent(network)}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to fetch transactions");
        return;
      }

      // Store in sessionStorage
      sessionStorage.setItem(
        "luxbin_session",
        JSON.stringify({
          walletAddress: address,
          network,
          transactions: data.transactions as Transaction[],
          flaggedTransactions: [],
          personalDetails: null,
          selectedAgencies: [],
          generatedLetters: [],
        })
      );

      router.push("/transactions");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <StepIndicator currentStep={1} />

      <div className="rounded-lg border border-luxbin-border bg-luxbin-card p-6">
        <h1 className="text-2xl font-bold mb-2">Wallet Lookup</h1>
        <p className="text-sm text-luxbin-muted mb-6">
          Enter a wallet address to pull its full transaction history. Only the
          wallet address is sent to public blockchain APIs.
        </p>

        {loading ? (
          <LoadingSpinner message="Fetching transaction history..." />
        ) : (
          <WalletInput
            address={address}
            network={network}
            onAddressChange={setAddress}
            onNetworkChange={setNetwork}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  );
}
