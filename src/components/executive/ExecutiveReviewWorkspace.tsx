import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RegistrationApplication, RequestedInformationField } from '../../types';
import { RequestInfoModal } from './RequestInfoModal';
import { RejectModal } from './RejectModal';
import { FraudResolutionModal } from './FraudResolutionModal';
import { EscalateFraudModal } from './EscalateFraudModal';
import { VerificationResultPanel } from '../common/VerificationResultPanel';
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  UserCheck,
  Eye,
  EyeOff,
  Video,
  Camera,
  FileText,
  DollarSign,
  MessageSquare,
  Send,
  RotateCcw,
  AlertOctagon,
  Check,
  Volume2,
  Calendar,
  MapPin,
  Smartphone
} from 'lucide-react';

interface ExecutiveReviewWorkspaceProps {
  applicationId: string;
  onBack: () => void;
}

export const ExecutiveReviewWorkspace: React.FC<ExecutiveReviewWorkspaceProps> = ({
  applicationId,
  onBack
}) => {
  const {
    applications,
    currentExecutive,
    setCurrentExecutiveName,
    executiveApprove,
    executiveReject,
    executiveRequestInfo,
    executiveEscalateFraud,
    executiveResolveFraud,
    executiveRetryVerification,
    simulateServiceRetry,
    pollWebhookStatus,
    executiveAssignReviewer,
    executiveAddNote
  } = useApp();

  const app = applications.find((a) => a.id === applicationId);

  const [unmaskId, setUnmaskId] = useState(false);
  const [showRequestInfoModal, setShowRequestInfoModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showFraudResolutionModal, setShowFraudResolutionModal] = useState(false);
  const [showEscalateFraudModal, setShowEscalateFraudModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [isRetryingSmile, setIsRetryingSmile] = useState(false);
  const [approvalError, setApprovalError] = useState<string | null>(null);

  // Evidence check-off state for executive
  const [checkedIdPhoto, setCheckedIdPhoto] = useState(false);
  const [checkedHoldingPhoto, setCheckedHoldingPhoto] = useState(false);
  const [checkedVideo, setCheckedVideo] = useState(false);
  const [approvalConfirmPrompt, setApprovalConfirmPrompt] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    isStage2: boolean;
  } | null>(null);

  if (!app) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
        <p className="text-slate-500 text-sm">Application not found.</p>
        <button onClick={onBack} className="mt-2 text-amber-600 font-bold text-xs">
          Return to Queue
        </button>
      </div>
    );
  }

  const isHighValue = app.valueCategory === 'HIGH_VALUE';
  const isApproved = app.status === 'AUTO_APPROVED' || app.status === 'MANUALLY_APPROVED';
  const isRejected = app.status === 'REJECTED';
  const isFraud = app.status === 'SUSPECTED_FRAUD';
  const isNeedsInfo = app.status === 'NEEDS_INFORMATION';

  // Rule evaluation states
  const ruleSmileIdPass = app.verification.smileIdStatus === 'CLEAR';
  const ruleOtpPass = app.verification.otpStatus === 'VERIFIED';
  const ruleVideoPass = app.verification.videoStatus === 'VALID' && (app.evidence.videoDurationSeconds || 0) >= 8;
  const ruleDocumentPass = app.evidence.idPhotoQuality === 'CLEAR';
  const ruleFraudPass = app.verification.smileIdStatus !== 'BLOCKED_FRAUD' && !app.riskFlags.includes('Suspected Fraud');
  const ruleFinancialPass = !isHighValue || app.verification.bankHistoryStatus === 'PROVIDED' || app.verification.bankHistoryStatus === 'SUBMITTED';

  const handleApprove = () => {
    setApprovalError(null);

    if (isFraud && !app.fraudResolved) {
      setApprovalError('Ordinary approval is disabled for suspected fraud cases. Please resolve the fraud investigation below first.');
      return;
    }

    if (isHighValue && !app.firstApprovalBy) {
      setApprovalConfirmPrompt({
        isOpen: true,
        title: 'Stage 1 Senior Approval',
        description: 'Confirm Stage 1 Senior Approval for this High-Value application? (A second independent senior approval will be required before equipment release)',
        isStage2: false
      });
    } else if (isHighValue && app.requiresSecondApproval) {
      // Check if same reviewer
      if (app.firstApprovalBy && app.firstApprovalBy.trim().toLowerCase() === currentExecutive.name.trim().toLowerCase()) {
        setApprovalError(
          `Dual Independent Approval Enforcement: Stage 1 was authorized by ${app.firstApprovalBy}. The second approval must be completed by an independent senior officer.`
        );
        return;
      }

      setApprovalConfirmPrompt({
        isOpen: true,
        title: 'Final Second Senior Sign-off',
        description: `Confirm Final Second Senior Sign-off for High-Value financing by ${currentExecutive.name}? Equipment will be unlocked.`,
        isStage2: true
      });
    } else {
      setApprovalConfirmPrompt({
        isOpen: true,
        title: 'Approve Registration',
        description: `Approve registration ${app.id} for ${app.customer.fullName}? Equipment will be unlocked.`,
        isStage2: false
      });
    }
  };

  const executeConfirmedApprove = (isStage2: boolean) => {
    const res = executiveApprove(app.id, currentExecutive.name, isStage2);
    if (!res.success && res.error) {
      setApprovalError(res.error);
    }
    setApprovalConfirmPrompt(null);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    executiveAddNote(app.id, newNoteText.trim(), currentExecutive.name);
    setNewNoteText('');
  };

  const handleRetrySmileId = () => {
    setIsRetryingSmile(true);
    setTimeout(() => {
      executiveRetryVerification(app.id, currentExecutive.name);
      setIsRetryingSmile(false);
    }, 1200);
  };

  const maskedNationalId = unmaskId
    ? app.evidence.nationalIdNumber
    : app.evidence.nationalIdNumber.replace(/.(?=.{3})/g, '•');

  return (
    <div className="space-y-4">
      {/* Top Header / Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-all"
            title="Back to queue"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900">
                {app.customer.fullName}
              </h2>
              <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {app.id}
              </span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                  isHighValue ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}
              >
                {isHighValue ? 'High Value Tier' : 'Normal Value'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Submitted: {new Date(app.submissionTimestamp).toLocaleString()} • {app.customer.location}
            </p>
          </div>
        </div>

        {/* Action Buttons in Header */}
        <div className="flex items-center gap-2">
          {!app.assignedReviewerName && (
            <button
              onClick={() => executiveAssignReviewer(app.id, currentExecutive.name)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Claim Case</span>
            </button>
          )}

          {!isApproved && !isRejected && (
            <>
              <button
                onClick={() => setShowRequestInfoModal(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Request Info</span>
              </button>

              <button
                onClick={() => setShowRejectModal(true)}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>

              <button
                onClick={handleApprove}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>
                  {isHighValue
                    ? app.requiresSecondApproval
                      ? 'Final 2nd Senior Sign-Off'
                      : 'Approve Stage 1 Credit'
                    : 'Approve Application'}
                </span>
              </button>
            </>
          )}

          {isApproved && (
            <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>Fully Approved</span>
            </span>
          )}

          {isRejected && (
            <span className="bg-rose-100 text-rose-800 font-extrabold text-xs px-3 py-1.5 rounded-xl border border-rose-300 flex items-center gap-1.5">
              <XCircle className="w-4 h-4" />
              <span>Rejected ({app.rejectionReasonCode})</span>
            </span>
          )}
        </div>
      </div>

      {/* Approval Error Banner */}
      {approvalError && (
        <div className="bg-rose-50 border-2 border-rose-400 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs text-rose-950 font-bold shadow-xs">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{approvalError}</span>
          </div>

          {approvalError.includes('Dual Independent Approval Enforcement') && (
            <button
              onClick={() => {
                setCurrentExecutiveName('David Ochieng (Senior Credit Risk Manager)');
                setApprovalError(null);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-amber-300 font-extrabold text-xs shadow-xs hover:bg-slate-800"
            >
              Switch Officer to David Ochieng (Independent Sr. Officer)
            </button>
          )}
        </div>
      )}

      {/* Prominent Suspected Fraud Security Banner */}
      {isFraud && (
        <div className="bg-rose-950 text-white p-4 rounded-2xl border-2 border-rose-500 shadow-lg space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center shrink-0">
                <AlertOctagon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm text-rose-200">
                  CRITICAL FRAUD LOCKOUT: ORDINARY APPROVAL DISABLED
                </h3>
                <p className="text-xs text-rose-300">
                  Flagged by Smile ID / Anti-Fraud Watchlist for suspected identity theft or syndicate activity.
                </p>
              </div>
            </div>

            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-800 text-rose-200 border border-rose-700">
              Security Hold
            </span>
          </div>

          <div className="bg-rose-900/60 p-3 rounded-xl border border-rose-700 text-xs text-rose-100 flex flex-wrap items-center justify-between gap-3">
            <span>
              Authorized Fraud Officer Resolution Required to unlock or terminate:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFraudResolutionModal(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Resolve Fraud Case (Clear / Blacklist)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QA Audit Sample Notice */}
      {app.isAuditSample && (
        <div className="bg-amber-500/10 border border-amber-400 p-3 rounded-2xl flex items-center justify-between text-xs text-amber-950 font-bold">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Quality Assurance 10% Audit Sample: Auto-approved application selected for supervisory review.</span>
          </div>
          <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-extrabold">
            QA Monitored
          </span>
        </div>
      )}

      {/* SLA Alert Strip */}
      <div className="bg-slate-900 text-white p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${app.isOverdue ? 'text-rose-400' : app.isUrgent ? 'text-amber-400' : 'text-emerald-400'}`} />
          <span>
            <strong>Asynchronous SLA:</strong> {isHighValue ? '24 Hours (Senior Credit)' : '2 Hours (Normal Value)'}
          </span>
          <span className="text-slate-400">•</span>
          <span>
            Deadline: <strong className="font-mono text-amber-300">{new Date(app.slaDeadlineTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {app.isOverdue ? (
            <span className="bg-rose-500 text-white font-extrabold px-2 py-0.5 rounded text-[10px] animate-pulse">
              OVERDUE ESCALATION
            </span>
          ) : app.isUrgent ? (
            <span className="bg-amber-500 text-slate-950 font-extrabold px-2 py-0.5 rounded text-[10px]">
              APPROACHING DEADLINE
            </span>
          ) : (
            <span className="bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded text-[10px]">
              Within SLA Target
            </span>
          )}

          <span className="text-slate-400">
            Reviewer: <strong>{app.assignedReviewerName || 'Unassigned Queue'}</strong>
          </span>
        </div>
      </div>

      {/* Explicit Identity Verification State Machine Panel */}
      <VerificationResultPanel
        application={app}
        mode="EXECUTIVE"
        onRetryVerification={() => {
          if (
            app.verification.stateMachineState === 'ERROR_SERVICE_UNAVAILABLE' ||
            app.verification.stateMachineState === 'RETRY_SCHEDULED'
          ) {
            simulateServiceRetry(app.id);
          } else {
            executiveRetryVerification(app.id, currentExecutive.name);
          }
        }}
        onPollWebhookStatus={() => pollWebhookStatus(app.id)}
      />

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Evidence & Media Inspection (2 Cols Wide) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Section: Automated Rule Evaluation Panel */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Automated Decision Rule Engine Evaluation
              </h3>
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Transparent Logic
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {/* Rule 1: Smile ID */}
              <div className="p-2.5 rounded-xl border bg-slate-50 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-700 text-[11px]">1. Civil Registry</span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${ruleSmileIdPass ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {ruleSmileIdPass ? 'PASS' : app.verification.smileIdStatus}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{app.verification.smileIdReasonCode || 'Civil registry check'}</p>
              </div>

              {/* Rule 2: OTP */}
              <div className="p-2.5 rounded-xl border bg-slate-50 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-700 text-[11px]">2. Phone OTP</span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${ruleOtpPass ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {ruleOtpPass ? 'PASS' : app.verification.otpStatus}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">Carrier confirmation PIN</p>
              </div>

              {/* Rule 3: Video */}
              <div className="p-2.5 rounded-xl border bg-slate-50 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-700 text-[11px]">3. Video Consent</span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${ruleVideoPass ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {ruleVideoPass ? 'PASS' : app.verification.videoStatus}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{app.evidence.videoDurationSeconds}s • Audio verified</p>
              </div>

              {/* Rule 4: Document Quality */}
              <div className="p-2.5 rounded-xl border bg-slate-50 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-700 text-[11px]">4. Document Photo</span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${ruleDocumentPass ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {ruleDocumentPass ? 'PASS' : app.evidence.idPhotoQuality}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">Anti-glare & clarity audit</p>
              </div>

              {/* Rule 5: Anti Fraud */}
              <div className="p-2.5 rounded-xl border bg-slate-50 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-700 text-[11px]">5. Fraud Registry</span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${ruleFraudPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {ruleFraudPass ? 'PASS' : 'FLAGGED'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">No terminal fraud watchlist match</p>
              </div>

              {/* Rule 6: Financial Credit History */}
              <div className="p-2.5 rounded-xl border bg-slate-50 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-700 text-[11px]">6. Tier / Finance</span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${ruleFinancialPass ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'}`}>
                    {isHighValue ? (ruleFinancialPass ? 'ATTACHED' : 'PENDING') : 'N/A (Normal)'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{isHighValue ? 'Senior sign-off mandatory' : 'Auto-approvable tier'}</p>
              </div>
            </div>
          </div>

          {/* Evidence Panels: Photos & Video */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-500" />
              Customer Evidence Inspection
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Photo 1: ID Card Close-up */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">
                    National ID Card (OCR Capture)
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${app.evidence.idPhotoQuality === 'CLEAR' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {app.evidence.idPhotoQuality}
                  </span>
                </div>

                <div className="aspect-16/10 rounded-lg overflow-hidden border border-slate-300 bg-slate-900 flex items-center justify-center">
                  <img
                    src={app.evidence.nationalIdPhotoUrl}
                    alt="National ID"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500 font-mono">
                    ID: {maskedNationalId}
                  </span>
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedIdPhoto}
                      onChange={(e) => setCheckedIdPhoto(e.target.checked)}
                      className="rounded accent-emerald-600"
                    />
                    <span>Mark Inspected</span>
                  </label>
                </div>
              </div>

              {/* Photo 2: Customer Holding ID */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">
                    Customer Holding ID Card (Proof)
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                    Framed
                  </span>
                </div>

                <div className="aspect-16/10 rounded-lg overflow-hidden border border-slate-300 bg-slate-900 flex items-center justify-center">
                  <img
                    src={app.evidence.customerHoldingIdPhotoUrl}
                    alt="Customer Holding ID"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    Face & Card visible together
                  </span>
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedHoldingPhoto}
                      onChange={(e) => setCheckedHoldingPhoto(e.target.checked)}
                      className="rounded accent-emerald-600"
                    />
                    <span>Mark Inspected</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Video Evidence Card */}
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-xs text-slate-800">
                    Customer Verification Video Statement
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {app.evidence.assistedRecording && (
                    <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded font-bold">
                      Assisted Echo Mode
                    </span>
                  )}
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-mono font-bold">
                    {app.evidence.videoDurationSeconds}s Duration
                  </span>
                </div>
              </div>

              <div className="aspect-21/9 rounded-lg overflow-hidden border border-slate-300 bg-slate-950 relative flex items-center justify-center">
                <img
                  src={app.evidence.videoUrl || 'mock-video.png'}
                  alt="Video Preview"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-950/40">
                  <span className="text-xs font-bold">Consent Statement Audio: Present & Audible</span>
                  <p className="text-[11px] text-slate-300 italic mt-0.5 max-w-md text-center">
                    "My name is {app.customer.fullName}... I want to purchase the {app.product.name} solar system using Pay-As-You-Go financing."
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  Audio: <strong>{app.evidence.videoHasAudio ? 'Clear' : 'Missing'}</strong> • Retakes: <strong>{app.evidence.videoRetakeCount}/2</strong>
                </span>
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkedVideo}
                    onChange={(e) => setCheckedVideo(e.target.checked)}
                    className="rounded accent-emerald-600"
                  />
                  <span>Mark Video Inspected</span>
                </label>
              </div>
            </div>

            {/* High-Value Bank Statement if attached */}
            {isHighValue && app.evidence.bankStatementFileName && (
              <div className="border border-purple-200 bg-purple-50/40 rounded-xl p-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-purple-950">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-purple-700" />
                    Attached Financial Statement (High-Value Credit Assessment)
                  </span>
                  <span className="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded">
                    M-Pesa 6 Months
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-mono">
                  File: {app.evidence.bankStatementFileName} • Consent granted: {app.evidence.bankConsentGiven ? 'Yes' : 'No'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Customer Details, Smile ID, Notes, Actions */}
        <div className="space-y-4">
          {/* Customer Profile Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">
              Customer Identity & Solar Contract
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">National ID:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-slate-900">{maskedNationalId}</span>
                  <button
                    onClick={() => setUnmaskId(!unmaskId)}
                    className="text-slate-400 hover:text-slate-700 p-0.5"
                    title={unmaskId ? 'Mask ID' : 'Unmask ID'}
                  >
                    {unmaskId ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Phone Number:</span>
                <span className="font-mono font-bold text-slate-900">
                  {app.customer.countryCode} {app.customer.phoneNumber}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Date of Birth:</span>
                <span className="font-medium text-slate-900">{app.customer.dateOfBirth}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Location:</span>
                <span className="font-medium text-slate-900 text-right">{app.customer.location}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Solar Product:</span>
                <span className="font-bold text-slate-900 text-right">{app.product.name}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-500">PAYG Terms:</span>
                <span className="font-bold text-amber-600">
                  KSh {app.product.dailyRateKsh}/day (Dep: KSh {app.product.depositKsh.toLocaleString()})
                </span>
              </div>
            </div>
          </div>

          {/* Smile ID Simulated Response Details */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">
                Smile ID Simulated Response
              </h3>
              <button
                onClick={handleRetrySmileId}
                disabled={isRetryingSmile}
                className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1 disabled:opacity-50"
              >
                <RotateCcw className={`w-3 h-3 ${isRetryingSmile ? 'animate-spin' : ''}`} />
                <span>Retry Verification</span>
              </button>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Outcome Status:</span>
                <span className={`font-bold ${app.verification.smileIdStatus === 'CLEAR' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {app.verification.smileIdStatus}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Reason Code:</span>
                <span className="font-mono text-[11px] text-slate-700">
                  {app.verification.smileIdReasonCode || 'CIVIL_REGISTRY_MATCH'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Confidence Score:</span>
                <span className="font-bold text-slate-900">
                  {app.verification.smileIdConfidenceScore || 98}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Query Retries:</span>
                <span className="text-slate-700">{app.verification.smileIdAttemptCount}</span>
              </div>
            </div>

            {/* Fraud Escalation Action */}
            {!isFraud && (
              <button
                onClick={() => setShowEscalateFraudModal(true)}
                className="w-full py-2 rounded-xl border border-rose-300 bg-rose-50/50 hover:bg-rose-100/70 text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Escalate to Fraud Review Unit</span>
              </button>
            )}
          </div>

          {/* Reviewer Internal Notes */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">
              Reviewer Notes & Internal Log
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {app.reviewerNotes.length === 0 ? (
                <p className="text-slate-400 text-xs italic">No internal notes yet.</p>
              ) : (
                app.reviewerNotes.map((note) => (
                  <div key={note.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-slate-700">{note.author}</span>
                      <span>{new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-700 text-[11px] leading-relaxed">{note.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add note input */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Add internal reviewer note..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                disabled={!newNoteText.trim()}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold disabled:opacity-40"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showRequestInfoModal && (
        <RequestInfoModal
          customerName={app.customer.fullName}
          registrationId={app.id}
          onConfirm={(fields, comment) => {
            executiveRequestInfo(app.id, fields, comment, currentExecutive.name);
            setShowRequestInfoModal(false);
          }}
          onClose={() => setShowRequestInfoModal(false)}
        />
      )}

      {showRejectModal && (
        <RejectModal
          customerName={app.customer.fullName}
          registrationId={app.id}
          onConfirm={(reasonCode, explanation) => {
            executiveReject(app.id, reasonCode, explanation, currentExecutive.name);
            setShowRejectModal(false);
          }}
          onClose={() => setShowRejectModal(false)}
        />
      )}

      {showFraudResolutionModal && (
        <FraudResolutionModal
          customerName={app.customer.fullName}
          registrationId={app.id}
          onConfirm={(resolution, notes) => {
            executiveResolveFraud(app.id, resolution, notes, currentExecutive.name);
            setShowFraudResolutionModal(false);
          }}
          onClose={() => setShowFraudResolutionModal(false)}
        />
      )}

      {showEscalateFraudModal && (
        <EscalateFraudModal
          customerName={app.customer.fullName}
          registrationId={app.id}
          onConfirm={(reason) => {
            executiveEscalateFraud(app.id, reason, currentExecutive.name);
            setShowEscalateFraudModal(false);
          }}
          onClose={() => setShowEscalateFraudModal(false)}
        />
      )}

      {/* Approval Confirmation Dialog */}
      {approvalConfirmPrompt && approvalConfirmPrompt.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              {approvalConfirmPrompt.title}
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {approvalConfirmPrompt.description}
            </p>
            <div className="mt-5 flex gap-2 justify-end">
              <button
                onClick={() => setApprovalConfirmPrompt(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => executeConfirmedApprove(approvalConfirmPrompt.isStage2)}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
