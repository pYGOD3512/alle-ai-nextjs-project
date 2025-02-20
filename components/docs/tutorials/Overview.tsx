import React from "react";
import {
  Link,
  ChevronRight,
  Sparkles,
  MessageSquare,
  Image,
  Video,
  Music,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Overview = () => {
  const quickLinks = [
    {
      id: "developer-quickstart",
      title: "Developer quickstart",
      description: "Learn how to integrate our AI platform",
      link: "/quickstart",
      span: "col-span-1",
    },
    {
      id: "conversational-ai",
      title: "Developer playground",
      description: "Deploy AI chat agents in minutes",
      link: "/conversational-ai",
      span: "col-span-1",
    },
    {
      id: "product-guides",
      title: "Product guides",
      description: "Learn how to use our AI platform",
      link: "/guides",
      span: "col-span-1",
    },
    {
      id: "api-reference",
      title: "API reference",
      description: "Dive into our API reference",
      link: "/api",
      span: "col-span-1",
    },
  ];

  const features = [
    {
      id: "multi-model-chat",
      title: "Multi-Model Chat",
      icon: <MessageSquare className="w-6 h-6 " />,
      description:
        "Access ChatGPT, Claude, Gemini, and more AI models in one unified interface. Compare responses and choose the best model for your needs.",
    },
    {
      id: "image-generation",
      title: "Image Generation",
      icon: <Image className="w-6 h-6 " />,
      description:
        "Create stunning visuals using state-of-the-art AI image generation models. Perfect for design, content creation, and artistic projects.",
    },
    {
      id: "video-creation",
      title: "Video Creation",
      icon: <Video className="w-6 h-6 " />,
      description:
        "Generate and edit videos with AI assistance. Transform your ideas into engaging video content effortlessly.",
    },
    {
      id: "audio-generation",
      title: "Audio Generation",
      icon: <Music className="w-6 h-6 " />,
      description:
        "Create voice-overs, music, and sound effects using advanced AI audio generation capabilities.",
    },
  ];

  const quickStartSteps = [
    "Starting a New Chat ",
    "Using Prompts Effectively",
    "Frequently Asked Questions",
  ];

  return (
    <div className="min-h-screen ">
      {/* Popular */}
      <div className="max-w-6xl mx-auto ">
        <div className="flex items-center gap-2 mb-6">
        </div>
      </div>

      {/*  Overview */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="space-y-8">
          <div className="text-center space-y-4 mt-12">
            <Sparkles className="w-12 h-12 mx-auto text-black dark:text-white" />
            <h2 id="platform-capabilities" className="text-4xl font-bold ">
              Your All-in-One AI Platform
            </h2>
            <p className="text-xl text-muted-foreground mb-5 max-w-3xl mx-auto">
              {`        Access the world's leading AI models for chat, image, video, and
              audio generation in one unified platform.`}
            </p>
          </div>

          {/* Feature  */}
          <h2 id="capabilities" className="text-2xl font-bold">
            Capabilities
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:border-blue-600 cursor-pointer dark:bg-zinc-800 transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gray-200 dark:bg-zinc-900 rounded-lg dark:text-white">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold ">
                        {feature.title}
                      </h4>
                      <p className="mt-2 text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick  Guide */}
          <div className="mt-16 ">
            <h2 id="quick-start-guide" className="text-2xl font-bold  mb-6">
              Quick Start Guide
            </h2>
            <div className="space-y-4">
              {quickStartSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 dark:bg-zinc-800  rounded-lg border border-zinc-900 hover:border-blue-600 cursor-pointer transition-colors"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-900 dark:text-white text-black font-semibold">
                    {index + 1}
                  </span>
                  <p className="text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Button */}
          <div className="text-center mt-12">
            <button className="inline-flex items-center px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-slate-200 transition-colors">
              Get Started Now
              <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
