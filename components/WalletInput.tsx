"use client";

import { SUPPORTED_NETWORKS } from "@/lib/networks";

interface WalletInputProps {
  address: string;
  network: string;
  onAddressChange: (address: string) => void;
  onNetworkChange: (network: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error?: string;
}

export default function WalletInput({
  address,
  network,
  onAddressChange,
  onNetworkChange,
  onSubmit,
  loading,
  error,
}: WalletInputProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-luxbin-muted mb-2">Network</label>
        <select
          value={network}
          onChange={(e) => onNetworkChange(e.target.value)}
          className="w-full"
        >
          {SUPPORTED_NETWORKS.filter((n) => n.id !== "solana-mainnet").map((n) => (
            <option key={n.id} value={n.id}>
              {n.name} ({n.nativeCurrency})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-luxbin-muted mb-2">Wallet Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder={network === "xrpl-mainnet" ? "r..." : "0x..."}
          className="w-full font-mono text-sm"
          spellCheck={false}
        />
      </div>

      {error && (
        <p className="text-luxbin-danger text-sm">{error}</p>
      )}

      <button
        onClick={onSubmit}
        disabled={loading || !address}
        className="w-full py-3 rounded-lg bg-luxbin-gold text-luxbin-dark font-semibold hover:bg-luxbin-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Fetching Transactions..." : "Look Up Transactions"}
      </button>
    </div>
  );
}
