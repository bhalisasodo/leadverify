import { NextRequest, NextResponse } from 'next/server';
import { applicationService } from '@/lib/services/applications';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ ok: false, error: 'Token is required' }, { status: 400 });
    }

    const success = await applicationService.withdrawByToken(token);
    if (!success) {
      return NextResponse.json({ ok: false, error: 'Application not found or could not be withdrawn' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: 'Application has been successfully withdrawn' });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: 'Error processing withdrawal' }, { status: 500 });
  }
}
