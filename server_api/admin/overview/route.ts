import { NextResponse } from 'next/server';
import { applicationService } from '@/lib/services/applications';

export async function GET() {
  try {
    const metrics = await applicationService.getOverviewMetrics();
    return NextResponse.json({ ok: true, metrics });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: 'Failed to fetch overview metrics' }, { status: 500 });
  }
}
