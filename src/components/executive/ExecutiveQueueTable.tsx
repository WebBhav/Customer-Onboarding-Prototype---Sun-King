import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RegistrationApplication } from '../../types';
import {
  Search,
  Filter,
  ArrowUpDown,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  User,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';

interface ExecutiveQueueTableProps {
  initialQueueFilter?: string;
  onSelectApplication: (id: string) => void;
}

export const ExecutiveQueueTable: React.FC<ExecutiveQueueTableProps> = ({
  initialQueueFilter = 'ALL',
  onSelectApplication
}) => {
  const { applications, simulatedTime } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>(initialQueueFilter);
  const [valueTierFilter, setValueTierFilter] = useState<'ALL' | 'NORMAL' | 'HIGH'>('ALL');
  const [sortField, setSortField] = useState<'SLA_URGENT' | 'SUBMISSION_TIME' | 'NAME'>('SLA_URGENT');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter logic
  const filteredApps = applications.filter((app) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = app.customer.fullName.toLowerCase().includes(q);
      const matchId = app.id.toLowerCase().includes(q);
      const matchPhone = app.customer.phoneNumber.includes(q);
      const matchProduct = app.product.name.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchPhone && !matchProduct) return false;
    }

    // Value tier filter
    if (valueTierFilter === 'NORMAL' && app.valueCategory !== 'NORMAL_VALUE') return false;
    if (valueTierFilter === 'HIGH' && app.valueCategory !== 'HIGH_VALUE') return false;

    // Queue Filter
    switch (activeFilter) {
      case 'NORMAL_QUEUE':
        return app.valueCategory === 'NORMAL_VALUE' && app.status !== 'AUTO_APPROVED' && app.status !== 'REJECTED';
      case 'HIGH_VALUE_QUEUE':
        return app.valueCategory === 'HIGH_VALUE';
      case 'MANUAL_REVIEW':
        return app.status === 'MANUAL_REVIEW';
      case 'FRAUD_REVIEW':
        return app.status === 'SUSPECTED_FRAUD';
      case 'NEEDS_INFORMATION':
        return app.status === 'NEEDS_INFORMATION';
      case 'AUTO_APPROVED':
        return app.status === 'AUTO_APPROVED';
      case 'QA_SAMPLES':
        return app.isAuditSample === true;
      case 'MANUALLY_APPROVED':
        return app.status === 'MANUALLY_APPROVED';
      case 'REJECTED':
        return app.status === 'REJECTED';
      case 'OTP_PENDING':
        return app.verification.otpStatus !== 'VERIFIED';
      case 'INVALID_VIDEO':
        return app.verification.videoStatus !== 'VALID';
      default:
        return true;
    }
  });

  // Sorting: Urgency approaching deadlines first, then older submissions
  filteredApps.sort((a, b) => {
    if (sortField === 'SLA_URGENT') {
      // Overdue first
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;

      // Urgent next
      if (a.isUrgent && !b.isUrgent) return -1;
      if (!a.isUrgent && b.isUrgent) return 1;

      // Then by SLA deadline ascending
      return new Date(a.slaDeadlineTimestamp).getTime() - new Date(b.slaDeadlineTimestamp).getTime();
    }

    if (sortField === 'SUBMISSION_TIME') {
      return new Date(b.submissionTimestamp).getTime() - new Date(a.submissionTimestamp).getTime();
    }

    if (sortField === 'NAME') {
      return a.customer.fullName.localeCompare(b.customer.fullName);
    }

    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(filteredApps.length / pageSize));
  const paginatedApps = filteredApps.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadge = (app: RegistrationApplication) => {
    switch (app.status) {
      case 'AUTO_APPROVED':
        return <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded text-[11px]">Auto-Approved</span>;
      case 'MANUALLY_APPROVED':
        return <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded text-[11px]">Approved</span>;
      case 'NEEDS_INFORMATION':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded text-[11px] animate-pulse">Needs Info</span>;
      case 'SUSPECTED_FRAUD':
        return <span className="bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded text-[11px]">Suspected Fraud</span>;
      case 'REJECTED':
        return <span className="bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded text-[11px]">Rejected</span>;
      default:
        return <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[11px]">Review Required</span>;
    }
  };

  const getSlaRemainingBadge = (app: RegistrationApplication) => {
    if (app.status === 'AUTO_APPROVED' || app.status === 'MANUALLY_APPROVED' || app.status === 'REJECTED') {
      return <span className="text-slate-400 font-mono text-[11px]">Settled</span>;
    }

    const deadline = new Date(app.slaDeadlineTimestamp).getTime();
    const now = simulatedTime.getTime();
    const diffMin = Math.round((deadline - now) / (1000 * 60));

    if (diffMin < 0) {
      return (
        <span className="bg-rose-100 text-rose-800 border border-rose-300 font-mono font-bold px-2 py-0.5 rounded text-[10px] animate-pulse">
          Overdue ({Math.abs(diffMin)}m)
        </span>
      );
    }

    if (diffMin <= 30) {
      return (
        <span className="bg-amber-100 text-amber-800 border border-amber-300 font-mono font-bold px-2 py-0.5 rounded text-[10px]">
          Urgent ({diffMin}m left)
        </span>
      );
    }

    const hours = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    return (
      <span className="text-slate-600 font-mono text-[11px]">
        {hours > 0 ? `${hours}h ` : ''}{mins}m left
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, ref ID, phone, or product..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <select
            value={valueTierFilter}
            onChange={(e) => setValueTierFilter(e.target.value as any)}
            className="px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
          >
            <option value="ALL">All Tiers</option>
            <option value="NORMAL">Normal Value</option>
            <option value="HIGH">High Value</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold">Sort by:</span>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as any)}
            className="px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white cursor-pointer"
          >
            <option value="SLA_URGENT">⚠️ Urgency (SLA Deadlines First)</option>
            <option value="SUBMISSION_TIME">🕒 Submission Time (Newest First)</option>
            <option value="NAME">🔤 Customer Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-3">Reg ID</th>
                <th className="py-3 px-3">Customer Name</th>
                <th className="py-3 px-3">Catalog Item</th>
                <th className="py-3 px-3">Tier</th>
                <th className="py-3 px-3">Submitted</th>
                <th className="py-3 px-3">Smile ID</th>
                <th className="py-3 px-3">OTP</th>
                <th className="py-3 px-3">Video</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">SLA Remaining</th>
                <th className="py-3 px-3">Reviewer</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedApps.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-400">
                    No applications found in this queue.
                  </td>
                </tr>
              ) : (
                paginatedApps.map((app) => {
                  const isHigh = app.valueCategory === 'HIGH_VALUE';
                  const maskedPhone = `${app.customer.countryCode} ${app.customer.phoneNumber.replace(/.(?=.{3})/g, '•')}`;

                  return (
                    <tr
                      key={app.id}
                      onClick={() => onSelectApplication(app.id)}
                      className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                        app.isOverdue ? 'bg-rose-50/30' : app.isUrgent ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {app.id}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{app.customer.fullName}</span>
                          {app.isAuditSample && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                              QA 10%
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{maskedPhone}</span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap text-slate-700">
                        {app.product.name}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                            isHigh ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {isHigh ? 'High Val' : 'Normal'}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                        {new Date(app.submissionTimestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold ${
                            app.verification.smileIdStatus === 'CLEAR'
                              ? 'text-emerald-700'
                              : app.verification.smileIdStatus === 'BLOCKED_FRAUD'
                              ? 'text-rose-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {app.verification.smileIdStatus}
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold ${
                            app.verification.otpStatus === 'VERIFIED'
                              ? 'text-emerald-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {app.verification.otpStatus}
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold ${
                            app.verification.videoStatus === 'VALID'
                              ? 'text-emerald-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {app.verification.videoStatus} ({app.evidence.videoDurationSeconds}s)
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        {getStatusBadge(app)}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        {getSlaRemainingBadge(app)}
                      </td>

                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap text-[11px]">
                        {app.assignedReviewerName ? app.assignedReviewerName.split(' ')[0] : '—'}
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectApplication(app.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-all"
                        >
                          Inspect →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong>{paginatedApps.length}</strong> of <strong>{filteredApps.length}</strong> cases
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded bg-white border border-slate-300 disabled:opacity-40 font-semibold"
            >
              Prev
            </button>
            <span className="px-2 font-mono">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded bg-white border border-slate-300 disabled:opacity-40 font-semibold"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
