import React, { useState } from 'react';
import { XCircle, X, AlertOctagon } from 'lucide-react';

interface RejectModalProps {
  customerName: string;
  registrationId: string;
  onConfirm: (reasonCode: string, explanation: string) => void;
  onClose: () => void;
}

const REJECTION_REASONS = [
  { code: 'ID_RECORD_NOT_FOUND', label: 'Civil Registry: National ID Does Not Exist' },
  { code: 'CONFIRMED_FRAUD_WATCHLIST', label: 'Fraud Unit: Confirmed Identity Theft / Impersonation' },
  { code: 'POLICY_INELIGIBLE_LOCATION', label: 'Credit Policy: Delinquent History or Ineligible Territory' },
  { code: 'UNDERAGE_APPLICANT', label: 'Policy Failure: Applicant is Under 18 Years Old' },
  { code: 'UNRESOLVED_EXPIRED_EVIDENCE', label: 'Unresolved Evidence: Timed Out After Multiple Retries' }
];

export const RejectModal: React.FC<RejectModalProps> = ({
  customerName,
  registrationId,
  onConfirm,
  onClose
}) => {
  const [reasonCode, setReasonCode] = useState(REJECTION_REASONS[0].code);
  const [explanation, setExplanation] = useState(
    'National ID card could not be validated against official population database after multiple attempts.'
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!explanation.trim()) {
      setError('A clear explanation is required for customer audit records.');
      return;
    }
    setError(null);
    onConfirm(reasonCode, explanation.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200">
        <div className="p-4 bg-rose-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-300" />
            <div>
              <h3 className="font-bold text-sm">Reject Application</h3>
              <p className="text-[11px] text-rose-200">
                {customerName} • {registrationId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-rose-300 hover:text-white hover:bg-rose-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-[11px] leading-relaxed">
            Warning: Rejection terminates this application. A structured reason code and clear audit justification are permanently recorded.
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Select Official Policy Reason Code *
            </label>
            <select
              value={reasonCode}
              onChange={(e) => setReasonCode(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-rose-500"
            >
              {REJECTION_REASONS.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Human-Readable Explanation *
            </label>
            <textarea
              rows={3}
              value={explanation}
              onChange={(e) => {
                setExplanation(e.target.value);
                if (error) setError(null);
              }}
              placeholder="State the conclusive reason for rejecting this registration..."
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              required
            />
            {error && <p className="text-rose-600 font-bold mt-1">{error}</p>}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold flex items-center gap-1.5 shadow-md shadow-rose-600/30"
            >
              <XCircle className="w-4 h-4" />
              <span>Confirm Permanent Rejection</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
