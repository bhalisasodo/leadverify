import { NextRequest, NextResponse } from 'next/server';
import { applicationService } from '@/lib/services/applications';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ ok: false, error: 'Token is required' }, { status: 400 });
  }

  const record = await applicationService.getByToken(token);
  if (!record) {
    return NextResponse.json({ ok: false, error: 'Application not found or link has expired' }, { status: 404 });
  }

  // Return non-sensitive status view for the applicant
  return NextResponse.json({
    ok: true,
    applicant: {
      reference: record.applicant.reference,
      firstName: record.applicant.firstName,
      status: record.applicant.status,
      createdAt: record.applicant.createdAt,
      updatedAt: record.applicant.updatedAt,
      withdrawnAt: record.applicant.withdrawnAt,
    },
    history: record.history.map((h) => ({
      toStatus: h.toStatus,
      changedAt: h.changedAt,
      note: h.note,
    })),
  });
}
