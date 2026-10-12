import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditEvent } from '../../types';
import { ShieldCheck, Search, Filter, Clock, User, FileText } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { applications } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Aggregate all audit events from all applications sorted chronologically descending
  const allEvents: Array<AuditEvent & { regId: string; customerName: string }> = [];

  applications.forEach((app) => {
    app.auditTrail.forEach((ev) => {
      allEvents.push({
        ...ev,
        regId: app.id,
        customerName: app.customer.fullName
      });
    });
  });

  allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filteredEvents = allEvents.filter((ev) => {
    if (roleFilter !== 'ALL' && ev.actorRole !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAction = ev.action.toLowerCase().includes(q);
      const matchActor = ev.actor.toLowerCase().includes(q);
      const matchReg = ev.regId.toLowerCase().includes(q);
      const matchCustomer = ev.customerName.toLowerCase().includes(q);
      const matchDetails = (ev.details || '').toLowerCase().includes(q);
      if (!matchAction && !matchActor && !matchReg && !matchCustomer && !matchDetails) {
        return false;
      }
    }
    return true;
  });

  const getRoleBadge = (role: AuditEvent['actorRole']) => {
    switch (role) {
      case 'SYSTEM':
        return <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-[10px] font-bold">SYSTEM</span>;
      case 'FIELD_AGENT':
        return <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px] font-bold">FIELD AGENT</span>;
      case 'SENIOR_EXECUTIVE':
        return <span className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded text-[10px] font-bold">SR. EXECUTIVE</span>;
      default:
        return <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold">EXECUTIVE</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            Enterprise Audit Trail & Governance Log
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log of all registration submissions, automated rules evaluations, evidence recaptures, and executive authorizations.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter audit trail..."
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
          >
            <option value="ALL">All Roles</option>
            <option value="FIELD_AGENT">Field Agent</option>
            <option value="SYSTEM">System Automation</option>
            <option value="EXECUTIVE">Executive</option>
            <option value="SENIOR_EXECUTIVE">Senior Executive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Application</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Audit Details & Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {new Date(ev.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-slate-900 block">{ev.regId}</span>
                    <span className="text-[11px] text-slate-500">{ev.customerName}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                    {ev.action}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                    {ev.actor}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getRoleBadge(ev.actorRole)}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-md">
                    {ev.details || ev.reason || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
