"use client";

import { Agency } from "@/lib/types";
import { AGENCY_INFO } from "@/lib/letter-templates";

interface AgencySelectorProps {
  selected: Agency[];
  onChange: (agencies: Agency[]) => void;
}

export default function AgencySelector({ selected, onChange }: AgencySelectorProps) {
  function toggle(agency: Agency) {
    if (selected.includes(agency)) {
      onChange(selected.filter((a) => a !== agency));
    } else {
      onChange([...selected, agency]);
    }
  }

  function selectAll() {
    onChange(AGENCY_INFO.map((a) => a.id));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-luxbin-text">Select Agencies</h3>
        <button
          onClick={selectAll}
          className="text-sm text-luxbin-gold hover:text-luxbin-gold-light transition-colors"
        >
          Select All
        </button>
      </div>
      <p className="text-sm text-luxbin-muted">
        Choose which agencies to generate complaint letters for.
      </p>

      <div className="grid grid-cols-1 gap-3">
        {AGENCY_INFO.map((agency) => (
          <label
            key={agency.id}
            className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
              selected.includes(agency.id)
                ? "border-luxbin-gold bg-luxbin-gold/5"
                : "border-luxbin-border hover:border-luxbin-border/80"
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(agency.id)}
              onChange={() => toggle(agency.id)}
              className="mt-0.5 w-4 h-4 accent-luxbin-gold cursor-pointer"
            />
            <div>
              <div className="font-medium text-sm">
                <span className="text-luxbin-gold">{agency.name}</span>
                <span className="text-luxbin-muted"> &mdash; {agency.fullName}</span>
              </div>
              <p className="text-xs text-luxbin-muted mt-1">{agency.description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
