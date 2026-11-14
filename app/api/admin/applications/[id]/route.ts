import { NextRequest, NextResponse } from 'next/server';
import { applicationService } from '@/lib/services/applications';
import type { ApplicationStatus, VerificationType, VerificationStatus } from '@/lib/types/talent';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const record = await applicationService.getById(params.id);
    if (!record) {
      return NextResponse.json({ ok: false, error: 'Application not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, application: record });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: 'Error fetching application' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'update_status') {
      const { status, note, changedBy } = body as {
        status: ApplicationStatus;
        note?: string;
        changedBy?: string;
      };

      if (!status) {
        return NextResponse.json({ ok: false, error: 'Status is required' }, { status: 400 });
      }

      const success = await applicationService.updateStatus(
        params.id,
        status,
        changedBy || 'Admin Reviewer',
        note
      );

      if (!success) {
        return NextResponse.json({ ok: false, error: 'Failed to update status' }, { status: 400 });
      }

      return NextResponse.json({ ok: true, message: 'Status updated successfully' });
    }

    if (action === 'record_verification') {
      const { type, status, evidenceReference, notes, reviewerId } = body as {
        type: VerificationType;
        status: VerificationStatus;
        evidenceReference?: string;
        notes?: string;
        reviewerId?: string;
      };

      if (!type || !status) {
        return NextResponse.json({ ok: false, error: 'Type and status are required' }, { status: 400 });
      }

      const success = await applicationService.recordVerification(
        params.id,
        type,
        status,
        reviewerId || 'Admin Verifier',
        evidenceReference,
        notes
      );

      if (!success) {
        return NextResponse.json({ ok: false, error: 'Failed to record verification' }, { status: 400 });
      }

      return NextResponse.json({ ok: true, message: 'Verification recorded successfully' });
    }

    return NextResponse.json({ ok: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: 'Error processing admin update' }, { status: 500 });
  }
}
