export type ApplicationStatus =
  | 'AUTO_APPROVED'
  | 'MANUALLY_APPROVED'
  | 'PENDING_VERIFICATION'
  | 'MANUAL_REVIEW'
  | 'NEEDS_INFORMATION'
  | 'SUSPECTED_FRAUD'
  | 'REJECTED';

export type ValueCategory = 'NORMAL_VALUE' | 'HIGH_VALUE';

export type OtpStatus =
  | 'VERIFIED'
  | 'PENDING'
  | 'FAILED'
  | 'IVR_COMPLETED'
  | 'IVR_DEFERRED'
  | 'SKIPPED';

export type VerificationStateMachineState =
  | 'NOT_STARTED'
  | 'WAITING_FOR_NETWORK'
  | 'SUBMITTED'
  | 'VERIFICATION_IN_PROGRESS'
  | 'CLEAR'
  | 'ATTENTION'
  | 'BLOCKED_NOT_FOUND'
  | 'BLOCKED_FRAUD'
  | 'ERROR_SERVICE_UNAVAILABLE'
  | 'ERROR_INVALID_INPUT'
  | 'RETRY_SCHEDULED'
  | 'NEEDS_AGENT_CORRECTION'
  | 'RESULT_NOT_CONFIRMED';

export type SmileIdSimulatedStatus =
  | 'CLEAR'
  | 'ATTENTION'
  | 'BLOCKED_NOT_FOUND'
  | 'BLOCKED_FRAUD'
  | 'ERROR_SERVICE_UNAVAILABLE'
  | 'ERROR_INVALID_INPUT'
  | 'PENDING';

export type VideoStatus =
  | 'VALID'
  | 'INVALID'
  | 'PENDING'
  | 'CORRUPTED_OR_SHORT'
  | 'RETAKE_LIMIT_REACHED';

export type BankHistoryStatus =
  | 'NOT_APPLICABLE'
  | 'PROVIDED'
  | 'MAY_BE_REQUESTED_LATER'
  | 'REQUESTED_BY_EXECUTIVE'
  | 'SUBMITTED';

export type RequestedInformationField =
  | 'RETAKE_NATIONAL_ID_PHOTO'
  | 'CORRECT_NATIONAL_ID_NUMBER'
  | 'RETAKE_CUSTOMER_WITH_ID_PHOTO'
  | 'RERECORD_CUSTOMER_VIDEO'
  | 'COMPLETE_OTP_VERIFICATION'
  | 'SUBMIT_BANK_STATEMENT'
  | 'CORRECT_CUSTOMER_DETAILS';

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: 'FIELD_AGENT' | 'EXECUTIVE' | 'SENIOR_EXECUTIVE' | 'SYSTEM';
  action: string;
  details?: string;
  reason?: string;
}

export interface ProductCatalogItem {
  id: string;
  name: string;
  category: ValueCategory;
  cashPriceKsh: number;
  depositKsh: number;
  dailyRateKsh: number;
  loanTermMonths: number;
  description: string;
  image: string;
  features: string[];
}

export interface CustomerDetails {
  fullName: string;
  phoneNumber: string;
  countryCode: string;
  dateOfBirth: string;
  location: string;
}

export interface EvidenceData {
  nationalIdNumber: string;
  nationalIdPhotoUrl: string;
  customerHoldingIdPhotoUrl: string;
  idPhotoQuality: 'CLEAR' | 'BLURRY' | 'GLARE' | 'CROPPED';
  idNumberCorrectionCount: number;
  videoUrl?: string;
  videoDurationSeconds?: number;
  videoHasAudio?: boolean;
  videoRetakeCount: number;
  assistedRecording: boolean;
  bankStatementUrl?: string;
  bankStatementFileName?: string;
  bankConsentGiven?: boolean;
}

export interface VerificationDetails {
  stateMachineState: VerificationStateMachineState;
  lastAttemptTimestamp?: string;
  retryCount: number;
  maxRetries: number;
  nextScheduledRetryMinutes?: number;
  nextScheduledRetryTimestamp?: string;
  nextScheduledActionLabel?: string;
  failureReason?: string;
  diagnosticTrace?: string;
  unconfirmedWebhook?: boolean;

  otpStatus: OtpStatus;
  otpCode?: string;
  otpMethodUsed?: 'SMS' | 'IVR';
  otpAttemptsCount: number;
  otpResendCount: number;
  otpDeferredScheduledMinutes?: number;
  otpDeferredWindowExpiresTimestamp?: string;
  
  smileIdStatus: SmileIdSimulatedStatus;
  smileIdReasonCode?: string;
  smileIdConfidenceScore?: number;
  smileIdAttemptCount: number;
  
  videoStatus: VideoStatus;
  bankHistoryStatus: BankHistoryStatus;
}

export interface RequestedInformationDetail {
  fields: RequestedInformationField[];
  comment: string;
  requestedAt: string;
  requestedBy: string;
  resolvedAt?: string;
}

export interface RegistrationApplication {
  id: string; // e.g. SK-2026-8941
  submissionTimestamp: string;
  customer: CustomerDetails;
  product: ProductCatalogItem;
  valueCategory: ValueCategory;
  evidence: EvidenceData;
  verification: VerificationDetails;
  
  status: ApplicationStatus;
  riskFlags: string[];
  
  // SLA Management
  slaDeadlineTimestamp: string; // 2 hours for normal, 24 hours for high value
  isUrgent: boolean;
  isOverdue: boolean;
  
  // Review assignments & decisions
  assignedReviewer?: string;
  assignedReviewerName?: string;
  reviewerNotes: Array<{
    id: string;
    author: string;
    timestamp: string;
    text: string;
  }>;
  
  firstApprovalBy?: string;
  firstApprovalTimestamp?: string;
  secondApprovalBy?: string;
  secondApprovalTimestamp?: string;
  requiresSecondApproval?: boolean;
  
  rejectionReasonCode?: string;
  rejectionExplanation?: string;
  
  requestedInformation?: RequestedInformationDetail;
  
  auditTrail: AuditEvent[];
  
  // Offline sync simulation
  isOfflineCreated?: boolean;
  isSyncedToBackend: boolean;

  // QA Audit Sample (10% auto-approval review sample)
  isAuditSample?: boolean;

  // Fraud resolution tracking
  fraudResolved?: boolean;
  fraudResolutionNotes?: string;
  fraudResolvedBy?: string;
}

export type NetworkConnectivity = 'ONLINE' | 'OFFLINE' | 'POOR_2G';

export type DemoScenarioPreset =
  | 'CLEAR'
  | 'ATTENTION'
  | 'ID_NOT_FOUND'
  | 'SUSPECTED_FRAUD'
  | 'TEMP_SERVICE_UNAVAILABLE'
  | 'INVALID_IMAGE'
  | 'OTP_DELAYED'
  | 'OTP_FAILED'
  | 'VIDEO_INVALID'
  | 'HIGH_VALUE_WITH_BANK'
  | 'HIGH_VALUE_WITHOUT_BANK';
