'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleThemeToggle}
      className="hidden md:flex w-8 h-8 p-1 text-muted-foreground rounded-full border border-borderColorPrimary"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:scale-0 dark:-rotate-90 [&[data-theme='system']]:scale-0 [&[data-theme='system']]:rotate-90" data-theme={theme} />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 [&[data-theme='system']]:scale-0 [&[data-theme='system']]:rotate-90" data-theme={theme} />
      <Monitor className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all [&[data-theme='system']]:rotate-0 [&[data-theme='system']]:scale-100" data-theme={theme} />
    </Button>
  );
}