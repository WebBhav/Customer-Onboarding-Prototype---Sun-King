import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Calendar,
  AlertOctagon,
  ArrowRight
} from 'lucide-react';

interface ExecutiveOverviewProps {
  onNavigateQueue: (queueId: string) => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({ onNavigateQueue }) => {
  const { metrics, applications } = useApp();

  // Status breakdown calculations
  const total = metrics.total || 1;
  const autoApprovedPct = Math.round((metrics.autoApproved / total) * 100);
  const manuallyApprovedPct = Math.round((metrics.manuallyApproved / total) * 100);
  const pendingPct = Math.round((metrics.pendingVerification / total) * 100);
  const needsInfoPct = Math.round((metrics.needsInformation / total) * 100);
  const rejectedPct = Math.round((metrics.rejected / total) * 100);

  // Group applications by submission day for trend chart
  const dailyCounts: { [key: string]: number } = {
    '10 Oct': 4,
    '11 Oct': 6,
    '12 Oct': metrics.todaySubmittedCount
  };

  return (
    <div className="space-y-4">
      {/* Overview Header Banner */}
      <div className="bg-[#0B192C] text-white p-5 rounded-2xl border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            Operational Intelligence Console
          </span>
          <h2 className="text-xl font-black mt-0.5">
            Asynchronous Verification Pipeline
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Eliminating real-time call center bottlenecks for 20,000 Sun King field agents across rural Kenya, Uganda, and Nigeria. Field agents onboard seamlessly while automated engines and customer care executives review exceptions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Auto-Approval Rate
            </span>
            <span className="text-xl font-black text-emerald-400">
              {metrics.total > 0 ? Math.round((metrics.autoApproved / metrics.total) * 100) : 0}%
            </span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Overdue / SLA Alerts
            </span>
            <span className={`text-xl font-black ${metrics.overdue > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
              {metrics.overdue + metrics.approachingDeadline}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Registrations */}
        <div
          onClick={() => onNavigateQueue('ALL')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Applications</span>
            <FileText className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{metrics.total}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">All active pipeline records</span>
        </div>

        {/* Auto-Approved */}
        <div
          onClick={() => onNavigateQueue('AUTO_APPROVED')}
          className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-bold uppercase tracking-wider">Auto-Approved</span>
            <CheckCircle className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">{metrics.autoApproved}</div>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">Zero human touch required</span>
        </div>

        {/* Manually Approved */}
        <div
          onClick={() => onNavigateQueue('MANUALLY_APPROVED')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider">Manually Approved</span>
            <ShieldCheck className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{metrics.manuallyApproved}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Executive verified</span>
        </div>

        {/* Pending Verification */}
        <div
          onClick={() => onNavigateQueue('PENDING')}
          className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-amber-800 mt-2">{metrics.pendingVerification}</div>
          <span className="text-[11px] text-amber-700 mt-0.5 block">In active decision queues</span>
        </div>

        {/* Needs Information */}
        <div
          onClick={() => onNavigateQueue('NEEDS_INFO')}
          className="bg-white p-4 rounded-2xl border border-amber-300 bg-amber-50/40 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-amber-900">
            <span className="text-xs font-bold uppercase tracking-wider">Awaiting Agent Info</span>
            <AlertTriangle className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-amber-900 mt-2">{metrics.needsInformation}</div>
          <span className="text-[11px] text-amber-800 mt-0.5 block">Recapture / correction asked</span>
        </div>

        {/* High-Value Applications */}
        <div
          onClick={() => onNavigateQueue('HIGH_VALUE')}
          className="bg-white p-4 rounded-2xl border border-purple-200 bg-purple-50/20 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-purple-800">
            <span className="text-xs font-bold uppercase tracking-wider">High Value Queue</span>
            <TrendingUp className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-purple-900 mt-2">{metrics.highValue}</div>
          <span className="text-[11px] text-purple-700 mt-0.5 block">24h SLA • Senior approval</span>
        </div>

        {/* Approaching Deadline */}
        <div
          onClick={() => onNavigateQueue('ALL')}
          className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-bold uppercase tracking-wider">Approaching SLA</span>
            <Clock className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-amber-700 mt-2">{metrics.approachingDeadline}</div>
          <span className="text-[11px] text-amber-600 mt-0.5 block">&lt;30m Normal / &lt;6h High Value</span>
        </div>

        {/* Rejected / Fraud */}
        <div
          onClick={() => onNavigateQueue('REJECTED')}
          className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-800">
            <span className="text-xs font-bold uppercase tracking-wider">Rejected / Blocked</span>
            <AlertOctagon className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-rose-800 mt-2">{metrics.rejected}</div>
          <span className="text-[11px] text-rose-700 mt-0.5 block">Failed policy / watchlist</span>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pipeline Distribution Bar Chart */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-amber-500" />
              Application Pipeline Distribution
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">100% Total</span>
          </div>

          <div className="h-4 w-full bg-slate-100 rounded-full flex overflow-hidden">
            <div style={{ width: `${autoApprovedPct}%` }} className="bg-emerald-500 h-full" title="Auto-Approved" />
            <div style={{ width: `${manuallyApprovedPct}%` }} className="bg-blue-500 h-full" title="Manually Approved" />
            <div style={{ width: `${pendingPct}%` }} className="bg-amber-400 h-full" title="Pending Review" />
            <div style={{ width: `${needsInfoPct}%` }} className="bg-amber-600 h-full" title="Needs Information" />
            <div style={{ width: `${rejectedPct}%` }} className="bg-rose-500 h-full" title="Rejected" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500 shrink-0" />
              <span className="text-slate-600">Auto-Approved ({autoApprovedPct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-500 shrink-0" />
              <span className="text-slate-600">Manual Approved ({manuallyApprovedPct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-400 shrink-0" />
              <span className="text-slate-600">Pending Review ({pendingPct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-600 shrink-0" />
              <span className="text-slate-600">Needs Info ({needsInfoPct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500 shrink-0" />
              <span className="text-slate-600">Rejected ({rejectedPct}%)</span>
            </div>
          </div>
        </div>

        {/* Daily Submissions Trend */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Daily Field Submissions Trend
            </h3>
            <span className="text-[11px] text-slate-400">Lake Basin Operations</span>
          </div>

          <div className="h-28 flex items-end justify-around gap-4 pt-4 border-b border-slate-100">
            {Object.entries(dailyCounts).map(([day, count]) => {
              const maxCount = 8;
              const barHeightPct = Math.max(15, Math.round((count / maxCount) * 100));

              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-xs font-black text-slate-900">{count}</span>
                  <div
                    className="w-full max-w-[40px] bg-gradient-to-t from-amber-500 to-yellow-400 rounded-t-lg transition-all shadow-xs"
                    style={{ height: `${barHeightPct}%` }}
                  />
                  <span className="text-[11px] font-bold text-slate-500">{day}</span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            Asynchronous onboarding allows agents to submit up to 3x more registrations daily.
          </p>
        </div>
      </div>
    </div>
  );
};
