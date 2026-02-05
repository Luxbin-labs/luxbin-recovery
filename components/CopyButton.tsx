"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-2 text-sm rounded-lg border border-luxbin-border hover:border-luxbin-gold text-luxbin-text hover:text-luxbin-gold transition-colors"
    >
      {copied ? "Copied!" : "Copy to Clipboard"}
    </button>
  );
}
