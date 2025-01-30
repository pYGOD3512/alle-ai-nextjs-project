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
     title: "Conversational AI",
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
    icon: <MessageSquare className="w-6 h-6 text-purple-500" />,
    description:
      "Access ChatGPT, Claude, Gemini, and more AI models in one unified interface. Compare responses and choose the best model for your needs.",
  },
  {
    id: "image-generation",
    title: "Image Generation",
    icon: <Image className="w-6 h-6 text-blue-500" />,
    description:
      "Create stunning visuals using state-of-the-art AI image generation models. Perfect for design, content creation, and artistic projects.",
  },
  {
    id: "video-creation",
    title: "Video Creation",
    icon: <Video className="w-6 h-6 text-green-500" />,
    description:
      "Generate and edit videos with AI assistance. Transform your ideas into engaging video content effortlessly.",
  },
  {
    id: "audio-generation",
    title: "Audio Generation",
    icon: <Music className="w-6 h-6 text-red-500" />,
    description:
      "Create voice-overs, music, and sound effects using advanced AI audio generation capabilities.",
  },
];


  const quickStartSteps = [
    "Sign up for an account or log in to your existing account",
    "Choose your preferred AI models from our extensive collection",
    "Start creating content across multiple formats - text, image, video, and audio",
    "Save and manage your generations in your personal dashboard",
  ];

  return (
    <div className="min-h-screen ">
      {/* Most Popular Section */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center gap-2 mb-6">
          <Link className="w-5 h-5" />
          <h2 id="most-popular" className="text-2xl font-bold">
            Most popular
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {quickLinks.map((section, index) => (
            <Card
              key={index}
              className={`${section.span} hover:border-purple-400 cursor-pointer transition-all duration-200`}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold">
                      {section.title}
                    </h4>
                    <p className="text-gray-500">{section.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Platform Overview */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 mt-12">
            <Sparkles className="w-12 h-12 mx-auto text-purple-600" />
            <h2
              id="your-all-in-one-ai-platform"
              className="text-4xl font-bold text-gray-900"
            >
              Your All-in-One AI Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              `
              {`        Access the world's leading AI models for chat, image, video, and
              audio generation in one unified platform.`}
              `
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h4
                        
                        className="text-xl font-semibold text-gray-900"
                      >
                        {feature.title}
                      </h4>
                      <p className="mt-2 text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Start Guide */}
          <div className="mt-16">
            <h2
              id="quick-start-guide"
              className="text-2xl font-bold text-gray-900 mb-6"
            >
              Quick Start Guide
            </h2>
            <div className="space-y-4">
              {quickStartSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-100 hover:border-purple-200 transition-colors"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-semibold">
                    {index + 1}
                  </span>
                  <p className="text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Get Started Button */}
          <div className="text-center mt-12">
            <button className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
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
