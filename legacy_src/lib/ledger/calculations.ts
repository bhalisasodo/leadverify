// LeadVerify Network: Compensation and Double-Entry Ledger Calculation Engine
// Enforces exact integer cents math with zero floating-point drift.

import { LedgerAccount, LedgerDirection, LedgerEntry } from '../../types';

export interface CompensationEvent {
  eventType: 'verified_lead_unit' | 'attended_appointment_unit' | 'closed_deal_commission' | 'base_hourly';
  unitCount: number;
  unitRateCents: number;
  dealSizeCents?: number;
  commissionBps?: number;
}

/**
 * Calculates exact compensation in integer cents.
 */
export function calculateCompensation(event: CompensationEvent): number {
  if (event.eventType === 'closed_deal_commission') {
    const dealSize = event.dealSizeCents || 0;
    const bps = event.commissionBps || 0;
    // Deal size in cents * bps / 10,000 (with exact integer round to nearest cent)
    return Math.round((dealSize * bps) / 10000);
  }

  return Math.round(event.unitCount * event.unitRateCents);
}

/**
 * Standard South African VAT calculation (15%) in exact cents
 */
export function calculateVat(subtotalCents: number, vatRateBps: number = 1500): number {
  return Math.round((subtotalCents * vatRateBps) / 10000);
}

/**
 * Validates a double-entry ledger transaction.
 * Double-entry rule: The sum of debits must equal the sum of credits.
 */
export function validateDoubleEntryLedger(
  entries: Array<{ account: LedgerAccount; direction: LedgerDirection; amount_cents: number }>
): { isValid: boolean; netDifferenceCents: number } {
  let totalDebits = 0;
  let totalCredits = 0;

  for (const entry of entries) {
    if (entry.amount_cents <= 0) {
      throw new Error(`Ledger entry amount must be strictly positive: got ${entry.amount_cents}`);
    }
    if (entry.direction === 'debit') {
      totalDebits += entry.amount_cents;
    } else {
      totalCredits += entry.amount_cents;
    }
  }

  const netDifferenceCents = totalDebits - totalCredits;
  return {
    isValid: netDifferenceCents === 0,
    netDifferenceCents,
  };
}

/**
 * Helper to generate double-entry records when an invoice is issued to a client.
 * Dr. Client Receivable
 * Cr. Platform Revenue (Client fee portion)
 * Cr. Fee Reserve (Accrued Agent liability reserve)
 */
export function generateInvoiceLedgerEntries(params: {
  campaignId: string;
  invoiceId: string;
  totalClientCents: number;
  agentReserveCents: number;
  platformRevenueCents: number;
  currency?: string;
}): Array<Omit<LedgerEntry, 'id' | 'created_at'>> {
  const transactionId = crypto.randomUUID ? crypto.randomUUID() : 'tx-' + Math.random().toString(36).substring(2, 9);
  const currency = params.currency || 'ZAR';

  return [
    {
      transaction_id: transactionId,
      campaign_id: params.campaignId,
      reference_type: 'invoice_issued',
      reference_id: params.invoiceId,
      account: 'client_receivable',
      direction: 'debit',
      amount_cents: params.totalClientCents,
      currency,
      description: `Invoice issued: Receivable from client`,
    },
    {
      transaction_id: transactionId,
      campaign_id: params.campaignId,
      reference_type: 'invoice_issued',
      reference_id: params.invoiceId,
      account: 'platform_revenue',
      direction: 'credit',
      amount_cents: params.platformRevenueCents,
      currency,
      description: `Platform revenue recognized`,
    },
    {
      transaction_id: transactionId,
      campaign_id: params.campaignId,
      reference_type: 'invoice_issued',
      reference_id: params.invoiceId,
      account: 'fee_reserve',
      direction: 'credit',
      amount_cents: params.agentReserveCents,
      currency,
      description: `Agent deliverable liability reserve held`,
    },
  ];
}
