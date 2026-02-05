"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-luxbin-border bg-luxbin-dark/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-luxbin-gold flex items-center justify-center">
            <span className="text-luxbin-dark font-bold text-sm">LX</span>
          </div>
          <span className="text-xl font-bold text-luxbin-gold">
            LUXBIN <span className="text-luxbin-text font-normal text-sm">Coinbase Recovery</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-luxbin-muted">
          <Link href="/lookup" className="hover:text-luxbin-gold transition-colors">
            Lookup
          </Link>
          <a
            href="https://www.consumerfinance.gov/complaint/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-luxbin-gold transition-colors"
          >
            CFPB Portal
          </a>
        </nav>
      </div>
    </header>
  );
}
