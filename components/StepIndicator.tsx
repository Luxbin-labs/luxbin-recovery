"use client";

const STEPS = [
  { num: 1, label: "Lookup" },
  { num: 2, label: "Transactions" },
  { num: 3, label: "Details" },
  { num: 4, label: "Letters" },
];

export default function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
      {STEPS.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step.num === currentStep
                  ? "bg-luxbin-gold text-luxbin-dark"
                  : step.num < currentStep
                  ? "bg-luxbin-gold/20 text-luxbin-gold border border-luxbin-gold"
                  : "bg-luxbin-card text-luxbin-muted border border-luxbin-border"
              }`}
            >
              {step.num < currentStep ? "\u2713" : step.num}
            </div>
            <span
              className={`text-sm hidden sm:inline ${
                step.num === currentStep ? "text-luxbin-gold font-medium" : "text-luxbin-muted"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-8 sm:w-12 h-px mx-1 sm:mx-2 ${
                step.num < currentStep ? "bg-luxbin-gold" : "bg-luxbin-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
