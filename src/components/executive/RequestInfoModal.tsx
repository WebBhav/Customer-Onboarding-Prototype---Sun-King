import React, { useState } from 'react';
import { RequestedInformationField } from '../../types';
import { AlertTriangle, X, CheckSquare, Square, Send } from 'lucide-react';

interface RequestInfoModalProps {
  customerName: string;
  registrationId: string;
  onConfirm: (fields: RequestedInformationField[], comment: string) => void;
  onClose: () => void;
}

const FIELD_OPTIONS: Array<{ id: RequestedInformationField; label: string; desc: string }> = [
  {
    id: 'RETAKE_NATIONAL_ID_PHOTO',
    label: 'Retake National ID Card Photo',
    desc: 'Image is unreadable, glare obscures text, or corners are cropped.'
  },
  {
    id: 'CORRECT_NATIONAL_ID_NUMBER',
    label: 'Correct National ID Number',
    desc: 'Entered ID number does not match image or civil registry.'
  },
  {
    id: 'RETAKE_CUSTOMER_WITH_ID_PHOTO',
    label: 'Retake Customer Holding ID Photo',
    desc: 'Customer face or card is not clearly identifiable together.'
  },
  {
    id: 'RERECORD_CUSTOMER_VIDEO',
    label: 'Re-record Customer Verification Video',
    desc: 'Video was under 8 seconds, audio missing, or script incomplete.'
  },
  {
    id: 'COMPLETE_OTP_VERIFICATION',
    label: 'Complete Phone OTP Verification',
    desc: 'Phone number verification was deferred or skipped in the field.'
  },
  {
    id: 'SUBMIT_BANK_STATEMENT',
    label: 'Submit Bank / M-Pesa 6-Month History',
    desc: 'Required for high-value solar product financing assessment.'
  },
  {
    id: 'CORRECT_CUSTOMER_DETAILS',
    label: 'Correct Missing Customer Details',
    desc: 'Legal name misspelling or address mismatch.'
  }
];

export const RequestInfoModal: React.FC<RequestInfoModalProps> = ({
  customerName,
  registrationId,
  onConfirm,
  onClose
}) => {
  const [selectedFields, setSelectedFields] = useState<RequestedInformationField[]>([
    'RETAKE_NATIONAL_ID_PHOTO'
  ]);
  const [comment, setComment] = useState(
    'Please recapture the requested evidence clearly and resubmit for immediate review.'
  );
  const [error, setError] = useState<string | null>(null);

  const toggleField = (field: RequestedInformationField) => {
    setError(null);
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFields.length === 0) {
      setError('Please select at least one field or evidence item to request from the field agent.');
      return;
    }
    setError(null);
    onConfirm(selectedFields, comment.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm">Request Information from Field Agent</h3>
              <p className="text-[11px] text-slate-300">
                {customerName} • {registrationId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          <p className="text-slate-600">
            Select the specific fields or evidence items that require correction. The field agent will be alerted in their mobile app to update only these items, preserving the original registration ID.
          </p>

          <div className="space-y-2">
            <span className="font-bold text-slate-900 block">Requested Items:</span>
            {FIELD_OPTIONS.map((opt) => {
              const isChecked = selectedFields.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => toggleField(opt.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    isChecked
                      ? 'border-amber-400 bg-amber-50/50 text-amber-950 font-medium'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="mt-0.5 text-amber-600">
                    {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div>
                    <span className="font-bold block text-slate-900">{opt.label}</span>
                    <span className="text-[11px] text-slate-500 font-normal">{opt.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className="font-bold text-slate-900 block mb-1">
              Instructions / Comment for Agent *
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Provide specific, friendly guidance to help the field agent capture valid evidence on the first retry..."
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
              required
            />
            {error && (
              <p className="text-rose-600 font-bold mt-1.5 p-2 bg-rose-50 rounded-lg border border-rose-200">
                {error}
              </p>
            )}
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
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Request to Agent</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
