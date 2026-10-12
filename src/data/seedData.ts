import { RegistrationApplication } from '../types';
import { SUN_KING_CATALOG } from './catalog';

// Helper mock images using clean stylized SVG data URLs so they render reliably everywhere
export const MOCK_IMAGES = {
  idCardClear: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250" fill="%23f8fafc"><rect width="400" height="250" rx="12" fill="%23e2e8f0" stroke="%2394a3b8" stroke-width="2"/><rect x="20" y="20" width="80" height="90" rx="6" fill="%23cbd5e1"/><circle cx="60" cy="55" r="22" fill="%2364748b"/><path d="M35 100 Q60 78 85 100" fill="%2364748b"/><text x="120" y="45" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230f172a">REPUBLIC OF KENYA</text><text x="120" y="65" font-family="sans-serif" font-size="11" fill="%23475569">NATIONAL IDENTITY CARD</text><text x="120" y="95" font-family="sans-serif" font-size="12" font-weight="bold" fill="%231e293b">ID: 29841029</text><text x="120" y="115" font-family="sans-serif" font-size="11" fill="%23334155">FULL NAME: MARY WAMBUI NJOROGE</text><text x="120" y="135" font-family="sans-serif" font-size="11" fill="%23334155">DOB: 14/08/1988  SEX: F</text><text x="120" y="155" font-family="sans-serif" font-size="11" fill="%23334155">DISTRICT: KISUMU WEST</text><rect x="20" y="180" width="360" height="40" rx="4" fill="%23f1f5f9" stroke="%23cbd5e1"/><text x="30" y="205" font-family="monospace" font-size="10" fill="%2364748b">&lt;&lt;&lt;KEN29841029&lt;8M8808144F2812316&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;02</text></svg>`,

  idCardBlurry: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250" fill="%23f8fafc"><filter id="blur"><feGaussianBlur stdDeviation="3.5"/></filter><rect width="400" height="250" rx="12" fill="%23cbd5e1" filter="url(%23blur)"/><circle cx="60" cy="55" r="22" fill="%2394a3b8" filter="url(%23blur)"/><rect x="120" y="35" width="200" height="20" rx="4" fill="%2394a3b8" filter="url(%23blur)"/><rect x="120" y="65" width="160" height="15" rx="4" fill="%2394a3b8" filter="url(%23blur)"/><rect x="120" y="95" width="180" height="15" rx="4" fill="%2394a3b8" filter="url(%23blur)"/><circle cx="280" cy="110" r="60" fill="white" opacity="0.7"/><text x="140" y="125" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23ef4444">UNREADABLE FLASH GLARE</text></svg>`,

  customerHoldingId: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="%23f1f5f9"><rect width="400" height="300" rx="12" fill="%23e2e8f0"/><circle cx="200" cy="100" r="50" fill="%23475569"/><path d="M120 220 Q200 160 280 220 L280 300 L120 300 Z" fill="%23334155"/><rect x="140" y="210" width="120" height="70" rx="6" fill="%23f8fafc" stroke="%230284c7" stroke-width="2"/><text x="160" y="235" font-family="sans-serif" font-size="9" font-weight="bold" fill="%230f172a">NATIONAL ID</text><rect x="150" y="245" width="25" height="25" rx="2" fill="%23cbd5e1"/><text x="180" y="255" font-family="sans-serif" font-size="8" fill="%23475569">PROOF MATCH</text><text x="180" y="265" font-family="sans-serif" font-size="7" fill="%230284c7">VERIFIED</text><text x="20" y="25" font-family="sans-serif" font-size="12" font-weight="bold" fill="%230f172a">CUSTOMER HOLDING ID PROOF</text><text x="20" y="42" font-family="sans-serif" font-size="10" fill="%23059669">Face and card clearly framed</text></svg>`,

  videoThumbnail: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260" fill="%230f172a"><rect width="400" height="260" rx="12" fill="%231e293b"/><circle cx="200" cy="120" r="36" fill="%230284c7" opacity="0.9"/><polygon points="192,105 215,120 192,135" fill="white"/><text x="200" y="180" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="white">Customer Verification Video</text><text x="200" y="200" text-anchor="middle" font-family="sans-serif" font-size="11" fill="%2394a3b8">Duration: 11s | Audio: Present (Audible Consent)</text><rect x="20" y="225" width="360" height="8" rx="4" fill="%23334155"/><rect x="20" y="225" width="240" height="8" rx="4" fill="%230284c7"/></svg>`
};

export const INITIAL_APPLICATIONS: RegistrationApplication[] = [
  // 1: National ID photo is unclear — retake the photo
  {
    id: 'SK-2026-4101',
    submissionTimestamp: '2026-10-12T07:45:00.000Z',
    customer: {
      fullName: 'Mary Wambui Njoroge',
      phoneNumber: '712345678',
      countryCode: '+254',
      dateOfBirth: '1988-08-14',
      location: 'Kisumu West Market, Kisumu'
    },
    product: SUN_KING_CATALOG[1], // Home 200 Plus
    valueCategory: 'NORMAL_VALUE',
    evidence: {
      nationalIdNumber: '29841029',
      nationalIdPhotoUrl: MOCK_IMAGES.idCardBlurry,
      customerHoldingIdPhotoUrl: MOCK_IMAGES.customerHoldingId,
      idPhotoQuality: 'GLARE',
      idNumberCorrectionCount: 0,
      videoUrl: MOCK_IMAGES.videoThumbnail,
      videoDurationSeconds: 12,
      videoHasAudio: true,
      videoRetakeCount: 0,
      assistedRecording: false
    },
    verification: {
      stateMachineState: 'NEEDS_AGENT_CORRECTION',
      retryCount: 0,
      maxRetries: 3,
      failureReason: 'ID_IMAGE_UNREADABLE_GLARE',
      diagnosticTrace: 'Optical character extraction failed on bottom checksum sequence due to 85% flash specular reflection.',
      nextScheduledActionLabel: 'Awaiting field agent photo recapture',
      otpStatus: 'VERIFIED',
      otpCode: '4829',
      otpMethodUsed: 'SMS',
      otpAttemptsCount: 1,
      otpResendCount: 0,
      smileIdStatus: 'ERROR_INVALID_INPUT',
      smileIdReasonCode: 'ID_IMAGE_UNREADABLE_GLARE',
      smileIdConfidenceScore: 32,
      smileIdAttemptCount: 1,
      videoStatus: 'VALID',
      bankHistoryStatus: 'NOT_APPLICABLE'
    },
    status: 'NEEDS_INFORMATION',
    riskFlags: ['Document Image Quality Fail'],
    slaDeadlineTimestamp: '2026-10-12T09:45:00.000Z',
    isUrgent: true,
    isOverdue: false,
    assignedReviewer: 'rev-02',
    assignedReviewerName: 'Sarah Kamau (Customer Care Specialist)',
    reviewerNotes: [
      {
        id: 'note-4101-1',
        author: 'Sarah Kamau',
        timestamp: '2026-10-12T08:10:00.000Z',
        text: 'The national ID card has severe sunlight glare obscuring date of birth and checksum digits. Sent back to agent Joseph for immediate recapture.'
      }
    ],
    requestedInformation: {
      fields: ['RETAKE_NATIONAL_ID_PHOTO'],
      comment: 'National ID photo is unclear — retake the photo on a flat matte surface without camera glare.',
      requestedAt: '2026-10-12T08:12:00.000Z',
      requestedBy: 'Sarah Kamau'
    },
    auditTrail: [
      {
        id: 'aud-4101-1',
        timestamp: '2026-10-12T07:45:00.000Z',
        actor: 'Joseph Mwangi',
        actorRole: 'FIELD_AGENT',
        action: 'Application Submitted',
        details: 'Submitted Sun King Home 200 Plus registration for Mary Wambui.'
      },
      {
        id: 'aud-4101-2',
        timestamp: '2026-10-12T08:12:00.000Z',
        actor: 'Sarah Kamau',
        actorRole: 'EXECUTIVE',
        action: 'Information Requested from Field Agent',
        reason: 'RETAKE_NATIONAL_ID_PHOTO',
        details: 'National ID photo is unclear — retake the photo.'
      }
    ],
    isSyncedToBackend: true
  },

  // 2: Video is shorter than 8 seconds — record again
  {
    id: 'SK-2026-4102',
    submissionTimestamp: '2026-10-12T07:20:00.000Z',
    customer: {
      fullName: 'Emmanuel Okello',
      phoneNumber: '723112233',
      countryCode: '+256',
      dateOfBirth: '1991-03-22',
      location: 'Mbale Border Post, Tororo'
    },
    product: SUN_KING_CATALOG[2], // Solar Fan System
    valueCategory: 'NORMAL_VALUE',
    evidence: {
      nationalIdNumber: 'CM91029103KLA',
      nationalIdPhotoUrl: MOCK_IMAGES.idCardClear,
      customerHoldingIdPhotoUrl: MOCK_IMAGES.customerHoldingId,
      idPhotoQuality: 'CLEAR',
      idNumberCorrectionCount: 0,
      videoUrl: MOCK_IMAGES.videoThumbnail,
      videoDurationSeconds: 4,
      videoHasAudio: true,
      videoRetakeCount: 1,
      assistedRecording: false
    },
    verification: {
      stateMachineState: 'NEEDS_AGENT_CORRECTION',
      retryCount: 1,
      maxRetries: 2,
      failureReason: 'VIDEO_BELOW_MINIMUM_DURATION',
      diagnosticTrace: 'Customer video truncated at 4.2 seconds; minimum 8.0s required to include complete legal agreement statement.',
      nextScheduledActionLabel: 'Awaiting video re-record',
      otpStatus: 'VERIFIED',
      otpCode: '5912',
      otpMethodUsed: 'SMS',
      otpAttemptsCount: 1,
      otpResendCount: 0,
      smileIdStatus: 'CLEAR',
      smileIdReasonCode: 'CIVIL_REGISTRY_MATCH',
      smileIdConfidenceScore: 97,
      smileIdAttemptCount: 1,
      videoStatus: 'CORRUPTED_OR_SHORT',
      bankHistoryStatus: 'NOT_APPLICABLE'
    },
    status: 'NEEDS_INFORMATION',
    riskFlags: ['Video Duration Below 8s Minimum'],
    slaDeadlineTimestamp: '2026-10-12T09:20:00.000Z',
    isUrgent: true,
    isOverdue: false,
    assignedReviewer: 'rev-02',
    assignedReviewerName: 'Sarah Kamau (Customer Care Specialist)',
    reviewerNotes: [
      {
        id: 'note-4102-1',
        author: 'Sarah Kamau',
        timestamp: '2026-10-12T07:55:00.000Z',
        text: 'Customer video stopped after 4 seconds before the customer stated the product name and financing intent.'
      }
    ],
    requestedInformation: {
      fields: ['RERECORD_CUSTOMER_VIDEO'],
      comment: 'Video is shorter than 8 seconds — record again ensuring customer speaks full statement.',
      requestedAt: '2026-10-12T07:58:00.000Z',
      requestedBy: 'Sarah Kamau'
    },
    auditTrail: [
      {
        id: 'aud-4102-1',
        timestamp: '2026-10-12T07:20:00.000Z',
        actor: 'Joseph Mwangi',
        actorRole: 'FIELD_AGENT',
        action: 'Application Submitted'
      },
      {
        id: 'aud-4102-2',
        timestamp: '2026-10-12T07:58:00.000Z',
        actor: 'Sarah Kamau',
        actorRole: 'EXECUTIVE',
        action: 'Information Requested from Field Agent',
        reason: 'RERECORD_CUSTOMER_VIDEO',
        details: 'Video is shorter than 8 seconds — record again.'
      }
    ],
    isSyncedToBackend: true
  },

  // 3: Please correct the national ID number
  {
    id: 'SK-2026-4103',
    submissionTimestamp: '2026-10-12T07:35:00.000Z',
    customer: {
      fullName: 'Beatrice Mutheu Musyoka',
      phoneNumber: '733445566',
      countryCode: '+254',
      dateOfBirth: '1987-11-19',
      location: 'Kitui Township, Eastern'
    },
    product: SUN_KING_CATALOG[0], // Home 60
    valueCategory: 'NORMAL_VALUE',
    evidence: {
      nationalIdNumber: '24891002', // Transposed digits
      nationalIdPhotoUrl: MOCK_IMAGES.idCardClear,
      customerHoldingIdPhotoUrl: MOCK_IMAGES.customerHoldingId,
      idPhotoQuality: 'CLEAR',
      idNumberCorrectionCount: 0,
      videoUrl: MOCK_IMAGES.videoThumbnail,
      videoDurationSeconds: 10,
      videoHasAudio: true,
      videoRetakeCount: 0,
      assistedRecording: false
    },
    verification: {
      stateMachineState: 'NEEDS_AGENT_CORRECTION',
      retryCount: 0,
      maxRetries: 1,
      failureReason: 'ID_DIGIT_MISMATCH_WITH_IMAGE',
      diagnosticTrace: 'OCR detected card string "24891020" does not match typed input "24891002". Permitting 1 agent digit correction.',
      nextScheduledActionLabel: 'Awaiting ID number correction (1 attempt remaining)',
      otpStatus: 'VERIFIED',
      otpCode: '7721',
      otpMethodUsed: 'SMS',
      otpAttemptsCount: 1,
      otpResendCount: 0,
      smileIdStatus: 'ATTENTION',
      smileIdReasonCode: 'ID_DIGIT_MISMATCH_WITH_IMAGE',
      smileIdConfidenceScore: 68,
      smileIdAttemptCount: 1,
      videoStatus: 'VALID',
      bankHistoryStatus: 'NOT_APPLICABLE'
    },
    status: 'NEEDS_INFORMATION',
    riskFlags: ['ID Number Transposition Mismatch'],
    slaDeadlineTimestamp: '2026-10-12T09:35:00.000Z',
    isUrgent: true,
    isOverdue: false,
    assignedReviewer: 'rev-02',
    assignedReviewerName: 'Sarah Kamau (Customer Care Specialist)',
    reviewerNotes: [
      {
        id: 'note-4103-1',
        author: 'Sarah Kamau',
        timestamp: '2026-10-12T08:05:00.000Z',
        text: 'The ID card in the photograph reads 24891020, but the agent typed 24891002. Returned to agent to confirm digit correction.'
      }
    ],
    requestedInformation: {
      fields: ['CORRECT_NATIONAL_ID_NUMBER'],
      comment: 'Please correct the national ID number — card reads 24891020 but 24891002 was submitted.',
      requestedAt: '2026-10-12T08:07:00.000Z',
      requestedBy: 'Sarah Kamau'
    },
    auditTrail: [
      {
        id: 'aud-4103-1',
        timestamp: '2026-10-12T07:35:00.000Z',
        actor: 'Joseph Mwangi',
        actorRole: 'FIELD_AGENT',
        action: 'Application Submitted'
      },
      {
        id: 'aud-4103-2',
        timestamp: '2026-10-12T08:07:00.000Z',
        actor: 'Sarah Kamau',
        actorRole: 'EXECUTIVE',
        action: 'Information Requested from Field Agent',
        reason: 'CORRECT_NATIONAL_ID_NUMBER',
        details: 'Please correct the national ID number.'
      }
    ],
    isSyncedToBackend: true
  },

  // 4: Customer care requested bank history for this high-value product
  {
    id: 'SK-2026-4104',
    submissionTimestamp: '2026-10-12T07:10:00.000Z',
    customer: {
      fullName: 'Peter Omondi Odhiambo',
      phoneNumber: '723456789',
      countryCode: '+254',
      dateOfBirth: '1984-11-03',
      location: 'Ahero Rice Scheme, Nyando'
    },
    product: SUN_KING_CATALOG[3], // Solar TV 32" (High Value)
    valueCategory: 'HIGH_VALUE',
    evidence: {
      nationalIdNumber: '24185790',
      nationalIdPhotoUrl: MOCK_IMAGES.idCardClear,
      customerHoldingIdPhotoUrl: MOCK_IMAGES.customerHoldingId,
      idPhotoQuality: 'CLEAR',
      idNumberCorrectionCount: 0,
      videoUrl: MOCK_IMAGES.videoThumbnail,
      videoDurationSeconds: 12,
      videoHasAudio: true,
      videoRetakeCount: 0,
      assistedRecording: true,
      bankConsentGiven: true
    },
    verification: {
      stateMachineState: 'NEEDS_AGENT_CORRECTION',
      retryCount: 0,
      maxRetries: 3,
      failureReason: 'HIGH_VALUE_FINANCIAL_HISTORY_REQUIRED',
      diagnosticTrace: 'High Value Tier: Solar TV 32" ($320+) credit committee requires 6-month mobile money / bank cashflow history.',
      nextScheduledActionLabel: 'Awaiting M-Pesa transaction statement upload',
      otpStatus: 'VERIFIED',
      otpCode: '5912',
      otpMethodUsed: 'SMS',
      otpAttemptsCount: 1,
      otpResendCount: 0,
      smileIdStatus: 'CLEAR',
      smileIdReasonCode: 'CIVIL_REGISTRY_MATCH',
      smileIdConfidenceScore: 98,
      smileIdAttemptCount: 1,
      videoStatus: 'VALID',
      bankHistoryStatus: 'REQUESTED_BY_EXECUTIVE'
    },
    status: 'NEEDS_INFORMATION',
    riskFlags: ['High Value Financing ($320+)', 'Missing Financial History'],
    slaDeadlineTimestamp: '2026-10-13T07:10:00.000Z',
    isUrgent: false,
    isOverdue: false,
    assignedReviewer: 'rev-sr-01',
    assignedReviewerName: 'Grace Achieng (Senior Credit Risk Manager)',
    reviewerNotes: [
      {
        id: 'note-4104-1',
        author: 'Grace Achieng',
        timestamp: '2026-10-12T07:40:00.000Z',
        text: 'Solar TV 32" requires proof of regular agricultural cashflow. Please upload recent 6-month M-Pesa statement.'
      }
    ],
    requestedInformation: {
      fields: ['SUBMIT_BANK_STATEMENT'],
      comment: 'Customer care requested bank history for this high-value product — please attach 6-month M-Pesa statement for credit approval.',
      requestedAt: '2026-10-12T07:42:00.000Z',
      requestedBy: 'Grace Achieng'
    },
    auditTrail: [
      {
        id: 'aud-4104-1',
        timestamp: '2026-10-12T07:10:00.000Z',
        actor: 'Joseph Mwangi',
        actorRole: 'FIELD_AGENT',
        action: 'Application Submitted'
      },
      {
        id: 'aud-4104-2',
        timestamp: '2026-10-12T07:42:00.000Z',
        actor: 'Grace Achieng',
        actorRole: 'SENIOR_EXECUTIVE',
        action: 'Information Requested from Field Agent',
        reason: 'SUBMIT_BANK_STATEMENT',
        details: 'Customer care requested bank history for this high-value product.'
      }
    ],
    isSyncedToBackend: true
  },

  // 5: Auto-Approved Normal Value - Faith Cherono Koech
  {
    id: 'SK-2026-4105',
    submissionTimestamp: '2026-10-12T06:30:00.000Z',
    customer: {
      fullName: 'Faith Cherono Koech',
      phoneNumber: '734567890',
      countryCode: '+254',
      dateOfBirth: '1992-04-21',
      location: 'Kipchimchim, Kericho West'
    },
    product: SUN_KING_CATALOG[0], // Home 60
    valueCategory: 'NORMAL_VALUE',
    evidence: {
      nationalIdNumber: '31459021',
      nationalIdPhotoUrl: MOCK_IMAGES.idCardClear,
      customerHoldingIdPhotoUrl: MOCK_IMAGES.customerHoldingId,
      idPhotoQuality: 'CLEAR',
      idNumberCorrectionCount: 0,
      videoUrl: MOCK_IMAGES.videoThumbnail,
      videoDurationSeconds: 14,
      videoHasAudio: true,
      videoRetakeCount: 0,
      assistedRecording: false
    },
    verification: {
      stateMachineState: 'CLEAR',
      retryCount: 0,
      maxRetries: 3,
      nextScheduledActionLabel: 'Asynchronous verification completed successfully',
      otpStatus: 'VERIFIED',
      otpCode: '8310',
      otpMethodUsed: 'SMS',
      otpAttemptsCount: 1,
      otpResendCount: 0,
      smileIdStatus: 'CLEAR',
      smileIdReasonCode: 'CIVIL_REGISTRY_MATCH',
      smileIdConfidenceScore: 99,
      smileIdAttemptCount: 1,
      videoStatus: 'VALID',
      bankHistoryStatus: 'NOT_APPLICABLE'
    },
    status: 'AUTO_APPROVED',
    riskFlags: [],
    slaDeadlineTimestamp: '2026-10-12T08:30:00.000Z',
    isUrgent: false,
    isOverdue: false,
    firstApprovalBy: 'SYSTEM_AUTOMATION',
    firstApprovalTimestamp: '2026-10-12T06:32:15.000Z',
    reviewerNotes: [],
    auditTrail: [
      {
        id: 'aud-4105-1',
        timestamp: '2026-10-12T06:30:00.000Z',
        actor: 'Joseph Mwangi',
        actorRole: 'FIELD_AGENT',
        action: 'Application Submitted'
      },
      {
        id: 'aud-4105-2',
        timestamp: '2026-10-12T06:32:15.000Z',
        actor: 'Sun King Asynchronous Decision Engine',
        actorRole: 'SYSTEM',
        action: 'Automated Approval Granted',
        details: 'Passed all 5 criteria: Normal value, Clear ID match, Verified OTP, Valid video (>8s), No risk flags.'
      }
    ],
    isSyncedToBackend: true
  },

  // 6: Auto-Approved Normal Value - Musa Danjuma
  {
    id: 'SK-2026-4106',
    submissionTimestamp: '2026-10-12T06:45:00.000Z',
    customer: {
      fullName: 'Musa Danjuma',
      phoneNumber: '8031234567',
      countryCode: '+234',
      dateOfBirth: '1989-07-11',
      location: 'Sabon Gari, Kaduna South'
    },
    product: SUN_KING_CATALOG[1], // Home 200 Plus
    valueCategory: 'NORMAL_VALUE',
    evidence: {
      nationalIdNumber: 'NIN-8910248102',
      nationalIdPhotoUrl: MOCK_IMAGES.idCardClear,
      customerHoldingIdPhotoUrl: MOCK_IMAGES.customerHoldingId,
      idPhotoQuality: 'CLEAR',
      idNumberCorrectionCount: 0,
      videoUrl: MOCK_IMAGES.videoThumbnail,
      videoDurationSeconds: 11,
      videoHasAudio: true,
      videoRetakeCount: 0,
      assistedRecording: false
    },
    verification: {
      stateMachineState: 'CLEAR',
      retryCount: 0,
      maxRetries: 3,
      nextScheduledActionLabel: 'Asynchronous verification completed successfully',
      otpStatus: 'VERIFIED',
      otpCode: '4829',
      otpMethodUsed: 'SMS',
      otpAttemptsCount: 1,
      otpResendCount: 0,
      smileIdStatus: 'CLEAR',
      smileIdReasonCode: 'CIVIL_REGISTRY_MATCH',
      smileIdConfidenceScore: 98,
      smileIdAttemptCount: 1,
      videoStatus: 'VALID',
      bankHistoryStatus: 'NOT_APPLICABLE'
    },
    status: 'AUTO_APPROVED',
    riskFlags: [],
    slaDeadlineTimestamp: '2026-10-12T08:45:00.000Z',
    isUrgent: false,
    isOverdue: false,
    firstApprovalBy: 'SYSTEM_AUTOMATION',
    firstApprovalTimestamp: '2026-10-12T06:47:00.000Z',
    reviewerNotes: [],
    auditTrail: [
      {
        id: 'aud-4106-1',
        timestamp: '2026-10-12T06:45:00.000Z',
        actor: 'Joseph Mwangi',
        actorRole: 'FIELD_AGENT',
        action: 'Application Submitted'
      },
      {
        id: 'aud-4106-2',
        timestamp: '2026-10-12T06:47:00.000Z',
        actor: 'Sun King Asynchronous Decision Engine',
        actorRole: 'SYSTEM',
        action: 'Automated Approval Granted',
        details: 'Deterministic automated approval: All 5 validation checks passed.'
      }
    ],
    isSyncedToBackend: true
  },

  // 7: Auto-Approved Normal Value (QA Audit Sample) - Grace Nakato
  {
    id: 'SK-2026-4107',
    submissionTimestamp: '2026-10-12T06:50:00.000Z',
    customer: {
      fullName: 'Grace Nakato',
      phoneNumber: '772998877',
      countryCode: '+256',
      dateOfBirth: '1994-10-05',
      location: 'Walukuba, Jinja Central'
    },
    product: SUN_KING_CATALOG[2], // Fan system
    valueCategory: 'NORMAL_VALUE',
    evidence: {
      nationalIdNumber: 'CF94029410JNJ',
      nationalIdPhotoUrl: MOCK_IMAGES.idCardClear,
      customerHoldingIdPhotoUrl: MOCK_IMAGES.customerHoldingId,
      idPhotoQuality: 'CLEAR',
      idNumberCorrectionCount: 0,
      videoUrl: MOCK_IMAGES.videoThumbnail,
      videoDurationSeconds: 13,
      videoHasAudio: true,
      videoRetakeCount: 0,
      assistedRecording: false
    },
    verification: {
      stateMachineState: 'CLEAR',
      retryCount: 0,
      maxRetries: 3,
      nextScheduledActionLabel: 'Sampled for 10% quality assurance monitoring',
      otpStatus: 'VERIFIED',
      otpCode: '6190',
      otpMethodUsed: 'SMS',
      otpAttemptsCount: 1,
      otpResendCount: 0,
      smileIdStatus: 'CLEAR',
      smileIdReasonCode: 'CIVIL_REGISTRY_MATCH',
      smileIdConfidenceScore: 99,
      smileIdAttemptCount: 1,
      videoStatus: 'VALID',
      bankHistoryStatus: 'NOT_APPLICABLE'
    },
    status: 'AUTO_APPROVED',
    isAuditSample: true, // 10% QA Audit Sample
    riskFlags: ['Quality Assurance 10% Audit Sample'],
    slaDeadlineTimestamp: '2026-10-12T08:50:00.000Z',
    isUrgent: false,
    isOverdue: false,
    firstApprovalBy: 'SYSTEM_AUTOMATION',
    firstApprovalTimestamp: '2026-10-12T06:52:10.000Z',
    reviewerNotes: [
      {
        id: 'note-4107-1',
        author: 'System Quality Assurance',
        timestamp: '2026-10-12T06:52:10.000Z',
        text: 'Selected for 10% supervisory post-approval compliance sampling. Equipment dispatch remains unlocked.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-4107-1',
        timestamp: '2026-10-12T06:50:00.000Z',
        actor: 'Joseph Mwangi',
        actorRole: 'FIELD_AGENT',
        action: 'Application Submitted'
      },
      {
        id: 'aud-4107-2',
        timestamp: '2026-10-12T06:52:10.000Z',
        actor: 'Sun King Asynchronous Decision Engine',
        actorRole: 'SYSTEM',
        action: 'Automated Approval Granted (Sampled for QA)',
        details: 'Auto-approved with 10% random quality assurance audit flag assigned.'
      }
    ],
    isSyncedToBackend: true
  },

  // 8: Manually Approved Normal Value - Samuel Kiptoo Langat
  {
    id: 'SK-2026-4108',
    submissionTimestamp: '2026-10-12T05:50:00.000Z',
    customer: {
      fullName: 'Samuel Kiptoo Langat',
      phoneNumber: '741223344',
      countryCode: '+254',
      dateOfBirth: '1982-01-30',
      location: 'Kipkaren, Eldoret South'
    },
    product: SUN_KING_CATALOG[1], // Home 200 Plus
    valueCategory: 'NORMAL_VALUE',
    evidence: {
      nationalIdNumber: '21098451',
      nationalIdPhotoUrl: MOCK_IMAGES.idCardClear,
      customerHoldingIdPhotoUrl: MOCK_IMAGES.customerHoldingId,
      idPhotoQuality: 'CLEAR',
      idNumberCorrectionCount: 0,
      videoUrl: MOCK_IMAGES.videoThumbnail,
      videoDurationSeconds: 12,
      videoHasAudio: true,
      videoRetakeCount: 0,
      assistedRecording: false
    },
    verification: {
      stateMachineState: 'CLEAR',
      retryCount: 0,
      maxRetries: 3,
      nextScheduledActionLabel: 'Executive reviewed boundary variation; approved',
      otpStatus: 'VERIFIED',
      otpCode: '8820',
      otpMethodUsed: 'SMS',
      otpAttemptsCount: 1,
      otpResendCount: 0,
      smileIdStatus: 'ATTENTION',
      smileIdReasonCode: 'ADDRESS_DISTRICT_VARIATION',
      smileIdConfidenceScore: 84,
      smileIdAttemptCount: 1,
      videoStatus: 'VALID',
      bankHistoryStatus: 'NOT_APPLICABLE'
    },
    status: 'MANUALLY_APPROVED',
    riskFlags: ['Minor District Variance Cleared'],
    slaDeadlineTimestamp: '2026-10-12T07:50:00.000Z',
    isUrgent: false,
    isOverdue: false,
    assignedReviewer: 'rev-02',
    assignedReviewerName: 'Sarah Kamau (Customer Care Specialist)',
    firstApprovalBy: 'Sarah Kamau',
    firstApprovalTimestamp: '2026-10-12T07:15:00.000Z',
    reviewerNotes: [
      {
        id: 'note-4108-1',
        author: 'Sarah Kamau',
        timestamp: '2026-10-12T07:15:00.000Z',
        text: 'Address shows Kipkaren boundary variance between Uasin Gishu and Nandi county. Verified customer identity and approved installation.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-4108-1',
        timestamp: '2026-10-12T05:50:00.000Z',
        actor: 'Joseph Mwangi',
        actorRole: 'FIELD_AGENT',
        action: 'Application Submitted'
      },
      {
        id: 'aud-4108-2',
        timestamp: '2026-10-12T07:15:00.000Z',
        actor: 'Sarah Kamau',
        actorRole: 'EXECUTIVE',
        action: 'Manual Approval Granted',
        details: 'Executive confirmed boundary variance was legitimate. Approved.'
      }
    ],
    isSyncedToBackend: true
  },

  // 9: Manually Approved Normal Value - Zainab Abba Kyari
  {
    id: 'SK-2026-4109',
    submissionTimestamp: '2026-10-12T05:30:00.000Z',
    customer: {
      fullName: 'Zainab Abba Kyari',
      phoneNumber: '8023344556',
      countryCode: '+234',
      dateOfBirth: '1993-09-14',
      location: 'Nasarawa, Kano City'
    },
    product: SUN_KING_CATALOG[0], // Home 60
    valueCategory: 'NORMAL_VALUE',
    evidence: {
      nationalIdNumber: 'NIN-7712390192',
      nationalIdPhotoUrl: MOCK_IMAGES.idCardClear,
      customerHoldingIdPhotoUrl: MOCK_IMAGES.customerHoldingId,
      idPhotoQuality: 'CLEAR',
      idNumberCorrectionCount: 0,
      videoUrl: MOCK_IMAGES.videoThumbnail,
      videoDurationSeconds: 10,
      videoHasAudio: true,
      videoRetakeCount: 0,
      assistedRecording: true
    },
    verification: {
      stateMachineState: 'CLEAR',
      retryCount: 0,
      maxRetries: 3,
      nextScheduledActionLabel: 'IVR fallback token verified; approved',
      otpStatus: 'IVR_COMPLETED',
      otpCode: '4829',
      otpMethodUsed: 'IVR',
      otpAttemptsCount: 2,
      otpResendCount: 1,
      smileIdStatus: 'CLEAR',
      smileIdReasonCode: 'CIVIL_REGISTRY_MATCH',
      smileIdConfidenceScore: 97,
      smileIdAttemptCount: 1,
      videoStatus: 'VALID',
      bankHistoryStatus: 'NOT_APPLICABLE'
    },
    status: 'MANUALLY_APPROVED',
    riskFlags: ['IVR Phone Verification Cleared'],
    slaDeadlineTimestamp: '2026-10-12T07:30:00.000Z',
    isUrgent: false,
    isOverdue: false,
    assignedReviewer: 'rev-02',
    assignedReviewerName: 'Sarah Kamau (Customer Care Specialist)',
    firstApprovalBy: 'Sarah Kamau',
    firstApprovalTimestamp: '2026-10-12T07:05:00.000Z',
    reviewerNotes: [
      {
        id: 'note-4109-1',
        author: 'Sarah Kamau',
        timestamp: '2026-10-12T07:05:00.000Z',
        text: 'SMS OTP failed due to Airtel carrier cell tower outage; agent used IVR voice call. Verified voice token and approved.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-4109-1',
        timestamp: '2026-10-12T05:30:00.000Z',
        actor: 'Joseph Mwangi',
        actorRole: 'FIELD_AGENT',
        action: 'Application Submitted'
      },
      {
        id: 'aud-4109-2',
        timestamp: '2026-10-12T07:05:00.000Z',
        actor: 'Sarah Kamau',
        actorRole: 'EXECUTIVE',
        action: 'Manual Approval Granted',
        details: 'Approved after verifying IVR fallback authorization.'
      }
    ],
    isSyncedToBackend: true
  },

  // 10: Rejected - Kevin Otieno Ouma (ID Record Not Found)
  {
    id: 'SK-2026-4110',
    submissionTimestamp: '2026-10-11T11:00:00.000Z',
    customer: {
      fullName: 'Kevin Otieno Ouma',
      phoneNumber: '789012345',
      countryCode: '+254',
      dateOfBirth: '1970-01-01',
      location: 'Bondo Township, Siaya'
    },
    product: SUN_KING_CATALOG[0],
    valueCategory: 'NORMAL_VALUE',
    evidence: {
      nationalIdNumber: '11223344',
      nationalIdPhotoUrl: MOCK_IMAGES.idCardClear,
      customerHoldingIdPhotoUrl: MOCK_IMAGES.customerHoldingId,
      idPhotoQuality: 'CLEAR',
      idNumberCorrectionCount: 1, // Correction attempt used
      videoUrl: MOCK_IMAGES.videoThumbnail,
      videoDurationSeconds: 8,
      videoHasAudio: true,
      videoRetakeCount: 0,
      assistedRecording: false
    },
    verification: {
      stateMachineState: 'BLOCKED_NOT_FOUND',
      retryCount: 2,
      maxRetries: 2,
      failureReason: 'NATIONAL_ID_DOES_NOT_EXIST',
      diagnosticTrace: 'Queries to Central Registry Gateway returned HTTP 404: National identity record does not exist in civil registrar database.',
      nextScheduledActionLabel: 'Closed: Registration rejected due to non-existent identity document',
      otpStatus: 'VERIFIED',
      otpCode: '9002',
      otpMethodUsed: 'SMS',
      otpAttemptsCount: 1,
      otpResendCount: 0,
      smileIdStatus: 'BLOCKED_NOT_FOUND',
      smileIdReasonCode: 'NATIONAL_ID_DOES_NOT_EXIST',
      smileIdConfidenceScore: 0,
      smileIdAttemptCount: 2,
      videoStatus: 'VALID',
      bankHistoryStatus: 'NOT_APPLICABLE'
    },
    status: 'REJECTED',
    riskFlags: ['National ID Record Not Found in Civil Registry'],
    slaDeadlineTimestamp: '2026-10-11T13:00:00.000Z',
    isUrgent: false,
    isOverdue: true,
    rejectionReasonCode: 'ID_RECORD_NOT_FOUND',
    rejectionExplanation: 'National ID number 11223344 could not be matched in the civil population database after multiple official registrar queries.',
    reviewerNotes: [
      {
        id: 'note-4110-1',
        author: 'Sarah Kamau',
        timestamp: '2026-10-11T12:15:00.000Z',
        text: 'Secondary registrar verification confirmed this ID number does not exist. Rejection issued per anti-counterfeiting compliance policy.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-4110-1',
        timestamp: '2026-10-11T11:00:00.000Z',
        actor: 'Joseph Mwangi',
        actorRole: 'FIELD_AGENT',
        action: 'Application Submitted'
      },
      {
        id: 'aud-4110-2',
        timestamp: '2026-10-11T12:15:00.000Z',
        actor: 'Sarah Kamau',
        actorRole: 'EXECUTIVE',
        action: 'Application Rejected',
        reason: 'ID_RECORD_NOT_FOUND',
        details: 'National ID number does not exist in national population registry.'
      }
    ],
    isSyncedToBackend: true
  },

  // 11: Rejected - Daniel Ndlovu (Policy Ineligible / Default)
  {
    id: 'SK-2026-4111',
    submissionTimestamp: '2026-10-11T14:20:00.000Z',
    customer: {
      fullName: 'Daniel Ndlovu',
      phoneNumber: '715566778',
      countryCode: '+254',
      dateOfBirth: '1986-06-18',
      location: 'Kitengela Plains, Kajiado'
    },
    product: SUN_KING_CATALOG[2], // Fan system
    valueCategory: 'NORMAL_VALUE',
    evidence: {
      nationalIdNumber: '25109482',
      nationalIdPhotoUrl: MOCK_IMAGES.idCardClear,
      customerHoldingIdPhotoUrl: MOCK_IMAGES.customerHoldingId,
      idPhotoQuality: 'CLEAR',
      idNumberCorrectionCount: 0,
      videoUrl: MOCK_IMAGES.videoThumbnail,
      videoDurationSeconds: 11,
      videoHasAudio: true,
      videoRetakeCount: 0,
      assistedRecording: false
    },
    verification: {
      stateMachineState: 'CLEAR',
      retryCount: 0,
      maxRetries: 3,
      failureReason: 'CREDIT_BUREAU_DEFAULT_FLAG',
      diagnosticTrace: 'Identity confirmed clear, but external shared credit bureau cross-check returned active hardware repossession lock.',
      nextScheduledActionLabel: 'Closed: Delinquency disqualification',
      otpStatus: 'VERIFIED',
      otpCode: '3194',
      otpMethodUsed: 'SMS',
      otpAttemptsCount: 1,
      otpResendCount: 0,
      smileIdStatus: 'CLEAR',
      smileIdReasonCode: 'CIVIL_REGISTRY_MATCH',
      smileIdConfidenceScore: 98,
      smileIdAttemptCount: 1,
      videoStatus: 'VALID',
      bankHistoryStatus: 'NOT_APPLICABLE'
    },
    status: 'REJECTED',
    riskFlags: ['Active Default Bureau Delinquency'],
    slaDeadlineTimestamp: '2026-10-11T16:20:00.000Z',
    isUrgent: false,
    isOverdue: true,
    rejectionReasonCode: 'POLICY_INELIGIBLE_LOCATION',
    rejectionExplanation: 'Customer has an unresolved 180-day default with active hardware lock on previous PAYG loan system.',
    reviewerNotes: [
      {
        id: 'note-4111-1',
        author: 'Grace Achieng',
        timestamp: '2026-10-11T15:30:00.000Z',
        text: 'Credit bureau cross-check revealed unresolved default on account #SK-2024-9182. Denied new equipment issuance.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-4111-1',
        timestamp: '2026-10-11T14:20:00.000Z',
        actor: 'Joseph Mwangi',
        actorRole: 'FIELD_AGENT',
        action: 'Application Submitted'
      },
      {
        id: 'aud-4111-2',
        timestamp: '2026-10-11T15:30:00.000Z',
        actor: 'Grace Achieng',
        actorRole: 'SENIOR_EXECUTIVE',
        action: 'Application Rejected',
        reason: 'POLICY_INELIGIBLE_LOCATION',
        details: 'Rejected due to active delinquency on prior PAYG installation.'
      }
    ],
    isSyncedToBackend: true
  },

  // 12: Temporary Service Failure (Retry Scheduled) - Amina Hassan Bakari
  {
    id: 'SK-2026-4112',
    submissionTimestamp: '2026-10-12T08:15:00.000Z',
    customer: {
      fullName: 'Amina Hassan Bakari',
      phoneNumber: '767890123',
      countryCode: '+254',
      dateOfBirth: '1995-12-05',
      location: 'Kisauni, Mombasa North'
    },
    product: SUN_KING_CATALOG[0], // Home 60
    valueCategory: 'NORMAL_VALUE',
    evidence: {
      nationalIdNumber: '34109823',
      nationalIdPhotoUrl: MOCK_IMAGES.idCardClear,
      customerHoldingIdPhotoUrl: MOCK_IMAGES.customerHoldingId,
      idPhotoQuality: 'CLEAR',
      idNumberCorrectionCount: 0,
      videoUrl: MOCK_IMAGES.videoThumbnail,
      videoDurationSeconds: 9,
      videoHasAudio: true,
      videoRetakeCount: 0,
      assistedRecording: true
    },
    verification: {
      stateMachineState: 'RETRY_SCHEDULED',
      retryCount: 1,
      maxRetries: 3,
      nextScheduledRetryMinutes: 5,
      nextScheduledActionLabel: 'Automated retry 2 of 3 scheduled in 5 minutes (Civil Registry gateway timeout)',
      failureReason: 'NATIONAL_GATEWAY_TIMEOUT',
      diagnosticTrace: 'Smile ID non-biometric simulation caught HTTP 504 Gateway Timeout from civil records server. Auto-retrying at 1m, 5m, 15m.',
      otpStatus: 'VERIFIED',
      otpCode: '6634',
      otpMethodUsed: 'SMS',
      otpAttemptsCount: 1,
      otpResendCount: 0,
      smileIdStatus: 'ERROR_SERVICE_UNAVAILABLE',
      smileIdReasonCode: 'NATIONAL_GATEWAY_TIMEOUT',
      smileIdConfidenceScore: 0,
      smileIdAttemptCount: 1,
      videoStatus: 'VALID',
      bankHistoryStatus: 'NOT_APPLICABLE'
    },
    status: 'PENDING_VERIFICATION',
    riskFlags: ['Civil Registry Gateway Timeout (Auto-Retry Scheduled)'],
    slaDeadlineTimestamp: '2026-10-12T10:15:00.000Z',
    isUrgent: false,
    isOverdue: false,
    reviewerNotes: [
      {
        id: 'note-4112-1',
        author: 'System Queue',
        timestamp: '2026-10-12T08:15:00.000Z',
        text: 'Smile ID API returned HTTP 504 timeout on Civil Registrar gateway. Background auto-retry scheduled in 5 minutes.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-4112-1',
        timestamp: '2026-10-12T08:15:00.000Z',
        actor: 'Joseph Mwangi',
        actorRole: 'FIELD_AGENT',
        action: 'Application Submitted'
      },
      {
        id: 'aud-4112-2',
        timestamp: '2026-10-12T08:16:00.000Z',
        actor: 'Smile ID Non-Biometric Engine',
        actorRole: 'SYSTEM',
        action: 'Verification Temporarily Failed (Service Unavailable)',
        details: 'Civil Registry gateway timeout. Case queued for automatic retry.'
      }
    ],
    isSyncedToBackend: true
  },

  // 13: Pending Verification in Queue - Joshua Mwewa
  {
    id: 'SK-2026-4113',
    submissionTimestamp: '2026-10-12T08:25:00.000Z',
    customer: {
      fullName: 'Joshua Mwewa',
      phoneNumber: '977665544',
      countryCode: '+256',
      dateOfBirth: '1988-05-14',
      location: 'Kitwe Copperbelt, Central'
    },
    product: SUN_KING_CATALOG[1], // Home 200 Plus
    valueCategory: 'NORMAL_VALUE',
    evidence: {
      nationalIdNumber: 'NR-88129031',
      nationalIdPhotoUrl: MOCK_IMAGES.idCardClear,
      customerHoldingIdPhotoUrl: MOCK_IMAGES.customerHoldingId,
      idPhotoQuality: 'CLEAR',
      idNumberCorrectionCount: 0,
      videoUrl: MOCK_IMAGES.videoThumbnail,
      videoDurationSeconds: 11,
      videoHasAudio: true,
      videoRetakeCount: 0,
      assistedRecording: false
    },
    verification: {
      stateMachineState: 'VERIFICATION_IN_PROGRESS',
      retryCount: 0,
      maxRetries: 3,
      nextScheduledActionLabel: 'Async queue worker evaluating national civil registry record',
      otpStatus: 'VERIFIED',
      otpCode: '3819',
      otpMethodUsed: 'SMS',
      otpAttemptsCount: 1,
      otpResendCount: 0,
      smileIdStatus: 'PENDING',
      smileIdReasonCode: 'ASYNC_QUEUE_PROCESSING',
      smileIdConfidenceScore: 0,
      smileIdAttemptCount: 0,
      videoStatus: 'VALID',
      bankHistoryStatus: 'NOT_APPLICABLE'
    },
    status: 'PENDING_VERIFICATION',
    riskFlags: [],
    slaDeadlineTimestamp: '2026-10-12T10:25:00.000Z',
    isUrgent: false,
    isOverdue: false,
    reviewerNotes: [],
    auditTrail: [
      {
        id: 'aud-4113-1',
        timestamp: '2026-10-12T08:25:00.000Z',
        actor: 'Joseph Mwangi',
        actorRole: 'FIELD_AGENT',
        action: 'Application Submitted'
      }
    ],
    isSyncedToBackend: true
  },

  // 14: Suspected Fraud - Bernard K. Mutua
  {
    id: 'SK-2026-4114',
    submissionTimestamp: '2026-10-12T05:20:00.000Z',
    customer: {
      fullName: 'Bernard K. Mutua',
      phoneNumber: '756789012',
      countryCode: '+254',
      dateOfBirth: '1985-09-29',
      location: 'Kangundo Road, Machakos'
    },
    product: SUN_KING_CATALOG[1], // Home 200 Plus
    valueCategory: 'NORMAL_VALUE',
    evidence: {
      nationalIdNumber: '28194012',
      nationalIdPhotoUrl: MOCK_IMAGES.idCardClear,
      customerHoldingIdPhotoUrl: MOCK_IMAGES.customerHoldingId,
      idPhotoQuality: 'CLEAR',
      idNumberCorrectionCount: 0,
      videoUrl: MOCK_IMAGES.videoThumbnail,
      videoDurationSeconds: 10,
      videoHasAudio: true,
      videoRetakeCount: 0,
      assistedRecording: false
    },
    verification: {
      stateMachineState: 'BLOCKED_FRAUD',
      retryCount: 0,
      maxRetries: 0,
      failureReason: 'NATIONAL_FRAUD_REGISTRY_MATCH',
      diagnosticTrace: 'National ID number 28194012 flagged on consortium anti-fraud shared index for stolen identity duplication. Hardware release locked.',
      nextScheduledActionLabel: 'Ordinary approval disabled. Awaiting Fraud Officer adjudication.',
      otpStatus: 'VERIFIED',
      otpCode: '1190',
      otpMethodUsed: 'SMS',
      otpAttemptsCount: 1,
      otpResendCount: 0,
      smileIdStatus: 'BLOCKED_FRAUD',
      smileIdReasonCode: 'NATIONAL_FRAUD_REGISTRY_MATCH',
      smileIdConfidenceScore: 9,
      smileIdAttemptCount: 1,
      videoStatus: 'VALID',
      bankHistoryStatus: 'NOT_APPLICABLE'
    },
    status: 'SUSPECTED_FRAUD',
    riskFlags: ['Suspected Fraud', 'National Fraud Watchlist', 'High Velocity Device Tag'],
    slaDeadlineTimestamp: '2026-10-12T07:20:00.000Z',
    isUrgent: false,
    isOverdue: true,
    assignedReviewer: 'rev-fraud-01',
    assignedReviewerName: 'Alex Kimani (Fraud & Investigations)',
    reviewerNotes: [
      {
        id: 'note-4114-1',
        author: 'Alex Kimani',
        timestamp: '2026-10-12T06:00:00.000Z',
        text: 'ID number 28194012 flagged on anti-fraud shared consortium with active stolen identity report. Ordinary approval disabled.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-4114-1',
        timestamp: '2026-10-12T05:20:00.000Z',
        actor: 'Joseph Mwangi',
        actorRole: 'FIELD_AGENT',
        action: 'Application Submitted'
      },
      {
        id: 'aud-4114-2',
        timestamp: '2026-10-12T05:22:00.000Z',
        actor: 'Smile ID Non-Biometric Engine',
        actorRole: 'SYSTEM',
        action: 'Terminal Fraud Alert Generated',
        details: 'Blocked: NATIONAL_FRAUD_REGISTRY_MATCH. Account frozen for fraud investigation.'
      }
    ],
    isSyncedToBackend: true
  },

  // 15: OTP Pending (Deferred in Field with simulated IVR schedule) - James Ndung'u Kariuki
  {
    id: 'SK-2026-4115',
    submissionTimestamp: '2026-10-12T08:00:00.000Z',
    customer: {
      fullName: 'James Ndung\'u Kariuki',
      phoneNumber: '778901234',
      countryCode: '+254',
      dateOfBirth: '1975-06-12',
      location: 'Mai Mahiu Rural, Naivasha'
    },
    product: SUN_KING_CATALOG[1], // Home 200 Plus
    valueCategory: 'NORMAL_VALUE',
    evidence: {
      nationalIdNumber: '18902415',
      nationalIdPhotoUrl: MOCK_IMAGES.idCardClear,
      customerHoldingIdPhotoUrl: MOCK_IMAGES.customerHoldingId,
      idPhotoQuality: 'CLEAR',
      idNumberCorrectionCount: 0,
      videoUrl: MOCK_IMAGES.videoThumbnail,
      videoDurationSeconds: 11,
      videoHasAudio: true,
      videoRetakeCount: 0,
      assistedRecording: true
    },
    verification: {
      stateMachineState: 'ATTENTION',
      retryCount: 1,
      maxRetries: 3,
      otpDeferredScheduledMinutes: 30, // Scheduled IVR callback at 30 min and 2 hours
      otpDeferredWindowExpiresTimestamp: '2026-10-12T12:00:00.000Z', // 4 hour window
      nextScheduledActionLabel: 'Automated IVR call retry scheduled at 30 min (window expires in 3h 40m)',
      failureReason: 'PHONE_OTP_DEFERRED_NETWORK_LATENCY',
      diagnosticTrace: 'Agent deferred OTP at doorstep due to cell carrier tower congestion. IVR callback retry cycle initialized: 30m, 120m.',
      otpStatus: 'IVR_DEFERRED',
      otpAttemptsCount: 2,
      otpResendCount: 1,
      smileIdStatus: 'CLEAR',
      smileIdReasonCode: 'CIVIL_REGISTRY_MATCH',
      smileIdConfidenceScore: 96,
      smileIdAttemptCount: 1,
      videoStatus: 'VALID',
      bankHistoryStatus: 'NOT_APPLICABLE'
    },
    status: 'MANUAL_REVIEW',
    riskFlags: ['OTP Pending (Network Deferred in Field)', 'Assisted Video Recording'],
    slaDeadlineTimestamp: '2026-10-12T10:00:00.000Z',
    isUrgent: false,
    isOverdue: false,
    reviewerNotes: [
      {
        id: 'note-4115-1',
        author: 'System Queue',
        timestamp: '2026-10-12T08:00:00.000Z',
        text: 'Agent deferred OTP after cell tower congestion. Executive callback or verification pending.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-4115-1',
        timestamp: '2026-10-12T08:00:00.000Z',
        actor: 'Joseph Mwangi',
        actorRole: 'FIELD_AGENT',
        action: 'Application Submitted with Deferred OTP',
        details: 'SMS OTP delayed at tower; deferred in field so agent could proceed. IVR scheduled at 30m.'
      }
    ],
    isSyncedToBackend: true
  },

  // 16: Overdue Application - Esther Akinyi
  {
    id: 'SK-2026-4116',
    submissionTimestamp: '2026-10-12T05:30:00.000Z', // Submitted 3.5h ago
    customer: {
      fullName: 'Esther Akinyi',
      phoneNumber: '719887766',
      countryCode: '+254',
      dateOfBirth: '1989-12-04',
      location: 'Homa Bay Pier, South Nyanza'
    },
    product: SUN_KING_CATALOG[0], // Home 60
    valueCategory: 'NORMAL_VALUE',
    evidence: {
      nationalIdNumber: '29810452',
      nationalIdPhotoUrl: MOCK_IMAGES.idCardClear,
      customerHoldingIdPhotoUrl: MOCK_IMAGES.customerHoldingId,
      idPhotoQuality: 'CLEAR',
      idNumberCorrectionCount: 0,
      videoUrl: MOCK_IMAGES.videoThumbnail,
      videoDurationSeconds: 10,
      videoHasAudio: true,
      videoRetakeCount: 0,
      assistedRecording: false
    },
    verification: {
      stateMachineState: 'ATTENTION',
      retryCount: 0,
      maxRetries: 3,
      failureReason: 'SLA_DEADLINE_BREACHED',
      diagnosticTrace: 'Application submitted 3.5 hours ago without conclusive automated sign-off. Normal Value 2h SLA deadline breached by 90 minutes.',
      nextScheduledActionLabel: 'Priority executive assignment required (Overdue SLA)',
      otpStatus: 'VERIFIED',
      otpCode: '4829',
      otpMethodUsed: 'SMS',
      otpAttemptsCount: 1,
      otpResendCount: 0,
      smileIdStatus: 'ATTENTION',
      smileIdReasonCode: 'OFFLINE_REGISTRY_PARTIAL_MATCH',
      smileIdConfidenceScore: 79,
      smileIdAttemptCount: 1,
      videoStatus: 'VALID',
      bankHistoryStatus: 'NOT_APPLICABLE'
    },
    status: 'MANUAL_REVIEW',
    riskFlags: ['Overdue SLA Escalation (>90m Past Deadline)'],
    slaDeadlineTimestamp: '2026-10-12T07:30:00.000Z', // In the past!
    isUrgent: false,
    isOverdue: true,
    assignedReviewer: 'rev-02',
    assignedReviewerName: 'Sarah Kamau (Customer Care Specialist)',
    reviewerNotes: [
      {
        id: 'note-4116-1',
        author: 'SLA Monitor',
        timestamp: '2026-10-12T07:30:00.000Z',
        text: 'Case exceeded 2-hour Normal Value SLA deadline. Escalated to priority executive queue.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-4116-1',
        timestamp: '2026-10-12T05:30:00.000Z',
        actor: 'Joseph Mwangi',
        actorRole: 'FIELD_AGENT',
        action: 'Application Submitted'
      },
      {
        id: 'aud-4116-2',
        timestamp: '2026-10-12T07:30:00.000Z',
        actor: 'SLA Escalation Engine',
        actorRole: 'SYSTEM',
        action: 'SLA Breach Recorded',
        details: 'Overdue beyond 2-hour threshold without final decision.'
      }
    ],
    isSyncedToBackend: true
  },

  // 17: High Value with Bank History Available - David Kiprotich Rono
  {
    id: 'SK-2026-4117',
    submissionTimestamp: '2026-10-11T16:00:00.000Z',
    customer: {
      fullName: 'David Kiprotich Rono',
      phoneNumber: '745678901',
      countryCode: '+254',
      dateOfBirth: '1979-02-18',
      location: 'Turbo Sub-County, Eldoret Outskirts'
    },
    product: SUN_KING_CATALOG[3], // Solar TV 32"
    valueCategory: 'HIGH_VALUE',
    evidence: {
      nationalIdNumber: '21948124',
      nationalIdPhotoUrl: MOCK_IMAGES.idCardClear,
      customerHoldingIdPhotoUrl: MOCK_IMAGES.customerHoldingId,
      idPhotoQuality: 'CLEAR',
      idNumberCorrectionCount: 0,
      videoUrl: MOCK_IMAGES.videoThumbnail,
      videoDurationSeconds: 15,
      videoHasAudio: true,
      videoRetakeCount: 0,
      assistedRecording: false,
      bankStatementUrl: 'mock-statement-turbo-farmer.pdf',
      bankStatementFileName: 'Mpesa_Statement_6mo_DavidRono.pdf',
      bankConsentGiven: true
    },
    verification: {
      stateMachineState: 'CLEAR',
      retryCount: 0,
      maxRetries: 3,
      nextScheduledActionLabel: 'Stage 1 approved; awaiting mandatory 2nd independent senior sign-off',
      otpStatus: 'VERIFIED',
      otpCode: '7721',
      otpMethodUsed: 'SMS',
      otpAttemptsCount: 1,
      otpResendCount: 0,
      smileIdStatus: 'CLEAR',
      smileIdReasonCode: 'CIVIL_REGISTRY_MATCH',
      smileIdConfidenceScore: 97,
      smileIdAttemptCount: 1,
      videoStatus: 'VALID',
      bankHistoryStatus: 'PROVIDED'
    },
    status: 'MANUAL_REVIEW',
    riskFlags: ['High Value Financing ($320+)', 'Awaiting 2nd Senior Approval'],
    slaDeadlineTimestamp: '2026-10-12T16:00:00.000Z',
    isUrgent: false,
    isOverdue: false,
    assignedReviewer: 'rev-sr-01',
    assignedReviewerName: 'Grace Achieng (Senior Credit Risk Manager)',
    firstApprovalBy: 'Grace Achieng (Senior Credit Risk Manager)',
    firstApprovalTimestamp: '2026-10-12T07:10:00.000Z',
    requiresSecondApproval: true,
    reviewerNotes: [
      {
        id: 'note-4117-1',
        author: 'Grace Achieng',
        timestamp: '2026-10-12T07:10:00.000Z',
        text: 'Bank history confirmed: M-Pesa monthly cash inflow exceeds KSh 38,000. Approved Stage 1; awaiting 2nd independent senior sign-off.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-4117-1',
        timestamp: '2026-10-11T16:00:00.000Z',
        actor: 'Joseph Mwangi',
        actorRole: 'FIELD_AGENT',
        action: 'Application Submitted',
        details: 'High-value registration with M-Pesa statement attached.'
      },
      {
        id: 'aud-4117-2',
        timestamp: '2026-10-12T07:10:00.000Z',
        actor: 'Grace Achieng',
        actorRole: 'SENIOR_EXECUTIVE',
        action: 'Stage 1 Senior Approval Granted',
        details: 'Passed credit threshold. Waiting for mandatory 2nd senior approval.'
      }
    ],
    isSyncedToBackend: true
  },

  // 18: High Value with Bank History MISSING - Fatuma Ali Mohammed
  {
    id: 'SK-2026-4118',
    submissionTimestamp: '2026-10-12T06:15:00.000Z',
    customer: {
      fullName: 'Fatuma Ali Mohammed',
      phoneNumber: '711223344',
      countryCode: '+254',
      dateOfBirth: '1983-04-12',
      location: 'Garissa Township, North Eastern'
    },
    product: SUN_KING_CATALOG[4], // PowerHub 1000W Inverter ($680+ High Value)
    valueCategory: 'HIGH_VALUE',
    evidence: {
      nationalIdNumber: '22891045',
      nationalIdPhotoUrl: MOCK_IMAGES.idCardClear,
      customerHoldingIdPhotoUrl: MOCK_IMAGES.customerHoldingId,
      idPhotoQuality: 'CLEAR',
      idNumberCorrectionCount: 0,
      videoUrl: MOCK_IMAGES.videoThumbnail,
      videoDurationSeconds: 14,
      videoHasAudio: true,
      videoRetakeCount: 0,
      assistedRecording: false,
      bankConsentGiven: true
    },
    verification: {
      stateMachineState: 'ATTENTION',
      retryCount: 0,
      maxRetries: 3,
      failureReason: 'HIGH_VALUE_STATEMENT_NOT_PROVIDED',
      diagnosticTrace: 'High Value PowerHub application submitted without instant M-Pesa cashflow statement. Senior credit committee must assess asset collateral.',
      nextScheduledActionLabel: 'Senior credit review: decide whether to request bank history or approve on collateral',
      otpStatus: 'VERIFIED',
      otpCode: '5519',
      otpMethodUsed: 'SMS',
      otpAttemptsCount: 1,
      otpResendCount: 0,
      smileIdStatus: 'CLEAR',
      smileIdReasonCode: 'CIVIL_REGISTRY_MATCH',
      smileIdConfidenceScore: 98,
      smileIdAttemptCount: 1,
      videoStatus: 'VALID',
      bankHistoryStatus: 'MAY_BE_REQUESTED_LATER'
    },
    status: 'MANUAL_REVIEW',
    riskFlags: ['High Value Financing ($680+)', 'Financial Statement Not Yet Attached'],
    slaDeadlineTimestamp: '2026-10-13T06:15:00.000Z',
    isUrgent: false,
    isOverdue: false,
    assignedReviewer: 'rev-sr-01',
    assignedReviewerName: 'Grace Achieng (Senior Credit Risk Manager)',
    reviewerNotes: [
      {
        id: 'note-4118-1',
        author: 'Grace Achieng',
        timestamp: '2026-10-12T07:20:00.000Z',
        text: 'High-value PowerHub inverter registered without bank statement. Senior reviewer should evaluate whether to request bank history or verify merchant shop premise.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-4118-1',
        timestamp: '2026-10-12T06:15:00.000Z',
        actor: 'Joseph Mwangi',
        actorRole: 'FIELD_AGENT',
        action: 'Application Submitted'
      },
      {
        id: 'aud-4118-2',
        timestamp: '2026-10-12T07:20:00.000Z',
        actor: 'Credit Policy Router',
        actorRole: 'SYSTEM',
        action: 'Routed to Senior Credit Risk Queue',
        details: 'High-Value system financing without instant statement attachment.'
      }
    ],
    isSyncedToBackend: true
  },

  // 19: Offline Saved Case - Stephen Otieno
  {
    id: 'SK-2026-4119',
    submissionTimestamp: '2026-10-12T08:20:00.000Z',
    customer: {
      fullName: 'Stephen Otieno',
      phoneNumber: '799887766',
      countryCode: '+254',
      dateOfBirth: '1990-08-08',
      location: 'Rusinga Island, Lake Victoria'
    },
    product: SUN_KING_CATALOG[0], // Home 60
    valueCategory: 'NORMAL_VALUE',
    evidence: {
      nationalIdNumber: '30129481',
      nationalIdPhotoUrl: MOCK_IMAGES.idCardClear,
      customerHoldingIdPhotoUrl: MOCK_IMAGES.customerHoldingId,
      idPhotoQuality: 'CLEAR',
      idNumberCorrectionCount: 0,
      videoUrl: MOCK_IMAGES.videoThumbnail,
      videoDurationSeconds: 10,
      videoHasAudio: true,
      videoRetakeCount: 0,
      assistedRecording: false
    },
    verification: {
      stateMachineState: 'WAITING_FOR_NETWORK',
      retryCount: 0,
      maxRetries: 3,
      nextScheduledActionLabel: 'Cached in local agent outbox; will submit once mobile data is connected',
      otpStatus: 'VERIFIED',
      otpCode: '4829',
      otpMethodUsed: 'SMS',
      otpAttemptsCount: 1,
      otpResendCount: 0,
      smileIdStatus: 'PENDING',
      smileIdReasonCode: 'SAVED_OFFLINE_AWAITING_SYNC',
      smileIdConfidenceScore: 0,
      smileIdAttemptCount: 0,
      videoStatus: 'VALID',
      bankHistoryStatus: 'NOT_APPLICABLE'
    },
    status: 'PENDING_VERIFICATION',
    riskFlags: ['Cached Offline on Device'],
    slaDeadlineTimestamp: '2026-10-12T10:20:00.000Z',
    isUrgent: false,
    isOverdue: false,
    reviewerNotes: [],
    auditTrail: [
      {
        id: 'aud-4119-1',
        timestamp: '2026-10-12T08:20:00.000Z',
        actor: 'Joseph Mwangi',
        actorRole: 'FIELD_AGENT',
        action: 'Application Saved Locally (Offline)',
        details: 'Device offline at Rusinga Island. Cached in local outbox waiting for connectivity.'
      }
    ],
    isOfflineCreated: true,
    isSyncedToBackend: false
  },

  // 20: Missing Result / Untrusted Webhook Case - Kofi Mensah
  {
    id: 'SK-2026-4120',
    submissionTimestamp: '2026-10-12T08:05:00.000Z',
    customer: {
      fullName: 'Kofi Mensah',
      phoneNumber: '710099887',
      countryCode: '+254',
      dateOfBirth: '1991-05-18',
      location: 'Namanga Border Post, Kajiado'
    },
    product: SUN_KING_CATALOG[1], // Home 200 Plus
    valueCategory: 'NORMAL_VALUE',
    evidence: {
      nationalIdNumber: '29048192',
      nationalIdPhotoUrl: MOCK_IMAGES.idCardClear,
      customerHoldingIdPhotoUrl: MOCK_IMAGES.customerHoldingId,
      idPhotoQuality: 'CLEAR',
      idNumberCorrectionCount: 0,
      videoUrl: MOCK_IMAGES.videoThumbnail,
      videoDurationSeconds: 12,
      videoHasAudio: true,
      videoRetakeCount: 0,
      assistedRecording: false
    },
    verification: {
      stateMachineState: 'RESULT_NOT_CONFIRMED',
      retryCount: 1,
      maxRetries: 3,
      unconfirmedWebhook: true,
      failureReason: 'ASYNC_WEBHOOK_DELIVERY_MISSING',
      diagnosticTrace: 'Verification payload dispatched to simulated civil registry service, but callback webhook event was not received or failed HMAC validation. Result unconfirmed.',
      nextScheduledActionLabel: 'Manual status polling query available in executive console',
      otpStatus: 'VERIFIED',
      otpCode: '4829',
      otpMethodUsed: 'SMS',
      otpAttemptsCount: 1,
      otpResendCount: 0,
      smileIdStatus: 'PENDING',
      smileIdReasonCode: 'UNCONFIRMED_WEBHOOK',
      smileIdConfidenceScore: 0,
      smileIdAttemptCount: 1,
      videoStatus: 'VALID',
      bankHistoryStatus: 'NOT_APPLICABLE'
    },
    status: 'PENDING_VERIFICATION',
    riskFlags: ['Webhook Event Not Received (Result Not Confirmed)'],
    slaDeadlineTimestamp: '2026-10-12T10:05:00.000Z',
    isUrgent: false,
    isOverdue: false,
    reviewerNotes: [
      {
        id: 'note-4120-1',
        author: 'System Webhook Dispatcher',
        timestamp: '2026-10-12T08:06:00.000Z',
        text: 'Callback webhook timed out after 300s. Event marked unconfirmed; query status poll allowed.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-4120-1',
        timestamp: '2026-10-12T08:05:00.000Z',
        actor: 'Joseph Mwangi',
        actorRole: 'FIELD_AGENT',
        action: 'Application Submitted'
      },
      {
        id: 'aud-4120-2',
        timestamp: '2026-10-12T08:07:00.000Z',
        actor: 'Sun King Security Gateway',
        actorRole: 'SYSTEM',
        action: 'Webhook Callback Missing',
        details: 'Result not confirmed. System refuses to assume success without valid cryptographic acknowledgment.'
      }
    ],
    isSyncedToBackend: true
  }
];
