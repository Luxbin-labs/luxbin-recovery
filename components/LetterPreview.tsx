"use client";

import { GeneratedLetter } from "@/lib/types";
import CopyButton from "./CopyButton";
import dynamic from "next/dynamic";
import { useState } from "react";

const LetterPDF = dynamic(() => import("./LetterPDF"), { ssr: false });

export default function LetterPreview({ letter }: { letter: GeneratedLetter }) {
  const [showPdf, setShowPdf] = useState(false);

  return (
    <div className="rounded-lg border border-luxbin-border overflow-hidden">
      <div className="bg-luxbin-card px-4 py-3 flex items-center justify-between border-b border-luxbin-border">
        <div>
          <h3 className="font-semibold text-sm text-luxbin-gold">{letter.agencyName}</h3>
          <p className="text-xs text-luxbin-muted mt-0.5">{letter.subject}</p>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={letter.body} />
          <button
            onClick={() => setShowPdf(!showPdf)}
            className="px-4 py-2 text-sm rounded-lg bg-luxbin-gold text-luxbin-dark font-medium hover:bg-luxbin-gold-light transition-colors"
          >
            {showPdf ? "Hide PDF" : "Download PDF"}
          </button>
        </div>
      </div>

      {showPdf && <LetterPDF letter={letter} />}

      <details className="group">
        <summary className="px-4 py-3 text-sm text-luxbin-muted cursor-pointer hover:text-luxbin-text transition-colors">
          Preview Letter Text
        </summary>
        <div className="px-4 pb-4">
          <pre className="whitespace-pre-wrap text-sm text-luxbin-text font-mono bg-luxbin-darker p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">
            {letter.body}
          </pre>
        </div>
      </details>
    </div>
  );
}
