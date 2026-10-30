import React, { useState, useEffect } from 'react';
import { store } from './lib/supabase/client';
import { Navigation } from './components/ui/Navigation';
import { BusinessPortal } from './features/business/BusinessPortal';
import { AgentPortal } from './features/agent/AgentPortal';
import { AdminPortal } from './features/admin/AdminPortal';
import { UserProfile } from './types';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(store.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('admin-campaigns');

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCurrentUser({ ...store.getCurrentUser() });
    });
    return () => unsubscribe();
  }, []);

  const isOpsOrFinance =
    currentUser.roles.includes('operations_admin') ||
    currentUser.roles.includes('super_admin') ||
    currentUser.roles.includes('finance_admin');
  const isBusiness = currentUser.roles.includes('business_user');
  const isAgent = currentUser.roles.includes('agent');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navigation
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1">
        {isOpsOrFinance && (
          <AdminPortal activeTab={activeTab} setActiveTab={setActiveTab} />
        )}

        {isBusiness && (
          <BusinessPortal activeTab={activeTab} setActiveTab={setActiveTab} />
        )}

        {isAgent && (
          <AgentPortal activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            LeadVerify Network (Pty) Ltd — Managed B2B Sales Execution Network • South Africa
          </div>
          <div className="font-mono text-slate-400">
            Current Session: {currentUser.display_name} ({currentUser.roles.join(', ')})
          </div>
        </div>
      </footer>
    </div>
  );
};
