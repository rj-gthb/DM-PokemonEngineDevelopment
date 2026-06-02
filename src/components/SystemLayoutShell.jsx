'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import TypeBackground from './TypeBackground';
import { useSystemState } from '../context/SystemStateContext';

const TABS = [
  { href: '/team-engine', label: 'Team Engine' },
  { href: '/challenger-engine', label: 'Challenger Engine' },
  { href: '/battle-prediction', label: 'Battle Prediction Engine' },
];

export default function SystemLayoutShell({ children }) {
  const pathname = usePathname();
  const { currentType } = useSystemState();
  const useCssTypeBackground = pathname === '/team-engine' || pathname === '/challenger-engine';

  return (
    <div className="app-shell" data-type={currentType || undefined}>
      {!useCssTypeBackground && <TypeBackground currentType={currentType} />}

      <header className="glass-header">
        <p className="screen-kicker">GROUP 6 - BATTLE LINK CONSOLE</p>
        <h1>Group 6 | Pokemon Day II System</h1>
        <nav className="engine-tabs">
          {TABS.map((tab) => (
            <Link key={tab.href} href={tab.href} className={`tab-btn ${pathname === tab.href ? 'active' : ''}`}>
              {tab.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="container">{children}</main>
    </div>
  );
}
