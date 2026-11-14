"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const linkClass = (href: string) =>
    `px-3 py-2 text-sm font-medium ${pathname === href ? 'text-deepBlue' : 'text-slate'} hover:text-deepBlue`;
  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center space-x-8">
          <Link href="/" className={linkClass('/')}>Home</Link>
          <Link href="/talent-network" className={linkClass('/talent-network')}>Talent Network</Link>
        </div>
        <div>
          <a href="/contact" className="bg-deepBlue text-white px-4 py-2 rounded-btn hover:bg-deepBlue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deepBlue">Book a discovery call</a>
        </div>
      </div>
    </nav>
  );
}
