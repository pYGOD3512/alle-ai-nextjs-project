"use client";

import '../globals.css';
import React from 'react';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import PlansArea from '@/components/features/plans/PlansArea';

import { message, Tour } from 'antd';
import type { TourProps } from 'antd';

import { useAuth } from '@/components/providers/authTest';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { isSubscribed } = useAuth();

  return (
  <>
    {isSubscribed ? (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full relative">
        <Header />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
      </div>
    ) : (
      <div className="h-screen flex overflow-hidden">
        <main className="flex-1 flex flex-col h-full relative">
          <Header />
          <PlansArea />
        </main>
      </div>
    )}
  </>
  );
}
