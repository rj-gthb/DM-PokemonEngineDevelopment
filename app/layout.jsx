import './globals.css';
import { SystemStateProvider } from '../src/context/SystemStateContext';
import SystemLayoutShell from '../src/components/SystemLayoutShell';

export const metadata = {
  title: 'Group 6 | Pokemon Day II System',
  description: 'Pokemon Day II System - Team, Challenger, and Battle Prediction Engines',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SystemStateProvider>
          <SystemLayoutShell>{children}</SystemLayoutShell>
        </SystemStateProvider>
      </body>
    </html>
  );
}
