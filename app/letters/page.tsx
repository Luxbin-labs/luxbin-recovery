"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "@/components/StepIndicator";
import LetterPreview from "@/components/LetterPreview";
import { SessionData } from "@/lib/types";

export default function LettersPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("luxbin_session");
    if (!raw) {
      router.push("/lookup");
      return;
    }
    const data = JSON.parse(raw) as SessionData;
    if (!data.generatedLetters || data.generatedLetters.length === 0) {
      router.push("/generate");
      return;
    }
    setSession(data);
  }, [router]);

  if (!session) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <StepIndicator currentStep={4} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Your Complaint Letters</h1>
        <p className="text-sm text-luxbin-muted">
          {session.generatedLetters.length} letter
          {session.generatedLetters.length !== 1 ? "s" : ""} generated.
          Copy to clipboard or download as PDF.
        </p>
      </div>

      <div className="space-y-6">
        {session.generatedLetters.map((letter) => (
          <LetterPreview key={letter.agency} letter={letter} />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => router.push("/generate")}
          className="px-4 py-2 text-sm rounded-lg border border-luxbin-border text-luxbin-muted hover:text-luxbin-text transition-colors"
        >
          Back to Edit
        </button>
        <button
          onClick={() => {
            sessionStorage.removeItem("luxbin_session");
            router.push("/");
          }}
          className="px-4 py-2 text-sm rounded-lg border border-luxbin-border text-luxbin-muted hover:text-luxbin-text transition-colors"
        >
          Start Over
        </button>
      </div>

      <div className="mt-8 p-4 rounded-lg border border-luxbin-border/50">
        <h3 className="text-sm font-semibold text-luxbin-gold mb-2">Next Steps</h3>
        <ul className="space-y-2 text-sm text-luxbin-muted">
          <li>
            <strong className="text-luxbin-text">CFPB:</strong> File at{" "}
            <a href="https://www.consumerfinance.gov/complaint/" target="_blank" rel="noopener noreferrer" className="text-luxbin-gold hover:underline">
              consumerfinance.gov/complaint
            </a>
          </li>
          <li>
            <strong className="text-luxbin-text">FTC:</strong> File at{" "}
            <a href="https://reportfraud.ftc.gov/" target="_blank" rel="noopener noreferrer" className="text-luxbin-gold hover:underline">
              reportfraud.ftc.gov
            </a>
          </li>
          <li>
            <strong className="text-luxbin-text">SEC:</strong> File at{" "}
            <a href="https://www.sec.gov/tcr" target="_blank" rel="noopener noreferrer" className="text-luxbin-gold hover:underline">
              sec.gov/tcr
            </a>
          </li>
          <li>
            <strong className="text-luxbin-text">State AG:</strong> Search for your state&apos;s Attorney General consumer complaint portal.
          </li>
          <li>
            <strong className="text-luxbin-text">Coinbase:</strong> Send to{" "}
            <span className="text-luxbin-gold">legal@coinbase.com</span> via certified mail and email.
          </li>
        </ul>
      </div>
    </div>
  );
}
