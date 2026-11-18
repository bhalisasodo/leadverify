import { NextRequest, NextResponse } from 'next/server';
import { applicationService } from '@/lib/services/applications';

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get('search') || undefined;
    const status = req.nextUrl.searchParams.get('status') || undefined;
    const province = req.nextUrl.searchParams.get('province') || undefined;

    const applications = await applicationService.list({ search, status, province });
    return NextResponse.json({ ok: true, applications });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: 'Failed to list applications' }, { status: 500 });
  }
}
