"use client"

import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from "@/components/ui/toaster"
import { usePageTitle } from '@/hooks/use-page-title';
import { AuthProvider } from '@/components/providers/authTest';
import { usePathname } from 'next/navigation';
import { publicRoutes, privateRoutes } from '@/components/providers/authTest';
import { NotFoundPage } from '@/components/features/not-found/404';


const inter = Inter({ subsets: ['latin'] });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  usePageTitle();
    const pathname = usePathname();

      // Function to check if the current path matches any route
  const matchRoute = (route: string): boolean => {
    // Exact match
    if (route === pathname) return true;
    
    // Check if the pathname starts with the route (for nested routes)
    if (route.endsWith('/*') && pathname.startsWith(route.slice(0, -2))) return true;
    
    return false;
  };

  // Check if the current path matches any public or private route
  const isPublicRoute = publicRoutes.some(route => matchRoute(route));
  const isPrivateRoute = privateRoutes.some(route => matchRoute(route));

  if (!isPublicRoute && !isPrivateRoute) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NotFoundPage 
              title="Page Not Found"
              description="Oops! Looks like you've wandered off the beaten path. Let's get you back on track!"
              showHomeButton={true}
            />
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    );
  }


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
            {children}
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
