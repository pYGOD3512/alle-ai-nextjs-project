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
  Crown,
  Gem,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { navItems, userMenuItems, notifications as notificationData, CHAT_MODELS, IMAGE_MODELS, AUDIO_MODELS, VIDEO_MODELS} from '@/lib/constants';
import { NotificationItem } from "@/lib/types";
import { useSidebarStore, useSelectedModelsStore } from "@/stores";
import { ThemeToggle } from "../ui/theme-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuShortcut } from "../ui/dropdown-menu";
import { TextSizeModal, FeedbackModal, SettingsModal, UserProfileModal, ReferModal, AlbumModal, ShareLinkModal, LogoutModal } from "../ui/modals";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname } from 'next/navigation';

import { useAuth } from '@/components/providers/AuthProvider';
import { NotificationsPanel } from "@/components/NotificationWindow";
import { NotificationModal } from "@/components/ui/modals";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";


export function Header() {
  // const { isSubscribed } = useAuth();

  const { isOpen, toggle } = useSidebarStore();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const pathname = usePathname();
  const router = useRouter();


  const [mounted, setMounted] = React.useState(false);
  const [recentNotifications, setRecentNotifications] = React.useState<NotificationItem[]>(notificationData);
  const [allNotifications, setAllNotifications] = React.useState<NotificationItem[]>(notificationData);
  const [textSizeModalOpen, setTextSizeModalOpen] = React.useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = React.useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = React.useState(false);
  const [userProfileModalOpen, setUserProfileModalOpen] = React.useState(false);
  const [referModalOpen, setReferModalOpen] = React.useState(false);
  const [albumModalOpen, setAlbumModalOpen] = React.useState(false);
  const [shareLinkModalOpen, setShareLinkModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);

  const { getSelectedModelNames, toggleModelActive, inactiveModels, lastUpdate } = useSelectedModelsStore(
    (state) => ({
      getSelectedModelNames: state.getSelectedModelNames,
      toggleModelActive: state.toggleModelActive,
      inactiveModels: state.inactiveModels,
      lastUpdate: state.lastUpdate
    })
  );

  const { currentPage } = useSidebarStore();

  // Get current selected model names based on the current page
  const selectedModelNames = React.useMemo(() => 
    getSelectedModelNames(currentPage as 'chat' | 'image' | 'audio' | 'video'),
    [currentPage, getSelectedModelNames, inactiveModels, lastUpdate]
  );

  const isChangelogPage = pathname.includes('changelog');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleNotificationClick = (notification: NotificationItem) => {
    setSelectedNotification(notification);
    setNotificationModalOpen(true);
    markAsRead(notification.id);
  };

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
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleClick}
                className="hidden md:flex w-8 h-8 p-1 rounded-full text-muted-foreground border border-borderColorPrimary select-none"
              >
                <item.type className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tour</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={openModal}
                className={`${item.type !== MessagesSquare ? 'hidden' : ''} md:flex w-8 h-8 p-1 rounded-full text-muted-foreground border border-borderColorPrimary select-none`}
              >
                <item.type className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{item.type === ALargeSmall ? 'Text Size' : 'Feedback'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    // navItems that triggers a dropdown
    return (
      <TooltipProvider key={index}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative w-8 h-8 p-1 rounded-full text-muted-foreground border border-borderColorPrimary select-none"
                >
                  <item.type className="h-5 w-5" />
                  {recentNotifications.some(n => !n.read) && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={`${unreadNotifications.length === 0 ? 'w-fit' : 'w-64 md:w-80'} mr-20 rounded-xl p-1 md:p-2 bg-backgroundSecondary`}>
                {unreadNotifications.length > 0 ? (
                  <>
                    <div className="flex justify-between items-center px-3 border-b border-borderColorPrimary">
                      <h4 className="font-small text-sm">Notifications</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-muted-foreground hover:text-primary"
                        onClick={() => {
                          // Mark all as read instead of clearing
                          setRecentNotifications(recentNotifications.map(n => ({ ...n, read: true })));
                          setAllNotifications(allNotifications.map(n => ({ ...n, read: true })));
                        }}
                      >
                        Mark all read
                      </Button>
                    </div>
                    {unreadNotifications.map((notification) => (
                      <DropdownMenuItem 
                        key={notification.id}
                        className="flex flex-col items-start p-2 cursor-pointer hover:bg-hoverColorPrimary gap-1 bg-primary/5"
                        onClick={() => {
                          markAsRead(notification.id);
                          handleNotificationClick(notification);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-xs">{notification.title}</div>
                          <span className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {notification.message.length > 50 ? notification.message.slice(0, 50) + '...' : notification.message}
                        </div>
                        <div className="text-[0.6rem] text-muted-foreground">
                          {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                            Math.round((notification.timestamp.getTime() - Date.now()) / (1000 * 60)),
                            'minute'
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2 text-xs text-muted-foreground hover:text-primary"
                      onClick={() => setNotificationsPanelOpen(true)}
                    >
                      See all notifications
                    </Button>
                  </>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">No unread notifications</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2 text-xs text-muted-foreground hover:text-primary"
                      onClick={() => setNotificationsPanelOpen(true)}
                    >
                      See all notifications
                    </Button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent>
            Notifications {unreadNotifications.length > 0 ? `(${unreadNotifications.length} unread)` : ''}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
        if (item.label === 'Developer') {
          router.push('/developer');
        } else {
          window.open(item.href, '_blank');
        }
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
    setRecentNotifications(recentNotifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ));
    
    setAllNotifications(allNotifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ));
  };
  

  const handleTour = () => {
    // console.log("Starting tour...");
  };
  const handleLogOut = () => {
    setIsLogoutModalOpen(true);
  };

  // Get only unread notifications for the header dropdown
  const unreadNotifications = React.useMemo(() => 
    recentNotifications.filter(notification => !notification.read),
    [recentNotifications]
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
        {!pathname.includes('/plans') ? (
        <div className={`absolute left-0 h-14 flex items-center justify-center transition-all duration-6300 z-10
          ${isOpen ? 'w-60' : 'w-16'} 
          ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          border-r px-4  bg-sideBarBackground`}
        >
          {isOpen ? (
            mounted && (
              <Image 
                src={resolvedTheme === 'dark' ? "/svgs/logo-desktop-full.png" : "/svgs/logo-desktop-dark-full.png"}
                alt="Logo"
                width={100}
                height={100}
                className={`rounded mx-auto`}
              />
            )
          ) : (
            mounted && (
              <Image 
                src={resolvedTheme === 'dark' ? "/svgs/logo-desktop-mini.png" : "/svgs/logo-desktop-mini-dark.png"}
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
        ${!pathname.includes('/plans') ? (isMobile ? 'ml-4' : (isOpen ? 'ml-60' : 'ml-16')) : 'justify-around'}`}
        >
          {!isChangelogPage && mounted && !pathname.includes('/plans') ? (
            selectedModelNames.length > 0 ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-2/5 sm:w-fit overflow-auto whitespace-nowrap flex items-center ml-8 border border-muted-foreground rounded-md py-1 cursor-pointer hover:bg-backgroundSecondary/50 transition-colors">
                      {selectedModelNames.map((model, index) => (
                        <span 
                          key={`${model}-${index}`} 
                          className={`flex items-center gap-1 text-xs border-r px-1 border-muted-foreground last:border-none ${
                            !model.isActive ? 'text-muted-foreground opacity-50' : 'dark:text-gray-400 text-gray-800'
                          }`}
                        >
                          {model.name}
                          {model.type === 'plus' && (
                            <Gem className={`h-3 w-3 ${model.isActive ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                          )}
                        </span>
                      ))}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5} className="w-64 p-0">
                    <div className="w-full bg-backgroundSecondary rounded-lg">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-borderColorPrimary">
                        <Text className="text-xs font-medium">Selected Models</Text>
                        <Text className="text-xs text-muted-foreground">{selectedModelNames.length} active</Text>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto py-2">
                        {selectedModelNames.map((model, index) => {
                          const modelList = currentPage === 'chat' ? CHAT_MODELS 
                            : currentPage === 'image' ? IMAGE_MODELS
                            : currentPage === 'audio' ? AUDIO_MODELS
                            : VIDEO_MODELS;

                          const modelInfo = modelList.find(m => m.name === model.name);
                          
                          return (
                            <div 
                              key={index}
                              className={`flex items-center justify-between px-4 py-2 hover:bg-hoverColorPrimary cursor-pointer ${
                                !model.isActive ? 'opacity-50' : ''
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="flex flex-col">
                                  <Text className={`text-xs ${!model.isActive ? 'text-muted-foreground' : ''}`}>
                                    {model.name}
                                  </Text>
                                </div>
                                {model.type === 'plus' && (
                                  <Gem className={`h-3 w-3 ${model.isActive ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                                )}
                              </div>
                              <Switch
                                variant="sm"
                                checked={model.isActive}
                                onCheckedChange={() => {
                                  if (modelInfo) {
                                    toggleModelActive(modelInfo.id);
                                  }
                                }}
                                className="ml-2"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
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
            pathname.includes('/plans') && mounted && (
              <Image
              src={resolvedTheme === 'dark' ? "/svgs/logo-desktop-full.png" : "/svgs/logo-desktop-dark-full.png"}
                alt="Logo"
                width={100}
                height={100}
                className="rounded md:mx-auto"
              />
            )
          )}
          

          <div className={`flex items-center gap-2 ${!pathname.includes('/plans') ? 'ml-auto mr-8' : 'md:mx-auto'}`}>
            {/* {pathname.includes("/chat") && (
              <Button
              variant={'outline'}
              className="h-8 rounded-full gap-1 p-2 text-muted-foreground"
              onClick={() => setShareLinkModalOpen(true)}
              >
                <Share className="w-4 h-4"/>
                Share
              </Button>
            )} */}
            

            <ThemeToggle />
            {navItems.filter(item => 
              !pathname.includes('/plans') || 
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
                  !pathname.includes('/plans') || 
                  !(item.label === 'Profile' || item.label === 'Developer' || item.label === 'Refer' || item.label === 'Album' || item.label === 'Settings')
                ).map((item, index) => (
                  <DropdownMenuItem key={index} onClick={() => handleUserMenuItemClick(item)} className="gap-4 cursor-pointer hover:bg-hoverColorPrimary">
                    <item.icon className="h-4 w-4" />
                    {item.label}
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
      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
      />
      <NotificationsPanel
        open={notificationsPanelOpen}
        onClose={() => setNotificationsPanelOpen(false)}
        notifications={allNotifications}
        onNotificationClick={handleNotificationClick}
      />
      
      <NotificationModal
        notification={selectedNotification}
        open={notificationModalOpen}
        onClose={() => {
          setNotificationModalOpen(false);
          setSelectedNotification(null);
        }}
      />
    </>
  );
}