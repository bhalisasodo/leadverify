# LeadVerify — Definition of Done

A feature is complete only when all applicable checks pass.

## Product
- Meets a documented user story.
- Respects the managed-service business model.
- Includes clear loading, empty, error, and success states.
- Is responsive and accessible.
- Does not expose direct client-agent hiring in MVP.

## Data
- Schema and migrations are version-controlled.
- Constraints and indexes are appropriate.
- Validation exists at the API/database boundary.
- No sensitive data is collected without a defined need.
- Test data is synthetic.

## Security
- Server-side authorisation is implemented.
- RLS policies are applied and tested.
- Cross-business and cross-agent access is tested.
- Secrets remain server-side.
- Sensitive admin actions are audited.
- File storage is private and access-controlled.

## Financial
- Uses exact money representation.
- Compensation terms are versioned.
- Calculations are tested.
- Adjustments and reversals preserve history.
- Duplicate webhook/event handling is idempotent.
- No automatic payout is implied unless integrated and verified.

## Quality
- Unit tests pass.
- Integration tests pass.
- Relevant E2E tests pass.
- No critical console or server errors.
- Error monitoring is configured for deployed environments.
- Documentation is updated.

## Release
- Staging review completed.
- Migration plan reviewed.
- Backup/recovery considered.
- Founder acceptance recorded.
- Outstanding risks are documented.
