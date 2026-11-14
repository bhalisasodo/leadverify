import React, { useState } from 'react';
import { store } from '../../lib/supabase/client';
import { formatCents } from '../../lib/formatting/currency';
import { canAgentViewCampaignOpportunities } from '../../lib/permissions/rbac';
import {
  ShieldAlert,
  ShieldCheck,
  Briefcase,
  Send,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Sparkles,
} from 'lucide-react';

interface AgentPortalProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AgentPortal: React.FC<AgentPortalProps> = ({ activeTab, setActiveTab }) => {
  const currentAgent = store.getCurrentUserAgent();
  const assignments = store.getAssignments();
  const campaigns = store.getCampaigns();
  const compensations = store.getCompensations();
  const deliverables = store.getDeliverables();

  // Deliverable Lead Submission Form
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0]?.id || '');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isApproved = currentAgent ? canAgentViewCampaignOpportunities(currentAgent.approval_status) : false;

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      store.submitLead({
        campaignId: selectedCampaignId,
        companyName,
        contactName,
        contactEmail,
        contactPhone,
      });
      setSuccessMsg(`Lead for ${companyName} submitted successfully for LeadVerify QA review.`);
      setCompanyName('');
      setContactName('');
      setContactEmail('');
      setContactPhone('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit lead.');
    }
  };

  const totalEarningsCents = compensations.reduce((sum, c) => sum + c.amount_cents, 0);
  const approvedEarningsCents = compensations
    .filter((c) => c.status === 'approved' || c.status === 'paid')
    .reduce((sum, c) => sum + c.amount_cents, 0);
  const accruedEarningsCents = compensations
    .filter((c) => c.status === 'accrued')
    .reduce((sum, c) => sum + c.amount_cents, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner & Verification Status */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-sky-600" />
            <h1 className="text-2xl font-bold text-slate-900">{currentAgent?.display_name || 'Sales Agent'}</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {currentAgent?.profile_summary || 'Registered sales representative'}
          </p>
        </div>

        {/* Verification Status Badge */}
        <div>
          {isApproved ? (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified & Approved for Campaigns
            </div>
          ) : (
            <div className="bg-amber-50 text-amber-800 border border-amber-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Verification Status: {currentAgent?.approval_status.replace('_', ' ').toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Tab: Campaign Opportunities (Enforces Rule #4) */}
      {activeTab === 'agent-opportunities' && (
        <div className="space-y-6">
          {!isApproved ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center max-w-2xl mx-auto">
              <ShieldAlert className="w-12 h-12 text-amber-600 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-amber-900 mb-2">Campaign Access Restricted</h2>
              <p className="text-sm text-amber-700 leading-relaxed mb-4">
                <strong>Non-negotiable Rule #4:</strong> Agents must complete verification and receive administrator approval before viewing eligible campaign opportunities.
              </p>
              <div className="bg-white/70 rounded-lg p-3 text-xs text-amber-800 font-mono inline-block">
                Current Status: {currentAgent?.approval_status}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">Eligible Managed Campaign Opportunities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaigns.map((camp) => (
                  <div key={camp.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                          {camp.target_industry}
                        </span>
                        <span className="text-xs text-slate-400">Campaign ID: {camp.id.substring(0, 8)}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-1">{camp.title}</h3>
                      <p className="text-xs text-slate-500 mb-4">{camp.description}</p>

                      {camp.commercial_terms && (
                        <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1">
                          <div className="font-semibold text-slate-700">Client Terms Reference:</div>
                          <div className="text-slate-600">
                            Verified Lead: {formatCents(camp.commercial_terms.client_per_verified_lead_cents)} • Meeting: {formatCents(camp.commercial_terms.client_per_attended_appointment_cents)}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Direct Managed Staffing
                      </span>
                      <button
                        onClick={() => setActiveTab('agent-assignments')}
                        className="text-xs font-semibold text-sky-600 hover:text-sky-700"
                      >
                        View My Assignments →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Active Assignments */}
      {activeTab === 'agent-assignments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Your Campaign Assignments</h2>
            <button
              onClick={() => setActiveTab('agent-deliverables')}
              className="text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-lg shadow-sm"
            >
              + Submit Work
            </button>
          </div>

          {assignments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
              No active assignments currently allocated to your account.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {assignments.map((asg) => (
                <div key={asg.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-sky-600" />
                        <h3 className="text-lg font-bold text-slate-900">{asg.campaign_title || 'Active Campaign'}</h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                          {asg.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Assigned Role: <span className="font-semibold text-slate-700">{asg.role_in_campaign}</span> • Allocation: {asg.allocated_hours_per_week} hrs/week
                      </div>
                    </div>

                    {asg.compensation_terms && (
                      <div className="bg-slate-50 rounded-lg p-3 text-xs text-right">
                        <div className="text-slate-400">Agreed Compensation</div>
                        <div className="font-bold text-slate-900">
                          {formatCents(asg.compensation_terms.per_verified_lead_cents)} / lead • {formatCents(asg.compensation_terms.per_attended_appointment_cents)} / meeting
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Submit Deliverable & Lead Capture */}
      {activeTab === 'agent-deliverables' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Submit Qualified Lead Deliverable</h2>
          <p className="text-xs text-slate-500 mb-6">
            Leads are validated by LeadVerify QA against campaign criteria and checked for duplication before client delivery and compensation accrual.
          </p>

          {errorMsg && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmitLead} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Select Campaign *</label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex FinTech Solutions"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Decision Maker Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thabo Khumalo"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Contact Email *</label>
                <input
                  type="email"
                  required
                  placeholder="thabo@apexfintech.test"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+27 82 000 0000"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium shadow-sm transition"
              >
                <Send className="w-4 h-4" />
                Submit for QA Verification
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Earnings & Payouts */}
      {activeTab === 'agent-earnings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="text-xs text-slate-500">Total Calculated Earnings</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{formatCents(totalEarningsCents)}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="text-xs text-emerald-600 font-medium">Approved & Payable</div>
              <div className="text-2xl font-bold text-emerald-700 mt-1">{formatCents(approvedEarningsCents)}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="text-xs text-amber-600 font-medium">Accrued / In QA</div>
              <div className="text-2xl font-bold text-amber-700 mt-1">{formatCents(accruedEarningsCents)}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Itemized Compensation Events</h3>
              <p className="text-xs text-slate-500">Calculated transparently in integer cents with zero rounding drift.</p>
            </div>

            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Event Type</th>
                  <th className="px-6 py-3">Units</th>
                  <th className="px-6 py-3">Unit Rate</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {compensations.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">{c.event_type.replace(/_/g, ' ')}</td>
                    <td className="px-6 py-4">{c.units_count}</td>
                    <td className="px-6 py-4">{formatCents(c.unit_rate_cents, c.currency)}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{formatCents(c.amount_cents, c.currency)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          c.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.status.toUpperCase()}
                      </span>
                    </td>
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
