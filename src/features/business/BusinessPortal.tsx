import React, { useState } from 'react';
import { store } from '../../lib/supabase/client';
import { formatCents } from '../../lib/formatting/currency';
import { PlusCircle, CheckCircle2, Clock, FileText, Target, AlertCircle, Building, Users } from 'lucide-react';

interface BusinessPortalProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BusinessPortal: React.FC<BusinessPortalProps> = ({ activeTab, setActiveTab }) => {
  const currentBusiness = store.getCurrentUserBusiness();
  const campaigns = store.getCampaigns();
  const leads = store.getLeads();
  const invoices = store.getInvoices();

  // New Campaign Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icp, setIcp] = useState('');
  const [targetTitles, setTargetTitles] = useState('Head of DevOps, VP of Engineering, CTO');
  const [leadTarget, setLeadTarget] = useState(40);
  const [appointmentTarget, setAppointmentTarget] = useState(12);
  const [services, setServices] = useState<string[]>(['lead_generation', 'appointment_setting']);
  const [formSuccess, setFormSuccess] = useState(false);

  const handleSubmitCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    store.createCampaign({
      title,
      description,
      servicesRequested: services,
      idealCustomerProfile: icp,
      targetTitles: targetTitles.split(',').map((t) => t.trim()),
      leadTargetCount: Number(leadTarget),
      appointmentTargetCount: Number(appointmentTarget),
    });
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('biz-campaigns');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-sky-600" />
            <h1 className="text-2xl font-bold text-slate-900">
              {currentBusiness?.trading_name || currentBusiness?.legal_name || 'Client Business'}
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Technology Category: <span className="font-medium text-slate-700">{currentBusiness?.technology_category}</span> • Country: <span className="font-medium text-slate-700">{currentBusiness?.country}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Managed Client Account Active
          </div>
          <button
            onClick={() => setActiveTab('biz-new-campaign')}
            className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Request Campaign
          </button>
        </div>
      </div>

      {/* Tab: New Campaign Wizard */}
      {activeTab === 'biz-new-campaign' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Submit New Managed Campaign Request</h2>
          <p className="text-sm text-slate-500 mb-6">
            LeadVerify administrators will review your ICP, assign verified sales specialists, and configure commercial milestones.
          </p>

          {formSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-emerald-900">Campaign Request Submitted!</h3>
              <p className="text-sm text-emerald-700">Routing to LeadVerify operations for scoping and agent matching...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitCampaign} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q1 Kubernetes Platform Head of Engineering Outreach"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Objective & Overview *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your product value proposition, target problem, and goal for this sprint..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ideal Customer Profile (ICP) *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Target company size, technology stack, pain points, and buyer personas..."
                  value={icp}
                  onChange={(e) => setIcp(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target Decision Maker Titles</label>
                  <input
                    type="text"
                    value={targetTitles}
                    onChange={(e) => setTargetTitles(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target Verified Leads Count</label>
                  <input
                    type="number"
                    min={5}
                    value={leadTarget}
                    onChange={(e) => setLeadTarget(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('biz-campaigns')}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium shadow-sm transition"
                >
                  Submit for LeadVerify Review
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab: Campaigns List */}
      {activeTab === 'biz-campaigns' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Active & Submitted Campaigns</h2>
            <span className="text-xs text-slate-500">Tenant-isolated view for {currentBusiness?.legal_name}</span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {campaigns.map((camp) => (
              <div key={camp.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
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
                    <p className="text-sm text-slate-500 mt-1">{camp.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Target Deliverables</div>
                    <div className="text-sm font-semibold text-slate-800">
                      {camp.lead_target_count} Leads • {camp.appointment_target_count} Meetings
                    </div>
                  </div>
                </div>

                {camp.requirements && (
                  <div className="mt-4 bg-slate-50 rounded-lg p-3 text-xs text-slate-600 space-y-1">
                    <div>
                      <span className="font-semibold text-slate-700">Target ICP:</span> {camp.requirements.ideal_customer_profile}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Target Titles:</span> {camp.requirements.target_titles.join(', ')}
                    </div>
                  </div>
                )}

                {camp.commercial_terms && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
                    <div>
                      Retainer:{' '}
                      <span className="font-semibold text-slate-800">
                        {formatCents(camp.commercial_terms.client_monthly_retainer_cents, camp.commercial_terms.currency)}
                      </span>{' '}
                      • Per Verified Lead:{' '}
                      <span className="font-semibold text-slate-800">
                        {formatCents(camp.commercial_terms.client_per_verified_lead_cents, camp.commercial_terms.currency)}
                      </span>
                    </div>
                    <div>Payment Terms: {camp.commercial_terms.payment_terms_days} days</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Verified Pipeline */}
      {activeTab === 'biz-leads' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Verified Client Pipeline</h2>
            <p className="text-xs text-slate-500">
              Only QA-approved leads and validated appointments delivered by LeadVerify are presented here.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Company</th>
                  <th className="px-6 py-3">Decision Maker</th>
                  <th className="px-6 py-3">Contact Email</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Verification QA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {lead.company_name}
                      {lead.company_domain && <span className="block text-xs text-slate-400">{lead.company_domain}</span>}
                    </td>
                    <td className="px-6 py-4">
                      {lead.contact_name}
                      <span className="block text-xs text-slate-400">{lead.contact_title}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{lead.contact_email}</td>
                    <td className="px-6 py-4 text-xs">{lead.contact_phone || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        QA Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Billing & Invoices */}
      {activeTab === 'biz-billing' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Billing & Invoices</h2>
              <p className="text-xs text-slate-500">Track campaign retainers, verified milestones, and tax invoices.</p>
            </div>
            <div className="text-xs bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700 font-medium">
              Tax Currency: South African Rand (ZAR)
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Invoice #</th>
                  <th className="px-6 py-3">Subtotal</th>
                  <th className="px-6 py-3">15% VAT</th>
                  <th className="px-6 py-3">Total Amount</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-mono font-medium text-slate-900">{inv.invoice_number}</td>
                    <td className="px-6 py-4">{formatCents(inv.subtotal_cents, inv.currency)}</td>
                    <td className="px-6 py-4">{formatCents(inv.tax_cents, inv.currency)}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{formatCents(inv.total_cents, inv.currency)}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{inv.due_date}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {inv.status.toUpperCase()}
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
