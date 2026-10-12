import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RegistrationApplication, RequestedInformationField } from '../../types';
import { CameraModal } from './CameraModal';
import { VideoRecordModal } from './VideoRecordModal';
import { VerificationResultPanel } from '../common/VerificationResultPanel';
import {
  ChevronLeft,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  User,
  ShieldCheck,
  Video,
  Camera,
  RotateCcw,
  Send,
  Calendar,
  MapPin,
  Smartphone,
  Info
} from 'lucide-react';
import { MOCK_IMAGES } from '../../data/seedData';

interface FieldAgentCaseDetailProps {
  applicationId: string;
  onBack: () => void;
}

export const FieldAgentCaseDetail: React.FC<FieldAgentCaseDetailProps> = ({ applicationId, onBack }) => {
  const { applications, resubmitCaseCorrection, fieldAgent } = useApp();
  const app = applications.find((a) => a.id === applicationId);

  const [activeCameraType, setActiveCameraType] = useState<'CUSTOMER_HOLDING_ID' | 'NATIONAL_ID_CARD' | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Field edit states for corrections
  const [correctedIdPhoto, setCorrectedIdPhoto] = useState<string | null>(null);
  const [correctedHoldingPhoto, setCorrectedHoldingPhoto] = useState<string | null>(null);
  const [correctedIdNumber, setCorrectedIdNumber] = useState<string>(app?.evidence.nationalIdNumber || '');
  const [correctedVideoUrl, setCorrectedVideoUrl] = useState<string | null>(null);
  const [correctedBankStatement, setCorrectedBankStatement] = useState<string | null>(null);
  const [showResubmitSuccess, setShowResubmitSuccess] = useState(false);

  if (!app) {
    return (
      <div className="p-4 text-center">
        <p className="text-slate-500 text-sm">Application not found.</p>
        <button onClick={onBack} className="mt-2 text-amber-600 font-bold text-xs">
          Return to list
        </button>
      </div>
    );
  }

  const isNeedsInfo = app.status === 'NEEDS_INFORMATION';
  const requestedFields = app.requestedInformation?.fields || [];

  const handleResubmit = () => {
    resubmitCaseCorrection(app.id, {
      idPhotoUrl: correctedIdPhoto || undefined,
      customerHoldingIdUrl: correctedHoldingPhoto || undefined,
      idNumber: correctedIdNumber !== app.evidence.nationalIdNumber ? correctedIdNumber : undefined,
      videoUrl: correctedVideoUrl || undefined,
      bankStatementUrl: correctedBankStatement ? 'mock-bank-statement-resubmitted.pdf' : undefined,
      bankStatementFileName: correctedBankStatement ? 'Mpesa_Statement_6mo_Resubmitted.pdf' : undefined
    });

    setShowResubmitSuccess(true);
    setTimeout(() => {
      setShowResubmitSuccess(false);
      onBack();
    }, 1500);
  };

  const getStatusBadge = () => {
    switch (app.status) {
      case 'AUTO_APPROVED':
      case 'MANUALLY_APPROVED':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold px-2.5 py-0.5 rounded-full text-xs">Approved</span>;
      case 'NEEDS_INFORMATION':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-2.5 py-0.5 rounded-full text-xs animate-pulse">Action Required</span>;
      case 'SUSPECTED_FRAUD':
      case 'REJECTED':
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 font-extrabold px-2.5 py-0.5 rounded-full text-xs">Blocked / Rejected</span>;
      default:
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 font-extrabold px-2.5 py-0.5 rounded-full text-xs">Pending Verification</span>;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen pb-20 shadow-md">
      {/* Header */}
      <div className="bg-[#0B192C] text-white p-3.5 sticky top-12 z-20 shadow-xs flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to List
        </button>
        <span className="font-mono text-xs font-bold text-amber-400">
          Ref: {app.id}
        </span>
        <div>{getStatusBadge()}</div>
      </div>

      <div className="p-4 space-y-4">
        {/* Real-time Verification State Machine Status */}
        <VerificationResultPanel application={app} mode="FIELD_AGENT" />

        {/* ========================================================
            ID NOT FOUND (Civil Registry Failure Handling)
        ======================================================== */}
        {app.verification.stateMachineState === 'BLOCKED_NOT_FOUND' && (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <h3 className="font-extrabold text-sm text-rose-950">
                  National ID Not Found in Registry Records
                </h3>
                <p className="text-[11px] text-rose-800">
                  {app.evidence.idNumberCorrectionCount < 1
                    ? '1 correction attempt permitted for field agent. Verify digits against customer physical ID card.'
                    : 'Correction limit reached (1 attempt used). Routed to Customer Care for manual registry inquiry.'}
                </p>
              </div>
            </div>

            {app.evidence.idNumberCorrectionCount < 1 ? (
              <div className="bg-white p-3 rounded-xl border border-rose-200 space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  Correct National ID Number:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={correctedIdNumber}
                    onChange={(e) => setCorrectedIdNumber(e.target.value)}
                    placeholder="Enter correct ID digits"
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleResubmit}
                    className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xs"
                  >
                    Resubmit ID
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-rose-100/70 text-xs text-rose-900 font-semibold text-center">
                Manual Review in Progress by Customer Care Executive
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            ACTION REQUIRED BANNER (If Executive Requested Info)
        ======================================================== */}
        {isNeedsInfo && (
          <div className="bg-amber-500/10 border-2 border-amber-400 rounded-2xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <h3 className="font-extrabold text-sm text-amber-950">
                  Action Required by Field Agent
                </h3>
                <p className="text-[11px] text-amber-800">
                  Customer Care Executive requested corrections for this registration.
                </p>
              </div>
            </div>

            {/* Executive Comment */}
            {app.requestedInformation && (
              <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs text-slate-800 space-y-1">
                <span className="font-bold text-slate-900 block">
                  Executive Note ({app.requestedInformation.requestedBy}):
                </span>
                <p className="italic text-slate-700">
                  "{app.requestedInformation.comment}"
                </p>
              </div>
            )}

            {/* In-Place Resolution Form */}
            <div className="space-y-3 pt-1">
              <span className="text-xs font-bold text-amber-950 block">
                Update Requested Evidence:
              </span>

              {/* Case A: Retake ID Photo */}
              {requestedFields.includes('RETAKE_NATIONAL_ID_PHOTO') && (
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      1. National ID Photo Recapture
                    </span>
                    {correctedIdPhoto && (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" /> Ready
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveCameraType('NATIONAL_ID_CARD')}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    {correctedIdPhoto ? 'Retake Sharp ID Card Photo' : 'Capture Sharp ID Photo (No Glare)'}
                  </button>
                </div>
              )}

              {/* Case B: Correct National ID Number */}
              {requestedFields.includes('CORRECT_NATIONAL_ID_NUMBER') && (
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    2. Correct National ID Number
                  </label>
                  <input
                    type="text"
                    value={correctedIdNumber}
                    onChange={(e) => setCorrectedIdNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono font-bold"
                  />
                </div>
              )}

              {/* Case C: Customer with ID Photo */}
              {requestedFields.includes('RETAKE_CUSTOMER_WITH_ID_PHOTO') && (
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">
                    3. Customer Holding ID Photo
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveCameraType('CUSTOMER_HOLDING_ID')}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Recapture Customer Holding ID
                  </button>
                </div>
              )}

              {/* Case D: Re-record Video */}
              {requestedFields.includes('RERECORD_CUSTOMER_VIDEO') && (
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Customer Consent Video (Min 8s)
                    </span>
                    {correctedVideoUrl && (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" /> Re-recorded
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowVideoModal(true)}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Re-Record Customer Video Statement
                  </button>
                </div>
              )}

              {/* Case E: Submit Bank Statement */}
              {requestedFields.includes('SUBMIT_BANK_STATEMENT') && (
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      M-Pesa / Bank Statement (6 Months)
                    </span>
                    {correctedBankStatement && (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" /> Attached
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCorrectedBankStatement('Mpesa_Statement_6mo_Resubmitted.pdf')}
                    className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-purple-700" />
                    Attach M-Pesa 6-Month Statement
                  </button>
                </div>
              )}

              {/* Resubmit CTA Button */}
              <button
                type="button"
                onClick={handleResubmit}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Resubmit Corrections (Preserves Reg ID)
              </button>

              {showResubmitSuccess && (
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold text-center">
                  Successfully resubmitted! Moving back into verification workflow.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Customer & Product Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {app.customer.fullName}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{app.customer.location}</span>
              </div>
            </div>

            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                app.valueCategory === 'HIGH_VALUE'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {app.valueCategory.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
            <div>
              <span className="text-slate-500 block">Phone:</span>
              <span className="font-bold text-slate-800 font-mono">
                {app.customer.countryCode} {app.customer.phoneNumber}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">National ID:</span>
              <span className="font-bold text-slate-800 font-mono">
                {app.evidence.nationalIdNumber}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Solar Product:</span>
              <span className="font-bold text-slate-800">
                {app.product.name}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">PAYG Rate:</span>
              <span className="font-bold text-amber-600">
                KSh {app.product.dailyRateKsh}/day
              </span>
            </div>
          </div>
        </div>

        {/* Verification Status Overview */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
            Verification Checks Breakdown
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-600">Phone OTP Status:</span>
              <span
                className={`font-bold ${
                  app.verification.otpStatus === 'VERIFIED'
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                }`}
              >
                {app.verification.otpStatus}
              </span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-600">Smile ID Simulated:</span>
              <span
                className={`font-bold ${
                  app.verification.smileIdStatus === 'CLEAR'
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                }`}
              >
                {app.verification.smileIdStatus}
              </span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-600">Video Evidence:</span>
              <span
                className={`font-bold ${
                  app.verification.videoStatus === 'VALID'
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                }`}
              >
                {app.verification.videoStatus} ({app.evidence.videoDurationSeconds}s)
              </span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-600">SLA Deadline:</span>
              <span
                className={`font-mono font-bold ${
                  app.isOverdue
                    ? 'text-rose-600'
                    : app.isUrgent
                    ? 'text-amber-600'
                    : 'text-slate-700'
                }`}
              >
                {new Date(app.slaDeadlineTimestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                {app.isOverdue && ' (Overdue)'}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline of Events */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
            Chronological Audit Timeline
          </h3>

          <div className="space-y-3 border-l-2 border-slate-200 pl-3 ml-1 text-xs">
            {app.auditTrail.map((ev) => (
              <div key={ev.id} className="relative space-y-0.5">
                <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-white" />
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold text-slate-700">{ev.action}</span>
                  <span>
                    {new Date(ev.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">{ev.details || ev.reason}</p>
                <span className="text-[10px] text-slate-400">By {ev.actor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Camera Capture */}
      {activeCameraType && (
        <CameraModal
          title={
            activeCameraType === 'CUSTOMER_HOLDING_ID'
              ? 'Customer Holding ID Photograph'
              : 'National ID Card (Close-up)'
          }
          instructions="Please ensure crisp focus and legible identification digits."
          type={activeCameraType}
          onCapture={(imgUrl) => {
            if (activeCameraType === 'CUSTOMER_HOLDING_ID') {
              setCorrectedHoldingPhoto(imgUrl);
            } else {
              setCorrectedIdPhoto(imgUrl);
            }
            setActiveCameraType(null);
          }}
          onClose={() => setActiveCameraType(null)}
        />
      )}

      {/* Modal: Video Recording */}
      {showVideoModal && (
        <VideoRecordModal
          customerName={app.customer.fullName}
          location={app.customer.location}
          nationalIdNumber={correctedIdNumber}
          productName={app.product.name}
          isAssisted={app.evidence.assistedRecording}
          retakeCount={app.evidence.videoRetakeCount}
          onSaveVideo={(url) => {
            setCorrectedVideoUrl(url);
            setShowVideoModal(false);
          }}
          onClose={() => setShowVideoModal(false)}
        />
      )}
    </div>
  );
};
