import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RegistrationApplication } from '../../types';
import {
  User,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
  RefreshCw,
  Search,
  Filter,
  ChevronRight,
  Sun,
  ShieldAlert,
  ArrowRight,
  Camera,
  Video,
  FileText,
  Edit3
} from 'lucide-react';

interface FieldAgentHomeProps {
  onNewCustomer: () => void;
  onSelectApplication: (id: string) => void;
}

export const FieldAgentHome: React.FC<FieldAgentHomeProps> = ({
  onNewCustomer,
  onSelectApplication
}) => {
  const { applications, fieldAgent, network, metrics, syncOfflineApplications } = useApp();
  const [filterTab, setFilterTab] = useState<'ALL' | 'ACTION_REQUIRED' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Identify all tickets requiring action
  const actionRequiredApps = applications.filter((app) => app.status === 'NEEDS_INFORMATION');

  // Filter applications for the main list
  const filteredApps = applications.filter((app) => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = app.customer.fullName.toLowerCase().includes(q);
      const matchId = app.id.toLowerCase().includes(q);
      const matchPhone = app.customer.phoneNumber.includes(q);
      if (!matchName && !matchId && !matchPhone) return false;
    }

    // Tab filter
    if (filterTab === 'ACTION_REQUIRED') return app.status === 'NEEDS_INFORMATION';
    if (filterTab === 'PENDING') return app.status === 'PENDING_VERIFICATION' || app.status === 'MANUAL_REVIEW';
    if (filterTab === 'APPROVED') return app.status === 'AUTO_APPROVED' || app.status === 'MANUALLY_APPROVED';
    if (filterTab === 'REJECTED') return app.status === 'REJECTED' || app.status === 'SUSPECTED_FRAUD';
    return true;
  });

  const handleSync = async () => {
    setIsSyncing(true);
    await syncOfflineApplications();
    setIsSyncing(false);
  };

  const getStatusBadge = (app: RegistrationApplication) => {
    if (!app.isSyncedToBackend) {
      return (
        <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-2 py-0.5 rounded text-[10px]">
          Saved Offline
        </span>
      );
    }

    switch (app.status) {
      case 'AUTO_APPROVED':
        return (
          <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded text-[10px]">
            Auto-Approved ✓
          </span>
        );
      case 'MANUALLY_APPROVED':
        return (
          <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded text-[10px]">
            Approved ✓
          </span>
        );
      case 'NEEDS_INFORMATION':
        return (
          <span className="bg-rose-100 text-rose-900 border border-rose-300 font-black px-2 py-0.5 rounded text-[10px] animate-pulse">
            Action Required ⚠️
          </span>
        );
      case 'SUSPECTED_FRAUD':
        return (
          <span className="bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded text-[10px]">
            Fraud Flagged 🚫
          </span>
        );
      case 'REJECTED':
        return (
          <span className="bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded text-[10px]">
            Rejected ✕
          </span>
        );
      default:
        return (
          <span className="bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded text-[10px]">
            Under Review
          </span>
        );
    }
  };

  const getActionCardDetails = (app: RegistrationApplication) => {
    const fields = app.requestedInformation?.fields || [];
    if (fields.includes('RETAKE_NATIONAL_ID_PHOTO')) {
      return {
        title: 'National ID photo is unclear — retake the photo.',
        icon: Camera,
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        cta: 'Retake ID Photo'
      };
    }
    if (fields.includes('RERECORD_CUSTOMER_VIDEO')) {
      return {
        title: 'Video is shorter than 8 seconds — record again.',
        icon: Video,
        badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
        cta: 'Re-Record Video'
      };
    }
    if (fields.includes('CORRECT_NATIONAL_ID_NUMBER')) {
      return {
        title: 'Please correct the national ID number.',
        icon: Edit3,
        badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
        cta: 'Correct ID Number'
      };
    }
    if (fields.includes('SUBMIT_BANK_STATEMENT')) {
      return {
        title: 'Customer care requested bank history for this high-value product.',
        icon: FileText,
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        cta: 'Attach Statement'
      };
    }
    return {
      title: app.requestedInformation?.comment || 'Action Required by Field Agent',
      icon: AlertTriangle,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      cta: 'Resolve Ticket'
    };
  };

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen pb-28 shadow-md relative">
      {/* Field Agent Profile Card */}
      <div className="bg-[#0B192C] text-white p-4 rounded-b-2xl shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-amber-400 flex items-center justify-center text-amber-300 font-bold">
              JM
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-extrabold text-sm">{fieldAgent.name}</h2>
                <span className="text-[10px] bg-slate-800 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold">
                  {fieldAgent.id}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {fieldAgent.territory} • {fieldAgent.hub}
              </p>
            </div>
          </div>

          {/* Sync badge & Connectivity indicator */}
          <div className="text-right">
            <div className="flex items-center gap-1 text-[11px] font-semibold justify-end">
              {network === 'ONLINE' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-300">Online</span>
                </>
              ) : network === 'POOR_2G' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-amber-300">2G Edge</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="text-rose-300">Offline</span>
                </>
              )}
            </div>

            {metrics.offlineUnsynced > 0 && (
              <button
                onClick={handleSync}
                disabled={network === 'OFFLINE' || isSyncing}
                className="mt-1 text-[10px] text-amber-300 hover:underline flex items-center gap-1 justify-end font-semibold"
              >
                <RefreshCw className={`w-2.5 h-2.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{metrics.offlineUnsynced} in Outbox</span>
              </button>
            )}
          </div>
        </div>

        {/* Big Action Button: New Customer */}
        <button
          onClick={onNewCustomer}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <Plus className="w-5 h-5 stroke-[3] text-slate-950" />
          <span>New Customer Registration</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-5 gap-1.5">
          <div className="bg-white p-2 rounded-xl border border-slate-200 text-center shadow-2xs">
            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">
              Today
            </span>
            <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
              {metrics.todaySubmittedCount}
            </span>
          </div>

          <div className="bg-white p-2 rounded-xl border border-emerald-200 bg-emerald-50/30 text-center shadow-2xs">
            <span className="text-[9px] text-emerald-700 font-bold block uppercase tracking-wider">
              Approved
            </span>
            <span className="text-sm font-extrabold text-emerald-700 mt-0.5 block">
              {metrics.autoApproved + metrics.manuallyApproved}
            </span>
          </div>

          <div className="bg-white p-2 rounded-xl border border-amber-200 bg-amber-50/30 text-center shadow-2xs">
            <span className="text-[9px] text-amber-800 font-bold block uppercase tracking-wider">
              Pending
            </span>
            <span className="text-sm font-extrabold text-amber-800 mt-0.5 block">
              {metrics.pendingVerification}
            </span>
          </div>

          <div
            className={`p-2 rounded-xl border text-center shadow-2xs ${
              metrics.needsInformation > 0
                ? 'bg-rose-50 border-rose-300 text-rose-900 ring-2 ring-rose-400/20'
                : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <span className="text-[9px] font-bold block uppercase tracking-wider text-rose-700">
              Action Req.
            </span>
            <span className="text-sm font-extrabold text-rose-700 mt-0.5 block">
              {metrics.needsInformation}
            </span>
          </div>

          <div className="bg-white p-2 rounded-xl border border-slate-200 text-center shadow-2xs">
            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">
              Offline
            </span>
            <span className="text-sm font-extrabold text-amber-700 mt-0.5 block">
              {metrics.offlineUnsynced}
            </span>
          </div>
        </div>

        {/* ====================================================================
            MOST PROMINENT SECTION: ACTION REQUIRED (Open Tickets)
        ==================================================================== */}
        {actionRequiredApps.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />
                <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                  Action Required ({actionRequiredApps.length} Open Cases)
                </h3>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">
                Tap to fix & resubmit
              </span>
            </div>

            <div className="space-y-2">
              {actionRequiredApps.map((app) => {
                const card = getActionCardDetails(app);
                const IconComponent = card.icon;

                return (
                  <div
                    key={app.id}
                    onClick={() => onSelectApplication(app.id)}
                    className="p-3.5 rounded-2xl border-2 border-rose-300 bg-gradient-to-r from-rose-50/70 via-white to-amber-50/50 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-rose-700 font-mono block">
                            {app.id} • {app.customer.fullName}
                          </span>
                          <h4 className="font-extrabold text-xs text-slate-900 leading-snug">
                            {card.title}
                          </h4>
                        </div>
                      </div>

                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 uppercase tracking-wider shrink-0">
                        Fix Needed
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] border-t border-rose-100 text-slate-600">
                      <span>{app.product.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectApplication(app.id);
                        }}
                        className="font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1"
                      >
                        <span>{card.cta}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Offline Outbox Banner if any */}
        {metrics.offlineUnsynced > 0 && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-center justify-between text-xs text-amber-950">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <strong className="block">{metrics.offlineUnsynced} Registration(s) Saved Offline</strong>
                <span className="text-[11px] text-amber-800">
                  Cached in local storage on device.
                </span>
              </div>
            </div>
            <button
              onClick={handleSync}
              disabled={network === 'OFFLINE' || isSyncing}
              className="px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-xs disabled:opacity-50"
            >
              Sync Now
            </button>
          </div>
        )}

        {/* Search & Filter Pills */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, ref ID, or phone..."
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {[
              { id: 'ALL', label: 'All', count: applications.length },
              { id: 'ACTION_REQUIRED', label: 'Action Req.', count: metrics.needsInformation },
              { id: 'PENDING', label: 'Pending', count: metrics.pendingVerification },
              { id: 'APPROVED', label: 'Approved', count: metrics.autoApproved + metrics.manuallyApproved },
              { id: 'REJECTED', label: 'Rejected', count: metrics.rejected }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold shrink-0 text-xs transition-all flex items-center gap-1.5 ${
                  filterTab === tab.id
                    ? 'bg-[#0B192C] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    filterTab === tab.id ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Application Cards List */}
        <div className="space-y-2.5">
          {filteredApps.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
              <p className="text-xs text-slate-500 font-medium">No registrations match this filter.</p>
              <button
                onClick={() => {
                  setFilterTab('ALL');
                  setSearchQuery('');
                }}
                className="text-xs text-amber-600 font-bold hover:underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredApps.map((app) => {
              const isNeedsAction = app.status === 'NEEDS_INFORMATION';
              const isHigh = app.valueCategory === 'HIGH_VALUE';

              return (
                <div
                  key={app.id}
                  onClick={() => onSelectApplication(app.id)}
                  className={`bg-white rounded-2xl p-3.5 border transition-all cursor-pointer shadow-2xs hover:shadow-md ${
                    isNeedsAction
                      ? 'border-rose-300 ring-2 ring-rose-400/20 bg-rose-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-slate-900">
                          {app.customer.fullName}
                        </h3>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            isHigh ? 'bg-purple-100 text-purple-800' : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {isHigh ? 'High Val' : 'Normal'}
                        </span>
                        {app.isAuditSample && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                            QA Sample
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        {app.product.name} • {app.id}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      {getStatusBadge(app)}
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">
                      {new Date(app.submissionTimestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric'
                      })},{' '}
                      {new Date(app.submissionTimestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>

                    <div className="flex items-center gap-1 font-semibold text-slate-700">
                      <span className="text-[11px] text-amber-800 line-clamp-1">
                        {app.status === 'NEEDS_INFORMATION'
                          ? app.requestedInformation?.comment || 'Action Required'
                          : app.status === 'AUTO_APPROVED' || app.status === 'MANUALLY_APPROVED'
                          ? 'Ready for dispatch'
                          : app.status === 'REJECTED'
                          ? 'Registration closed'
                          : app.status === 'SUSPECTED_FRAUD'
                          ? 'Fraud review lock'
                          : 'Asynchronous review'}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Floating Action Button for One-Handed Mobile Use */}
      <div className="fixed bottom-4 right-4 z-40 max-w-md">
        <button
          onClick={onNewCustomer}
          className="h-14 px-5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-2xl shadow-amber-500/40 flex items-center gap-2 border-2 border-slate-900 active:scale-95 transition-all"
          title="New Customer Registration"
        >
          <Plus className="w-5 h-5 stroke-[3] text-slate-950" />
          <span className="font-extrabold uppercase tracking-wide">New Customer</span>
        </button>
      </div>
    </div>
  );
};
