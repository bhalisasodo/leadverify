import React from 'react';
import { UserProfile } from '../../types';
import { store } from '../../lib/supabase/client';
import { ShieldCheck, Building2, UserCheck, LogOut, ArrowRightLeft } from 'lucide-react';

interface NavigationProps {
  currentUser: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentUser, activeTab, setActiveTab }) => {
  const allProfiles = store.getAllProfiles();

  const isOpsAdmin = currentUser.roles.includes('operations_admin') || currentUser.roles.includes('super_admin');
  const isFinance = currentUser.roles.includes('finance_admin');
  const isBiz = currentUser.roles.includes('business_user');
  const isAgent = currentUser.roles.includes('agent');

  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center font-bold text-white text-lg shadow-inner">
              LV
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                LeadVerify
                <span className="text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                  MVP
                </span>
              </div>
              <div className="text-xs text-slate-400">Managed Sales Execution Network</div>
            </div>
          </div>

          {/* Role Navigation Links */}
          <nav className="hidden md:flex space-x-1">
            {isBiz && (
              <>
                <button
                  onClick={() => setActiveTab('biz-campaigns')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    activeTab.startsWith('biz-campaigns')
                      ? 'bg-sky-700 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  My Campaigns
                </button>
                <button
                  onClick={() => setActiveTab('biz-new-campaign')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    activeTab === 'biz-new-campaign'
                      ? 'bg-sky-700 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  + New Campaign
                </button>
                <button
                  onClick={() => setActiveTab('biz-leads')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    activeTab === 'biz-leads'
                      ? 'bg-sky-700 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  Verified Pipeline
                </button>
                <button
                  onClick={() => setActiveTab('biz-billing')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    activeTab === 'biz-billing'
                      ? 'bg-sky-700 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  Invoices & Billing
                </button>
              </>
            )}

            {isAgent && (
              <>
                <button
                  onClick={() => setActiveTab('agent-assignments')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    activeTab === 'agent-assignments'
                      ? 'bg-sky-700 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  Active Assignments
                </button>
                <button
                  onClick={() => setActiveTab('agent-opportunities')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    activeTab === 'agent-opportunities'
                      ? 'bg-sky-700 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  Campaign Opportunities
                </button>
                <button
                  onClick={() => setActiveTab('agent-deliverables')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    activeTab === 'agent-deliverables'
                      ? 'bg-sky-700 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  Submit Deliverable
                </button>
                <button
                  onClick={() => setActiveTab('agent-earnings')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    activeTab === 'agent-earnings'
                      ? 'bg-sky-700 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  Earnings & Payouts
                </button>
              </>
            )}

            {(isOpsAdmin || isFinance) && (
              <>
                <button
                  onClick={() => setActiveTab('admin-campaigns')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    activeTab === 'admin-campaigns'
                      ? 'bg-sky-700 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  Campaigns & Review
                </button>
                <button
                  onClick={() => setActiveTab('admin-agents')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    activeTab === 'admin-agents'
                      ? 'bg-sky-700 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  Agent Network & Vetting
                </button>
                <button
                  onClick={() => setActiveTab('admin-qa')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    activeTab === 'admin-qa'
                      ? 'bg-sky-700 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  QA Deliverables
                </button>
                <button
                  onClick={() => setActiveTab('admin-finance')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    activeTab === 'admin-finance'
                      ? 'bg-sky-700 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  Finance & Ledger
                </button>
                <button
                  onClick={() => setActiveTab('admin-audit')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    activeTab === 'admin-audit'
                      ? 'bg-sky-700 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  Audit Trail
                </button>
              </>
            )}
          </nav>

          {/* Quick Persona Switcher for pair-programming and review */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300">
              <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
              <span className="hidden sm:inline mr-1 text-slate-400">Persona:</span>
              <select
                aria-label="Switch User Persona"
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                value={currentUser.id}
                onChange={(e) => {
                  store.setCurrentUser(e.target.value);
                  const selected = allProfiles.find((p) => p.id === e.target.value);
                  if (selected?.roles.includes('business_user')) setActiveTab('biz-campaigns');
                  else if (selected?.roles.includes('agent')) setActiveTab('agent-assignments');
                  else setActiveTab('admin-campaigns');
                }}
              >
                {allProfiles.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.display_name} ({p.roles.join(', ')})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
