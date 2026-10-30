// LeadVerify Network: Data Store & Repository Service
// Provides reactive query & mutation layer with tenant isolation and audit logging.

import {
  UserProfile,
  Business,
  Agent,
  Campaign,
  Assignment,
  Lead,
  Appointment,
  Deliverable,
  Invoice,
  CompensationCalculation,
  LedgerEntry,
  AuditLog,
  CampaignStatus,
  DeliverableStatus,
  AgentApprovalStatus,
} from '../../types';
import {
  INITIAL_PROFILES,
  INITIAL_BUSINESSES,
  INITIAL_AGENTS,
  INITIAL_CAMPAIGNS,
  INITIAL_ASSIGNMENTS,
  INITIAL_LEADS,
  INITIAL_APPOINTMENTS,
  INITIAL_DELIVERABLES,
  INITIAL_INVOICES,
  INITIAL_COMPENSATIONS,
  INITIAL_LEDGER,
  INITIAL_AUDIT_LOGS,
} from './mockData';
import { canBusinessAccessResource, canAgentAccessAssignment, canAgentViewCampaignOpportunities } from '../permissions/rbac';
import { calculateCompensation, generateInvoiceLedgerEntries, validateDoubleEntryLedger } from '../ledger/calculations';

class LeadVerifyStore {
  private profiles: UserProfile[] = [...INITIAL_PROFILES];
  private businesses: Business[] = [...INITIAL_BUSINESSES];
  private agents: Agent[] = [...INITIAL_AGENTS];
  private campaigns: Campaign[] = [...INITIAL_CAMPAIGNS];
  private assignments: Assignment[] = [...INITIAL_ASSIGNMENTS];
  private leads: Lead[] = [...INITIAL_LEADS];
  private appointments: Appointment[] = [...INITIAL_APPOINTMENTS];
  private deliverables: Deliverable[] = [...INITIAL_DELIVERABLES];
  private invoices: Invoice[] = [...INITIAL_INVOICES];
  private compensations: CompensationCalculation[] = [...INITIAL_COMPENSATIONS];
  private ledger: LedgerEntry[] = [...INITIAL_LEDGER];
  private auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];

  private currentUser: UserProfile = INITIAL_PROFILES[0]; // Default Alice Admin
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadState();
  }

  private saveState() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('leadverify_state_saved', 'true');
      }
    } catch {
      // Ignore storage errors in non-browser env
    }
  }

  private loadState() {
    // In-memory initialized with synthetic seed data
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.saveState();
    this.listeners.forEach((listener) => listener());
  }

  // --- Auth & Session ---
  public getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  public setCurrentUser(userId: string): void {
    const found = this.profiles.find((p) => p.id === userId);
    if (found) {
      this.currentUser = found;
      this.logAudit('auth.switch_user', 'user_profile', found.id, null, { email: found.email });
      this.notify();
    }
  }

  public getAllProfiles(): UserProfile[] {
    return [...this.profiles];
  }

  // Helper to get current user's business if any
  public getCurrentUserBusiness(): Business | undefined {
    if (this.currentUser.email === 'carl@cloudcore.test') {
      return this.businesses[0];
    }
    if (this.currentUser.email === 'dana@devmetrics.test') {
      return this.businesses[1];
    }
    return undefined;
  }

  // Helper to get current user's agent record if any
  public getCurrentUserAgent(): Agent | undefined {
    return this.agents.find((a) => a.user_id === this.currentUser.id);
  }

  // --- Audit Logging ---
  public logAudit(
    action: string,
    entityType: string,
    entityId: string,
    previousState?: Record<string, unknown> | null,
    newState?: Record<string, unknown> | null
  ) {
    const entry: AuditLog = {
      id: 'aud-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      actor_id: this.currentUser.id,
      actor_email: this.currentUser.email,
      actor_role: this.currentUser.roles[0],
      action,
      entity_type: entityType,
      entity_id: entityId,
      previous_state: previousState || undefined,
      new_state: newState || undefined,
      created_at: new Date().toISOString(),
    };
    this.auditLogs.unshift(entry);
  }

  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  // --- Businesses ---
  public getBusinesses(): Business[] {
    const userBusiness = this.getCurrentUserBusiness();
    if (userBusiness) {
      return this.businesses.filter((b) => b.id === userBusiness.id);
    }
    return [...this.businesses];
  }

  public registerBusiness(businessData: Omit<Business, 'id' | 'created_at' | 'verification_status'>): Business {
    const newBiz: Business = {
      id: 'biz-' + Date.now(),
      ...businessData,
      verification_status: 'pending',
      created_at: new Date().toISOString(),
    };
    this.businesses.push(newBiz);
    this.logAudit('business.registered', 'business', newBiz.id, null, { legal_name: newBiz.legal_name });
    this.notify();
    return newBiz;
  }

  // --- Agents ---
  public getAgents(): Agent[] {
    const userAgent = this.getCurrentUserAgent();
    if (userAgent) {
      return this.agents.filter((a) => a.id === userAgent.id);
    }
    return [...this.agents];
  }

  public registerAgent(agentData: {
    displayName: string;
    email: string;
    location: string;
    profileSummary: string;
    yearsExperience: number;
    capacityHoursPerWeek: number;
  }): Agent {
    const newUserId = 'usr-' + Date.now();
    const newProfile: UserProfile = {
      id: newUserId,
      display_name: agentData.displayName,
      email: agentData.email,
      timezone: 'Africa/Johannesburg',
      status: 'active',
      roles: ['agent'],
      created_at: new Date().toISOString(),
    };
    this.profiles.push(newProfile);

    const newAgent: Agent = {
      id: 'ag-' + Date.now(),
      user_id: newUserId,
      display_name: agentData.displayName,
      email: agentData.email,
      profile_summary: agentData.profileSummary,
      location: agentData.location,
      timezone: 'Africa/Johannesburg',
      years_experience: agentData.yearsExperience,
      availability_status: 'available',
      capacity_hours_per_week: agentData.capacityHoursPerWeek,
      approval_status: 'pending_review',
      skills: [],
      created_at: new Date().toISOString(),
    };
    this.agents.push(newAgent);
    this.logAudit('agent.registered', 'agent', newAgent.id, null, { email: newAgent.email });
    this.notify();
    return newAgent;
  }

  public updateAgentApprovalStatus(agentId: string, status: AgentApprovalStatus, reason?: string) {
    const agent = this.agents.find((a) => a.id === agentId);
    if (!agent) throw new Error('Agent not found');
    const oldStatus = agent.approval_status;
    agent.approval_status = status;
    this.logAudit('agent.status_updated', 'agent', agentId, { approval_status: oldStatus }, { approval_status: status, reason });
    this.notify();
  }

  // --- Campaigns ---
  public getCampaigns(): Campaign[] {
    const userBusiness = this.getCurrentUserBusiness();
    if (userBusiness) {
      return this.campaigns.filter((c) => canBusinessAccessResource(userBusiness.id, c.business_id));
    }
    const userAgent = this.getCurrentUserAgent();
    if (userAgent) {
      if (!canAgentViewCampaignOpportunities(userAgent.approval_status)) {
        return [];
      }
      // Return campaigns agent is assigned to or eligible active campaigns
      const agentAssignmentCampaignIds = this.assignments
        .filter((a) => a.agent_id === userAgent.id)
        .map((a) => a.campaign_id);
      return this.campaigns.filter((c) => agentAssignmentCampaignIds.includes(c.id));
    }
    return [...this.campaigns];
  }

  public createCampaign(campaignData: {
    title: string;
    description: string;
    servicesRequested: string[];
    idealCustomerProfile: string;
    targetTitles: string[];
    leadTargetCount: number;
    appointmentTargetCount: number;
  }): Campaign {
    const business = this.getCurrentUserBusiness() || this.businesses[0];
    const newCampaign: Campaign = {
      id: 'camp-' + Date.now(),
      business_id: business.id,
      business_name: business.trading_name || business.legal_name,
      title: campaignData.title,
      description: campaignData.description,
      target_industry: 'Technology',
      services_requested: campaignData.servicesRequested,
      status: 'submitted',
      lead_target_count: campaignData.leadTargetCount,
      appointment_target_count: campaignData.appointmentTargetCount,
      requirements: {
        id: 'req-' + Date.now(),
        campaign_id: 'camp-' + Date.now(),
        ideal_customer_profile: campaignData.idealCustomerProfile,
        target_titles: campaignData.targetTitles,
        target_geographies: ['South Africa'],
        target_company_sizes: ['20-250 employees'],
      },
      commercial_terms: {
        id: 'term-' + Date.now(),
        campaign_id: 'camp-' + Date.now(),
        version: 1,
        currency: 'ZAR',
        client_monthly_retainer_cents: 1500000,
        client_per_verified_lead_cents: 50000,
        client_per_attended_appointment_cents: 150000,
        client_commission_bps: 500,
        payment_terms_days: 14,
        is_active: true,
      },
      created_at: new Date().toISOString(),
    };
    this.campaigns.push(newCampaign);
    this.logAudit('campaign.submitted', 'campaign', newCampaign.id, null, { title: newCampaign.title });
    this.notify();
    return newCampaign;
  }

  public updateCampaignStatus(campaignId: string, status: CampaignStatus) {
    const campaign = this.campaigns.find((c) => c.id === campaignId);
    if (!campaign) throw new Error('Campaign not found');
    const oldStatus = campaign.status;
    campaign.status = status;
    this.logAudit('campaign.status_changed', 'campaign', campaignId, { status: oldStatus }, { status });
    this.notify();
  }

  // --- Assignments ---
  public getAssignments(): Assignment[] {
    const userAgent = this.getCurrentUserAgent();
    if (userAgent) {
      return this.assignments.filter((a) => canAgentAccessAssignment(userAgent.id, a.agent_id));
    }
    return [...this.assignments];
  }

  public assignAgentToCampaign(params: {
    campaignId: string;
    agentId: string;
    roleInCampaign: string;
    hoursPerWeek: number;
    perLeadCents: number;
    perAppointmentCents: number;
    commissionBps: number;
  }): Assignment {
    const campaign = this.campaigns.find((c) => c.id === params.campaignId);
    const agent = this.agents.find((a) => a.id === params.agentId);
    if (!campaign || !agent) throw new Error('Campaign or Agent not found');

    if (!canAgentViewCampaignOpportunities(agent.approval_status)) {
      throw new Error('Non-negotiable rule: Agents must be approved before assignment to campaigns.');
    }

    const assignment: Assignment = {
      id: 'asg-' + Date.now(),
      campaign_id: campaign.id,
      campaign_title: campaign.title,
      agent_id: agent.id,
      agent_name: agent.display_name,
      role_in_campaign: params.roleInCampaign,
      status: 'offered',
      allocated_hours_per_week: params.hoursPerWeek,
      compensation_terms: {
        id: 'c-term-' + Date.now(),
        assignment_id: 'asg-' + Date.now(),
        currency: 'ZAR',
        base_hourly_rate_cents: 0,
        per_verified_lead_cents: params.perLeadCents,
        per_attended_appointment_cents: params.perAppointmentCents,
        commission_bps: params.commissionBps,
      },
      created_at: new Date().toISOString(),
    };
    this.assignments.push(assignment);
    this.logAudit('assignment.created', 'assignment', assignment.id, null, { agent_name: agent.display_name, role: assignment.role_in_campaign });
    this.notify();
    return assignment;
  }

  public acceptAssignment(assignmentId: string): void {
    const asg = this.assignments.find((a) => a.id === assignmentId);
    if (!asg) throw new Error('Assignment not found');
    asg.status = 'active';
    this.logAudit('assignment.accepted', 'assignment', asg.id, { status: 'offered' }, { status: 'active' });
    this.notify();
  }

  // --- Leads & Deduplication ---
  public getLeads(): Lead[] {
    const userBusiness = this.getCurrentUserBusiness();
    if (userBusiness) {
      const bizCampaignIds = this.campaigns.filter((c) => c.business_id === userBusiness.id).map((c) => c.id);
      return this.leads.filter((l) => bizCampaignIds.includes(l.campaign_id) && ['verified', 'accepted'].includes(l.status));
    }
    const userAgent = this.getCurrentUserAgent();
    if (userAgent) {
      return this.leads.filter((l) => l.agent_id === userAgent.id);
    }
    return [...this.leads];
  }

  public submitLead(leadData: {
    campaignId: string;
    companyName: string;
    companyDomain?: string;
    contactName: string;
    contactTitle?: string;
    contactEmail: string;
    contactPhone?: string;
    linkedinUrl?: string;
  }): Lead {
    const userAgent = this.getCurrentUserAgent() || this.agents[0];
    const campaign = this.campaigns.find((c) => c.id === leadData.campaignId);
    if (!campaign) throw new Error('Campaign not found');

    // Rule: Duplicate prevention check per campaign
    const isDuplicate = this.leads.some(
      (l) => l.campaign_id === leadData.campaignId && l.contact_email.toLowerCase() === leadData.contactEmail.toLowerCase()
    );
    if (isDuplicate) {
      throw new Error(`Duplicate lead error: A lead with email "${leadData.contactEmail}" is already registered for this campaign.`);
    }

    const newLead: Lead = {
      id: 'lead-' + Date.now(),
      campaign_id: leadData.campaignId,
      agent_id: userAgent.id,
      agent_name: userAgent.display_name,
      company_name: leadData.companyName,
      company_domain: leadData.companyDomain,
      contact_name: leadData.contactName,
      contact_title: leadData.contactTitle,
      contact_email: leadData.contactEmail,
      contact_phone: leadData.contactPhone,
      linkedinUrl: leadData.linkedinUrl,
      status: 'submitted',
      created_at: new Date().toISOString(),
    };
    this.leads.push(newLead);
    this.logAudit('lead.submitted', 'lead', newLead.id, null, { email: newLead.contact_email, company: newLead.company_name });
    this.notify();
    return newLead;
  }

  public verifyLead(leadId: string, isAccepted: boolean, reason?: string) {
    const lead = this.leads.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');
    const oldStatus = lead.status;
    lead.status = isAccepted ? 'verified' : 'rejected';
    lead.rejection_reason = reason;
    this.logAudit('lead.verified', 'lead', leadId, { status: oldStatus }, { status: lead.status, reason });

    // Accrue agent compensation if accepted
    if (isAccepted) {
      const assignment = this.assignments.find((a) => a.campaign_id === lead.campaign_id && a.agent_id === lead.agent_id);
      const unitRate = assignment?.compensation_terms?.per_verified_lead_cents || 25000;
      this.compensations.push({
        id: 'comp-' + Date.now(),
        assignment_id: assignment?.id || 'asg-auto',
        campaign_id: lead.campaign_id,
        agent_id: lead.agent_id,
        event_type: 'verified_lead_unit',
        units_count: 1,
        unit_rate_cents: unitRate,
        amount_cents: unitRate,
        currency: 'ZAR',
        status: 'approved',
        calculated_at: new Date().toISOString(),
      });
    }

    this.notify();
  }

  // --- Deliverables & QA Review ---
  public getDeliverables(): Deliverable[] {
    const userBusiness = this.getCurrentUserBusiness();
    if (userBusiness) {
      const bizCampaignIds = this.campaigns.filter((c) => c.business_id === userBusiness.id).map((c) => c.id);
      return this.deliverables.filter((d) => bizCampaignIds.includes(d.campaign_id) && d.status === 'approved');
    }
    const userAgent = this.getCurrentUserAgent();
    if (userAgent) {
      return this.deliverables.filter((d) => d.agent_id === userAgent.id);
    }
    return [...this.deliverables];
  }

  public reviewDeliverable(deliverableId: string, status: DeliverableStatus, feedback: string) {
    const deliv = this.deliverables.find((d) => d.id === deliverableId);
    if (!deliv) throw new Error('Deliverable not found');
    const oldStatus = deliv.status;
    deliv.status = status;
    this.logAudit('deliverable.reviewed', 'deliverable', deliverableId, { status: oldStatus }, { status, feedback });
    this.notify();
  }

  // --- Finance, Invoices & Immutable Ledger ---
  public getInvoices(): Invoice[] {
    const userBusiness = this.getCurrentUserBusiness();
    if (userBusiness) {
      return this.invoices.filter((i) => i.business_id === userBusiness.id);
    }
    return [...this.invoices];
  }

  public getCompensations(): CompensationCalculation[] {
    const userAgent = this.getCurrentUserAgent();
    if (userAgent) {
      return this.compensations.filter((c) => c.agent_id === userAgent.id);
    }
    return [...this.compensations];
  }

  public getLedger(): LedgerEntry[] {
    return [...this.ledger];
  }

  public issueInvoice(campaignId: string, subtotalCents: number): Invoice {
    const campaign = this.campaigns.find((c) => c.id === campaignId);
    if (!campaign) throw new Error('Campaign not found');

    const taxCents = Math.round((subtotalCents * 1500) / 10000); // 15% VAT in integer cents
    const totalCents = subtotalCents + taxCents;

    const newInvoice: Invoice = {
      id: 'inv-' + Date.now(),
      invoice_number: `INV-2026-${(this.invoices.length + 1).toString().padStart(3, '0')}`,
      business_id: campaign.business_id,
      business_name: campaign.business_name,
      campaign_id: campaign.id,
      subtotal_cents: subtotalCents,
      tax_cents: taxCents,
      total_cents: totalCents,
      currency: 'ZAR',
      status: 'issued',
      issued_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    };

    this.invoices.push(newInvoice);

    // Generate balanced double-entry ledger entries
    const agentReserveCents = Math.round(subtotalCents * 0.4); // 40% reserved for agent payouts
    const platformRevenueCents = totalCents - agentReserveCents;

    const entries = generateInvoiceLedgerEntries({
      campaignId: campaign.id,
      invoiceId: newInvoice.id,
      totalClientCents: totalCents,
      agentReserveCents,
      platformRevenueCents,
      currency: 'ZAR',
    });

    const validation = validateDoubleEntryLedger(entries);
    if (!validation.isValid) {
      throw new Error(`Double-entry balance violation: net difference is ${validation.netDifferenceCents} cents.`);
    }

    entries.forEach((entry) => {
      this.ledger.push({
        ...entry,
        id: 'ledg-' + Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString(),
      });
    });

    this.logAudit('finance.invoice_issued', 'invoice', newInvoice.id, null, { invoice_number: newInvoice.invoice_number, total_cents: totalCents });
    this.notify();
    return newInvoice;
  }
}

export const store = new LeadVerifyStore();
