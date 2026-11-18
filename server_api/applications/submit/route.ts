import { NextRequest, NextResponse } from 'next/server';
import { fullApplicationSchema } from '@/lib/validation/application';
import { applicationService } from '@/lib/services/applications';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = fullApplicationSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Validation failed',
          issues: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = await applicationService.submit(parseResult.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error processing application' },
      { status: 500 }
    );
  }
}
