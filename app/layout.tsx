import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LeadVerify — B2B Sales Intelligence · South Africa',
  description: 'Real sales conversations, verified from the first call. We find the right prospects, reach the decision-makers who matter and book the meetings.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#fff', fontFamily: 'Inter, sans-serif', color: '#44546A' }}>
        {children}
      </body>
    </html>
  );
}
