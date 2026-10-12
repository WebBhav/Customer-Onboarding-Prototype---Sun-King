import React, { useState } from 'react';
import { AlertOctagon, X, AlertTriangle } from 'lucide-react';

interface EscalateFraudModalProps {
  customerName: string;
  registrationId: string;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

const PRESET_REASONS = [
  'National ID card photo indicates physical alterations or digital tampering',
  'Customer video statement does not match identity details provided in national registry',
  'Multiple registration attempts detected with mismatched names across different agent hubs',
  'Suspicious telecommunication SIM registration alert flagged by network carrier',
  'Identity impersonation inquiry reported by regional branch operations'
];

export const EscalateFraudModal: React.FC<EscalateFraudModalProps> = ({
  customerName,
  registrationId,
  onConfirm,
  onClose
}) => {
  const [reason, setReason] = useState(PRESET_REASONS[0]);
  const [customDetail, setCustomDetail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = customDetail.trim() ? `${reason} — ${customDetail.trim()}` : reason;
    if (!finalReason.trim()) {
      setError('Please provide a specific security reason for escalating to Fraud Review.');
      return;
    }
    setError(null);
    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-4 bg-rose-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-300" />
            <div>
              <h3 className="font-extrabold text-sm text-rose-100">Escalate to Fraud Unit</h3>
              <p className="text-[11px] text-rose-300">
                {customerName} • <span className="font-mono">{registrationId}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-rose-300 hover:text-white hover:bg-rose-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-[11px] leading-relaxed flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p>
              Escalating will immediately <strong>freeze this application</strong>, engage hardware equipment locks, and <strong>disable ordinary executive approval</strong> until formally investigated.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">
              Primary Fraud Concern Category:
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              {PRESET_REASONS.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">
              Additional Specific Findings (Optional):
            </label>
            <textarea
              rows={2}
              value={customDetail}
              onChange={(e) => {
                setCustomDetail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Card font differs from standard civil registry template; numbers printed with inconsistent spacing."
              className="w-full p-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            {error && <p className="text-rose-600 font-semibold">{error}</p>}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-extrabold text-xs shadow-md"
            >
              Confirm Fraud Escalation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
