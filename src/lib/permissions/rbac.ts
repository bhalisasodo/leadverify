// LeadVerify Network: Role-Based Access Control and Authorization Guards
// Single source of truth for permission checks across frontend and business logic.

import { UserProfile, UserRole, AgentApprovalStatus } from '../../types';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 100,
  operations_admin: 80,
  finance_admin: 70,
  business_user: 30,
  agent: 20,
};

/**
 * Checks if a user has any administrative privileges
 */
export function isAdminUser(user: UserProfile | null): boolean {
  if (!user) return false;
  return user.roles.some((role) =>
    ['super_admin', 'operations_admin', 'finance_admin'].includes(role)
  );
}

/**
 * Checks if user is an operations administrator
 */
export function isOperationsAdmin(user: UserProfile | null): boolean {
  if (!user) return false;
  return user.roles.includes('operations_admin') || user.roles.includes('super_admin');
}

/**
 * Checks if user is a finance administrator
 */
export function isFinanceAdmin(user: UserProfile | null): boolean {
  if (!user) return false;
  return user.roles.includes('finance_admin') || user.roles.includes('super_admin');
}

/**
 * Checks if user is a client business user
 */
export function isBusinessUser(user: UserProfile | null): boolean {
  if (!user) return false;
  return user.roles.includes('business_user');
}

/**
 * Checks if user is an agent
 */
export function isAgentUser(user: UserProfile | null): boolean {
  if (!user) return false;
  return user.roles.includes('agent');
}

/**
 * Core Non-Negotiable Business Rule #4 & #5:
 * "Agents must be approved before viewing eligible campaign opportunities."
 * "Assignment-specific permissions control access to client/campaign data."
 */
export function canAgentViewCampaignOpportunities(agentApprovalStatus: AgentApprovalStatus): boolean {
  return agentApprovalStatus === 'approved';
}

/**
 * Business Rule #13:
 * "Business users only see their own organisation's data."
 */
export function canBusinessAccessResource(
  userBusinessId: string | null | undefined,
  resourceBusinessId: string
): boolean {
  if (!userBusinessId) return false;
  return userBusinessId === resourceBusinessId;
}

/**
 * Business Rule #14:
 * "Agents only see their own profile and assigned work."
 */
export function canAgentAccessAssignment(
  userAgentId: string | null | undefined,
  assignmentAgentId: string
): boolean {
  if (!userAgentId) return false;
  return userAgentId === assignmentAgentId;
}
