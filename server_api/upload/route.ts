import { NextRequest, NextResponse } from 'next/server';
import { documentService } from '@/lib/services/documents';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const kind = (formData.get('kind') as string) || 'cv';

    if (!file) {
      return NextResponse.json({ ok: false, error: 'No file provided' }, { status: 400 });
    }

    const validation = documentService.validateFile(file.name, file.type, file.size);
    if (!validation.valid) {
      return NextResponse.json({ ok: false, error: validation.error }, { status: 400 });
    }

    const storagePath = documentService.generateStoragePath(kind, file.name);

    return NextResponse.json({
      ok: true,
      file: {
        kind,
        storagePath,
        originalName: file.name,
        mimeType: file.type || 'application/octet-stream',
        sizeBytes: file.size,
      },
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ ok: false, error: 'File upload processing failed' }, { status: 500 });
  }
}
