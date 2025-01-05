'use client';

import React, { forwardRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Text } from "@radix-ui/themes";
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { 
  ChevronLeft,
  ChevronRight,
  Bell,
  ALargeSmall,
  MessagesSquare,
  HelpCircle,
  LogOut,
  Share,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { navItems, userMenuItems, notifications as notificationData} from '@/lib/constants';
import { useSidebarStore, useSelectedModelsStore } from "@/stores";
import { ThemeToggle } from "../ui/theme-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuShortcut } from "../ui/dropdown-menu";
import { TextSizeModal, FeedbackModal, SettingsModal, UserProfileModal, ReferModal, AlbumModal, ShareLinkModal } from "../ui/modals";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname } from 'next/navigation';

import { useAuth } from '@/components/providers/authTest';
import { AuthSwitch } from "../ui/authSwitch";

export function Header() {
  const { isSubscribed } = useAuth();

  const { isOpen, toggle } = useSidebarStore();
  const { theme, setTheme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const pathname = usePathname();

  const [mounted, setMounted] = React.useState(false);
  const [notifications, setNotifications] = React.useState(notificationData);
  const [textSizeModalOpen, setTextSizeModalOpen] = React.useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = React.useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = React.useState(false);
  const [userProfileModalOpen, setUserProfileModalOpen] = React.useState(false);
  const [referModalOpen, setReferModalOpen] = React.useState(false);
  const [albumModalOpen, setAlbumModalOpen] = React.useState(false);
  const [shareLinkModalOpen, setShareLinkModalOpen] = useState(false);

  const currentPage = useSidebarStore((state) => state.currentPage);
  const selectedModels = useSelectedModelsStore((state) => state.selectedModels);
  const getSelectedModelNames = useSelectedModelsStore((state) => state.getSelectedModelNames);

  
  // Get current selected model names based on the current page
  const selectedModelNames = React.useMemo(() => 
    getSelectedModelNames(currentPage as 'chat' | 'image' | 'audio' | 'video'),
    [currentPage, selectedModels, getSelectedModelNames]
  );

  const isChangelogPage = pathname.includes('changelog');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const renderNavItem = (item: any, index: number) => {

    //navItems that triggers a function
    if (item.interactionType === "function") {
      const functionMap = {
        [HelpCircle.name]: handleTour,
      };

      const handleClick = () => {
        const handler = functionMap[item.type.name];
        if (handler) {
          handler();
        }
      };

      return (
        <Button 
          key={index}
          variant="ghost" 
          size="icon" 
          onClick={handleClick}
          className="hidden md:flex w-8 h-8 p-1 rounded-full text-muted-foreground border border-borderColorPrimary select-none"
        >
          <item.type className="h-5 w-5" />
        </Button>
      );
    }

    // navItems that triggers a modal
    if (item.interactionType === "modal") {
      const openModal = () => {
        if (item.type === ALargeSmall) {
          setTextSizeModalOpen(true);
        } else if (item.type === MessagesSquare) {
          setFeedbackModalOpen(true);
        }
      };

      return (
        <Button 
          key={index}
          variant="ghost" 
          size="icon" 
          onClick={openModal}
          className={`${item.type !== MessagesSquare ? 'hidden' : ''} md:flex w-8 h-8 p-1 rounded-full text-muted-foreground border border-borderColorPrimary select-none`}
        >
          <item.type className="h-5 w-5" />
        </Button>
      );
    }

    // navItems that triggers a dropdown
    return (
      <DropdownMenu key={index}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative w-8 h-8 p-1 rounded-full text-muted-foreground border border-borderColorPrimary select-none"
          >
            <item.type className="h-5 w-5" />
            {notifications.some(n => !n.read) && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={`${notifications.length === 0 ? 'w-fit' : 'w-64 md:w-80'} mr-20 rounded-xl p-1 md:p-2 bg-backgroundSecondary`}>
          {notifications.length > 0 && (
            <>
              <div className="flex justify-between items-center px-3 border-b border-borderColorPrimary">
                <h4 className="font-small text-sm">Notifications</h4>
              <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-muted-foreground hover:text-primary"
              onClick={() => setNotifications([])}
            >
              Clear all
              </Button>
          </div>
            </>
          )}
          {notifications.length === 0 ? (
            <div className=" p-4 text-center text-muted-foreground">
              <Bell className="h-6 w-6 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No new notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id}
                className={`flex flex-col items-start p-2 cursor-pointer hover:bg-hoverColorPrimary gap-1 ${
                  !notification.read ? 'bg-primary/5' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-center gap-2">
                  <div className="font-small text-xs">{notification.title}</div>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{notification.message}</div>
                <div className="text-[0.6rem] text-muted-foreground">
                {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                  Math.round((notification.timestamp.getTime() - Date.now()) / (1000 * 60)),
                  'minute'
                )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const handleUserMenuItemClick = (item: any) => {
    switch (item.interactionType) {
      case 'modal':
        if (item.label === 'Profile') {
          setUserProfileModalOpen(true);
        } else if (item.label === 'Settings') {
          setSettingsModalOpen(true);
        } else if (item.label === 'Refer') {
          setReferModalOpen(true);
        } else if (item.label === 'Album') {
          setAlbumModalOpen(true);
        }
        break;
      case 'link':
        window.open(item.href, '_blank');
        break;
      case 'function':
        const functionMap = {
          [LogOut.name]: handleLogOut,
        };
  
        const handleMenuItemClick = () => {
          const handler = functionMap[item.label.name];
          if (handler) {
            handler();
          }
        };
        handleMenuItemClick();
        break;
    }
  };

  // Mark as read
  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ));
  };
  

  const handleTour = () => {
    // console.log("Starting tour...");
  };
  const handleLogOut = () => {
    // console.log("Logging out...");
  };


  return (
    <>
      <header className="sticky top-0 z-50 w-full  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
        {isSubscribed ? (
        <div className={`absolute left-0 h-14 flex items-center justify-center transition-all duration-6300 z-10
          ${isOpen ? 'w-60' : 'w-16'} 
          ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          border-r px-4  bg-sideBarBackground`}
        >
          {isOpen ? (
            mounted && (
              <Image 
                src={theme === 'dark' ? "/svgs/logo-desktop-full.png" : "/svgs/logo-desktop-dark-full.png"}
                alt="Logo"
                width={100}
                height={100}
                className={`rounded mx-auto`}
              />
            )
          ) : (
            mounted && (
              <Image 
                src={theme === 'dark' ? "/svgs/logo-desktop-mini.png" : "/svgs/logo-desktop-mini-dark.png"}
                alt="Logo"
                width={100}
                height={100}
                className="rounded mx-auto"
              />
            )
          )}
          
          <Button 
            variant="secondary" 
            size="icon" 
            onClick={toggle}
            className={`h-6 w-6 absolute -right-3 transition-all duration-300 ${isMobile ? ( isOpen ? '-right-3' : 'right-[-2.5rem]') : "-right-3" }`}
            aria-label="Toggle Sidebar"
          >
            {isOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>
        ) : (
          ''
        )}

        <div className={`flex h-14 items-center transition-all duration-300 
        ${isSubscribed ? (isMobile ? 'ml-4' : (isOpen ? 'ml-60' : 'ml-16')) : 'justify-around'}`}
        >
          {!isChangelogPage && mounted && isSubscribed ? (
            selectedModelNames.length > 0 ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-2/5 sm:w-1/2 md:w-fit absolute overflow-auto whitespace-nowrap flex items-center ml-8 border border-muted-foreground rounded-md py-1">
                      {selectedModelNames.map((model, index) => (
                        <span 
                          key={`${model}-${index}`} 
                          className="text-xs dark:text-gray-400 text-gray-800 border-r px-1 border-muted-foreground last:border-none"
                        >
                          {model}
                        </span>
                      ))}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="max-w-[300px] break-words bg-backgroundSecondary"
                  >
                    Selected Models
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="flex items-center ml-8 border border-red-500 rounded-md py-1">
                <span className="text-xs text-red-500 px-1">
                  No models selected
                </span>
              </div>
            )
          ) : (
            !isSubscribed && mounted && (
              <Image
                src={theme === 'dark' ? "/svgs/logo-desktop-full.png" : "/svgs/logo-desktop-dark-full.png"}
                alt="Logo"
                width={100}
                height={100}
                className="rounded md:mx-auto"
              />
            )
          )}
          

          <div className={`flex items-center gap-2 ${isSubscribed ? 'ml-auto mr-8' : 'md:mx-auto'}`}>
            {/* <AuthSwitch /> */}
            <Button
            variant={'outline'}
            className="h-8 rounded-full gap-1 p-2 text-muted-foreground"
            onClick={() => setShareLinkModalOpen(true)}
            >
              <Share className="w-4 h-4"/>
              Share
            </Button>
            <ThemeToggle />
            {navItems.filter(item => 
              isSubscribed || 
              !(item.type === HelpCircle || item.type === ALargeSmall)
            ).map((item, index) => renderNavItem(item, index))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Image
                  src="/user.jpg"
                alt="User Image"
                width={35}
                height={35}
                className="rounded-full mx-auto cursor-pointer select-none"
              />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-8 rounded-xl max-w-full p-2 bg-backgroundSecondary">
                <DropdownMenuItem className="flex items-start p-2 gap-4 cursor-pointer">
                  <Image
                    src="/user.jpg"
                    alt="User Image"
                    width={35}
                    height={35}
                    className="rounded-full mx-auto cursor-pointer"
                  />
                  <div className="flex flex-col mr-4">
                    <Text className="text-sm">Osei-Wusu Pascal</Text>
                    <Text className="text-xs">pascal@gmail.com</Text>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 bg-foreground/20"/>
                {userMenuItems.filter(item => 
                  isSubscribed || 
                  !(item.label === 'Profile' || item.label === 'Developer' || item.label === 'Refer' || item.label === 'Album' || item.label === 'Settings')
                ).map((item, index) => (
                  <DropdownMenuItem key={index} onClick={() => handleUserMenuItemClick(item)} className="gap-4 cursor-pointer hover:bg-hoverColorPrimary">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    <DropdownMenuShortcut>
                    {item.shortcut}
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <TextSizeModal 
        isOpen={textSizeModalOpen} 
        onClose={() => setTextSizeModalOpen(false)} 
      />
      <FeedbackModal 
        isOpen={feedbackModalOpen} 
        onClose={() => setFeedbackModalOpen(false)} 
      />
      <SettingsModal 
        isOpen={settingsModalOpen} 
        onClose={() => setSettingsModalOpen(false)} 
      />
      <UserProfileModal 
        isOpen={userProfileModalOpen} 
        onClose={() => setUserProfileModalOpen(false)} 
      />
      <ReferModal 
        isOpen={referModalOpen} 
        onClose={() => setReferModalOpen(false)} 
      />
      <AlbumModal 
        isOpen={albumModalOpen} 
        onClose={() => setAlbumModalOpen(false)} 
      />
      <ShareLinkModal 
        isOpen={shareLinkModalOpen} 
        onClose={() => setShareLinkModalOpen(false)} 
      />
    </>
  );
}