'use client';

import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useSidebarStore, navItems, models } from '@/lib/constants';

export function Header() {
  const { isOpen, toggle } = useSidebarStore();
  
  return (
    <header className="sticky top-0 z-50 w-full  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className={`absolute left-0 h-14 flex items-center justify-center transition-all duration-200 ${
        isOpen ? 'w-60' : 'w-16'
      } border-r px-4`}>
        {isOpen ? (
          <Image 
            src="/svgs/logo-desktop-dark-full.png"
            alt="Logo"
            width={100}
            height={100}
            className="rounded mx-auto"
          />
        ) : (
          <Image 
            src="/svgs/logo-desktop-mini-dark.png"
            alt="Logo"
            width={100}
            height={100}
            className="rounded mx-auto"
          />
        )}
        
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={toggle}
          className="h-6 w-6 absolute -right-4"
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className={`flex h-14 items-center transition-all duration-300 ${
        isOpen ? 'ml-60' : 'ml-16'
      }`}>
        {models.length > 0 ? (
          <div className="flex items-center ml-8 border border-muted-foreground rounded-md py-1">
            {models.map((model, index) => (
            <span key={index} className="text-xs text-muted-foreground border-r px-1 border-muted-foreground last:border-none">
              {model}
            </span>
            ))}
          </div>
        ) : (
          <div className="flex items-center ml-8 border  border-red-500 rounded-md py-1">
            <span className="text-xs text-red-500 px-1">
              No models selected
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-2 ml-auto mr-8">
          {navItems.map((item, index) => (
            <Button key={index} variant="ghost" size="icon" className="w-7 h-7 p-1 rounded-full border border-gray-200 " onClick={item.onClick}>
              <item.type className="h-5 w-5" />
            </Button>
          ))}
          <Image
            src="/user.jpg"
            alt="User Image"
            width={35}
            height={35}
            className="rounded-full mx-auto cursor-pointer"
          />
        </div>
      </div>
    </header>
  );
}