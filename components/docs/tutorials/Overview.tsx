"use client";
import React from "react";
import { Sparkles, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
//  components
const HomeContent = () => <div>This is the Home tab content.</div>;
const DMsContent = () => <div>This is the DMs tab content.</div>;
const ActivityContent = () => <div>This is the Activity tab content.</div>;
const LaterContent = () => <div>This is the Later tab content.</div>;
const InfoCards = () => {
  return (
    <div className="space-y-4">
      {/* Heads Up Card */}
      <Card className="border-green-500 bg-background shadow-lg  dark:border-green-400 ">
        <CardContent className="p-4 flex items-start space-x-3 text-gray-900 dark:text-gray-100">
          <Info className="text-green-400 flex-shrink-0" />
          <div>
            <p className="font-semibold text-black dark:text-green-300">
              Heads up:
            </p>
            <p className="">
              Some features require a paid plan. Check out our  
              <a
                href="#"
                className="text-blue-500 underline hover:text-blue-400 transition-colors duration-200 dark:text-blue-400 dark:hover:text-blue-300"
              >
                feature limitations
              </a>
                or consider  
              <a
                href="#"
                className="text-blue-500 underline hover:text-blue-400 transition-colors duration-200 dark:text-blue-400 dark:hover:text-blue-300"
              >
                upgrading your plan
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tip Card */}
      <Card className="border-blue-500 bg-background shadow-lg  dark:border-blue-400 ">
        <CardContent className="p-4 flex items-start space-x-3 text-gray-900 dark:text-gray-100">
          <Sparkles className="text-blue-400 flex-shrink-0" />
          <div>
            <p className="font-semibold text-black dark:text-blue-300">Tip:</p>
            <p className="">
              To access our Help Center and resources, click  
              <a
                href="#"
                className="text-blue-500 underline hover:text-blue-400 transition-colors duration-200 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Help Center
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
const Overview = () => {
  const [activeTab, setActiveTab] = React.useState("new-chat");
  const renderContent = () => {
    switch (activeTab) {
      case "new-chat":
        return <HomeContent />;
      case "mode-selector":
        return <DMsContent />;
      case "model-switcher":
        return <ActivityContent />;
      case "feature-hub":
        return <LaterContent />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen ">
      {/* Popular */}
      <div className="max-w-6xl mx-auto ">
        <div className="flex items-center gap-2 mb-6"></div>
      </div>

      {/*  Overview */}
      <div className="max-w-6xl mx-auto p-2">
        <div className="space-y-8">
          {/* <div className="text-center space-y-4 mt-6">
            <h2 id="platform-capabilities" className="text-2xl font-bold ">
              Getting Started with Alle-ai: Your Quick Start Guide
            </h2>
            <p className="text-xl text-muted-foreground mb-5 max-w-3xl mx-auto">
              {`    Welcome to Alle-ai! We’re happy to have you. Alle-ai brings together the world’s
               leading AI models for chat, image, video, and audio generation in one unified platform designed 
               to power creativity and productivity. To get started, check out the guide below for a quick tour.`}
            </p>
          </div> */}

          {/* Feature  */}

          {/* awareness */}
          <div className="mt-5 mb-10 ">
            <InfoCards />
          </div>
        </div>
        {/* sidebar */}

        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold mb-4">Sidebar</h2>
          <hr className="border-t-1 dark:border-zinc-700 border-gray-200 " />
          <p className="mt-5 text-muted-foreground">
            {`From the sidebar, you can switch between different modes, including
            Chat, Image Generation, Audio Generation, and Video Generation.
            You'll also find tools like Chat History, the Model Glossary, the
            Changelog, and Model Analysis to keep track of updates and access
            key information easily.`}
          </p>
        </div>
        {/* sidebar image placeholder */}
        <div className="mb-5">
          <Image
            src="/screenshots/mockUiSidebar.png"
            alt="sidebar"
            width={700}
            height={400}
          />
        </div>
        <div className="mt-5">
          <div>
            <Tabs
              defaultValue="new-chat"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="flex justify-start space-x-4 border-b dark:border-zinc-700 border-gray-200 bg-transparent">
                <TabsTrigger
                  value="new-chat"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground data-[state=active]:text-black dark:text-muted-foreground dark:data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-gray-700 dark:data-[state=active]:border-gray-400"
                >
                  1. New Chat
                </TabsTrigger>
                <TabsTrigger
                  value="mode-selector"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground data-[state=active]:text-black dark:text-muted-foreground dark:data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-gray-700 dark:data-[state=active]:border-gray-400"
                >
                  2. Mode Selector
                </TabsTrigger>
                <TabsTrigger
                  value="model-switcher"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground data-[state=active]:text-black dark:text-muted-foreground dark:data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-gray-700 dark:data-[state=active]:border-gray-400"
                >
                  3. Model Switcher
                </TabsTrigger>
                <TabsTrigger
                  value="feature-hub"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground data-[state=active]:text-black dark:text-muted-foreground dark:data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-gray-700 dark:data-[state=active]:border-gray-400"
                >
                  4. Feature Hub
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Render the content based on the active tab */}
            <div className="mt-4">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
