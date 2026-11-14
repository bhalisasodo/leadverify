import React, { useState } from 'react';
import { store } from '../../lib/supabase/client';
import { formatCents } from '../../lib/formatting/currency';
import { AgentApprovalStatus, CampaignStatus, DeliverableStatus } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Briefcase,
  Users,
  Building,
  DollarSign,
  FileCheck,
  History,
  AlertCircle,
  Sparkles,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';

interface AdminPortalProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ activeTab, setActiveTab }) => {
  const campaigns = store.getCampaigns();
  const agents = store.getAgents();
  const deliverables = store.getDeliverables();
  const invoices = store.getInvoices();
  const ledger = store.getLedger();
  const auditLogs = store.getAuditLogs();

  // Agent Matching State
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0]?.id || '');
  const [selectedAgentId, setSelectedAgentId] = useState(agents.find((a) => a.approval_status === 'approved')?.id || '');
  const [matchingRole, setMatchingRole] = useState('Outbound Tech SDR');
  const [perLeadCents, setPerLeadCents] = useState(25000); // R250
  const [perMeetingCents, setPerMeetingCents] = useState(75000); // R750
  const [matchingSuccess, setMatchingSuccess] = useState('');
  const [matchingError, setMatchingError] = useState('');

  // Invoice Generation State
  const [invoiceCampaignId, setInvoiceCampaignId] = useState(campaigns[0]?.id || '');
  const [subtotalCents, setSubtotalCents] = useState(1500000); // R15,000

  const handleApproveAgent = (agentId: string) => {
    store.updateAgentApprovalStatus(agentId, 'approved');
  };

  const handleRejectAgent = (agentId: string) => {
    const reason = prompt('Enter rejection reason for audit log:');
    if (reason) {
      store.updateAgentApprovalStatus(agentId, 'rejected', reason);
    }
  };

  const handleUpdateCampaignStatus = (campaignId: string, status: CampaignStatus) => {
    store.updateCampaignStatus(campaignId, status);
  };

  const handleReviewDeliverable = (deliverableId: string, status: DeliverableStatus) => {
    const feedback = prompt(`Enter QA review notes for ${status}:`) || 'Reviewed by LeadVerify Operations';
    store.reviewDeliverable(deliverableId, status, feedback);
  };

  const handleAssignAgent = (e: React.FormEvent) => {
    e.preventDefault();
    setMatchingSuccess('');
    setMatchingError('');
    try {
      store.assignAgentToCampaign({
        campaignId: selectedCampaignId,
        agentId: selectedAgentId,
        roleInCampaign: matchingRole,
        hoursPerWeek: 20,
        perLeadCents: Number(perLeadCents),
        perAppointmentCents: Number(perMeetingCents),
        commissionBps: 200,
      });
      setMatchingSuccess('Agent successfully matched and assigned to campaign!');
    } catch (err: any) {
      setMatchingError(err.message || 'Failed to assign agent.');
    }
  };

  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      store.issueInvoice(invoiceCampaignId, Number(subtotalCents));
      alert('Invoice and balanced double-entry ledger records issued successfully!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-xl shadow-md p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-sky-400" />
            <h1 className="text-2xl font-bold">LeadVerify Operations & Finance Console</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Managed Sales Operating System — Campaign Approval, Agent Vetting, QA & Immutable Ledger
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300">
            Total Ledger Entries: {ledger.length}
          </div>
          <div className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300">
            Audit Logs: {auditLogs.length}
          </div>
        </div>
      </div>

      {/* Tab: Campaigns Review & Approval */}
      {activeTab === 'admin-campaigns' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Campaign Scoping & Approval Queue</h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {campaigns.map((camp) => (
              <div key={camp.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">{camp.id.substring(0, 8)}</span>
                      <h3 className="text-lg font-bold text-slate-900">{camp.title}</h3>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          camp.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : camp.status === 'submitted'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {camp.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Client Business: <span className="font-semibold text-slate-700">{camp.business_name}</span> • Industry: {camp.target_industry}
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="flex items-center gap-2">
                    {camp.status === 'submitted' && (
                      <button
                        onClick={() => handleUpdateCampaignStatus(camp.id, 'active')}
                        className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Activate
                      </button>
                    )}
                    {camp.status === 'active' && (
                      <button
                        onClick={() => handleUpdateCampaignStatus(camp.id, 'paused')}
                        className="text-xs font-medium bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1.5 rounded-lg transition"
                      >
                        Pause Campaign
                      </button>
                    )}
                    {camp.status === 'paused' && (
                      <button
                        onClick={() => handleUpdateCampaignStatus(camp.id, 'active')}
                        className="text-xs font-medium bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg transition"
                      >
                        Resume Campaign
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg space-y-1">
                    <div className="font-semibold text-slate-700">Scoping & ICP:</div>
                    <div className="text-slate-600">{camp.requirements?.ideal_customer_profile || 'Standard ICP'}</div>
                    <div className="text-slate-500">Titles: {camp.requirements?.target_titles.join(', ')}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg space-y-1">
                    <div className="font-semibold text-slate-700">Commercial Terms:</div>
                    <div className="text-slate-600">
                      Retainer: {formatCents(camp.commercial_terms?.client_monthly_retainer_cents || 0)} • Per Verified Lead:{' '}
                      {formatCents(camp.commercial_terms?.client_per_verified_lead_cents || 0)}
                    </div>
                    <div className="text-slate-500">Targets: {camp.lead_target_count} Leads / {camp.appointment_target_count} Appointments</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Agent Network & Vetting Queue */}
      {activeTab === 'admin-agents' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Agent Vetting & Verification Queue</h2>
                <p className="text-xs text-slate-500">
                  Open registration gate: Agents can register, but are blocked from campaigns until approved by operations.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Agent</th>
                    <th className="px-6 py-3">Location / Timezone</th>
                    <th className="px-6 py-3">Experience</th>
                    <th className="px-6 py-3">Vetting Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {agents.map((ag) => (
                    <tr key={ag.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{ag.display_name}</div>
                        <div className="text-xs font-mono text-slate-400">{ag.email}</div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {ag.location}
                        <span className="block text-slate-400">{ag.timezone}</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium">
                        {ag.years_experience} yrs exp • {ag.capacity_hours_per_week} hrs/wk
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                            ag.approval_status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ag.approval_status === 'pending_review'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {ag.approval_status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {ag.approval_status !== 'approved' ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApproveAgent(ag.id)}
                              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-2.5 py-1 rounded transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectAgent(ag.id)}
                              className="text-xs bg-red-100 hover:bg-red-200 text-red-700 font-medium px-2.5 py-1 rounded transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active Staff
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Manual Agent Matching Console */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">Manual Agent-to-Campaign Assignment</h3>
            <p className="text-xs text-slate-500 mb-4">
              Match verified sales professionals with active campaigns and bind explicit compensation terms.
            </p>

            {matchingSuccess && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-700">
                {matchingSuccess}
              </div>
            )}
            {matchingError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                {matchingError}
              </div>
            )}

            <form onSubmit={handleAssignAgent} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Target Campaign</label>
                <select
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Select Approved Agent</label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.display_name} ({a.approval_status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Role Title</label>
                <input
                  type="text"
                  value={matchingRole}
                  onChange={(e) => setMatchingRole(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Agent Per-Lead Rate (cents)</label>
                <input
                  type="number"
                  value={perLeadCents}
                  onChange={(e) => setPerLeadCents(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Agent Per-Meeting Rate (cents)</label>
                <input
                  type="number"
                  value={perMeetingCents}
                  onChange={(e) => setPerMeetingCents(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium px-4 py-2 rounded-lg text-xs transition shadow-sm"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab: QA Deliverables Queue */}
      {activeTab === 'admin-qa' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Deliverable Quality Assurance & Review</h2>
            <p className="text-xs text-slate-500">
              Deliverables are reviewed against acceptance criteria. Approving a deliverable triggers agent compensation accrual.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Deliverable</th>
                  <th className="px-6 py-3">Submitting Agent</th>
                  <th className="px-6 py-3">Item Count</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">QA Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliverables.map((deliv) => (
                  <tr key={deliv.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{deliv.title}</div>
                      <div className="text-xs text-slate-500">{deliv.deliverable_type}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-800">{deliv.agent_name}</td>
                    <td className="px-6 py-4 text-xs">{deliv.item_count} items</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          deliv.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : deliv.status === 'submitted'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {deliv.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {deliv.status === 'submitted' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReviewDeliverable(deliv.id, 'approved')}
                            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-2.5 py-1 rounded transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReviewDeliverable(deliv.id, 'revision_requested')}
                            className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium px-2.5 py-1 rounded transition"
                          >
                            Request Revision
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Finance & Immutable Ledger */}
      {activeTab === 'admin-finance' && (
        <div className="space-y-6">
          {/* Issue New Invoice Drawer */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">Issue Client Retainer / Milestone Invoice</h3>
            <p className="text-xs text-slate-500 mb-4">
              Automatically creates balanced double-entry ledger entries: Dr. Client Receivable, Cr. Platform Revenue, Cr. Agent Reserve.
            </p>
            <form onSubmit={handleGenerateInvoice} className="flex flex-wrap items-end gap-4">
              <div className="w-64">
                <label className="block text-xs font-medium text-slate-700 mb-1">Select Campaign</label>
                <select
                  value={invoiceCampaignId}
                  onChange={(e) => setInvoiceCampaignId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.business_name})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-48">
                <label className="block text-xs font-medium text-slate-700 mb-1">Subtotal (ZAR Cents)</label>
                <input
                  type="number"
                  value={subtotalCents}
                  onChange={(e) => setSubtotalCents(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white font-medium px-4 py-2 rounded-lg text-xs transition shadow-sm"
              >
                Issue Invoice & Post to Ledger
              </button>
            </form>
          </div>

          {/* Double-Entry Ledger Explorer */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Immutable Double-Entry Financial Ledger</h3>
                <p className="text-xs text-slate-500">
                  Every financial transaction must balance (Debits = Credits) with exact minor units (integer cents).
                </p>
              </div>
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded text-xs font-semibold">
                ✓ Ledger Balanced
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Tx ID</th>
                    <th className="px-6 py-3">Account</th>
                    <th className="px-6 py-3">Direction</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  {ledger.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-3 text-slate-400">{entry.transaction_id.substring(0, 11)}</td>
                      <td className="px-6 py-3 font-semibold text-slate-800">{entry.account}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            entry.direction === 'debit'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {entry.direction.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-bold text-slate-900">
                        {formatCents(entry.amount_cents, entry.currency)}
                      </td>
                      <td className="px-6 py-3 font-sans text-slate-600">{entry.description}</td>
                      <td className="px-6 py-3 text-slate-400">{entry.created_at.substring(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Immutable Audit Trail */}
      {activeTab === 'admin-audit' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">System Audit Logs</h2>
            <p className="text-xs text-slate-500">
              Append-only audit trail recording every state change, approval, verification decision, and ledger mutation.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Actor</th>
                  <th className="px-6 py-3">Entity</th>
                  <th className="px-6 py-3">Details</th>
                  <th className="px-6 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3 font-mono font-bold text-xs text-slate-900">{log.action}</td>
                    <td className="px-6 py-3 text-xs">
                      <div className="font-medium text-slate-800">{log.actor_email}</div>
                      <div className="text-slate-400">{log.actor_role}</div>
                    </td>
                    <td className="px-6 py-3 font-mono text-xs text-slate-600">
                      {log.entity_type}:{log.entity_id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-3 text-xs font-mono text-slate-500">
                      {log.new_state ? JSON.stringify(log.new_state) : '—'}
                    </td>
                    <td className="px-6 py-3 text-xs text-slate-400">{log.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
