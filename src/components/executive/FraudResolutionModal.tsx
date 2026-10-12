import React, { useState } from 'react';
import { AlertOctagon, X, CheckCircle, ShieldAlert, ShieldCheck } from 'lucide-react';

interface FraudResolutionModalProps {
  customerName: string;
  registrationId: string;
  onConfirm: (resolution: 'CLEARED' | 'CONFIRMED_FRAUD', notes: string) => void;
  onClose: () => void;
}

export const FraudResolutionModal: React.FC<FraudResolutionModalProps> = ({
  customerName,
  registrationId,
  onConfirm,
  onClose
}) => {
  const [resolutionType, setResolutionType] = useState<'CLEARED' | 'CONFIRMED_FRAUD'>('CLEARED');
  const [notes, setNotes] = useState(
    'In-person branch verification confirmed genuine identity with physical stamped paper civil registrar certificate.'
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError('A formal justification note is mandatory for fraud investigation audit compliance.');
      return;
    }
    setError(null);
    onConfirm(resolutionType, notes.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-4 bg-rose-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-rose-800 text-rose-200">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-rose-100">Fraud Resolution Console</h3>
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900 leading-relaxed">
            <strong>Security Notice:</strong> Ordinary approval is disabled for suspected fraud cases. An authorized resolution is required to either unlock for manual credit evaluation or terminate and blacklist.
          </div>

          {/* Action Choice */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 block text-xs">
              Select Authorized Resolution Action:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setResolutionType('CLEARED');
                  setNotes('In-person branch verification confirmed genuine identity with physical stamped paper civil registrar certificate.');
                  setError(null);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  resolutionType === 'CLEARED'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Clear Flag & Unlock</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Valid paperwork confirmed. Return to Customer Care for standard credit decision.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setResolutionType('CONFIRMED_FRAUD');
                  setNotes('Confirmed identity impersonation on national fraud watchlist. Blacklisted across Sun King network.');
                  setError(null);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  resolutionType === 'CONFIRMED_FRAUD'
                    ? 'border-rose-500 bg-rose-50/70 text-rose-950 ring-2 ring-rose-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Confirm Fraud & Blacklist</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Reject permanently and add national ID number to cross-branch fraud blocklist.
                </p>
              </button>
            </div>
          </div>

          {/* Justification Notes */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">
              Official Resolution Justification & Audit Notes *
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                if (error) setError(null);
              }}
              placeholder="State formal findings, physical registrar certificates inspected, or watchlist records..."
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            {error && (
              <p className="text-rose-600 font-semibold text-[11px]">{error}</p>
            )}
          </div>

          {/* Quick presets for common justifications */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Quick Justification Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setNotes('In-person branch verification confirmed genuine identity with physical stamped paper civil registrar certificate.')}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-700 font-medium"
              >
                Branch Stamped Paper Cert
              </button>
              <button
                type="button"
                onClick={() => setNotes('Area Chief letter of introduction provided confirming customer residence and legal name.')}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-700 font-medium"
              >
                Local Area Chief Letter
              </button>
              <button
                type="button"
                onClick={() => setNotes('Customer telecommunication registered SIM card verified in carrier shop with original physical ID.')}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-700 font-medium"
              >
                Carrier Shop SIM Proof
              </button>
            </div>
          </div>

          {/* Action buttons */}
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
              className={`px-4 py-2 rounded-xl text-white font-extrabold text-xs shadow-md transition-all ${
                resolutionType === 'CLEARED'
                  ? 'bg-emerald-600 hover:bg-emerald-500'
                  : 'bg-rose-700 hover:bg-rose-600'
              }`}
            >
              {resolutionType === 'CLEARED' ? 'Authorize & Clear Flag' : 'Confirm Fraud & Reject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
