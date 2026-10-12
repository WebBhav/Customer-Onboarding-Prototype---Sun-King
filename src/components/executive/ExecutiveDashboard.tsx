import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExecutiveOverview } from './ExecutiveOverview';
import { ExecutiveQueueTable } from './ExecutiveQueueTable';
import { ExecutiveReviewWorkspace } from './ExecutiveReviewWorkspace';
import { AuditLogView } from './AuditLogView';
import {
  LayoutDashboard,
  Layers,
  Inbox,
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  XCircle,
  FileText,
  UserCheck,
  TrendingUp,
  Settings,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const {
    metrics,
    currentExecutive,
    setCurrentExecutiveRole,
    applications
  } = useApp();

  const [currentTab, setCurrentTab] = useState<
    | 'OVERVIEW'
    | 'ALL'
    | 'NORMAL_QUEUE'
    | 'HIGH_VALUE_QUEUE'
    | 'MANUAL_REVIEW'
    | 'FRAUD_REVIEW'
    | 'NEEDS_INFO'
    | 'AUTO_APPROVED'
    | 'QA_SAMPLES'
    | 'REJECTED'
    | 'AUDIT_LOG'
  >('OVERVIEW');

  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  const sidebarNavItems = [
    { id: 'OVERVIEW', label: 'Overview', icon: LayoutDashboard, count: undefined },
    { id: 'ALL', label: 'All Applications', icon: Layers, count: metrics.total },
    { id: 'NORMAL_QUEUE', label: 'Normal Value Queue', icon: Inbox, count: metrics.total - metrics.highValue },
    { id: 'HIGH_VALUE_QUEUE', label: 'High Value Queue', icon: TrendingUp, count: metrics.highValue, highlight: true },
    { id: 'MANUAL_REVIEW', label: 'Manual Review', icon: UserCheck, count: metrics.pendingVerification },
    { id: 'FRAUD_REVIEW', label: 'Fraud Review', icon: ShieldAlert, count: metrics.suspectedFraudCount, alert: true },
    { id: 'NEEDS_INFO', label: 'Needs Information', icon: AlertTriangle, count: metrics.needsInformation },
    { id: 'AUTO_APPROVED', label: 'Auto-Approved', icon: CheckCircle, count: metrics.autoApproved },
    { id: 'QA_SAMPLES', label: '10% QA Audit Sample', icon: ShieldCheck, count: metrics.qaAuditSamplesCount },
    { id: 'REJECTED', label: 'Rejected', icon: XCircle, count: metrics.rejected },
    { id: 'AUDIT_LOG', label: 'Audit Log', icon: FileText, count: undefined }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-3 sm:p-6 gap-6">
        {/* Left Sidebar */}
        <aside className="w-64 shrink-0 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hidden md:flex">
          <div className="space-y-4">
            {/* Executive Identity Profile */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#0B192C] text-amber-400 font-bold flex items-center justify-center text-xs">
                  {currentExecutive.role === 'SENIOR_EXECUTIVE' ? 'GA' : 'SK'}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-extrabold text-xs text-slate-900 truncate">
                    {currentExecutive.name.split(' (')[0]}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-semibold block truncate">
                    {currentExecutive.role === 'SENIOR_EXECUTIVE' ? 'Sr. Credit Risk Head' : 'Customer Care Specialist'}
                  </span>
                </div>
              </div>

              {/* Role Toggle */}
              <div className="pt-1 border-t border-slate-200 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-semibold">Simulated Persona:</span>
                <button
                  onClick={() =>
                    setCurrentExecutiveRole(
                      currentExecutive.role === 'SENIOR_EXECUTIVE' ? 'EXECUTIVE' : 'SENIOR_EXECUTIVE'
                    )
                  }
                  className="font-bold text-amber-600 hover:underline"
                >
                  {currentExecutive.role === 'SENIOR_EXECUTIVE' ? 'Switch to CC Officer' : 'Switch to Sr. Credit Head'}
                </button>
              </div>
            </div>

            {/* Navigation List */}
            <nav className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block mb-1">
                Decision Queues
              </span>

              {sidebarNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id && !selectedApplicationId;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id as any);
                      setSelectedApplicationId(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#0B192C] text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.count !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? 'bg-amber-400 text-slate-950'
                            : item.alert && item.count > 0
                            ? 'bg-rose-100 text-rose-800'
                            : item.highlight
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer stats in sidebar */}
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>SLA Target:</span>
              <strong className="text-slate-700">2h / 24h</strong>
            </div>
            <div className="flex justify-between">
              <span>Decision Engine:</span>
              <strong className="text-emerald-600">Active ✓</strong>
            </div>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <main className="flex-1 min-w-0">
          {/* Mobile Tab Select for small screens */}
          <div className="md:hidden mb-3">
            <select
              value={currentTab}
              onChange={(e) => {
                setCurrentTab(e.target.value as any);
                setSelectedApplicationId(null);
              }}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-white text-slate-900"
            >
              {sidebarNavItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label} ({item.count ?? ''})
                </option>
              ))}
            </select>
          </div>

          {/* Render selected view */}
          {selectedApplicationId ? (
            <ExecutiveReviewWorkspace
              applicationId={selectedApplicationId}
              onBack={() => setSelectedApplicationId(null)}
            />
          ) : currentTab === 'OVERVIEW' ? (
            <ExecutiveOverview
              onNavigateQueue={(q) => {
                setCurrentTab(q as any);
                setSelectedApplicationId(null);
              }}
            />
          ) : currentTab === 'AUDIT_LOG' ? (
            <AuditLogView />
          ) : (
            <ExecutiveQueueTable
              initialQueueFilter={
                currentTab === 'NORMAL_QUEUE'
                  ? 'NORMAL_QUEUE'
                  : currentTab === 'HIGH_VALUE_QUEUE'
                  ? 'HIGH_VALUE_QUEUE'
                  : currentTab === 'MANUAL_REVIEW'
                  ? 'MANUAL_REVIEW'
                  : currentTab === 'FRAUD_REVIEW'
                  ? 'FRAUD_REVIEW'
                  : currentTab === 'NEEDS_INFO'
                  ? 'NEEDS_INFORMATION'
                  : currentTab === 'AUTO_APPROVED'
                  ? 'AUTO_APPROVED'
                  : currentTab === 'QA_SAMPLES'
                  ? 'QA_SAMPLES'
                  : currentTab === 'REJECTED'
                  ? 'REJECTED'
                  : 'ALL'
              }
              onSelectApplication={(id) => setSelectedApplicationId(id)}
            />
          )}
        </main>
      </div>
    </div>
  );
};
