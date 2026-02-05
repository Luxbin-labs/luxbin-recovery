import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-xl bg-luxbin-gold flex items-center justify-center">
            <span className="text-luxbin-dark font-bold text-2xl">LX</span>
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          <span className="text-luxbin-gold">LUXBIN</span> Coinbase Recovery
        </h1>
        <p className="text-xl text-luxbin-muted max-w-2xl mx-auto">
          Free tool to investigate wallet transactions and generate formal complaint
          letters for regulatory agencies. No sign-up. No data stored.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        {[
          {
            title: "Pull Transaction History",
            desc: "Enter any EVM wallet address to fetch complete transaction history across Ethereum, Base, Polygon, Arbitrum, and Optimism.",
          },
          {
            title: "Flag Suspicious Activity",
            desc: "Review each transaction and flag unauthorized or suspicious transfers with one click.",
          },
          {
            title: "Generate Complaint Letters",
            desc: "Auto-generate formal complaint letters with full transaction evidence for CFPB, SEC, FTC, State AG, and Coinbase Legal.",
          },
          {
            title: "Download as PDF",
            desc: "Download letters as professional PDF documents or copy to clipboard. All generated locally in your browser.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="p-6 rounded-lg border border-luxbin-border bg-luxbin-card"
          >
            <h3 className="font-semibold text-luxbin-gold mb-2">{item.title}</h3>
            <p className="text-sm text-luxbin-muted">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/lookup"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-luxbin-gold text-luxbin-dark font-bold text-lg hover:bg-luxbin-gold-light transition-colors"
        >
          Start Recovery Process
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      <div className="mt-16 p-6 rounded-lg border border-luxbin-border bg-luxbin-card">
        <h2 className="font-semibold text-luxbin-gold mb-3">How It Works</h2>
        <ol className="space-y-3 text-sm text-luxbin-muted">
          <li>
            <strong className="text-luxbin-text">1. Look Up</strong> &mdash; Enter your wallet
            address and select the blockchain network. We pull your full transaction history
            using public block explorer APIs.
          </li>
          <li>
            <strong className="text-luxbin-text">2. Flag</strong> &mdash; Review your transactions
            and check the box next to any that are unauthorized or suspicious.
          </li>
          <li>
            <strong className="text-luxbin-text">3. Details</strong> &mdash; Enter your name,
            state, and describe what happened. This stays in your browser only.
          </li>
          <li>
            <strong className="text-luxbin-text">4. Generate</strong> &mdash; Get professionally
            formatted complaint letters with legal citations for each agency. Download as PDF
            or copy to clipboard.
          </li>
        </ol>
      </div>

      <div className="mt-8 p-4 rounded-lg border border-luxbin-border/50 text-center">
        <p className="text-xs text-luxbin-muted">
          This tool generates template complaint letters. It is not legal advice.
          All personal information stays in your browser and is never transmitted to any server.
          Only your wallet address is sent to public blockchain APIs to retrieve transaction data.
        </p>
      </div>
    </div>
  );
}
