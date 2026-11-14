import test from 'node:test';
import assert from 'node:assert/strict';
import { applicationService } from '../../lib/services/applications.ts';

test('Workflow: Submit application generates valid reference and hashed token', async () => {
  const result = await applicationService.submit({
    personal: {
      firstName: 'Lerato',
      lastName: 'Khumalo',
      email: 'lerato.khumalo@example.co.za',
      phone: '+27 83 999 8888',
      city: 'Cape Town',
      province: 'Western Cape',
      country: 'South Africa',
    },
    professional: {
      jobTitle: 'Sales Development Representative',
      employmentStatus: 'Employed full-time',
      yearsExperience: '1 to 2',
      headline: 'Outbound sales specialist',
      biography: 'Specialising in cold outreach and discovery calls',
    },
    expertise: {
      primaryCategory: 'Sales',
      secondaryCategories: ['Lead generation'],
      skills: ['Cold calling', 'Appointment setting'],
      industries: ['Software, Cloud & Technology'],
      languages: ['English', 'isiXhosa'],
    },
    preferences: {
      workTypes: ['Full-time contract'],
      workModes: ['Remote'],
      weeklyAvailability: '40+ hours (Full-time)',
      preferredHours: 'Standard hours',
      earliestAvailability: '2026-12-01',
      compensationStructure: 'Fixed monthly retainer',
      compensationExpectation: 'R30,000 / month',
    },
    documents: {
      cv: {
        kind: 'cv',
        storagePath: 'applicant-documents/cv/sample.pdf',
        originalName: 'Lerato_Khumalo_CV.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 1024 * 300,
      },
      certificates: [],
      referencesText: '',
    },
    consent: {
      consentProcessing: true,
      consentSharing: false,
      consentMarketing: false,
    },
  });

  assert.equal(result.ok, true);
  assert.match(result.reference, /^LV-TN-\d{6}$/);
  assert.ok(result.statusToken && result.statusToken.length > 20);

  // Retrieve by status token
  const retrieved = await applicationService.getByToken(result.statusToken);
  assert.ok(retrieved);
  assert.equal(retrieved.applicant.email, 'lerato.khumalo@example.co.za');
  assert.equal(retrieved.applicant.status, 'application_received');

  // Admin updates status to under_review
  const updated = await applicationService.updateStatus(
    retrieved.applicant.id,
    'under_review',
    'Senior Reviewer',
    'Candidate CV matches current commercial requirements'
  );
  assert.equal(updated, true);

  // Check updated record
  const checkUpdated = await applicationService.getById(retrieved.applicant.id);
  assert.equal(checkUpdated?.applicant.status, 'under_review');
  assert.equal(checkUpdated?.history[0].toStatus, 'under_review');
  assert.equal(checkUpdated?.history[0].note, 'Candidate CV matches current commercial requirements');

  // Verifier records experience verification
  const verResult = await applicationService.recordVerification(
    retrieved.applicant.id,
    'experience',
    'verified',
    'Verification Officer',
    'Verified 2 years SDR at TechPro SA via previous manager call',
    'Positive endorsement received.'
  );
  assert.equal(verResult, true);

  // Applicant voluntarily withdraws
  const withdrawResult = await applicationService.withdrawByToken(result.statusToken);
  assert.equal(withdrawResult, true);

  const finalRecord = await applicationService.getByToken(result.statusToken);
  assert.equal(finalRecord?.applicant.status, 'withdrawn');
  assert.ok(finalRecord?.applicant.withdrawnAt);
  assert.ok(finalRecord?.applicant.deletedAt); // Scheduled deletion marker
});
