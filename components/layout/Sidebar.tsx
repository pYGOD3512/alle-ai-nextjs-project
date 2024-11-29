'use client';

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutGrid, 
  MessageSquare, 
  Image as ImageIcon, 
  Music, 
  Video,
  Plus,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import { useSidebarStore } from '@/lib/stores/sidebar-store';

export function Sidebar() {
  const { isOpen } = useSidebarStore();

  return (
    <div className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ${
      isOpen ? 'w-60' : 'w-16'
    } border-r bg-background`}>
      <div className="flex h-14 items-center border-b px-4">
        {isOpen ? (
          <div className="flex items-center gap-2">
            <Image 
              src="https://avatars.githubusercontent.com/u/1?v=4"
              alt="Logo"
              width={32}
              height={32}
              className="rounded"
            />
            <span className="font-semibold">Alle-AI</span>
          </div>
        ) : (
          <Image 
            src="https://avatars.githubusercontent.com/u/1?v=4"
            alt="Logo"
            width={32}
            height={32}
            className="rounded mx-auto"
          />
        )}
      </div>

      <div className="p-2">
        {isOpen ? (
          <>
            <div className="flex gap-2 px-2">
              <Button className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                NEW CHAT
              </Button>
              <Button variant="outline" size="icon">
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 space-y-1">
              {[
                { icon: MessageSquare, label: 'Chat' },
                { icon: ImageIcon, label: 'Image Generation' },
                { icon: Music, label: 'Audio Generation', beta: true },
                { icon: Video, label: 'Video Generation', beta: true },
              ].map((item, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  className="w-full justify-start h-8 text-sm"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                  {item.beta && (
                    <span className="ml-2 text-xs bg-primary/10 px-1.5 py-0.5 rounded">
                      Beta
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Button variant="ghost" size="icon" className="w-full">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-full">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-full">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-full">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-full">
              <Music className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-full">
              <Video className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {isOpen && (
        <>
          <div className="px-4">
            <div className="text-xs font-medium text-muted-foreground mb-2">
              CHAT HISTORY
            </div>
            <ScrollArea className="h-[calc(100vh-380px)]">
              <div className="space-y-0.5">
                {[
                  'Time to Build a Wall with Four...',
                  'Making $1 Million in 5 Days...',
                  'Future of Generative AI in...',
                  'Strategies to Improve Emplo...',
                  'Improving Employee Engageme...',
                  'Creating a Content Calendar...',
                  'Staying Updated with Tech N...',
                ].map((chat, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    className="w-full justify-start text-left h-8 text-sm"
                  >
                    {chat}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="absolute bottom-0 left-0 right-0 border-t p-4">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="https://avatars.githubusercontent.com/u/1?v=4"
                alt="User"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1">
                <div className="font-medium">Pascal</div>
                <div className="text-xs text-muted-foreground">
                  lvl55525721@gmail.com
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              MANAGE SUBSCRIPTION
            </Button>
          </div>
        </>
      )}
    </div>
  );
}