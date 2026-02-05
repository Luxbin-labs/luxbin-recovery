"use client";

import { PersonalDetails } from "@/lib/types";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming", "District of Columbia",
];

interface PersonalDetailsFormProps {
  details: PersonalDetails;
  onChange: (details: PersonalDetails) => void;
}

export default function PersonalDetailsForm({ details, onChange }: PersonalDetailsFormProps) {
  function update(field: keyof PersonalDetails, value: string) {
    onChange({ ...details, [field]: value });
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-luxbin-text">Your Information</h3>
      <p className="text-sm text-luxbin-muted">
        This information is used only to generate your letters. It never leaves your browser.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-luxbin-muted mb-1">Full Name</label>
          <input
            type="text"
            value={details.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="John Doe"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm text-luxbin-muted mb-1">Email Address</label>
          <input
            type="email"
            value={details.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="john@example.com"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm text-luxbin-muted mb-1">State of Residence</label>
          <select
            value={details.state}
            onChange={(e) => update("state", e.target.value)}
            className="w-full"
          >
            <option value="">Select State...</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-luxbin-muted mb-1">Estimated Loss (USD)</label>
          <input
            type="text"
            value={details.estimatedLoss}
            onChange={(e) => update("estimatedLoss", e.target.value)}
            placeholder="$5,000"
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-luxbin-muted mb-1">Incident Description</label>
        <textarea
          value={details.incidentDescription}
          onChange={(e) => update("incidentDescription", e.target.value)}
          placeholder="Describe what happened: when you noticed unauthorized transactions, what steps you've taken, any communication with Coinbase support, etc."
          rows={5}
          className="w-full"
        />
      </div>
    </div>
  );
}
