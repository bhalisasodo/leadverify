import crypto from 'crypto';

export interface UploadedFileMeta {
  kind: 'cv' | 'portfolio' | 'certificate' | 'reference' | 'identity';
  storagePath: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
}

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export const documentService = {
  validateFile(originalName: string, mimeType: string, sizeBytes: number): { valid: boolean; error?: string } {
    if (sizeBytes > MAX_FILE_SIZE_BYTES) {
      return { valid: false, error: 'File exceeds maximum allowed limit of 10MB' };
    }
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return { valid: false, error: 'Invalid file format. Allowed types: PDF, DOC, DOCX, PNG, JPEG' };
    }
    return { valid: true };
  },

  generateStoragePath(kind: string, originalName: string): string {
    const safeExt = originalName.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'bin';
    const randomId = crypto.randomUUID();
    return `applicant-documents/${kind}/${randomId}.${safeExt}`;
  },

  async getSignedUrl(storagePath: string, expiresInSeconds = 900): Promise<string> {
    // In production with Supabase Storage:
    // const { data } = await supabase.storage.from('applicant-documents').createSignedUrl(storagePath, expiresInSeconds);
    // return data?.signedUrl || '';
    return `/api/documents/preview?path=${encodeURIComponent(storagePath)}&exp=${Date.now() + expiresInSeconds * 1000}`;
  },
};
