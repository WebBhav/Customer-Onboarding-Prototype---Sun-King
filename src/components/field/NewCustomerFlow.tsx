import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  RegistrationApplication,
  ProductCatalogItem,
  SmileIdSimulatedStatus,
  OtpStatus,
  VideoStatus,
  BankHistoryStatus
} from '../../types';
import { SUN_KING_CATALOG } from '../../data/catalog';
import { CameraModal } from './CameraModal';
import { VideoRecordModal } from './VideoRecordModal';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Smartphone,
  PhoneCall,
  Camera,
  Video,
  FileText,
  DollarSign,
  Sun,
  User,
  ArrowRight,
  Info,
  RefreshCw,
  Send,
  Eye,
  Check,
  XCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

interface NewCustomerFlowProps {
  onCancel: () => void;
  onComplete: (app: RegistrationApplication) => void;
}

export const NewCustomerFlow: React.FC<NewCustomerFlowProps> = ({ onCancel, onComplete }) => {
  const { submitNewApplication, fieldAgent, network, simulatedTime } = useApp();
  const navigate = useNavigate();

  // Wizard state: Step 1 to Step 8
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Customer details
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+254');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('1990-05-15');
  const [location, setLocation] = useState('Kisumu Central Market, Kisumu');

  // Step 2: OTP State
  const [otpTriggered, setOtpTriggered] = useState(false);
  const [otpStatus, setOtpStatus] = useState<OtpStatus>('PENDING');
  const [otpCodeInput, setOtpCodeInput] = useState('');
  const [otpTimerSeconds, setOtpTimerSeconds] = useState(300); // 5 min
  const [resendCooldown, setResendCooldown] = useState(60);
  const [otpAttemptsCount, setOtpAttemptsCount] = useState(0);
  const [otpResendsCount, setOtpResendsCount] = useState(0);
  const [otpSimulationOutcome, setOtpSimulationOutcome] = useState<'RECEIVED' | 'DELAYED' | 'FAILED'>('RECEIVED');
  const [ivrState, setIvrState] = useState<'NONE' | 'CALLING' | 'CONNECTED' | 'FAILED'>('NONE');
  const [otpError, setOtpError] = useState<string | null>(null);

  // Step 3: National ID & Photos
  const [nationalIdNumber, setNationalIdNumber] = useState('32849102');
  const [nationalIdPhotoUrl, setNationalIdPhotoUrl] = useState<string | null>(null);
  const [customerHoldingIdPhotoUrl, setCustomerHoldingIdPhotoUrl] = useState<string | null>(null);
  const [idPhotoQuality, setIdPhotoQuality] = useState<'CLEAR' | 'BLURRY' | 'GLARE'>('CLEAR');
  const [activeCameraType, setActiveCameraType] = useState<'CUSTOMER_HOLDING_ID' | 'NATIONAL_ID_CARD' | null>(null);
  const [idRetakeCount, setIdRetakeCount] = useState(0);

  // Step 4: Smile ID Non-Biometric Simulation
  const [smileIdScenario, setSmileIdScenario] = useState<SmileIdSimulatedStatus>('CLEAR');
  const [smileIdPhase, setSmileIdPhase] = useState<number>(0);
  const [smileIdRunning, setSmileIdRunning] = useState(false);
  const [smileIdFinished, setSmileIdFinished] = useState(false);
  const [smileIdFinalStatus, setSmileIdFinalStatus] = useState<SmileIdSimulatedStatus>('CLEAR');
  const [smileIdReason, setSmileIdReason] = useState<string>('CIVIL_REGISTRY_MATCH');
  const [idCorrectionAttempted, setIdCorrectionAttempted] = useState(false);
  const [showInlineIdCorrection, setShowInlineIdCorrection] = useState(false);
  const [tempCorrectedId, setTempCorrectedId] = useState('');
  const [stepError, setStepError] = useState<string | null>(null);

  // Step 5: Product Catalog
  const [selectedProduct, setSelectedProduct] = useState<ProductCatalogItem>(SUN_KING_CATALOG[0]);
  const [activeDemoPreset, setActiveDemoPreset] = useState<string>('CUSTOM');

  const applyDemoScenarioPreset = (preset: string) => {
    setActiveDemoPreset(preset);
    switch (preset) {
      case 'CLEAR':
        setFullName('Faith Cherono Koech');
        setCountryCode('+254');
        setPhoneNumber('712345678');
        setLocation('Kipchimchim, Kericho West');
        setSelectedProduct(SUN_KING_CATALOG[0]);
        setNationalIdNumber('31459021');
        setNationalIdPhotoUrl('mock-id-clear.jpg');
        setCustomerHoldingIdPhotoUrl('mock-holding.jpg');
        setIdPhotoQuality('CLEAR');
        setOtpStatus('VERIFIED');
        setOtpCodeInput('4829');
        setOtpTriggered(true);
        setSmileIdScenario('CLEAR');
        setSmileIdFinalStatus('CLEAR');
        setSmileIdReason('CIVIL_REGISTRY_MATCH');
        setSmileIdFinished(true);
        setVideoUrl('mock-video-valid.mp4');
        setVideoDuration(14);
        setVideoHasAudio(true);
        setVideoStatus('VALID');
        break;

      case 'ATTENTION':
        setFullName('Amina Hassan Bakari');
        setCountryCode('+254');
        setPhoneNumber('767890123');
        setLocation('Kisauni, Mombasa North');
        setSelectedProduct(SUN_KING_CATALOG[1]);
        setNationalIdNumber('34109823');
        setIdPhotoQuality('CLEAR');
        setOtpStatus('VERIFIED');
        setOtpCodeInput('4829');
        setOtpTriggered(true);
        setSmileIdScenario('ATTENTION');
        setSmileIdFinalStatus('ATTENTION');
        setSmileIdReason('ADDRESS_DISTRICT_VARIATION');
        setSmileIdFinished(true);
        setVideoUrl('mock-video-valid.mp4');
        setVideoDuration(11);
        setVideoHasAudio(true);
        setVideoStatus('VALID');
        break;

      case 'ID_NOT_FOUND':
        setFullName('Kevin Otieno Ouma');
        setCountryCode('+254');
        setPhoneNumber('789012345');
        setLocation('Bondo Township, Siaya');
        setSelectedProduct(SUN_KING_CATALOG[0]);
        setNationalIdNumber('11223344');
        setIdPhotoQuality('CLEAR');
        setOtpStatus('VERIFIED');
        setOtpTriggered(true);
        setSmileIdScenario('BLOCKED_NOT_FOUND');
        setSmileIdFinalStatus('BLOCKED_NOT_FOUND');
        setSmileIdReason('NATIONAL_ID_DOES_NOT_EXIST');
        setSmileIdFinished(true);
        break;

      case 'SUSPECTED_FRAUD':
        setFullName('Bernard K. Mutua');
        setCountryCode('+254');
        setPhoneNumber('756789012');
        setLocation('Kangundo Road, Machakos');
        setSelectedProduct(SUN_KING_CATALOG[1]);
        setNationalIdNumber('28194012');
        setIdPhotoQuality('CLEAR');
        setOtpStatus('VERIFIED');
        setOtpTriggered(true);
        setSmileIdScenario('BLOCKED_FRAUD');
        setSmileIdFinalStatus('BLOCKED_FRAUD');
        setSmileIdReason('NATIONAL_FRAUD_REGISTRY_MATCH');
        setSmileIdFinished(true);
        break;

      case 'TEMP_SERVICE_UNAVAILABLE':
        setFullName('Joshua Mwewa');
        setCountryCode('+256');
        setPhoneNumber('977665544');
        setLocation('Kitwe Copperbelt, Central');
        setSelectedProduct(SUN_KING_CATALOG[1]);
        setNationalIdNumber('NR-88129031');
        setIdPhotoQuality('CLEAR');
        setOtpStatus('VERIFIED');
        setOtpTriggered(true);
        setSmileIdScenario('ERROR_SERVICE_UNAVAILABLE');
        setSmileIdFinalStatus('ERROR_SERVICE_UNAVAILABLE');
        setSmileIdReason('NATIONAL_GATEWAY_TIMEOUT');
        setSmileIdFinished(true);
        break;

      case 'INVALID_IMAGE':
        setFullName('Mary Wambui Njoroge');
        setCountryCode('+254');
        setPhoneNumber('712345678');
        setLocation('Kisumu West Market, Kisumu');
        setSelectedProduct(SUN_KING_CATALOG[1]);
        setNationalIdNumber('29841029');
        setIdPhotoQuality('GLARE');
        setOtpStatus('VERIFIED');
        setOtpTriggered(true);
        setSmileIdScenario('ERROR_INVALID_INPUT');
        setSmileIdFinalStatus('ERROR_INVALID_INPUT');
        setSmileIdReason('ID_IMAGE_UNREADABLE_GLARE');
        setSmileIdFinished(true);
        break;

      case 'OTP_DELAYED':
        setFullName('James Ndung\'u');
        setCountryCode('+254');
        setPhoneNumber('778901234');
        setLocation('Mai Mahiu Rural, Naivasha');
        setSelectedProduct(SUN_KING_CATALOG[0]);
        setOtpStatus('IVR_DEFERRED');
        setOtpTriggered(true);
        setIdPhotoQuality('CLEAR');
        setSmileIdScenario('CLEAR');
        setSmileIdFinalStatus('CLEAR');
        setSmileIdFinished(true);
        break;

      case 'OTP_FAILED':
        setFullName('Daniel Otieno');
        setCountryCode('+254');
        setPhoneNumber('719998877');
        setLocation('Ahero Town, Kisumu');
        setSelectedProduct(SUN_KING_CATALOG[0]);
        setOtpTriggered(true);
        setOtpStatus('FAILED');
        setOtpAttemptsCount(3);
        setOtpError('Maximum 3 incorrect attempts reached. Use IVR or Skip to continue.');
        break;

      case 'VIDEO_INVALID':
        setFullName('Emmanuel Okello');
        setCountryCode('+256');
        setPhoneNumber('723112233');
        setLocation('Mbale Border Post, Tororo');
        setSelectedProduct(SUN_KING_CATALOG[2]);
        setOtpStatus('VERIFIED');
        setOtpTriggered(true);
        setIdPhotoQuality('CLEAR');
        setSmileIdScenario('CLEAR');
        setSmileIdFinalStatus('CLEAR');
        setSmileIdFinished(true);
        setVideoDuration(4);
        setVideoHasAudio(false);
        setVideoStatus('CORRUPTED_OR_SHORT');
        break;

      case 'HIGH_VALUE_WITH_BANK':
        setFullName('David Kiprotich Rono');
        setCountryCode('+254');
        setPhoneNumber('745678901');
        setLocation('Turbo Sub-County, Eldoret');
        setSelectedProduct(SUN_KING_CATALOG[3]); // Solar TV 32"
        setNationalIdNumber('21948124');
        setIdPhotoQuality('CLEAR');
        setOtpStatus('VERIFIED');
        setOtpTriggered(true);
        setSmileIdScenario('CLEAR');
        setSmileIdFinalStatus('CLEAR');
        setSmileIdFinished(true);
        setVideoUrl('mock-video-valid.mp4');
        setVideoDuration(15);
        setVideoHasAudio(true);
        setVideoStatus('VALID');
        setBankConsentGiven(true);
        setBankHistoryStatus('PROVIDED');
        setBankStatementName('Mpesa_Statement_6mo_DavidRono.pdf');
        break;

      case 'HIGH_VALUE_WITHOUT_BANK':
        setFullName('Fatuma Ali Mohammed');
        setCountryCode('+254');
        setPhoneNumber('711223344');
        setLocation('Garissa Township, North Eastern');
        setSelectedProduct(SUN_KING_CATALOG[4]); // PowerHub 1000W
        setNationalIdNumber('22891045');
        setIdPhotoQuality('CLEAR');
        setOtpStatus('VERIFIED');
        setOtpTriggered(true);
        setSmileIdScenario('CLEAR');
        setSmileIdFinalStatus('CLEAR');
        setSmileIdFinished(true);
        setVideoUrl('mock-video-valid.mp4');
        setVideoDuration(14);
        setVideoHasAudio(true);
        setVideoStatus('VALID');
        setBankConsentGiven(true);
        setBankHistoryStatus('MAY_BE_REQUESTED_LATER');
        setBankStatementName('');
        break;
    }
  };

  // Step 6: Customer Video
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(12);
  const [videoHasAudio, setVideoHasAudio] = useState<boolean>(true);
  const [isAssistedRecording, setIsAssistedRecording] = useState<boolean>(false);
  const [videoRetakes, setVideoRetakes] = useState<number>(0);
  const [videoStatus, setVideoStatus] = useState<VideoStatus>('PENDING');

  // Step 7: High-Value Branch
  const [bankConsentGiven, setBankConsentGiven] = useState(false);
  const [bankHistoryStatus, setBankHistoryStatus] = useState<BankHistoryStatus>('MAY_BE_REQUESTED_LATER');
  const [bankStatementName, setBankStatementName] = useState<string>('');

  // Step 8: Submission Result
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<RegistrationApplication | null>(null);

  // OTP Countdown Timers
  useEffect(() => {
    let interval: any = null;
    if (otpTriggered && otpTimerSeconds > 0 && otpStatus !== 'VERIFIED') {
      interval = setInterval(() => {
        setOtpTimerSeconds((prev) => Math.max(0, prev - 1));
        setResendCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTriggered, otpTimerSeconds, otpStatus]);

  // Trigger OTP when phone number reaches 9 digits
  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '');
    setPhoneNumber(cleaned);
    if (cleaned.length >= 9 && !otpTriggered) {
      setOtpTriggered(true);
      setResendCooldown(60);
      setOtpTimerSeconds(300);
    }
  };

  // OTP Verification logic
  const handleVerifyOtp = (codeToVerify?: string) => {
    const code = codeToVerify || otpCodeInput;
    if (otpAttemptsCount >= 3) {
      setOtpError('Maximum 3 incorrect attempts reached. Use IVR or Skip to continue.');
      return;
    }

    if (code === '4829' || code === '1234') {
      setOtpStatus('VERIFIED');
      setOtpError(null);
    } else {
      const nextCount = otpAttemptsCount + 1;
      setOtpAttemptsCount(nextCount);
      if (nextCount >= 3) {
        setOtpError('Maximum 3 incorrect attempts reached. Please request IVR Voice Call OTP or Skip.');
      } else {
        setOtpError(`Incorrect OTP (${nextCount}/3 attempts). Demo code is 4829.`);
      }
    }
  };

  const handleResendOtp = () => {
    if (otpResendsCount >= 2) {
      setOtpError('Maximum 2 resends reached. Please request IVR voice call or skip.');
      return;
    }
    setOtpResendsCount((prev) => prev + 1);
    setResendCooldown(60);
    setOtpTimerSeconds(300);
    setOtpError(null);
  };

  const handleTriggerIvr = () => {
    setIvrState('CALLING');
    setTimeout(() => {
      setIvrState('CONNECTED');
    }, 2000);
  };

  // Run Smile ID Simulation with stage animations
  const runSmileIdSimulation = (overrideScenario?: SmileIdSimulatedStatus) => {
    const targetScenario = overrideScenario || smileIdScenario;
    setSmileIdRunning(true);
    setSmileIdFinished(false);
    setSmileIdPhase(1);

    setTimeout(() => setSmileIdPhase(2), 700);
    setTimeout(() => setSmileIdPhase(3), 1500);
    setTimeout(() => {
      setSmileIdPhase(4);
      setSmileIdFinalStatus(targetScenario);

      let reason = 'CIVIL_REGISTRY_MATCH';
      if (targetScenario === 'ATTENTION') reason = 'ADDRESS_DISTRICT_VARIATION';
      if (targetScenario === 'BLOCKED_NOT_FOUND') reason = 'NATIONAL_ID_DOES_NOT_EXIST';
      if (targetScenario === 'BLOCKED_FRAUD') reason = 'FRAUD_WATCHLIST_MATCH';
      if (targetScenario === 'ERROR_SERVICE_UNAVAILABLE') reason = 'NATIONAL_GATEWAY_TIMEOUT';
      if (targetScenario === 'ERROR_INVALID_INPUT') reason = 'ID_IMAGE_OCR_UNREADABLE';

      setSmileIdReason(reason);
      setSmileIdFinished(true);
      setSmileIdRunning(false);
    }, 2300);
  };

  // Auto run Smile ID when entering Step 4
  useEffect(() => {
    if (currentStep === 4 && !smileIdFinished && !smileIdRunning) {
      runSmileIdSimulation();
    }
  }, [currentStep]);

  // Video confirmation
  const handleSaveVideo = (url: string, duration: number, hasAudio: boolean, assisted: boolean, retakes: number) => {
    setVideoUrl(url);
    setVideoDuration(duration);
    setVideoHasAudio(hasAudio);
    setIsAssistedRecording(assisted);
    setVideoRetakes(retakes);

    if (duration < 8 || !hasAudio) {
      setVideoStatus('INVALID');
    } else if (retakes >= 2) {
      setVideoStatus('RETAKE_LIMIT_REACHED');
    } else {
      setVideoStatus('VALID');
    }
    setShowVideoModal(false);
  };

  // Handle final submission
  const handleSubmitRegistration = async () => {
    setIsSubmitting(true);

    const now = simulatedTime;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const regId = `SK-2026-${randomSuffix}`;

    const isHighValue = selectedProduct.category === 'HIGH_VALUE';
    const slaDeadlineHours = isHighValue ? 24 : 2;
    const slaDeadline = new Date(now.getTime() + slaDeadlineHours * 60 * 60 * 1000).toISOString();

    const riskFlags: string[] = [];
    if (otpStatus === 'SKIPPED' || otpStatus === 'IVR_DEFERRED' || otpStatus === 'PENDING') {
      riskFlags.push('Phone OTP Pending');
    }
    if (idPhotoQuality !== 'CLEAR') {
      riskFlags.push('ID Photo Quality Flag');
    }
    if (videoStatus !== 'VALID') {
      riskFlags.push('Customer Video Requires Review');
    }
    if (isAssistedRecording) {
      riskFlags.push('Assisted Low-Literacy Recording');
    }
    if (isHighValue) {
      riskFlags.push('High-Value Financing ($320+)');
    }

    const newApp: RegistrationApplication = {
      id: regId,
      submissionTimestamp: now.toISOString(),
      customer: {
        fullName,
        phoneNumber,
        countryCode,
        dateOfBirth,
        location
      },
      product: selectedProduct,
      valueCategory: selectedProduct.category,
      evidence: {
        nationalIdNumber,
        nationalIdPhotoUrl: nationalIdPhotoUrl || 'mock-id-card.jpg',
        customerHoldingIdPhotoUrl: customerHoldingIdPhotoUrl || 'mock-customer-id.jpg',
        idPhotoQuality,
        idNumberCorrectionCount: idCorrectionAttempted ? 1 : 0,
        videoUrl: videoUrl || 'mock-video.mp4',
        videoDurationSeconds: videoDuration,
        videoHasAudio,
        videoRetakeCount: videoRetakes,
        assistedRecording: isAssistedRecording,
        bankStatementUrl: bankStatementName ? 'mock-bank-doc.pdf' : undefined,
        bankStatementFileName: bankStatementName || undefined,
        bankConsentGiven
      },
      verification: {
        stateMachineState:
          network === 'OFFLINE'
            ? 'WAITING_FOR_NETWORK'
            : smileIdFinalStatus === 'BLOCKED_FRAUD'
            ? 'BLOCKED_FRAUD'
            : smileIdFinalStatus === 'BLOCKED_NOT_FOUND'
            ? 'BLOCKED_NOT_FOUND'
            : smileIdFinalStatus === 'ERROR_SERVICE_UNAVAILABLE'
            ? 'ERROR_SERVICE_UNAVAILABLE'
            : smileIdFinalStatus === 'ERROR_INVALID_INPUT'
            ? 'ERROR_INVALID_INPUT'
            : smileIdFinalStatus === 'ATTENTION'
            ? 'ATTENTION'
            : 'CLEAR',
        retryCount: 0,
        maxRetries: 3,
        nextScheduledRetryMinutes: smileIdFinalStatus === 'ERROR_SERVICE_UNAVAILABLE' ? 1 : undefined,
        nextScheduledActionLabel:
          smileIdFinalStatus === 'ERROR_SERVICE_UNAVAILABLE'
            ? 'Auto-retry #1 of 3 scheduled in 1 minute'
            : smileIdFinalStatus === 'BLOCKED_NOT_FOUND'
            ? '1 ID correction attempt permitted'
            : undefined,
        otpStatus,
        otpCode: otpStatus === 'VERIFIED' ? '4829' : undefined,
        otpMethodUsed: ivrState === 'CONNECTED' ? 'IVR' : 'SMS',
        otpAttemptsCount,
        otpResendCount: otpResendsCount,
        smileIdStatus: smileIdFinalStatus,
        smileIdReasonCode: smileIdReason,
        smileIdConfidenceScore: smileIdFinalStatus === 'CLEAR' ? 98 : smileIdFinalStatus === 'ATTENTION' ? 76 : 15,
        smileIdAttemptCount: 1,
        videoStatus: videoStatus === 'PENDING' ? 'VALID' : videoStatus,
        bankHistoryStatus: isHighValue ? bankHistoryStatus : 'NOT_APPLICABLE'
      },
      status: 'PENDING_VERIFICATION',
      riskFlags,
      slaDeadlineTimestamp: slaDeadline,
      isUrgent: false,
      isOverdue: false,
      reviewerNotes: [],
      auditTrail: [
        {
          id: `aud-${Date.now()}-init`,
          timestamp: now.toISOString(),
          actor: fieldAgent.name,
          actorRole: 'FIELD_AGENT',
          action: 'New Application Created',
          details: `Field agent registered ${fullName} for ${selectedProduct.name} at ${location}`
        }
      ],
      isSyncedToBackend: network !== 'OFFLINE'
    };

    const finalizedApp = await submitNewApplication(newApp);
    setIsSubmitting(false);
    setSubmissionReceipt(finalizedApp);
  };

  const stepsList = [
    { num: 1, label: 'Customer Details' },
    { num: 2, label: 'Phone OTP' },
    { num: 3, label: 'ID Photos' },
    { num: 4, label: 'Smile ID Check' },
    { num: 5, label: 'Solar Product' },
    { num: 6, label: 'Consent Video' },
    ...(selectedProduct.category === 'HIGH_VALUE' ? [{ num: 7, label: 'High Value Finance' }] : []),
    { num: selectedProduct.category === 'HIGH_VALUE' ? 8 : 7, label: 'Review & Submit' }
  ];

  const totalSteps = selectedProduct.category === 'HIGH_VALUE' ? 8 : 7;
  const isHighValueFlow = selectedProduct.category === 'HIGH_VALUE';

  // Navigation handlers
  const handleNext = () => {
    setStepError(null);
    if (currentStep === 1) {
      if (!fullName.trim() || !phoneNumber.trim()) {
        setStepError('Please enter customer full name and mobile number to proceed.');
        return;
      }
    }

    if (currentStep === 3) {
      if (!nationalIdPhotoUrl) {
        setNationalIdPhotoUrl('mock-id.jpg');
      }
      if (!customerHoldingIdPhotoUrl) {
        setCustomerHoldingIdPhotoUrl('mock-holding.jpg');
      }
    }

    if (currentStep === 4) {
      if (smileIdFinalStatus === 'BLOCKED_FRAUD') {
        setStepError('Simulated fraud detected. Terminal security block: ordinary registration cannot proceed.');
        return;
      }
    }

    if (currentStep === 5) {
      if (!isHighValueFlow && currentStep === 5) {
        // Next will be 6
      }
    }

    // Skip step 7 if Normal Value
    if (currentStep === 6 && !isHighValueFlow) {
      setCurrentStep(8); // Go straight to Final Review
      return;
    }

    setCurrentStep((prev) => Math.min(8, prev + 1));
  };

  const handleBack = () => {
    if (currentStep === 8 && !isHighValueFlow) {
      setCurrentStep(6);
      return;
    }
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // SUCCESS RECEIPT SCREEN
  if (submissionReceipt) {
    const isNormal = submissionReceipt.valueCategory === 'NORMAL_VALUE';
    const isApproved = submissionReceipt.status === 'AUTO_APPROVED';
    const isSavedOffline = !submissionReceipt.isSyncedToBackend;

    return (
      <div className="max-w-md mx-auto p-4 space-y-4">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl text-center space-y-4">
          <div
            className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
              isApproved
                ? 'bg-emerald-100 text-emerald-600'
                : isSavedOffline
                ? 'bg-amber-100 text-amber-600'
                : 'bg-blue-100 text-blue-600'
            }`}
          >
            {isApproved ? (
              <CheckCircle className="w-10 h-10" />
            ) : isSavedOffline ? (
              <Clock className="w-10 h-10" />
            ) : (
              <ShieldCheck className="w-10 h-10" />
            )}
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Registration Successful
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
              Ref #{submissionReceipt.id}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {submissionReceipt.customer.fullName} • {submissionReceipt.product.name}
            </p>
          </div>

          {/* Current Decision Status Banner */}
          <div
            className={`p-3.5 rounded-xl border text-left text-xs ${
              isApproved
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : isSavedOffline
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span>Decision Status:</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] uppercase font-extrabold ${
                  isApproved
                    ? 'bg-emerald-200 text-emerald-800'
                    : isSavedOffline
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-blue-200 text-blue-900'
                }`}
              >
                {isSavedOffline ? 'Saved Offline — Outbox' : submissionReceipt.status.replace('_', ' ')}
              </span>
            </div>

            <div className="mt-2 text-slate-600 space-y-1">
              <p>
                <strong>Asynchronous SLA Deadline:</strong>{' '}
                {isNormal ? '2 Hours (Normal Value)' : '24 Hours (High Value Senior Queue)'}
              </p>
              <p>
                {isApproved
                  ? 'All 5 automated verification criteria passed. Solar kit dispatch unlocked!'
                  : isSavedOffline
                  ? 'Registration cached safely on device. Will auto-sync when mobile signal is detected.'
                  : 'Customer care executive will review asynchronously. You may immediately proceed to next customer!'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => onComplete(submissionReceipt)}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Return to Applications List</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setSubmissionReceipt(null);
                setCurrentStep(1);
                setFullName('');
                setPhoneNumber('');
                setOtpStatus('PENDING');
                setOtpTriggered(false);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Register Another Customer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen pb-20 shadow-md">
      {/* Top Header */}
      <div className="bg-[#0B192C] text-white p-3.5 sticky top-12 z-20 shadow-xs">
        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            Cancel
          </button>
          <div className="text-center">
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              New Customer Registration
            </h2>
            <p className="text-[11px] text-slate-300">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <div className="text-[11px] font-mono text-amber-300">
            {Math.round((currentStep / totalSteps) * 100)}%
          </div>
        </div>

        {/* Mini Step Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Demo Scenario Preset Selector for Product Management Evaluation */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1.5 text-[11px]">
          <span className="text-amber-400 font-bold flex items-center gap-1 shrink-0">
            ⚡ Demo Scenario:
          </span>
          <select
            value={activeDemoPreset}
            onChange={(e) => applyDemoScenarioPreset(e.target.value)}
            className="flex-1 bg-slate-800 text-amber-300 font-bold px-2 py-1 rounded-lg border border-slate-700 text-[10px] focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            title="Select deterministic verification scenario outcome"
          >
            <option value="CUSTOM">Custom Input</option>
            <option value="CLEAR">1. Clear (Auto-Approve)</option>
            <option value="ATTENTION">2. Attention (Review Required)</option>
            <option value="ID_NOT_FOUND">3. ID Not Found (Retry)</option>
            <option value="SUSPECTED_FRAUD">4. Suspected Fraud (Lock)</option>
            <option value="TEMP_SERVICE_UNAVAILABLE">5. Temporary Service Unavailable</option>
            <option value="INVALID_IMAGE">6. Invalid Image (Glare)</option>
            <option value="OTP_DELAYED">7. OTP Delayed (IVR)</option>
            <option value="OTP_FAILED">8. OTP Failed (3x Limit)</option>
            <option value="VIDEO_INVALID">9. Video Invalid (&lt;8s)</option>
            <option value="HIGH_VALUE_WITH_BANK">10. High Value with Bank Statement</option>
            <option value="HIGH_VALUE_WITHOUT_BANK">11. High Value without Statement</option>
          </select>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="p-4 space-y-4">
        {stepError && (
          <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-xs text-rose-900 font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{stepError}</span>
          </div>
        )}

        {/* ========================================================
            SCREEN 1: Customer Details & Immediate OTP Trigger
        ======================================================== */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-amber-500" />
                Customer Identity Details
              </h3>
              <p className="text-xs text-slate-500">
                Collect basic identity info. OTP will trigger as soon as mobile number is confirmed.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Full Legal Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Mary Wambui Njoroge"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Phone Number *
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-24 px-2 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50"
                  >
                    <option value="+254">🇰🇪 +254</option>
                    <option value="+256">🇺🇬 +256</option>
                    <option value="+234">🇳🇬 +234</option>
                    <option value="+255">🇹🇿 +255</option>
                  </select>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="712 345 678"
                    className="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-bold font-mono focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Location / Village / Market
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Kisumu West Market, Nyando"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Simulated OTP Trigger Notice */}
            {otpTriggered && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 text-xs font-bold">
                  <Smartphone className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span>SMS OTP Triggered to {countryCode} {phoneNumber}</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  SMS PIN dispatched. You can verify it right now or skip verification to avoid holding up the customer in low-connectivity areas.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(2);
                    }}
                    className="py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-xs hover:bg-amber-300"
                  >
                    Verify OTP Now
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStatus('SKIPPED');
                      setCurrentStep(3);
                    }}
                    className="py-2 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-50"
                  >
                    Skip OTP & Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            SCREEN 2: Mock OTP & IVR Fallback
        ======================================================== */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-500" />
                  SMS OTP Verification
                </h3>
                <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {Math.floor(otpTimerSeconds / 60)}:
                  {String(otpTimerSeconds % 60).padStart(2, '0')}
                </span>
              </div>

              <p className="text-xs text-slate-500">
                A 4-digit verification code was sent to <strong>{countryCode} {phoneNumber}</strong>.
              </p>

              {/* OTP Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enter 4-Digit Code
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    maxLength={4}
                    value={otpCodeInput}
                    onChange={(e) => setOtpCodeInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="4829"
                    className="w-36 text-center tracking-widest text-lg font-bold font-mono px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                  <button
                    onClick={() => handleVerifyOtp()}
                    disabled={otpCodeInput.length < 4 || otpStatus === 'VERIFIED'}
                    className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs disabled:opacity-50"
                  >
                    {otpStatus === 'VERIFIED' ? 'Verified ✓' : 'Verify Code'}
                  </button>
                </div>

                {otpError && (
                  <p className="text-xs text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    {otpError}
                  </p>
                )}

                {otpStatus === 'VERIFIED' && (
                  <p className="text-xs text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Phone number verified successfully!
                  </p>
                )}
              </div>

              {/* Prototype Simulation Helpers */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 block">
                  Prototype Quick Simulation Helpers:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpCodeInput('4829');
                      handleVerifyOtp('4829');
                    }}
                    className="px-2 py-1 bg-white border border-slate-300 rounded text-[11px] font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                  >
                    ⚡ Auto-fill Correct (4829)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpCodeInput('9999');
                      handleVerifyOtp('9999');
                    }}
                    className="px-2 py-1 bg-white border border-slate-300 rounded text-[11px] font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-700"
                  >
                    Simulate Wrong OTP
                  </button>
                </div>
              </div>

              {/* Resend Controls */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-500">
                  Resends used: {otpResendsCount}/2
                </span>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || otpResendsCount >= 2}
                  onClick={handleResendOtp}
                  className="font-bold text-amber-600 hover:underline disabled:text-slate-400 disabled:no-underline"
                >
                  {resendCooldown > 0 ? `Resend SMS in ${resendCooldown}s` : 'Resend SMS OTP'}
                </button>
              </div>
            </div>

            {/* IVR Voice Fallback Option */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-xs text-slate-800">
                    Automated Voice Call (IVR OTP)
                  </h4>
                </div>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                  Fallback
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                If SMS is delayed by local carrier towers, Sun King IVR engine can call the customer's phone to read out the security PIN.
              </p>

              {ivrState === 'NONE' && (
                <button
                  type="button"
                  onClick={handleTriggerIvr}
                  className="w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Request IVR Voice Call OTP
                </button>
              )}

              {ivrState === 'CALLING' && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-center text-xs text-amber-800 font-semibold animate-pulse">
                  Dialing {countryCode} {phoneNumber}... Automated IVR dispatch in progress.
                </div>
              )}

              {ivrState === 'CONNECTED' && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1.5">
                  <p className="font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    IVR Call Connected: Spoken Code is 4829
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpCodeInput('4829');
                      setOtpStatus('IVR_COMPLETED');
                    }}
                    className="w-full py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                  >
                    Confirm IVR Code (4829)
                  </button>
                </div>
              )}

              {/* Defer Button */}
              <button
                type="button"
                onClick={() => {
                  setOtpStatus('IVR_DEFERRED');
                  setCurrentStep(3);
                }}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs text-center"
              >
                Defer OTP & Continue Registration
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 3: National ID & Photo Evidence (Non-Biometric)
        ======================================================== */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-500" />
                  National ID & Photo Evidence
                </h3>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                  Non-Biometric
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Non-biometric policy: Take two separate photographs to establish identity without automated facial matching.
              </p>

              {/* National ID Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  National ID Number *
                </label>
                <input
                  type="text"
                  value={nationalIdNumber}
                  onChange={(e) => setNationalIdNumber(e.target.value)}
                  placeholder="e.g. 32849102"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-bold font-mono focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              {/* Photo 1: Customer Holding ID Card */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Photo 1: Customer Holding National ID Card *
                  </span>
                  {customerHoldingIdPhotoUrl && (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3" /> Captured
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Ensure customer's face and the physical card are both sharp and well lit.
                </p>

                {customerHoldingIdPhotoUrl ? (
                  <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200">
                    <img
                      src={customerHoldingIdPhotoUrl}
                      alt="Customer Holding ID"
                      className="w-16 h-12 rounded object-cover border border-slate-300"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-slate-800 block">Proof Photograph</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">Framed & Visible</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveCameraType('CUSTOMER_HOLDING_ID')}
                      className="text-xs text-amber-600 hover:underline font-bold"
                    >
                      Retake
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveCameraType('CUSTOMER_HOLDING_ID')}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Camera className="w-4 h-4" />
                    Take Photo: Customer Holding ID
                  </button>
                )}
              </div>

              {/* Photo 2: National ID Card Close-up */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Photo 2: National ID Card (Close-up) *
                  </span>
                  {nationalIdPhotoUrl && (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3" /> Captured
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Lay card flat. Avoid camera flash glare over numbers and date of birth.
                </p>

                {nationalIdPhotoUrl ? (
                  <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200">
                    <img
                      src={nationalIdPhotoUrl}
                      alt="ID Card Close-up"
                      className="w-16 h-12 rounded object-cover border border-slate-300"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-slate-800 block">ID Card Close-up</span>
                      <span className={`text-[10px] font-semibold ${idPhotoQuality === 'CLEAR' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        Quality: {idPhotoQuality}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveCameraType('NATIONAL_ID_CARD')}
                      className="text-xs text-amber-600 hover:underline font-bold"
                    >
                      Retake
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveCameraType('NATIONAL_ID_CARD')}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Camera className="w-4 h-4" />
                    Take Photo: National ID Card
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 4: Simulated Smile ID Non-Biometric Verification
        ======================================================== */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Smile ID — Non-Biometric Verification
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Demo Mode • Local Simulation Only
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs border border-blue-200">
                  SID
                </div>
              </div>

              <div className="bg-blue-50/70 border border-blue-200 p-2.5 rounded-xl text-[11px] text-blue-900 leading-relaxed">
                Queries simulated civil registration databases using ID number and OCR without transmitting biometric or facial likeness data.
              </div>

              {/* Progress Stage Tracker */}
              <div className="space-y-2 py-2">
                {[
                  { stage: 1, label: '1. Preparing ID Verification Payload' },
                  { stage: 2, label: '2. Checking Civil Registry Records' },
                  { stage: 3, label: '3. Evaluating Verification Response' },
                  { stage: 4, label: '4. Updating Registration Workflow' }
                ].map((item) => (
                  <div key={item.stage} className="flex items-center gap-2.5 text-xs">
                    {smileIdPhase > item.stage ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : smileIdPhase === item.stage ? (
                      <RefreshCw className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center text-[10px] shrink-0">
                        {item.stage}
                      </span>
                    )}
                    <span
                      className={`font-medium ${
                        smileIdPhase >= item.stage ? 'text-slate-900 font-semibold' : 'text-slate-400'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Demo Scenario Selector */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>Simulate Test Verification Outcome:</span>
                  <span className="text-amber-600 text-[10px]">Deterministic Scenario</span>
                </label>
                <select
                  value={smileIdScenario}
                  onChange={(e) => {
                    const chosen = e.target.value as SmileIdSimulatedStatus;
                    setSmileIdScenario(chosen);
                    runSmileIdSimulation(chosen);
                  }}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white text-slate-800"
                >
                  <option value="CLEAR">Clear (Standard Valid Pass)</option>
                  <option value="ATTENTION">Attention / Needs Manual Review</option>
                  <option value="BLOCKED_NOT_FOUND">Blocked: ID Not Found in Registry</option>
                  <option value="BLOCKED_FRAUD">Blocked: Suspected Fraud / Watchlist</option>
                  <option value="ERROR_SERVICE_UNAVAILABLE">Error: Service Unavailable (Auto Retry)</option>
                  <option value="ERROR_INVALID_INPUT">Error: Invalid / Unreadable OCR</option>
                </select>
              </div>

              {/* Evaluated Outcome Card */}
              {smileIdFinished && (
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    smileIdFinalStatus === 'CLEAR'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : smileIdFinalStatus === 'ATTENTION'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : smileIdFinalStatus === 'BLOCKED_FRAUD' || smileIdFinalStatus === 'BLOCKED_NOT_FOUND'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : 'bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>Simulated Result:</span>
                    <span className="px-2 py-0.5 rounded font-black text-[11px] uppercase">
                      {smileIdFinalStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-[11px]">
                    <strong>Reason Code:</strong> {smileIdReason}
                  </p>

                  <div className="pt-1 text-[11px] leading-relaxed">
                    {smileIdFinalStatus === 'CLEAR' && (
                      <span className="text-emerald-700 font-medium">
                        ✓ Identity matches national population records with 98% confidence.
                      </span>
                    )}
                    {smileIdFinalStatus === 'ATTENTION' && (
                      <span className="text-amber-700 font-medium">
                        ⚠️ Minor variance detected. Application flagged for executive review; you may finish remaining registration steps.
                      </span>
                    )}
                    {smileIdFinalStatus === 'BLOCKED_NOT_FOUND' && (
                      <div className="space-y-2">
                        <span className="text-rose-700 font-bold block">
                          ❌ National ID number was not found in civil registry records.
                        </span>
                        {!idCorrectionAttempted ? (
                          !showInlineIdCorrection ? (
                            <button
                              type="button"
                              onClick={() => {
                                setTempCorrectedId(nationalIdNumber);
                                setShowInlineIdCorrection(true);
                              }}
                              className="mt-1 w-full py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xs"
                            >
                              Correct ID Number & Retry (1 attempt allowed)
                            </button>
                          ) : (
                            <div className="p-2.5 rounded-xl bg-white border border-rose-300 space-y-2">
                              <label className="text-[11px] font-bold text-slate-800 block">
                                Enter Corrected National ID Number:
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={tempCorrectedId}
                                  onChange={(e) => setTempCorrectedId(e.target.value)}
                                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (tempCorrectedId.trim()) {
                                      setNationalIdNumber(tempCorrectedId.trim());
                                      setIdCorrectionAttempted(true);
                                      setShowInlineIdCorrection(false);
                                      runSmileIdSimulation('CLEAR');
                                    }
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs"
                                >
                                  Verify ID
                                </button>
                              </div>
                            </div>
                          )
                        ) : (
                          <p className="text-[10px] text-rose-800 font-semibold">
                            Correction attempt used (1 of 1). Routing for manual registry review.
                          </p>
                        )}
                      </div>
                    )}
                    {smileIdFinalStatus === 'BLOCKED_FRAUD' && (
                      <span className="text-rose-700 font-bold">
                        🚫 Terminally blocked: Suspected fraud watchlist match. Registration frozen and routed to security review.
                      </span>
                    )}
                    {smileIdFinalStatus === 'ERROR_SERVICE_UNAVAILABLE' && (
                      <span className="text-slate-700 font-medium">
                        Server gateway timeout. Asynchronous background retry scheduled. Registration will continue.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 5: Product Catalog
        ======================================================== */}
        {currentStep === 5 && (
          <div className="space-y-3.5">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                Select Solar PAYG Product
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Product classification determines whether 2-hour auto-approval or 24-hour senior review applies.
              </p>
            </div>

            <div className="space-y-2.5">
              {SUN_KING_CATALOG.map((item) => {
                const isSelected = selectedProduct.id === item.id;
                const isHigh = item.category === 'HIGH_VALUE';

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedProduct(item)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer bg-white ${
                      isSelected
                        ? 'border-amber-500 ring-2 ring-amber-400/30 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                              isHigh ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {isHigh ? 'High Value' : 'Normal Value'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-slate-900">
                          KSh {item.dailyRateKsh}
                        </span>
                        <span className="text-[10px] text-slate-500 block">/ day PAYG</span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                      <span>Deposit: <strong>KSh {item.depositKsh.toLocaleString()}</strong></span>
                      <span>Term: <strong>{item.loanTermMonths} Months</strong></span>
                      <span className="font-bold text-amber-600">
                        {isSelected ? 'Selected ✓' : 'Tap to Select'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 6: Customer Video Recording
        ======================================================== */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Video className="w-4 h-4 text-amber-500" />
                  Customer Video Recording
                </h3>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                  Min 8s • Audio Consent
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Customer speaks the consent statement on video. Agent assisted reading is supported for low literacy.
              </p>

              {/* Script Preview Box */}
              <div className="bg-amber-500/10 border border-amber-300 p-3 rounded-xl text-xs space-y-1">
                <span className="font-bold text-amber-900 text-[11px] uppercase tracking-wider block">
                  Mandatory Video Script:
                </span>
                <p className="text-slate-800 italic leading-relaxed">
                  "My name is <strong>{fullName || 'Mary Wambui'}</strong>. I am currently at{' '}
                  <strong>{location}</strong>. My national ID number is{' '}
                  <strong>{nationalIdNumber}</strong>. I want to purchase the{' '}
                  <strong>{selectedProduct.name}</strong> solar system using Pay-As-You-Go financing."
                </p>
              </div>

              {/* Location Input Confirmation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm Spoken Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              {/* Video Evidence Status or Launcher */}
              {videoUrl ? (
                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-xs text-emerald-900">
                        Video Evidence Captured ({videoDuration}s)
                      </span>
                    </div>
                    {isAssistedRecording && (
                      <span className="text-[9px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                        Assisted Mode
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Audio verified • Customer face visible • Script consent recorded.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowVideoModal(true)}
                    className="w-full py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100"
                  >
                    Retake Video Recording ({videoRetakes}/2)
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowVideoModal(true)}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <Video className="w-4 h-4" />
                  Launch Video Recorder (Camera & Script)
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 7: High-Value Branch (Only if High Value)
        ======================================================== */}
        {currentStep === 7 && isHighValueFlow && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    High-Value Financial Assessment
                  </h3>
                </div>
                <span className="text-[10px] font-extrabold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                  Senior Review
                </span>
              </div>

              <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-200 text-xs text-purple-900 leading-relaxed">
                Because <strong>{selectedProduct.name}</strong> is a high-value system, senior credit risk policy requires optional financial verification.
              </div>

              {/* Explicit Customer Consent */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bankConsentGiven}
                  onChange={(e) => setBankConsentGiven(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded accent-purple-600 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">
                    Explicit Customer Consent *
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Customer explicitly agrees to submit mobile-money (M-Pesa) or bank transaction history for PAYG credit evaluation.
                  </span>
                </div>
              </label>

              {/* Financial History Decision */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Transaction History Option:
                </label>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBankHistoryStatus('PROVIDED');
                      setBankStatementName('Mpesa_Statement_6Months_Verified.pdf');
                    }}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      bankHistoryStatus === 'PROVIDED'
                        ? 'border-purple-600 bg-purple-50/70 text-purple-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>✓ Provide M-Pesa / Bank Statement Now</span>
                      <span className="text-[10px] bg-purple-200 px-1.5 py-0.5 rounded text-purple-900 font-bold">
                        Recommended
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-normal block mt-1">
                      Attaches simulated 6-month statement for senior credit approval.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBankHistoryStatus('MAY_BE_REQUESTED_LATER');
                      setBankStatementName('');
                    }}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      bankHistoryStatus === 'MAY_BE_REQUESTED_LATER'
                        ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>May be Requested by Customer Care Later</span>
                    <span className="text-[11px] text-slate-500 font-normal block mt-1">
                      Allows agent to finish registration immediately. If needed, executive will request it asynchronously.
                    </span>
                  </button>
                </div>
              </div>

              {bankStatementName && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-700">{bankStatementName}</span>
                  <span className="text-purple-600 font-bold">Attached ✓</span>
                </div>
              )}

              <p className="text-[11px] text-slate-500 italic">
                * Note: Missing bank history does NOT cause automatic rejection. High-value cases are reviewed by senior executives.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 8: Final Review & Submission
        ======================================================== */}
        {currentStep === 8 && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                Final Registration Review
              </h3>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Customer Name:</span>
                  <span className="font-bold text-slate-900">{fullName || 'Mary Wambui'}</span>
                </div>

                <div className="py-2 flex justify-between items-center">
                  <span className="text-slate-500">Phone & OTP:</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block font-mono">
                      {countryCode} {phoneNumber || '712345678'}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        otpStatus === 'VERIFIED'
                          ? 'text-emerald-600'
                          : otpStatus === 'SKIPPED'
                          ? 'text-amber-600'
                          : 'text-slate-500'
                      }`}
                    >
                      OTP: {otpStatus}
                    </span>
                  </div>
                </div>

                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">National ID:</span>
                  <span className="font-bold font-mono text-slate-900">{nationalIdNumber}</span>
                </div>

                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Smile ID Simulated:</span>
                  <span
                    className={`font-bold ${
                      smileIdFinalStatus === 'CLEAR' ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {smileIdFinalStatus}
                  </span>
                </div>

                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Solar Product:</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">{selectedProduct.name}</span>
                    <span className="text-[10px] text-slate-500">
                      KSh {selectedProduct.dailyRateKsh}/day ({selectedProduct.category.replace('_', ' ')})
                    </span>
                  </div>
                </div>

                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Video Evidence:</span>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600">
                      {videoDuration}s Captured ✓
                    </span>
                    {isAssistedRecording && (
                      <span className="text-[10px] text-amber-600 block">
                        Assisted Echo Mode
                      </span>
                    )}
                  </div>
                </div>

                {isHighValueFlow && (
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Financial History:</span>
                    <span className="font-bold text-purple-700">
                      {bankHistoryStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                )}
              </div>

              {/* SLA Preview Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Asynchronous Decision SLA:</span>
                  <span className="text-amber-600 font-extrabold">
                    {selectedProduct.category === 'HIGH_VALUE' ? '24 Hours' : '2 Hours'}
                  </span>
                </div>
                <p className="text-[11px]">
                  Field agent is not blocked waiting for live phone calls. Application enters central verification queue immediately.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center gap-2 pt-2">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="w-1/3 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all"
            >
              Back
            </button>
          )}

          {currentStep < 8 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Continue to Step {currentStep === 6 && !isHighValueFlow ? 7 : currentStep + 1}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitRegistration}
              className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Customer Registration</span>
                </>
              )}
            </button>
          )}
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
          instructions={
            activeCameraType === 'CUSTOMER_HOLDING_ID'
              ? 'Ensure customer face and card details are clearly visible in the frame'
              : 'Place card on a flat surface and ensure all 8 numbers are legible'
          }
          type={activeCameraType}
          onCapture={(imgUrl, quality) => {
            if (activeCameraType === 'CUSTOMER_HOLDING_ID') {
              setCustomerHoldingIdPhotoUrl(imgUrl);
            } else {
              setNationalIdPhotoUrl(imgUrl);
              setIdPhotoQuality(quality);
            }
            setActiveCameraType(null);
          }}
          onClose={() => setActiveCameraType(null)}
        />
      )}

      {/* Modal: Video Recording */}
      {showVideoModal && (
        <VideoRecordModal
          customerName={fullName}
          location={location}
          nationalIdNumber={nationalIdNumber}
          productName={selectedProduct.name}
          isAssisted={isAssistedRecording}
          retakeCount={videoRetakes}
          onSaveVideo={handleSaveVideo}
          onClose={() => setShowVideoModal(false)}
        />
      )}
    </div>
  );
};
