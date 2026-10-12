import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle, AlertCircle, Sparkles, X } from 'lucide-react';
import { MOCK_IMAGES } from '../../data/seedData';

interface CameraModalProps {
  title: string;
  instructions: string;
  type: 'CUSTOMER_HOLDING_ID' | 'NATIONAL_ID_CARD';
  onCapture: (imageUrl: string, quality: 'CLEAR' | 'BLURRY' | 'GLARE') => void;
  onClose: () => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  title,
  instructions,
  type,
  onCapture,
  onClose
}) => {
  const [useDeviceCamera, setUseDeviceCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<'CLEAR' | 'BLURRY' | 'GLARE'>('CLEAR');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Attempt real device camera if requested
  useEffect(() => {
    if (useDeviceCamera) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn('Real camera not accessible, falling back to simulator:', err);
          setCameraError('Real camera unavailable or permission denied. Using high-fidelity simulator.');
          setUseDeviceCamera(false);
        });
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useDeviceCamera]);

  const handleDeviceSnap = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        onCapture(dataUrl, 'CLEAR');
        return;
      }
    }
    // Fallback if canvas snapshot fails
    handleSimulatedSnap();
  };

  const handleSimulatedSnap = () => {
    let mockUrl = MOCK_IMAGES.idCardClear;
    if (type === 'CUSTOMER_HOLDING_ID') {
      mockUrl = MOCK_IMAGES.customerHoldingId;
    } else if (selectedQuality === 'BLURRY' || selectedQuality === 'GLARE') {
      mockUrl = MOCK_IMAGES.idCardBlurry;
    }
    onCapture(mockUrl, selectedQuality);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden text-white shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div>
            <h3 className="font-bold text-base text-amber-400 flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-400" />
              {title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{instructions}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Preview */}
        <div className="relative bg-slate-950 aspect-4/3 flex items-center justify-center overflow-hidden border-y border-slate-800">
          {useDeviceCamera ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
              <img
                src={
                  type === 'CUSTOMER_HOLDING_ID'
                    ? MOCK_IMAGES.customerHoldingId
                    : selectedQuality === 'CLEAR'
                    ? MOCK_IMAGES.idCardClear
                    : MOCK_IMAGES.idCardBlurry
                }
                alt="Simulated Preview"
                className="max-h-56 max-w-full rounded-lg border border-slate-700 shadow-md object-contain"
              />

              {/* Viewfinder overlay guide */}
              <div className="absolute inset-4 pointer-events-none border-2 border-dashed border-amber-400/50 rounded-xl flex items-center justify-center">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-slate-950/80 text-amber-300 px-2 py-0.5 rounded">
                  {type === 'CUSTOMER_HOLDING_ID' ? 'Frame Customer & ID Card (Reviewer Evidence — Non-Biometric)' : 'Align ID Card Within Border'}
                </span>
              </div>
            </div>
          )}

          {cameraError && (
            <div className="absolute top-2 inset-x-2 bg-amber-500/90 text-slate-950 text-[11px] p-2 rounded font-semibold text-center">
              {cameraError}
            </div>
          )}
        </div>

        {/* Simulator Presets / Controls */}
        <div className="p-4 space-y-3 bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Capture Source:</span>
            <button
              onClick={() => {
                setCameraError(null);
                setUseDeviceCamera(!useDeviceCamera);
              }}
              className="text-amber-400 hover:underline font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              {useDeviceCamera ? 'Switch to Mock Simulator' : 'Try Real Camera'}
            </button>
          </div>

          {!useDeviceCamera && (
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Simulate Camera Quality Outcome:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedQuality('CLEAR')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border text-center transition-all ${
                    selectedQuality === 'CLEAR'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  Clear (Pass)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedQuality('GLARE')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border text-center transition-all ${
                    selectedQuality === 'GLARE'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  Glare / Flash
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedQuality('BLURRY')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border text-center transition-all ${
                    selectedQuality === 'BLURRY'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  Blurry / Out of Focus
                </button>
              </div>
            </div>
          )}

          {/* Capture Trigger Button */}
          <div className="pt-1 flex gap-2">
            <button
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={useDeviceCamera ? handleDeviceSnap : handleSimulatedSnap}
              className="w-2/3 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-98"
            >
              <Camera className="w-4 h-4 text-slate-950" />
              Capture Photograph
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
