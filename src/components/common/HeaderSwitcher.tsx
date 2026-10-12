import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Sun,
  Smartphone,
  ShieldCheck,
  Clock,
  Wifi,
  WifiOff,
  RotateCcw,
  RefreshCw,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export const HeaderSwitcher: React.FC = () => {
  const {
    network,
    setNetwork,
    simulatedTime,
    advanceSimulatedTime,
    resetSimulatedTime,
    resetDemoData,
    syncOfflineApplications,
    metrics,
    currentExecutive,
    setCurrentExecutiveRole
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();
  const isFieldAgent = location.pathname.includes('/field-agent-view');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  const formattedTime = simulatedTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const formattedDate = simulatedTime.toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  });

  const handleSync = async () => {
    setIsSyncing(true);
    const count = await syncOfflineApplications();
    setIsSyncing(false);
    setSyncToast(count > 0 ? `Synced ${count} offline registration(s)!` : 'All registrations are up to date');
    setTimeout(() => setSyncToast(null), 3000);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B192C] text-white border-b border-slate-800 shadow-md">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Sun King Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-inner shadow-amber-300">
            <Sun className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base text-white">SUN KING</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                PAYG Solar
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Asynchronous Field Onboarding & Decision Platform
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/60 shadow-inner">
          <button
            onClick={() => navigate('/field-agent-view')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              isFieldAgent
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Field Agent View</span>
            {metrics.needsInformation > 0 && (
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isFieldAgent ? 'bg-slate-950 text-amber-300' : 'bg-amber-500 text-slate-950'
                }`}
              >
                {metrics.needsInformation}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate('/executive-agent-view')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              !isFieldAgent
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Executive Console</span>
            {(metrics.pendingVerification + metrics.highValue > 0) && (
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  !isFieldAgent ? 'bg-slate-950 text-amber-300' : 'bg-slate-700 text-slate-200'
                }`}
              >
                {metrics.total}
              </span>
            )}
          </button>
        </div>

        {/* Quick Demo Controls */}
        <div className="flex items-center gap-2 text-xs">
          {/* Network Simulator Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
            {network === 'ONLINE' ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            ) : network === 'POOR_2G' ? (
              <Wifi className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-rose-400" />
            )}
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value as any)}
              className="bg-transparent text-slate-200 font-medium text-xs focus:outline-none cursor-pointer"
              title="Simulate network connectivity in rural Africa"
            >
              <option value="ONLINE" className="bg-slate-800 text-white">4G Online</option>
              <option value="POOR_2G" className="bg-slate-800 text-white">Poor 2G (Slow)</option>
              <option value="OFFLINE" className="bg-slate-800 text-white">Offline (Outbox)</option>
            </select>
          </div>

          {/* Sync Offline Outbox button */}
          {metrics.offlineUnsynced > 0 && (
            <button
              onClick={handleSync}
              disabled={network === 'OFFLINE' || isSyncing}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                network === 'OFFLINE'
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse'
              }`}
              title="Sync offline records to server"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync ({metrics.offlineUnsynced})</span>
            </button>
          )}

          {/* Demo Clock Tool */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-slate-300">
              {formattedDate}, {formattedTime}
            </span>
            <div className="flex items-center gap-1 pl-1.5 border-l border-slate-700">
              <button
                onClick={() => advanceSimulatedTime(30)}
                className="px-1.5 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-[10px] text-amber-300 font-semibold"
                title="Advance clock by 30 minutes"
              >
                +30m
              </button>
              <button
                onClick={() => advanceSimulatedTime(90)}
                className="px-1.5 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-[10px] text-amber-300 font-semibold"
                title="Advance clock by 90 minutes (Normal Value Urgent Window)"
              >
                +90m
              </button>
              <button
                onClick={() => advanceSimulatedTime(120)}
                className="px-1.5 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-[10px] text-amber-300 font-semibold"
                title="Advance clock by 2 hours (Normal Value Overdue)"
              >
                +2h
              </button>
              <button
                onClick={() => advanceSimulatedTime(1080)}
                className="px-1.5 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-[10px] text-amber-300 font-semibold"
                title="Advance clock by 18 hours (High Value Urgent Window)"
              >
                +18h
              </button>
              <button
                onClick={() => advanceSimulatedTime(1440)}
                className="px-1.5 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-[10px] text-amber-300 font-semibold"
                title="Advance clock by 24 hours (High Value Overdue)"
              >
                +24h
              </button>
              <button
                onClick={resetSimulatedTime}
                className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
                title="Reset simulated time to default"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => setShowResetConfirmModal(true)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            title="Reset Seed Demo Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {syncToast && (
        <div className="bg-emerald-600 text-white text-xs font-semibold py-1 px-4 text-center">
          {syncToast}
        </div>
      )}

      {/* Offline Alert Strip */}
      {network === 'OFFLINE' && (
        <div className="bg-amber-500 text-slate-950 font-semibold text-xs py-1 px-4 flex items-center justify-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-slate-950" />
          <span>Simulated Offline Mode: Registrations will be saved locally to Outbox and synced once reconnected.</span>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-sm w-full p-5 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Reset Demo Data?</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              This will restore all 20 seeded applications, clear any newly submitted registrations, reset reviewer decisions, and return the demo clock back to default.
            </p>
            <div className="mt-5 flex gap-2 justify-end">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirmModal(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-xs"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
