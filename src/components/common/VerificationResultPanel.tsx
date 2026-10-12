import React from 'react';
import { RegistrationApplication, VerificationStateMachineState } from '../../types';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  RefreshCw,
  XCircle,
  CheckCircle,
  HelpCircle,
  AlertOctagon,
  ArrowRight,
  WifiOff,
  ServerCrash,
  UserCheck,
  Info
} from 'lucide-react';

interface VerificationResultPanelProps {
  application: RegistrationApplication;
  mode: 'FIELD_AGENT' | 'EXECUTIVE';
  onRetryVerification?: () => void;
  onPollWebhookStatus?: () => void;
}

export const VerificationResultPanel: React.FC<VerificationResultPanelProps> = ({
  application,
  mode,
  onRetryVerification,
  onPollWebhookStatus
}) => {
  const { verification, status, valueCategory, evidence } = application;
  const state = verification.stateMachineState || 'CLEAR';

  // State metadata
  const getStateInfo = (st: VerificationStateMachineState) => {
    switch (st) {
      case 'CLEAR':
        return {
          label: 'Clear (Simulated Non-Biometric Pass)',
          agentLabel: 'Verified ✓',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          badgeColor: 'bg-emerald-100 text-emerald-800',
          icon: CheckCircle,
          agentIntervention: false,
          executiveIntervention: false,
          canProceed: true,
          nextAction: 'Equipment dispatch unlocked (asynchronous verification satisfied)'
        };
      case 'ATTENTION':
        return {
          label: 'Attention / Manual Review',
          agentLabel: 'Under Customer Care Review',
          color: 'bg-amber-50 text-amber-900 border-amber-300',
          badgeColor: 'bg-amber-100 text-amber-900',
          icon: AlertTriangle,
          agentIntervention: false,
          executiveIntervention: true,
          canProceed: true, // Agent can finish remaining permitted steps
          nextAction: 'Executive review scheduled (non-blocking for field registration)'
        };
      case 'BLOCKED_NOT_FOUND':
        return {
          label: 'Blocked: ID Not Found in Civil Registry',
          agentLabel: 'ID Not Found in Records',
          color: 'bg-rose-50 text-rose-900 border-rose-300',
          badgeColor: 'bg-rose-100 text-rose-900',
          icon: XCircle,
          agentIntervention: evidence.idNumberCorrectionCount < 1,
          executiveIntervention: evidence.idNumberCorrectionCount >= 1,
          canProceed: false,
          nextAction:
            evidence.idNumberCorrectionCount < 1
              ? 'Agent may correct national ID number (1 attempt permitted)'
              : 'Correction attempts exhausted. Escalated for manual population registry inquiry'
        };
      case 'BLOCKED_FRAUD':
        return {
          label: 'Blocked: Suspected Fraud (Security Lockout)',
          agentLabel: 'Security Lockout — Registration Blocked',
          color: 'bg-rose-950 text-rose-100 border-rose-500',
          badgeColor: 'bg-rose-800 text-white',
          icon: AlertOctagon,
          agentIntervention: false,
          executiveIntervention: true,
          canProceed: false,
          nextAction: 'Ordinary approval disabled. Assigned to Fraud Investigation Unit'
        };
      case 'ERROR_SERVICE_UNAVAILABLE':
        return {
          label: 'Error: Service Unavailable (Civil Registry Gateway)',
          agentLabel: 'Network Service Busy — Background Auto-Retry',
          color: 'bg-blue-50 text-blue-900 border-blue-200',
          badgeColor: 'bg-blue-100 text-blue-900',
          icon: ServerCrash,
          agentIntervention: false,
          executiveIntervention: (verification.retryCount || 0) >= (verification.maxRetries || 3),
          canProceed: true, // Field agent does not wait
          nextAction:
            (verification.retryCount || 0) < (verification.maxRetries || 3)
              ? `Automated background retry ${verification.retryCount + 1} of ${verification.maxRetries || 3} scheduled at 1m, 5m, 15m intervals`
              : 'Verification Pending — Manual Follow-up Required (retries exhausted)'
        };
      case 'ERROR_INVALID_INPUT':
        return {
          label: 'Error: Invalid / Unreadable Evidence Input',
          agentLabel: 'ID Photo Unclear — Recapture Required',
          color: 'bg-amber-50 text-amber-900 border-amber-300',
          badgeColor: 'bg-amber-100 text-amber-900',
          icon: AlertTriangle,
          agentIntervention: true,
          executiveIntervention: false,
          canProceed: false,
          nextAction: 'Agent must retake sharp ID photograph without flash glare'
        };
      case 'NEEDS_AGENT_CORRECTION':
        return {
          label: 'Needs Agent Correction',
          agentLabel: 'Action Required: Update Requested Evidence',
          color: 'bg-amber-50 text-amber-900 border-amber-400',
          badgeColor: 'bg-amber-200 text-amber-950',
          icon: AlertTriangle,
          agentIntervention: true,
          executiveIntervention: false,
          canProceed: false,
          nextAction: 'Field agent must submit requested corrections'
        };
      case 'RETRY_SCHEDULED':
        return {
          label: 'Retry Scheduled',
          agentLabel: 'Queued for Re-check',
          color: 'bg-blue-50 text-blue-900 border-blue-200',
          badgeColor: 'bg-blue-100 text-blue-900',
          icon: RefreshCw,
          agentIntervention: false,
          executiveIntervention: false,
          canProceed: true,
          nextAction: `Next scheduled automated check at ${verification.nextScheduledRetryMinutes || 5} min`
        };
      case 'WAITING_FOR_NETWORK':
        return {
          label: 'Waiting for Network (Cached Locally)',
          agentLabel: 'Saved Offline — Outbox',
          color: 'bg-slate-100 text-slate-800 border-slate-300',
          badgeColor: 'bg-slate-200 text-slate-800',
          icon: WifiOff,
          agentIntervention: false,
          executiveIntervention: false,
          canProceed: true,
          nextAction: 'Will submit to verification central registry as soon as connectivity is restored'
        };
      case 'RESULT_NOT_CONFIRMED':
        return {
          label: 'Result Not Confirmed (Untrusted / Missing Webhook)',
          agentLabel: 'Awaiting Registry Confirmation',
          color: 'bg-amber-50 text-amber-900 border-amber-300',
          badgeColor: 'bg-amber-100 text-amber-900',
          icon: HelpCircle,
          agentIntervention: false,
          executiveIntervention: true,
          canProceed: false,
          nextAction: 'Status query polling permitted; otherwise escalates to manual registry check'
        };
      case 'SUBMITTED':
      case 'VERIFICATION_IN_PROGRESS':
        return {
          label: 'Verification In Progress',
          agentLabel: 'Checking Records...',
          color: 'bg-blue-50 text-blue-900 border-blue-200',
          badgeColor: 'bg-blue-100 text-blue-900',
          icon: Clock,
          agentIntervention: false,
          executiveIntervention: false,
          canProceed: true,
          nextAction: 'Evaluating non-biometric population records'
        };
      default:
        return {
          label: 'Not Started',
          agentLabel: 'Not Started',
          color: 'bg-slate-50 text-slate-700 border-slate-200',
          badgeColor: 'bg-slate-100 text-slate-700',
          icon: Clock,
          agentIntervention: false,
          executiveIntervention: false,
          canProceed: false,
          nextAction: 'Awaiting registration input'
        };
    }
  };

  const info = getStateInfo(state);
  const Icon = info.icon;

  if (mode === 'FIELD_AGENT') {
    return (
      <div className={`p-3.5 rounded-2xl border ${info.color} space-y-2`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 shrink-0" />
            <h4 className="font-extrabold text-xs">
              Simulated Identity Verification: {info.agentLabel}
            </h4>
          </div>
          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${info.badgeColor}`}>
            {state.replace(/_/g, ' ')}
          </span>
        </div>

        <p className="text-[11px] leading-relaxed opacity-90">
          <strong>Next Action:</strong> {info.nextAction}
        </p>

        <div className="pt-1.5 border-t border-current/15 flex items-center justify-between text-[10px] font-semibold opacity-85">
          <span>
            Agent Action Required: <strong>{info.agentIntervention ? 'YES' : 'NO'}</strong>
          </span>
          <span>
            Can Continue: <strong>{info.canProceed ? 'YES' : 'HOLD'}</strong>
          </span>
        </div>
      </div>
    );
  }

  // EXECUTIVE DIAGNOSTIC VIEW
  return (
    <div className={`p-4 rounded-2xl border-2 ${info.color} shadow-xs space-y-3`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/80 border border-current/20 shadow-2xs">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500">
                Non-Biometric State Machine
              </span>
              <span className="text-[9px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded font-mono font-bold">
                SIMULATED DEMO
              </span>
            </div>
            <h3 className="font-black text-sm text-slate-900 mt-0.5">
              {info.label}
            </h3>
          </div>
        </div>

        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${info.badgeColor} border border-current/20`}>
          {state}
        </span>
      </div>

      {/* Structured Status Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
        <div className="bg-white/80 p-2.5 rounded-xl border border-current/15">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Last Attempt
          </span>
          <span className="font-mono font-bold text-slate-800 text-[11px]">
            {verification.lastAttemptTimestamp
              ? new Date(verification.lastAttemptTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : new Date(application.submissionTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="bg-white/80 p-2.5 rounded-xl border border-current/15">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Retries Used
          </span>
          <span className="font-mono font-bold text-slate-800 text-[11px]">
            {verification.retryCount || 0} of {verification.maxRetries || 3}
          </span>
        </div>

        <div className="bg-white/80 p-2.5 rounded-xl border border-current/15">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Agent Needed?
          </span>
          <span className={`font-bold text-[11px] ${info.agentIntervention ? 'text-rose-700' : 'text-slate-700'}`}>
            {info.agentIntervention ? 'Yes (Recapture/Fix)' : 'No (Automated)'}
          </span>
        </div>

        <div className="bg-white/80 p-2.5 rounded-xl border border-current/15">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Executive Action?
          </span>
          <span className={`font-bold text-[11px] ${info.executiveIntervention ? 'text-amber-800' : 'text-slate-700'}`}>
            {info.executiveIntervention ? 'Yes (Review/Sign)' : 'No'}
          </span>
        </div>
      </div>

      {/* Failure Reason & Diagnostic Trace */}
      {(verification.failureReason || verification.smileIdReasonCode) && (
        <div className="bg-white/90 p-3 rounded-xl border border-current/15 text-xs space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-800">
              Diagnostic Reason Code: <code className="font-mono text-rose-700">{verification.failureReason || verification.smileIdReasonCode}</code>
            </span>
            <span className="text-[10px] text-slate-500">
              Confidence: {verification.smileIdConfidenceScore ?? 0}%
            </span>
          </div>
          {verification.diagnosticTrace && (
            <p className="text-[11px] text-slate-600 font-mono bg-slate-50 p-1.5 rounded border border-slate-200">
              {verification.diagnosticTrace}
            </p>
          )}
        </div>
      )}

      {/* Next Scheduled Action Banner */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-current/15">
        <span className="text-slate-600">
          <strong>Next Action:</strong> {info.nextAction}
        </span>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {onPollWebhookStatus && state === 'RESULT_NOT_CONFIRMED' && (
            <button
              onClick={onPollWebhookStatus}
              className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-500 shadow-xs"
            >
              Poll Webhook Status
            </button>
          )}

          {onRetryVerification &&
            (state === 'ERROR_SERVICE_UNAVAILABLE' ||
              state === 'RETRY_SCHEDULED' ||
              state === 'BLOCKED_NOT_FOUND' ||
              state === 'ATTENTION') && (
              <button
                onClick={onRetryVerification}
                className="px-2.5 py-1 rounded-lg bg-slate-900 text-amber-300 font-bold text-[11px] hover:bg-slate-800 flex items-center gap-1 shadow-xs"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Simulate Query Retry</span>
              </button>
            )}
        </div>
      </div>
    </div>
  );
};
