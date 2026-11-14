// LeadVerify Network: Currency Formatting and Exact Minor-Unit Handling

/**
 * Formats integer cents into a localized currency string (e.g. 1500000 cents -> "R 15,000.00")
 * Never converts to floating point for arithmetic; only converts for display presentation.
 */
export function formatCents(cents: number | bigint, currency: string = 'ZAR'): string {
  const numericCents = typeof cents === 'bigint' ? Number(cents) : cents;
  const isNegative = numericCents < 0;
  const absoluteCents = Math.abs(numericCents);

  const major = Math.floor(absoluteCents / 100);
  const minor = absoluteCents % 100;
  const minorString = minor.toString().padStart(2, '0');

  // Format integer major part with commas
  const majorString = major.toLocaleString('en-ZA');

  const prefix = currency === 'ZAR' ? 'R ' : `${currency} `;
  return `${isNegative ? '-' : ''}${prefix}${majorString}.${minorString}`;
}

/**
 * Converts user input string (e.g. "1,500.50" or "1500") into exact integer cents
 */
export function parseToCents(amountString: string): number {
  if (!amountString) return 0;
  // Clean whitespace, commas, and currency symbols
  const cleaned = amountString.replace(/[^0-9.-]/g, '');
  if (!cleaned) return 0;

  const parts = cleaned.split('.');
  const majorPart = parseInt(parts[0] || '0', 10);
  let minorPart = 0;

  if (parts.length > 1) {
    const minorStr = parts[1].padEnd(2, '0').slice(0, 2);
    minorPart = parseInt(minorStr, 10);
  }

  const sign = cleaned.startsWith('-') ? -1 : 1;
  return sign * (Math.abs(majorPart) * 100 + minorPart);
}
