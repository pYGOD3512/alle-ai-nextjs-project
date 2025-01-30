"use client";

import '@/app/globals.css';
import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { HelpButton } from '@/components/HelpButton';
import { FooterText } from '@/components/FooterText';
import { MainWrapper } from '@/components/MainWrapper';

const isMaintenance = false;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isMaintenance) {
    return null; // Handle maintenance on client side
  }

  return (
    <MainWrapper>
      <div className="h-screen flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col h-full relative">
          <Header />
          <div className="flex-1 overflow-auto">
            {children}
          </div>
          <HelpButton />
        </main>
      </div>
    </MainWrapper>
  );
}
