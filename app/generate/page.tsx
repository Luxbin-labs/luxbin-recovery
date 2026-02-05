"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "@/components/StepIndicator";
import PersonalDetailsForm from "@/components/PersonalDetailsForm";
import AgencySelector from "@/components/AgencySelector";
import { Agency, PersonalDetails, SessionData } from "@/lib/types";
import { generateAllLetters } from "@/lib/letter-templates";

export default function GeneratePage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [details, setDetails] = useState<PersonalDetails>({
    fullName: "",
    email: "",
    state: "",
    walletAddress: "",
    network: "",
    incidentDescription: "",
    estimatedLoss: "",
  });
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem("luxbin_session");
    if (!raw) {
      router.push("/lookup");
      return;
    }
    const data = JSON.parse(raw) as SessionData;
    if (!data.flaggedTransactions || data.flaggedTransactions.length === 0) {
      router.push("/transactions");
      return;
    }
    setSession(data);
    setDetails((d) => ({
      ...d,
      walletAddress: data.walletAddress,
      network: data.network,
    }));
    // Restore previous selections if any
    if (data.personalDetails) setDetails(data.personalDetails);
    if (data.selectedAgencies?.length) setAgencies(data.selectedAgencies);
  }, [router]);

  function handleGenerate() {
    setError("");
    if (!details.fullName || !details.email || !details.state) {
      setError("Please fill in your name, email, and state.");
      return;
    }
    if (!details.incidentDescription) {
      setError("Please describe what happened.");
      return;
    }
    if (agencies.length === 0) {
      setError("Please select at least one agency.");
      return;
    }
    if (!session) return;

    const letters = generateAllLetters(agencies, details, session.flaggedTransactions);
    const updated: SessionData = {
      ...session,
      personalDetails: details,
      selectedAgencies: agencies,
      generatedLetters: letters,
    };
    sessionStorage.setItem("luxbin_session", JSON.stringify(updated));
    router.push("/letters");
  }

  if (!session) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <StepIndicator currentStep={3} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Generate Complaint Letters</h1>
        <p className="text-sm text-luxbin-muted">
          {session.flaggedTransactions.length} flagged transaction
          {session.flaggedTransactions.length !== 1 ? "s" : ""} selected.
          Fill in your details and choose which agencies to file with.
        </p>
      </div>

      <div className="space-y-8">
        <div className="rounded-lg border border-luxbin-border bg-luxbin-card p-6">
          <PersonalDetailsForm details={details} onChange={setDetails} />
        </div>

        <div className="rounded-lg border border-luxbin-border bg-luxbin-card p-6">
          <AgencySelector selected={agencies} onChange={setAgencies} />
        </div>

        {error && (
          <p className="text-luxbin-danger text-sm text-center">{error}</p>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/transactions")}
            className="px-4 py-2 text-sm rounded-lg border border-luxbin-border text-luxbin-muted hover:text-luxbin-text transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleGenerate}
            className="px-6 py-3 rounded-lg bg-luxbin-gold text-luxbin-dark font-semibold hover:bg-luxbin-gold-light transition-colors"
          >
            Generate {agencies.length} Letter{agencies.length !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
