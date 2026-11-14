import test from 'node:test';
import assert from 'node:assert/strict';
import {
  personalInfoSchema,
  professionalInfoSchema,
  preferencesSchema,
  consentSchema,
} from '../../lib/validation/application.ts';
import { documentService } from '../../lib/services/documents.ts';

test('Validation: Personal info requires valid email and mandatory fields', () => {
  const invalid = personalInfoSchema.safeParse({
    firstName: '',
    lastName: 'Dlamini',
    email: 'not-an-email',
    phone: '123',
    city: '',
    province: 'Invalid Province',
  });
  assert.equal(invalid.success, false);

  const valid = personalInfoSchema.safeParse({
    firstName: 'Sipho',
    lastName: 'Dlamini',
    email: 'sipho@example.co.za',
    phone: '+27 82 123 4567',
    city: 'Johannesburg',
    province: 'Gauteng',
    country: 'South Africa',
  });
  assert.equal(valid.success, true);
});

test('Validation: Consent for application processing is strictly mandatory', () => {
  const rejected = consentSchema.safeParse({
    consentProcessing: false,
    consentSharing: true,
    consentMarketing: true,
  });
  assert.equal(rejected.success, false);

  const accepted = consentSchema.safeParse({
    consentProcessing: true,
    consentSharing: false,
    consentMarketing: false,
  });
  assert.equal(accepted.success, true);
});

test('Document Service: Enforces 10MB limit and approved MIME types', () => {
  const oversize = documentService.validateFile('cv.pdf', 'application/pdf', 15 * 1024 * 1024);
  assert.equal(oversize.valid, false);
  assert.match(oversize.error || '', /10MB/);

  const invalidMime = documentService.validateFile('script.exe', 'application/x-msdownload', 1024);
  assert.equal(invalidMime.valid, false);
  assert.match(invalidMime.error || '', /Invalid file format/);

  const validDoc = documentService.validateFile('resume.pdf', 'application/pdf', 1024 * 500);
  assert.equal(validDoc.valid, true);
});
