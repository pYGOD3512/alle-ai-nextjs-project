// "use client"

import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/components/providers/AuthProvider';
import { RouteGuard } from '@/components/features/auth/RouteGuard';
import { ConnectionStatus } from '@/components/ConnectionStatus';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {/* <RouteGuard> */}
              <ConnectionStatus />
                {children}
            {/* </RouteGuard> */}
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
