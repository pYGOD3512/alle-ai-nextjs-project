"use client";
import Link from "next/link";
import {
  MessageSquare,
  Images,
  Headphones,
  Video,
  ArrowRight,
  List,
  BookOpen,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import ArticleFeedback from "../articleFeedback";
import DocsFooter from "../simpleFooterDocs";
const resourceCards = [
  {
    title: "Configure your environment",
    description: "Set up our Node.js and Python SDKs to access all endpoints.",
    href: "/developers/setup",
  },
  {
    title: "Process text with AI",
    description:
      "Use chat endpoints for response summary or combined model outputs.",
    href: "/developers/chat",
  },
  {
    title: "Handle audio workflows",
    description:
      "Generate audio from text, transcribe audio, or synthesize speech via API.",
    href: "/developers/audio",
  },
  {
    title: "Generate custom images",
    description:
      "Integrate the image endpoint for AI-driven visuals with file inputs.",
    href: "/developers/image",
  },
  {
    title: "Manipulate video content",
    description:
      "Create or edit videos programmatically with the video endpoint.",
    href: "/developers/video",
  },
  {
    title: "Combine multi-model outputs",
    description:
      "Send a single request to merge responses from multiple AI models.",
    href: "/developers/multi-model",
  },
];
const tasks = [
  {
    id: "chat-text",
    title: "Chat & Text",
    href: "/chat",
    models: ["DeepSeek", "Gemini", "Claude"],
    icon: <MessageSquare className="w-5 h-5" />,
    description:
      "Write, summarize, or translate with models like DeepSeek or Claude",
  },
  {
    id: "image-generation",
    title: "Image Generation",
    href: "/image",
    models: ["Stable Diffusion", "DALL·E"],
    icon: <Images className="w-5 h-5" />,
    description:
      "Generate art, logos, or photos using Stable Diffusion, DALL·E",
  },
  {
    id: "audio-voice",
    title: "Audio & Voice",
    href: "/audio",
    models: ["ElevenLabs", "Whisper"],
    icon: <Headphones className="w-5 h-5" />,
    description: "Convert text to speech, transcribe, or create music",
  },
  {
    id: "video-animation",
    title: "Video & Animation",
    href: "/video",
    models: ["Runway", "Pika"],
    icon: <Video className="w-5 h-5" />,
    description: "Animate avatars, edit footage, or generate clips",
  },
];

export default function PlatformOverview() {
  return (
    <main className="">
      {/* Header Section */}
      <div className="mb-6">
        <p className="text-muted-foreground ">
          Generate text, images, audio, and videos all in one place. Compare
          outputs from top models or enhance results with AlleAI's proprietary
          AI models.
        </p>
      </div>

      {/* Get Started Section */}
      <div className="mb-8">
        <div className="">
          {/* Sign Up */}
          <div className="mb-5">
            <h3 className="text-xl font-semibold ">
              Create an account and learn how to start using alle-ai.
            </h3>
            <p className="text-muted-foreground mb-4">
              Instant access to 20+ AI models across text, image, audio, and
              video.
              <span>
                If you’re ready to start developing, see our &nbsp;
                <span>
                  <Link
                    href="/docs/api-reference/introduction"
                    target="_blank"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    developer quickstart.
                  </Link>
                </span>
              </span>
            </p>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Create your alle-ai account{" "}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {/* Choose Your Task */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Choose Your Task</h3>
            <p className="text-muted-foreground mb-4">
              Select from our range of AI capabilities to fit your specific
              needs.
            </p>

            <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {tasks.map((task) => (
                <div key={task.id} className="group">
                  <Link
                    href={task.href}
                    className="block group-hover:opacity-80 transition-opacity"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        <span
                          className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-background text-black 
 dark:text-white 
  border border-neutral-300 dark:border-neutral-700 
  shadow-md transition-colors"
                        >
                          {task.icon}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium mb-1 flex items-center">
                          {task.title}
                          <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h4>
                        <p className="text-muted-foreground text-sm mb-1">
                          {task.description}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {task.models.join(", ")} and more
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Guidance Section */}
      <div className="mt-7 mx-auto flex flex-col items-center justify-center">
        <h3 className="text-lg font-medium mb-3 ">Need Guidance?</h3>
        <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-4 sm:space-y-0">
          <Link
            href="/model-glossary"
            target="_blank"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <List className="w-4 h-4 mr-2" /> Browse Full Model List
          </Link>
          <Link
            href="/docs/api-reference/introduction"
            target="_blank"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <BookOpen className="w-4 h-4 mr-2" /> Quickstart Tutorial
          </Link>
        </div>
      </div>
      <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10" />
      {/* developer quickstart */}
      <section>
        <div>
          <h2 className="text-2xl font-bold mb-6">For developers</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourceCards.map((card, index) => (
              <Link key={index} href={card.href} className="block">
                <Card
                  className="border border-gray-200 dark:border-gray-700 
            bg-white dark:bg-accent
            transition-all duration-200 
            hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 
            hover:bg-gray-50 dark:hover:bg-gray-750 
            h-auto"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-blue-500 dark:text-blue-400 text-lg">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4">
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      {card.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <div className="mb-5">
        <ArticleFeedback />
      </div>
      <div>
        <DocsFooter />
      </div>
    </main>
  );
}
