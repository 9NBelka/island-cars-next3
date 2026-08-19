import type { ReactNode } from 'react';
import '../app/globals.scss';
import ScrollRestorer from './components/ScrollRestorer/ScrollRestorer';

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en'>
      <body suppressHydrationWarning>
        <ScrollRestorer />
        {children}
      </body>
    </html>
  );
}
