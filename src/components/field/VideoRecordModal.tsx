import React, { useState, useEffect, useRef } from 'react';
import { Video, Square, Play, RotateCcw, Check, Mic, AlertCircle, Volume2, X } from 'lucide-react';
import { MOCK_IMAGES } from '../../data/seedData';

interface VideoRecordModalProps {
  customerName: string;
  location: string;
  nationalIdNumber: string;
  productName: string;
  isAssisted: boolean;
  retakeCount: number;
  onSaveVideo: (videoUrl: string, duration: number, hasAudio: boolean, assisted: boolean, retakes: number) => void;
  onClose: () => void;
}

export const VideoRecordModal: React.FC<VideoRecordModalProps> = ({
  customerName,
  location,
  nationalIdNumber,
  productName,
  isAssisted: initialAssisted,
  retakeCount: initialRetakes,
  onSaveVideo,
  onClose
}) => {
  const [recordingState, setRecordingState] = useState<'IDLE' | 'RECORDING' | 'PREVIEW'>('IDLE');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isAssisted, setIsAssisted] = useState(initialAssisted);
  const [retakes, setRetakes] = useState(initialRetakes);
  const [simulatedShortVideo, setSimulatedShortVideo] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (recordingState === 'RECORDING') {
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recordingState]);

  const handleStartRecording = () => {
    setSecondsElapsed(0);
    setRecordingState('RECORDING');
  };

  const handleStopRecording = () => {
    setRecordingState('PREVIEW');
  };

  const handleRetake = () => {
    setRetakes((prev) => prev + 1);
    setSecondsElapsed(0);
    setRecordingState('IDLE');
  };

  const isDurationValid = secondsElapsed >= 8;
  const isRetakeLimitReached = retakes >= 2;

  const handleConfirm = () => {
    const finalDuration = simulatedShortVideo ? 4 : Math.max(secondsElapsed, 10);
    onSaveVideo(MOCK_IMAGES.videoThumbnail, finalDuration, true, isAssisted, retakes);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden text-white shadow-2xl flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-amber-400 flex items-center gap-2">
              <Video className="w-4 h-4 text-amber-400" />
              Customer Verification Video
            </h3>
            <p className="text-[11px] text-slate-400">
              Min 8 seconds • Audible consent statement for authorized reviewer (Non-Biometric)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Script Prompter Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 p-3 sm:p-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              Verification Script (Read Aloud Clearly)
            </span>
            <label className="flex items-center gap-1.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={isAssisted}
                onChange={(e) => setIsAssisted(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-amber-400 cursor-pointer"
              />
              <span className="text-slate-300 text-[11px]">
                Low Literacy (Assisted Echo Mode)
              </span>
            </label>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs sm:text-sm leading-relaxed text-slate-100 font-medium">
            "{isAssisted && <span className="text-amber-400 font-semibold">[Agent reads & Customer repeats]: </span>}
            My name is <strong className="text-amber-300">{customerName || '[Customer Name]'}</strong>. 
            I am currently at <strong className="text-amber-300">{location || '[Location]'}</strong>. 
            My national ID number is <strong className="text-amber-300">{nationalIdNumber || '[ID Number]'}</strong>. 
            I want to purchase the <strong className="text-amber-300">{productName || '[Sun King Solar System]'}</strong> solar system using Pay-As-You-Go financing."
          </div>

          {isAssisted && (
            <p className="text-[11px] text-amber-400/90 mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              Assisted mode enabled: Tagged for executive review to protect low-literacy customers.
            </p>
          )}
        </div>

        {/* Video Viewport / Preview */}
        <div className="relative bg-slate-950 aspect-16/10 flex items-center justify-center overflow-hidden border-b border-slate-800">
          <img
            src={MOCK_IMAGES.videoThumbnail}
            alt="Customer Video Preview"
            className="w-full h-full object-cover opacity-85"
          />

          {/* Live recording indicator & timer */}
          {recordingState === 'RECORDING' && (
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-rose-600/90 text-white px-2.5 py-1 rounded-full text-xs font-bold animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              <span>REC {secondsElapsed}s / 8s min</span>
            </div>
          )}

          {/* Audio input visualizer simulation */}
          {recordingState === 'RECORDING' && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Mic className="w-4 h-4 text-emerald-400 animate-bounce" />
              <div className="flex-1 flex items-center gap-1">
                {[40, 70, 90, 60, 80, 50, 95, 75, 60, 85].map((h, i) => (
                  <div
                    key={i}
                    className="w-2 bg-emerald-400 rounded-xs transition-all duration-150"
                    style={{ height: `${Math.max(6, (h * (secondsElapsed % 3 + 1)) / 3)}px` }}
                  />
                ))}
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">Audio Clear</span>
            </div>
          )}

          {/* Preview overlay */}
          {recordingState === 'PREVIEW' && (
            <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center mb-2 shadow-lg">
                <Play className="w-6 h-6 ml-0.5 fill-slate-950" />
              </div>
              <p className="text-xs font-bold text-white">Recording Captured: {secondsElapsed} seconds</p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-300">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Audio Detected</span>
                <span>•</span>
                <span>Customer Framed (Reviewer Evidence — Non-Biometric)</span>
              </div>
            </div>
          )}
        </div>

        {/* Retake Warning if nearing limit */}
        {retakes > 0 && (
          <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Retakes Used: <strong className="text-amber-400">{retakes} of 2</strong>
            </span>
            {isRetakeLimitReached && (
              <span className="text-amber-400 font-bold text-[11px]">
                Retake limit reached: Will route for executive review
              </span>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="p-3.5 bg-slate-900 space-y-2.5">
          {recordingState === 'IDLE' && (
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="w-1/3 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleStartRecording}
                className="w-2/3 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Video className="w-4 h-4 text-slate-950" />
                Start Recording (Min 8s)
              </button>
            </div>
          )}

          {recordingState === 'RECORDING' && (
            <button
              onClick={handleStopRecording}
              className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isDurationValid
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 cursor-pointer hover:bg-slate-700'
              }`}
            >
              <Square className="w-4 h-4" />
              <span>
                {isDurationValid
                  ? `Finish & Review Video (${secondsElapsed}s)`
                  : `Recording... (${secondsElapsed}s / 8s minimum required)`}
              </span>
            </button>
          )}

          {recordingState === 'PREVIEW' && (
            <div className="space-y-2">
              {/* Demo test helper */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <span>Demo Validation Tester:</span>
                <button
                  type="button"
                  onClick={() => setSimulatedShortVideo(!simulatedShortVideo)}
                  className={`text-[11px] font-bold ${
                    simulatedShortVideo ? 'text-rose-400 underline' : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {simulatedShortVideo ? 'Simulating <4s invalid duration' : 'Simulating standard valid video'}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleRetake}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Retake Recording ({retakes}/2)
                </button>
                <button
                  onClick={handleConfirm}
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <Check className="w-4 h-4" />
                  Confirm Video Evidence
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
