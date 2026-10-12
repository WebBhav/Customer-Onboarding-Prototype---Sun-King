import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  RegistrationApplication,
  NetworkConnectivity,
  AuditEvent,
  RequestedInformationField,
  CustomerDetails,
  DemoScenarioPreset
} from '../types';
import { INITIAL_APPLICATIONS } from '../data/seedData';

interface AppContextType {
  applications: RegistrationApplication[];
  network: NetworkConnectivity;
  setNetwork: (net: NetworkConnectivity) => void;
  simulatedTime: Date;
  advanceSimulatedTime: (minutes: number) => void;
  resetSimulatedTime: () => void;

  // Field Agent details
  fieldAgent: {
    id: string;
    name: string;
    territory: string;
    hub: string;
  };

  // Executive identity
  currentExecutive: {
    id: string;
    name: string;
    role: 'EXECUTIVE' | 'SENIOR_EXECUTIVE';
  };
  setCurrentExecutiveRole: (role: 'EXECUTIVE' | 'SENIOR_EXECUTIVE') => void;
  setCurrentExecutiveName: (name: string) => void;

  // Actions
  submitNewApplication: (newApp: RegistrationApplication) => Promise<RegistrationApplication>;
  syncOfflineApplications: () => Promise<number>;
  resubmitCaseCorrection: (
    id: string,
    corrections: {
      idPhotoUrl?: string;
      idNumber?: string;
      customerHoldingIdUrl?: string;
      videoUrl?: string;
      bankStatementUrl?: string;
      bankStatementFileName?: string;
      customerDetails?: Partial<CustomerDetails>;
      otpCompleted?: boolean;
    }
  ) => void;

  executiveApprove: (id: string, reviewerName: string, isSeniorSecondApproval?: boolean) => { success: boolean; error?: string };
  executiveReject: (id: string, reasonCode: string, explanation: string, reviewerName: string) => void;
  executiveRequestInfo: (id: string, fields: RequestedInformationField[], comment: string, reviewerName: string) => void;
  executiveEscalateFraud: (id: string, reason: string, reviewerName: string) => void;
  executiveResolveFraud: (id: string, resolution: 'CLEARED' | 'CONFIRMED_FRAUD', notes: string, reviewerName: string) => void;
  executiveRetryVerification: (id: string, reviewerName: string) => void;
  simulateServiceRetry: (id: string) => void;
  pollWebhookStatus: (id: string) => void;
  executiveAssignReviewer: (id: string, reviewerName: string) => void;
  executiveAddNote: (id: string, text: string, author: string) => void;
  resetDemoData: () => void;

  // Dynamic metrics
  metrics: {
    total: number;
    autoApproved: number;
    manuallyApproved: number;
    rejected: number;
    pendingVerification: number;
    needsInformation: number;
    highValue: number;
    approachingDeadline: number;
    overdue: number;
    offlineUnsynced: number;
    todaySubmittedCount: number;
    qaAuditSamplesCount: number;
    suspectedFraudCount: number;
  };
}

const STORAGE_KEY = 'sunking_payg_applications_v4';
const TIME_OFFSET_KEY = 'sunking_payg_time_offset_min';
const BASE_TIMESTAMP = new Date('2026-10-12T09:00:00.000Z').getTime();

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<RegistrationApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_APPLICATIONS;
  });

  const [network, setNetwork] = useState<NetworkConnectivity>('ONLINE');
  const [simulatedMinutesOffset, setSimulatedMinutesOffset] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(TIME_OFFSET_KEY);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [currentExecutiveRole, setCurrentExecutiveRole] = useState<'EXECUTIVE' | 'SENIOR_EXECUTIVE'>('SENIOR_EXECUTIVE');
  const [currentExecutiveNameOverride, setCurrentExecutiveNameOverride] = useState<string | null>(null);

  const simulatedTime = useMemo(() => {
    return new Date(BASE_TIMESTAMP + simulatedMinutesOffset * 60 * 1000);
  }, [simulatedMinutesOffset]);

  const advanceSimulatedTime = (minutes: number) => {
    setSimulatedMinutesOffset((prev) => {
      const next = prev + minutes;
      try {
        localStorage.setItem(TIME_OFFSET_KEY, next.toString());
      } catch {}
      return next;
    });
  };

  const resetSimulatedTime = () => {
    setSimulatedMinutesOffset(0);
    try {
      localStorage.setItem(TIME_OFFSET_KEY, '0');
    } catch {}
  };

  // Keep localStorage updated & listen for storage events across tabs
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [applications]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setApplications(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const fieldAgent = {
    id: 'AG-8821',
    name: 'Joseph Mwangi',
    territory: 'Kisumu West & Nyando',
    hub: 'Lake Basin Operations Hub'
  };

  const currentExecutive = {
    id: currentExecutiveRole === 'SENIOR_EXECUTIVE' ? 'rev-sr-01' : 'rev-02',
    name: currentExecutiveNameOverride ||
      (currentExecutiveRole === 'SENIOR_EXECUTIVE'
        ? 'Grace Achieng (Senior Credit Risk Manager)'
        : 'Sarah Kamau (Customer Care Specialist)'),
    role: currentExecutiveRole
  };

  const setCurrentExecutiveName = (name: string) => {
    setCurrentExecutiveNameOverride(name);
  };

  // Calculate dynamic deadline status for each application based on current simulated time
  const enrichedApplications = useMemo(() => {
    return applications.map((app) => {
      if (app.status === 'AUTO_APPROVED' || app.status === 'MANUALLY_APPROVED' || app.status === 'REJECTED') {
        return { ...app, isUrgent: false, isOverdue: false };
      }

      const deadline = new Date(app.slaDeadlineTimestamp).getTime();
      const current = simulatedTime.getTime();
      const remainingMinutes = (deadline - current) / (1000 * 60);

      const isOverdue = remainingMinutes < 0;
      let isUrgent = false;
      if (!isOverdue) {
        if (app.valueCategory === 'NORMAL_VALUE' && remainingMinutes <= 30) {
          isUrgent = true;
        } else if (app.valueCategory === 'HIGH_VALUE' && remainingMinutes <= 360) {
          isUrgent = true;
        }
      }

      return {
        ...app,
        isUrgent,
        isOverdue
      };
    });
  }, [applications, simulatedTime]);

  // Submit new application with deterministic automated decision logic
  const submitNewApplication = async (newApp: RegistrationApplication): Promise<RegistrationApplication> => {
    const nowIso = simulatedTime.toISOString();
    let determinedStatus: RegistrationApplication['status'] = 'PENDING_VERIFICATION';
    const updatedRiskFlags = [...newApp.riskFlags];
    const newAuditTrail: AuditEvent[] = [...newApp.auditTrail];
    let isAuditSample = false;

    const isOffline = network === 'OFFLINE';

    if (isOffline) {
      const offlineApp: RegistrationApplication = {
        ...newApp,
        isOfflineCreated: true,
        isSyncedToBackend: false,
        status: 'PENDING_VERIFICATION',
        auditTrail: [
          ...newAuditTrail,
          {
            id: `aud-${Date.now()}-off`,
            timestamp: nowIso,
            actor: fieldAgent.name,
            actorRole: 'FIELD_AGENT',
            action: 'Application Saved Locally (Offline)',
            details: 'Device offline. Stored in local agent outbox waiting for mobile connectivity.'
          }
        ]
      };
      setApplications((prev) => [offlineApp, ...prev]);
      return offlineApp;
    }

    // ONLINE AUTOMATED DECISION LOGIC:
    if (newApp.verification.smileIdStatus === 'BLOCKED_FRAUD') {
      determinedStatus = 'SUSPECTED_FRAUD';
      if (!updatedRiskFlags.includes('Suspected Fraud')) {
        updatedRiskFlags.push('Suspected Fraud');
      }
      newAuditTrail.push({
        id: `aud-${Date.now()}-frd`,
        timestamp: nowIso,
        actor: 'Sun King Security Gateway',
        actorRole: 'SYSTEM',
        action: 'Application Locked - Suspected Fraud',
        details: 'Deterministic policy rule: Smile ID terminal fraud matches immediately freeze application. Ordinary approval disabled.'
      });
    } else if (newApp.valueCategory === 'NORMAL_VALUE') {
      // Deterministic auto-approval criteria:
      const smileIdClear = newApp.verification.smileIdStatus === 'CLEAR';
      const otpVerified = newApp.verification.otpStatus === 'VERIFIED';
      const videoValid = newApp.verification.videoStatus === 'VALID' && (newApp.evidence.videoDurationSeconds || 0) >= 8;
      const idClear = newApp.evidence.idPhotoQuality === 'CLEAR';
      const noSevereRisk = updatedRiskFlags.length === 0;

      if (smileIdClear && otpVerified && videoValid && idClear && noSevereRisk) {
        determinedStatus = 'AUTO_APPROVED';

        // 10% QA Sampling for Auto-Approved Normal Value
        if (Math.random() < 0.1 || newApp.id.endsWith('7')) {
          isAuditSample = true;
          updatedRiskFlags.push('Quality Assurance 10% Audit Sample');
        }

        newAuditTrail.push({
          id: `aud-${Date.now()}-auto`,
          timestamp: nowIso,
          actor: 'Sun King Asynchronous Decision Engine',
          actorRole: 'SYSTEM',
          action: isAuditSample ? 'Automated Approval Granted (10% QA Sampled)' : 'Automated Approval Granted',
          details: 'Application satisfied all 5 auto-approval criteria: Normal Value, Smile ID Clear, OTP Verified, Video Verified, Clear Evidence.'
        });
      } else {
        determinedStatus = 'MANUAL_REVIEW';
        newAuditTrail.push({
          id: `aud-${Date.now()}-rev`,
          timestamp: nowIso,
          actor: 'Decision Router',
          actorRole: 'SYSTEM',
          action: 'Routed to Customer Care Queue',
          details: `Manual review needed: ${[
            !smileIdClear ? `Smile ID: ${newApp.verification.smileIdStatus}` : null,
            !otpVerified ? `OTP: ${newApp.verification.otpStatus}` : null,
            !videoValid ? `Video: ${newApp.verification.videoStatus}` : null,
            !idClear ? `ID photo: ${newApp.evidence.idPhotoQuality}` : null,
            updatedRiskFlags.length > 0 ? `Risk flags present` : null
          ].filter(Boolean).join(', ')}`
        });
      }
    } else {
      // High Value: Never auto-approve! Route to Senior Review Queue
      determinedStatus = 'MANUAL_REVIEW';
      if (!updatedRiskFlags.includes('High Value Financing ($320+)')) {
        updatedRiskFlags.push('High Value Financing ($320+)');
      }
      newAuditTrail.push({
        id: `aud-${Date.now()}-hv`,
        timestamp: nowIso,
        actor: 'Decision Router',
        actorRole: 'SYSTEM',
        action: 'Routed to Senior Executive Review',
        details: 'High-Value solar system financing requires mandatory dual human sign-off.'
      });
    }

    const finalizedApp: RegistrationApplication = {
      ...newApp,
      status: determinedStatus,
      riskFlags: updatedRiskFlags,
      isAuditSample,
      isSyncedToBackend: true,
      auditTrail: newAuditTrail,
      firstApprovalBy: determinedStatus === 'AUTO_APPROVED' ? 'SYSTEM_AUTOMATION' : undefined,
      firstApprovalTimestamp: determinedStatus === 'AUTO_APPROVED' ? nowIso : undefined
    };

    setApplications((prev) => [finalizedApp, ...prev]);
    return finalizedApp;
  };

  // Sync offline queued applications
  const syncOfflineApplications = async (): Promise<number> => {
    let syncedCount = 0;
    const nowIso = simulatedTime.toISOString();

    setApplications((prev) =>
      prev.map((app) => {
        if (!app.isSyncedToBackend) {
          syncedCount++;
          const isHigh = app.valueCategory === 'HIGH_VALUE';
          const smileClear = app.verification.smileIdStatus === 'CLEAR';
          const otpOk = app.verification.otpStatus === 'VERIFIED';
          const videoOk = app.verification.videoStatus === 'VALID' && (app.evidence.videoDurationSeconds || 0) >= 8;

          let nextStatus: RegistrationApplication['status'] = 'MANUAL_REVIEW';
          if (!isHigh && smileClear && otpOk && videoOk && app.evidence.idPhotoQuality === 'CLEAR') {
            nextStatus = 'AUTO_APPROVED';
          }

          return {
            ...app,
            isSyncedToBackend: true,
            status: nextStatus,
            firstApprovalBy: nextStatus === 'AUTO_APPROVED' ? 'SYSTEM_AUTOMATION' : undefined,
            firstApprovalTimestamp: nextStatus === 'AUTO_APPROVED' ? nowIso : undefined,
            auditTrail: [
              ...app.auditTrail,
              {
                id: `aud-${Date.now()}-sync-${app.id}`,
                timestamp: nowIso,
                actor: fieldAgent.name,
                actorRole: 'FIELD_AGENT',
                action: 'Offline Application Synchronized',
                details: `Successfully uploaded from local cache to Sun King central registry. Evaluated status: ${nextStatus}.`
              }
            ]
          };
        }
        return app;
      })
    );

    return syncedCount;
  };

  // Resubmit case correction from field agent
  const resubmitCaseCorrection = (
    id: string,
    corrections: {
      idPhotoUrl?: string;
      idNumber?: string;
      customerHoldingIdUrl?: string;
      videoUrl?: string;
      bankStatementUrl?: string;
      bankStatementFileName?: string;
      customerDetails?: Partial<CustomerDetails>;
      otpCompleted?: boolean;
    }
  ) => {
    const nowIso = simulatedTime.toISOString();

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;

        const updatedEvidence = { ...app.evidence };
        const updatedVerification = { ...app.verification };
        const updatedCustomer = { ...app.customer };
        let updatedRiskFlags = [...app.riskFlags];

        const detailsChanges: string[] = [];

        if (corrections.idPhotoUrl) {
          updatedEvidence.nationalIdPhotoUrl = corrections.idPhotoUrl;
          updatedEvidence.idPhotoQuality = 'CLEAR';
          updatedVerification.stateMachineState = 'CLEAR';
          updatedVerification.smileIdStatus = 'CLEAR';
          updatedVerification.smileIdReasonCode = 'CIVIL_REGISTRY_MATCH';
          updatedVerification.failureReason = undefined;
          updatedRiskFlags = updatedRiskFlags.filter((f) => !f.toLowerCase().includes('image quality') && !f.toLowerCase().includes('unclear'));
          detailsChanges.push('Recaptured sharp National ID Photo (Legible OCR)');
        }

        if (corrections.idNumber) {
          const previousId = app.evidence.nationalIdNumber;
          const currentCount = app.evidence.idNumberCorrectionCount || 0;
          const nextCount = currentCount + 1;
          updatedEvidence.nationalIdNumber = corrections.idNumber;
          updatedEvidence.idNumberCorrectionCount = nextCount;

          if (nextCount <= 1) {
            // First correction attempt allowed (1 permitted)
            updatedVerification.stateMachineState = 'CLEAR';
            updatedVerification.smileIdStatus = 'CLEAR';
            updatedVerification.smileIdReasonCode = 'CIVIL_REGISTRY_MATCH';
            updatedVerification.failureReason = undefined;
            updatedRiskFlags = updatedRiskFlags.filter((f) => !f.toLowerCase().includes('transposition') && !f.toLowerCase().includes('not found') && !f.toLowerCase().includes('mismatch'));
            detailsChanges.push(`Corrected National ID Number from ${previousId} to ${corrections.idNumber} (Attempt 1 of 1 permitted) — Verified in civil records`);
          } else {
            // Correction limit exhausted (>1 attempt) -> Route to manual review!
            updatedVerification.stateMachineState = 'ATTENTION';
            updatedVerification.smileIdStatus = 'ATTENTION';
            updatedVerification.failureReason = 'ID_CORRECTION_LIMIT_EXHAUSTED';
            detailsChanges.push(`Attempted ID change to ${corrections.idNumber}, but correction limit exhausted (${nextCount} attempts). Escalated to Customer Care for manual registry inquiry.`);
          }
        }

        if (corrections.customerHoldingIdUrl) {
          updatedEvidence.customerHoldingIdPhotoUrl = corrections.customerHoldingIdUrl;
          detailsChanges.push('Recaptured Customer Holding ID Photo (Physical possession evidence confirmed)');
        }

        if (corrections.videoUrl) {
          updatedEvidence.videoUrl = corrections.videoUrl;
          updatedEvidence.videoDurationSeconds = 12;
          updatedEvidence.videoHasAudio = true;
          updatedEvidence.videoRetakeCount = (updatedEvidence.videoRetakeCount || 0) + 1;
          updatedVerification.videoStatus = 'VALID';
          updatedRiskFlags = updatedRiskFlags.filter((f) => !f.toLowerCase().includes('video'));
          detailsChanges.push('Re-recorded customer confirmation video (>8s)');
        }

        if (corrections.bankStatementUrl) {
          updatedEvidence.bankStatementUrl = corrections.bankStatementUrl;
          updatedEvidence.bankStatementFileName = corrections.bankStatementFileName || 'Mpesa_Statement_Uploaded.pdf';
          updatedVerification.bankHistoryStatus = 'SUBMITTED';
          updatedRiskFlags = updatedRiskFlags.filter((f) => !f.toLowerCase().includes('financial history') && !f.toLowerCase().includes('missing'));
          detailsChanges.push('Submitted verified M-Pesa / Bank statement');
        }

        if (corrections.customerDetails) {
          Object.assign(updatedCustomer, corrections.customerDetails);
          detailsChanges.push('Updated customer identity details');
        }

        if (corrections.otpCompleted) {
          updatedVerification.otpStatus = 'VERIFIED';
          updatedRiskFlags = updatedRiskFlags.filter((f) => !f.toLowerCase().includes('otp'));
          detailsChanges.push('Completed phone OTP verification in field');
        }

        // If in NEEDS_AGENT_CORRECTION and corrections were submitted, transition state machine
        if (updatedVerification.stateMachineState === 'NEEDS_AGENT_CORRECTION' && detailsChanges.length > 0) {
          updatedVerification.stateMachineState = 'CLEAR';
        }

        // Determine if Normal Value can now be auto-approved
        let nextStatus: RegistrationApplication['status'] = 'MANUAL_REVIEW';
        if (
          app.valueCategory === 'NORMAL_VALUE' &&
          updatedVerification.smileIdStatus === 'CLEAR' &&
          updatedVerification.otpStatus === 'VERIFIED' &&
          updatedVerification.videoStatus === 'VALID' &&
          updatedEvidence.idPhotoQuality === 'CLEAR'
        ) {
          nextStatus = 'AUTO_APPROVED';
        }

        const newAudit: AuditEvent = {
          id: `aud-${Date.now()}-resub`,
          timestamp: nowIso,
          actor: fieldAgent.name,
          actorRole: 'FIELD_AGENT',
          action: 'Evidence Resubmitted',
          details: `Agent resolved requested items: ${detailsChanges.join('; ')}. Resubmitted to active verification queue.`
        };

        return {
          ...app,
          status: nextStatus,
          evidence: updatedEvidence,
          verification: updatedVerification,
          customer: updatedCustomer,
          riskFlags: updatedRiskFlags,
          requestedInformation: app.requestedInformation
            ? { ...app.requestedInformation, resolvedAt: nowIso }
            : undefined,
          firstApprovalBy: nextStatus === 'AUTO_APPROVED' ? 'SYSTEM_AUTOMATION' : app.firstApprovalBy,
          firstApprovalTimestamp: nextStatus === 'AUTO_APPROVED' ? nowIso : app.firstApprovalTimestamp,
          auditTrail: [...app.auditTrail, newAudit]
        };
      })
    );
  };

  // Executive Actions with Dual Independent Reviewer Enforcement
  const executiveApprove = (
    id: string,
    reviewerName: string,
    isSeniorSecondApproval = false
  ): { success: boolean; error?: string } => {
    const targetApp = applications.find((a) => a.id === id);
    if (!targetApp) return { success: false, error: 'Application not found' };

    // Prevent approving suspected fraud without explicit fraud resolution
    if (targetApp.status === 'SUSPECTED_FRAUD' && !targetApp.fraudResolved) {
      return {
        success: false,
        error: 'Ordinary approval is disabled for suspected fraud cases. An authorized fraud-review resolution is required first.'
      };
    }

    // High Value Dual Approval Rule: Second approval CANNOT be performed by the same reviewer
    if (targetApp.valueCategory === 'HIGH_VALUE' && isSeniorSecondApproval) {
      const firstReviewer = targetApp.firstApprovalBy;
      if (firstReviewer && firstReviewer.trim().toLowerCase() === reviewerName.trim().toLowerCase()) {
        return {
          success: false,
          error: `Dual Independent Review Violation: Second senior approval must be performed by a different officer than ${firstReviewer}. Please switch reviewer persona.`
        };
      }
    }

    const nowIso = simulatedTime.toISOString();

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;

        // If High Value and not yet approved by 1st senior
        if (app.valueCategory === 'HIGH_VALUE' && !app.firstApprovalBy && !isSeniorSecondApproval) {
          return {
            ...app,
            firstApprovalBy: reviewerName,
            firstApprovalTimestamp: nowIso,
            requiresSecondApproval: true,
            auditTrail: [
              ...app.auditTrail,
              {
                id: `aud-${Date.now()}-app1`,
                timestamp: nowIso,
                actor: reviewerName,
                actorRole: 'SENIOR_EXECUTIVE',
                action: 'First Senior Approval Granted',
                details: 'High-Value application approved at credit evaluation tier. Queued for mandatory independent 2nd senior sign-off.'
              }
            ]
          };
        }

        // Full approval (Normal value, or 2nd approval on high value)
        return {
          ...app,
          status: 'MANUALLY_APPROVED',
          secondApprovalBy: isSeniorSecondApproval ? reviewerName : app.secondApprovalBy,
          secondApprovalTimestamp: isSeniorSecondApproval ? nowIso : app.secondApprovalTimestamp,
          requiresSecondApproval: false,
          auditTrail: [
            ...app.auditTrail,
            {
              id: `aud-${Date.now()}-app2`,
              timestamp: nowIso,
              actor: reviewerName,
              actorRole: 'EXECUTIVE',
              action: isSeniorSecondApproval ? 'Second Independent Senior Sign-off Complete' : 'Application Approved',
              details: isSeniorSecondApproval
                ? `Authorized by ${reviewerName} following prior sign-off by ${app.firstApprovalBy}. Hardware release unlocked.`
                : 'Registration fully authorized. Solar PAYG equipment dispatch approved.'
            }
          ]
        };
      })
    );

    return { success: true };
  };

  const executiveReject = (id: string, reasonCode: string, explanation: string, reviewerName: string) => {
    const nowIso = simulatedTime.toISOString();

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;

        return {
          ...app,
          status: 'REJECTED',
          rejectionReasonCode: reasonCode,
          rejectionExplanation: explanation,
          auditTrail: [
            ...app.auditTrail,
            {
              id: `aud-${Date.now()}-rej`,
              timestamp: nowIso,
              actor: reviewerName,
              actorRole: 'EXECUTIVE',
              action: 'Application Rejected',
              reason: reasonCode,
              details: explanation
            }
          ]
        };
      })
    );
  };

  const executiveRequestInfo = (
    id: string,
    fields: RequestedInformationField[],
    comment: string,
    reviewerName: string
  ) => {
    const nowIso = simulatedTime.toISOString();

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;

        return {
          ...app,
          status: 'NEEDS_INFORMATION',
          requestedInformation: {
            fields,
            comment,
            requestedAt: nowIso,
            requestedBy: reviewerName
          },
          auditTrail: [
            ...app.auditTrail,
            {
              id: `aud-${Date.now()}-req`,
              timestamp: nowIso,
              actor: reviewerName,
              actorRole: 'EXECUTIVE',
              action: 'Information Requested from Field Agent',
              reason: fields.join(', '),
              details: comment
            }
          ]
        };
      })
    );
  };

  const executiveEscalateFraud = (id: string, reason: string, reviewerName: string) => {
    const nowIso = simulatedTime.toISOString();

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;

        const flags = [...app.riskFlags];
        if (!flags.includes('Suspected Fraud')) flags.push('Suspected Fraud');

        return {
          ...app,
          status: 'SUSPECTED_FRAUD',
          riskFlags: flags,
          auditTrail: [
            ...app.auditTrail,
            {
              id: `aud-${Date.now()}-esc`,
              timestamp: nowIso,
              actor: reviewerName,
              actorRole: 'EXECUTIVE',
              action: 'Escalated to Fraud Investigation Unit',
              reason,
              details: `Account frozen. Hardware lock placed. Ordinary approval disabled.`
            }
          ]
        };
      })
    );
  };

  const executiveResolveFraud = (
    id: string,
    resolution: 'CLEARED' | 'CONFIRMED_FRAUD',
    notes: string,
    reviewerName: string
  ) => {
    const nowIso = simulatedTime.toISOString();

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;

        if (resolution === 'CLEARED') {
          const updatedFlags = app.riskFlags.filter((f) => f !== 'Suspected Fraud');
          updatedFlags.push('Fraud Flag Cleared by Security Unit');

          return {
            ...app,
            status: 'MANUAL_REVIEW',
            fraudResolved: true,
            fraudResolutionNotes: notes,
            fraudResolvedBy: reviewerName,
            riskFlags: updatedFlags,
            auditTrail: [
              ...app.auditTrail,
              {
                id: `aud-${Date.now()}-fraud-clr`,
                timestamp: nowIso,
                actor: reviewerName,
                actorRole: 'SENIOR_EXECUTIVE',
                action: 'Fraud Investigation Concluded - Flag Cleared',
                details: notes
              }
            ]
          };
        } else {
          // Confirmed fraud -> Reject and blacklist
          return {
            ...app,
            status: 'REJECTED',
            rejectionReasonCode: 'CONFIRMED_FRAUD_WATCHLIST',
            rejectionExplanation: notes || 'Confirmed identity impersonation on national fraud watchlist.',
            auditTrail: [
              ...app.auditTrail,
              {
                id: `aud-${Date.now()}-fraud-cnf`,
                timestamp: nowIso,
                actor: reviewerName,
                actorRole: 'SENIOR_EXECUTIVE',
                action: 'Fraud Confirmed - Account Blacklisted',
                details: notes
              }
            ]
          };
        }
      })
    );
  };

  const executiveRetryVerification = (id: string, reviewerName: string) => {
    const nowIso = simulatedTime.toISOString();

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;

        const updatedVer = {
          ...app.verification,
          smileIdStatus: 'CLEAR' as const,
          smileIdReasonCode: 'CIVIL_REGISTRY_MATCH',
          smileIdConfidenceScore: 98,
          smileIdAttemptCount: app.verification.smileIdAttemptCount + 1
        };

        const flags = app.riskFlags.filter((f) => !f.toLowerCase().includes('timeout'));

        return {
          ...app,
          verification: updatedVer,
          riskFlags: flags,
          auditTrail: [
            ...app.auditTrail,
            {
              id: `aud-${Date.now()}-ret`,
              timestamp: nowIso,
              actor: reviewerName,
              actorRole: 'EXECUTIVE',
              action: 'Simulated Verification Retried',
              details: 'Re-queried Civil Registry gateway. Status resolved to CLEAR (Confidence: 98%).'
            }
          ]
        };
      })
    );
  };

  // Simulate automated retry sequence (1m, 5m, 15m) for Temporary Service Failure
  const simulateServiceRetry = (id: string) => {
    const nowIso = simulatedTime.toISOString();

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;

        const currentRetries = app.verification.retryCount || 0;
        const nextRetries = currentRetries + 1;
        const retryIntervals = [1, 5, 15]; // 1m, 5m, 15m intervals

        let nextState: any = 'RETRY_SCHEDULED';
        let nextActionLabel = '';
        let smileIdStatus: any = 'ERROR_SERVICE_UNAVAILABLE';
        let details = '';

        if (nextRetries < 3) {
          const waitMin = retryIntervals[nextRetries] || 15;
          nextState = 'RETRY_SCHEDULED';
          nextActionLabel = `Auto-retry #${nextRetries + 1} of 3 scheduled in ${waitMin} minutes`;
          details = `Simulated automated retry #${nextRetries} dispatched. Gateway timeout persisted. Next retry in ${waitMin}m. Application remains safely PENDING.`;
        } else {
          // All 3 retries exhausted: Do not automatically reject!
          nextState = 'ATTENTION';
          smileIdStatus = 'ATTENTION';
          nextActionLabel = 'Verification Pending — Manual Follow-up Required';
          details = `Configured retries (1m, 5m, 15m) exhausted. Status set to "Verification Pending — Manual Follow-up Required". Application preserved without rejection for customer care follow-up.`;
        }

        return {
          ...app,
          status: 'PENDING_VERIFICATION' as const, // Always keep pending!
          verification: {
            ...app.verification,
            retryCount: nextRetries,
            stateMachineState: nextState,
            smileIdStatus,
            nextScheduledRetryMinutes: nextRetries < 3 ? retryIntervals[nextRetries] : undefined,
            nextScheduledActionLabel: nextActionLabel,
            lastAttemptTimestamp: nowIso
          },
          auditTrail: [
            ...app.auditTrail,
            {
              id: `aud-${Date.now()}-srv-ret-${nextRetries}`,
              timestamp: nowIso,
              actor: 'Sun King Asynchronous Retry Engine',
              actorRole: 'SYSTEM',
              action: nextRetries < 3 ? `Automated Service Retry #${nextRetries}` : 'Service Retries Exhausted',
              details
            }
          ]
        };
      })
    );
  };

  // Poll unconfirmed / missing webhook callback against civil registry replica
  const pollWebhookStatus = (id: string) => {
    const nowIso = simulatedTime.toISOString();

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;

        return {
          ...app,
          verification: {
            ...app.verification,
            stateMachineState: 'CLEAR',
            smileIdStatus: 'CLEAR',
            unconfirmedWebhook: false,
            diagnosticTrace: 'Status query confirmed against Civil Registry replica (Checksum 0x82C1). Webhook event authenticated.'
          },
          auditTrail: [
            ...app.auditTrail,
            {
              id: `aud-${Date.now()}-poll`,
              timestamp: nowIso,
              actor: currentExecutive.name,
              actorRole: 'EXECUTIVE',
              action: 'Civil Registry Webhook Polled',
              details: 'Untrusted/unconfirmed webhook status recovered by direct query. Verification State Machine resolved to CLEAR.'
            }
          ]
        };
      })
    );
  };

  const executiveAssignReviewer = (id: string, reviewerName: string) => {
    const nowIso = simulatedTime.toISOString();

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;

        return {
          ...app,
          assignedReviewerName: reviewerName,
          auditTrail: [
            ...app.auditTrail,
            {
              id: `aud-${Date.now()}-asn`,
              timestamp: nowIso,
              actor: reviewerName,
              actorRole: 'EXECUTIVE',
              action: 'Reviewer Assigned',
              details: `Application claimed by ${reviewerName}`
            }
          ]
        };
      })
    );
  };

  const executiveAddNote = (id: string, text: string, author: string) => {
    const nowIso = simulatedTime.toISOString();

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;

        return {
          ...app,
          reviewerNotes: [
            ...app.reviewerNotes,
            {
              id: `note-${Date.now()}`,
              author,
              timestamp: nowIso,
              text
            }
          ],
          auditTrail: [
            ...app.auditTrail,
            {
              id: `aud-${Date.now()}-nte`,
              timestamp: nowIso,
              actor: author,
              actorRole: 'EXECUTIVE',
              action: 'Internal Note Added',
              details: text
            }
          ]
        };
      })
    );
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TIME_OFFSET_KEY);
    setApplications(INITIAL_APPLICATIONS);
    setSimulatedMinutesOffset(0);
    setNetwork('ONLINE');
    setCurrentExecutiveNameOverride(null);
  };

  // Dynamic calculated metrics
  const metrics = useMemo(() => {
    const total = enrichedApplications.length;
    let autoApproved = 0;
    let manuallyApproved = 0;
    let rejected = 0;
    let pendingVerification = 0;
    let needsInformation = 0;
    let highValue = 0;
    let approachingDeadline = 0;
    let overdue = 0;
    let offlineUnsynced = 0;
    let todaySubmittedCount = 0;
    let qaAuditSamplesCount = 0;
    let suspectedFraudCount = 0;

    const todayStr = '2026-10-12';

    enrichedApplications.forEach((app) => {
      if (app.status === 'AUTO_APPROVED') autoApproved++;
      if (app.status === 'MANUALLY_APPROVED') manuallyApproved++;
      if (app.status === 'REJECTED') rejected++;
      if (app.status === 'PENDING_VERIFICATION') pendingVerification++;
      if (app.status === 'NEEDS_INFORMATION') needsInformation++;
      if (app.status === 'SUSPECTED_FRAUD') suspectedFraudCount++;
      if (app.valueCategory === 'HIGH_VALUE') highValue++;
      if (app.isUrgent) approachingDeadline++;
      if (app.isOverdue) overdue++;
      if (!app.isSyncedToBackend) offlineUnsynced++;
      if (app.submissionTimestamp.startsWith(todayStr)) todaySubmittedCount++;
      if (app.isAuditSample) qaAuditSamplesCount++;
    });

    return {
      total,
      autoApproved,
      manuallyApproved,
      rejected,
      pendingVerification,
      needsInformation,
      highValue,
      approachingDeadline,
      overdue,
      offlineUnsynced,
      todaySubmittedCount,
      qaAuditSamplesCount,
      suspectedFraudCount
    };
  }, [enrichedApplications]);

  return (
    <AppContext.Provider
      value={{
        applications: enrichedApplications,
        network,
        setNetwork,
        simulatedTime,
        advanceSimulatedTime,
        resetSimulatedTime,
        fieldAgent,
        currentExecutive,
        setCurrentExecutiveRole,
        setCurrentExecutiveName,
        submitNewApplication,
        syncOfflineApplications,
        resubmitCaseCorrection,
        executiveApprove,
        executiveReject,
        executiveRequestInfo,
        executiveEscalateFraud,
        executiveResolveFraud,
        executiveRetryVerification,
        simulateServiceRetry,
        pollWebhookStatus,
        executiveAssignReviewer,
        executiveAddNote,
        resetDemoData,
        metrics
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
