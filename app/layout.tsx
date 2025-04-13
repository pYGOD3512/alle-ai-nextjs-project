"use client"

import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { RouteGuard } from '@/components/features/auth/RouteGuard';
import Script from 'next/script';

import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="/js/jquery.js?ver=1.0.0" strategy="beforeInteractive" />
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-LFYE2GVHQG" 
          strategy="afterInteractive" 
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LFYE2GVHQG');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RouteGuard>
            <AuthProvider>
                {/* <ConnectionStatus /> */}
                {children}
              <Toaster position="top-center" />
            </AuthProvider>
          </RouteGuard>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-4MEVHC95MQ" />
    </html>
  );
}
