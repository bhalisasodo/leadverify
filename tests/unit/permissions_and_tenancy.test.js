import test from 'node:test';
import assert from 'node:assert/strict';

function canAgentViewCampaignOpportunities(approvalStatus) {
  return approvalStatus === 'approved';
}

function canBusinessAccessResource(userBusinessId, resourceBusinessId) {
  if (!userBusinessId) return false;
  return userBusinessId === resourceBusinessId;
}

function canAgentAccessAssignment(userAgentId, assignmentAgentId) {
  if (!userAgentId) return false;
  return userAgentId === assignmentAgentId;
}

function validateDuplicateLead(existingLeads, newLead) {
  return existingLeads.some(
    (l) =>
      l.campaign_id === newLead.campaign_id &&
      l.contact_email.toLowerCase() === newLead.contact_email.toLowerCase()
  );
}

test('Non-negotiable Rule 4: Unverified/unapproved agents cannot view campaign opportunities', () => {
  assert.equal(canAgentViewCampaignOpportunities('approved'), true);
  assert.equal(canAgentViewCampaignOpportunities('draft'), false);
  assert.equal(canAgentViewCampaignOpportunities('pending_review'), false);
  assert.equal(canAgentViewCampaignOpportunities('rejected'), false);
  assert.equal(canAgentViewCampaignOpportunities('suspended'), false);
});

test('Non-negotiable Rule 13: Business users are strictly isolated to their own organisation', () => {
  const cloudCoreBizId = 'biz-cloudcore-001';
  const devMetricsBizId = 'biz-devmetrics-002';

  // Carl from CloudCore accessing CloudCore campaign -> Allowed
  assert.equal(canBusinessAccessResource(cloudCoreBizId, cloudCoreBizId), true);

  // Carl from CloudCore accessing DevMetrics campaign -> Denied
  assert.equal(canBusinessAccessResource(cloudCoreBizId, devMetricsBizId), false);

  // User without business membership -> Denied
  assert.equal(canBusinessAccessResource(null, cloudCoreBizId), false);
});

test('Non-negotiable Rule 14: Agents only see their own assigned work', () => {
  const sarahAgentId = 'ag-sarah-001';
  const mikeAgentId = 'ag-mike-002';

  // Sarah accessing Sarah assignment -> Allowed
  assert.equal(canAgentAccessAssignment(sarahAgentId, sarahAgentId), true);

  // Sarah accessing Mike assignment -> Denied
  assert.equal(canAgentAccessAssignment(sarahAgentId, mikeAgentId), false);
});

test('Lead Deduplication: Submitting duplicate email in same campaign is rejected', () => {
  const existingLeads = [
    { campaign_id: 'camp-1', contact_email: 'liam@finflow.test' },
    { campaign_id: 'camp-1', contact_email: 'kagiso@paystacker.test' },
  ];

  const duplicateLead = { campaign_id: 'camp-1', contact_email: 'LIAM@finflow.test' };
  const uniqueLead = { campaign_id: 'camp-1', contact_email: 'david@finflow.test' };
  const sameEmailDifferentCampaign = { campaign_id: 'camp-2', contact_email: 'liam@finflow.test' };

  assert.equal(validateDuplicateLead(existingLeads, duplicateLead), true);
  assert.equal(validateDuplicateLead(existingLeads, uniqueLead), false);
  assert.equal(validateDuplicateLead(existingLeads, sameEmailDifferentCampaign), false);
});
