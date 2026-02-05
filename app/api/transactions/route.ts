import { NextRequest, NextResponse } from "next/server";
import { fetchTransactions } from "@/lib/cdp-transactions";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const network = searchParams.get("network");
  const page = parseInt(searchParams.get("page") || "1");

  if (!address) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
  }

  if (!network) {
    return NextResponse.json({ error: "Network is required" }, { status: 400 });
  }

  // Basic address validation
  if (network === "xrpl-mainnet") {
    if (!/^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(address)) {
      return NextResponse.json({ error: "Invalid XRP Ledger address (should start with 'r')" }, { status: 400 });
    }
  } else if (network !== "solana-mainnet") {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json({ error: "Invalid EVM wallet address" }, { status: 400 });
    }
  }

  try {
    const result = await fetchTransactions(address, network, page);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch transactions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
