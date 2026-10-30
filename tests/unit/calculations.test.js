import test from 'node:test';
import assert from 'node:assert/strict';

// Test Exact Minor-Unit Handling & VAT
function calculateCompensation(event) {
  if (event.eventType === 'closed_deal_commission') {
    const dealSize = event.dealSizeCents || 0;
    const bps = event.commissionBps || 0;
    return Math.round((dealSize * bps) / 10000);
  }
  return Math.round(event.unitCount * event.unitRateCents);
}

function calculateVat(subtotalCents, vatRateBps = 1500) {
  return Math.round((subtotalCents * vatRateBps) / 10000);
}

function validateDoubleEntryLedger(entries) {
  let totalDebits = 0;
  let totalCredits = 0;
  for (const entry of entries) {
    if (entry.amount_cents <= 0) {
      throw new Error(`Amount must be positive: got ${entry.amount_cents}`);
    }
    if (entry.direction === 'debit') {
      totalDebits += entry.amount_cents;
    } else {
      totalCredits += entry.amount_cents;
    }
  }
  return {
    isValid: totalDebits === totalCredits,
    netDifferenceCents: totalDebits - totalCredits,
  };
}

test('Rule 12: Integer minor-unit arithmetic prevents floating point drift', () => {
  // Test unit rate calculation: 3 leads at R250.00 each = R750.00 (75,000 cents)
  const leadComp = calculateCompensation({
    eventType: 'verified_lead_unit',
    unitCount: 3,
    unitRateCents: 25000,
  });
  assert.equal(leadComp, 75000);

  // Test commission calculation: 2.5% (250 bps) on R125,500.00 deal (12,550,000 cents)
  // 12,550,000 * 250 / 10,000 = 313,750 cents (R3,137.50)
  const dealComp = calculateCompensation({
    eventType: 'closed_deal_commission',
    dealSizeCents: 12550000,
    commissionBps: 250,
  });
  assert.equal(dealComp, 313750);

  // South African 15% VAT on R15,000.00 retainer (1,500,000 cents) = R2,250.00 (225,000 cents)
  const vat = calculateVat(1500000, 1500);
  assert.equal(vat, 225000);
});

test('Rule 11: Double-entry ledger balancing enforces strict credit-debit equality', () => {
  const balancedEntries = [
    { account: 'client_receivable', direction: 'debit', amount_cents: 1725000 },
    { account: 'platform_revenue', direction: 'credit', amount_cents: 1500000 },
    { account: 'fee_reserve', direction: 'credit', amount_cents: 225000 },
  ];

  const result = validateDoubleEntryLedger(balancedEntries);
  assert.equal(result.isValid, true);
  assert.equal(result.netDifferenceCents, 0);

  const unbalancedEntries = [
    { account: 'client_receivable', direction: 'debit', amount_cents: 1725000 },
    { account: 'platform_revenue', direction: 'credit', amount_cents: 1500000 },
  ];

  const unbalancedResult = validateDoubleEntryLedger(unbalancedEntries);
  assert.equal(unbalancedResult.isValid, false);
  assert.equal(unbalancedResult.netDifferenceCents, 225000);
});
