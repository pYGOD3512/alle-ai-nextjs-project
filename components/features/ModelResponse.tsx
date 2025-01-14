'use client';

import { Card } from "@/components/ui/card";
import { Volume2, VolumeX, ThumbsUp, ThumbsDown, Copy, RefreshCw, Globe } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AdCard } from "@/components/features/AdCard";
import { SAMPLE_ADS } from "@/lib/constants"
import { useVoiceStore } from "@/stores/index";
import { motion } from 'framer-motion';
import { SourcesWindow } from "@/components/SourcesWindow";
import { Source } from '@/lib/types';
import { create } from 'zustand';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { CustomLink } from '@/components/markdown/CustomLink'
import { YouTubeEmbed } from '@/components/markdown/YouTubeEmbed';
import { Components } from 'react-markdown';
import { HTMLProps } from 'react';
import type { DetailedHTMLProps, HTMLAttributes, ImgHTMLAttributes, AnchorHTMLAttributes } from 'react';

interface ModelResponseProps {
  model: string;
  content: string;
  model_img: string;
  responseId: string;
  onFeedbackChange?: (responseId: string, feedback: 'like' | 'dislike' | null) => void;
  onRegenerate?: (responseId: string) => void;
  feedback?: 'like' | 'dislike' | null;
  webSearchEnabled?: boolean;
  sources?: Source[];
}

interface SourcesPillProps {
  onClick: () => void;
  sources: Source[];
}

const SourcesPill = ({ onClick, sources }: SourcesPillProps) => {
  // Limit to showing max 4 source images
  const displaySources = sources.slice(0, 3);
  const remainingCount = Math.max(0, sources.length - 4);

  return (
    <div 
      onClick={onClick}
      className="relative inline-flex items-center gap-2 px-2 py-1
                text-xs font-medium group
                rounded-full cursor-pointer
                border border-borderColorPrimary
                overflow-hidden hover:bg-secondary/10
                transition-colors duration-200"
    >
      {/* Source Images Stack */}
      <span className="relative z-10 transition-colors duration-300 group-hover:text-secondary-foreground">
        Sources
      </span>
      
      <div className="flex -space-x-2 relative">
        {displaySources.map((source, index) => (
          <div
            key={index}
            className="relative w-4 h-4 rounded-full border border-background
                      ring-2 ring-background
                      transition-transform duration-200
                      hover:translate-y-[-2px]"
            style={{
              zIndex: displaySources.length - index
            }}
          >
            <Image
              src={source.img || '/icons/wikipedia.png'}
              alt={source.type}
              width={16}
              height={16}
              className="rounded-full object-cover"
            />
          </div>
        ))}
        {remainingCount > 0 && (
          <div 
            className="relative w-4 h-4 rounded-full bg-secondary/30
                       flex items-center justify-center
                       text-[10px] font-medium
                       border border-background
                       ring-2 ring-background"
          >
            +{remainingCount}
          </div>
        )}
      </div>
      
    </div>
  );
};

interface SourcesWindowState {
  isOpen: boolean;
  activeResponseId: string | null;
  sources: Source[];
  setOpen: (isOpen: boolean) => void;
  setSources: (responseId: string, sources: Source[]) => void;
  close: () => void;
}

export const useSourcesWindowStore = create<SourcesWindowState>((set) => ({
  isOpen: false,
  activeResponseId: null,
  sources: [],
  setOpen: (isOpen) => set({ isOpen }),
  setSources: (responseId, sources) => set({ 
    activeResponseId: responseId, 
    sources,
    isOpen: true 
  }),
  close: () => set({ isOpen: false }),
}));

// Define proper types for the component props
type MarkdownComponentProps = {
  node?: any;
  children?: React.ReactNode;
  className?: string;
} & HTMLAttributes<HTMLElement>;

type LinkProps = {
  node?: any;
  children?: React.ReactNode;
  href?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

type ImageProps = {
  node?: any;
  alt?: string;
  src?: string;
} & ImgHTMLAttributes<HTMLImageElement>;

type CodeProps = {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
} & HTMLAttributes<HTMLElement>;

export function ModelResponse({ 
  model_img, 
  model, 
  content, 
  responseId,
  onFeedbackChange,
  onRegenerate,
  feedback = null,
  webSearchEnabled = false,
  sources = []
}: ModelResponseProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  const voiceSettings = useVoiceStore((state) => state.settings);
  const availableVoices = useVoiceStore((state) => state.availableVoices);
  const initVoices = useVoiceStore((state) => state.initVoices);
  const { setSources, close } = useSourcesWindowStore();

  useEffect(() => {
    // Initialize voices when component mounts
    initVoices();
    
    // Update voices when they become available
    speechSynthesis.onvoiceschanged = initVoices;
    
    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [initVoices]);

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(content);
      
      // Apply voice settings
      if (voiceSettings.voice) {
        const selectedVoice = availableVoices.find(v => v.voiceURI === voiceSettings.voice);
        if (selectedVoice) utterance.voice = selectedVoice;
      }
      
      utterance.pitch = voiceSettings.pitch;
      utterance.rate = voiceSettings.rate;
      utterance.volume = voiceSettings.volume;
      
      utterance.onend = () => setIsSpeaking(false);
      // utterance.onerror = () => {
      //   setIsSpeaking(false);
      //   toast({
      //     variant: "destructive",
      //     title: "Error",
      //     description: "Failed to play speech. Please try again.",
      //   });
      // };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "The response has been copied to your clipboard.",
    });
  };

  const handleLike = () => {
    onFeedbackChange?.(responseId, feedback === 'like' ? null : 'like');
    toast({
      title: feedback === 'like' ? "Feedback removed" : "Response liked",
      description: feedback === 'like' 
        ? "Your feedback has been removed." 
        : "Thank you for your feedback!",
    });
  };

  const handleDislike = () => {
    onFeedbackChange?.(responseId, feedback === 'dislike' ? null : 'dislike');
    toast({
      title: feedback === 'dislike' ? "Feedback removed" : "Response disliked",
      description: feedback === 'dislike' 
        ? "Your feedback has been removed." 
        : "Thank you for your feedback!",
    });
  };

  const components: Components = {
    a: ({ children, href, ...props }: LinkProps) => {
      if (!href) return <>{children}</>;
      
      // Handle YouTube links
      if (href.match(/youtube\.com|youtu\.be/)) {
        return (
          <>
            <br />
            <YouTubeEmbed url={href} />
            <br />
          </>
        );
      }
      
      return <CustomLink href={href} {...props}>{children}</CustomLink>;
    },
    
    img: ({ alt, src, ...props }: ImageProps) => (
      <div className="my-4">
        <img
          alt={alt || ''}
          src={src}
          {...props}
          className="rounded-lg w-full object-cover max-h-[400px]"
          loading="lazy"
        />
      </div>
    ),
    
    code: ({ inline, className, children, ...props }: CodeProps) => {
      if (inline) {
        return (
          <code 
            className="px-1.5 py-0.5 rounded-md bg-secondary/30 text-xs font-mono"
            {...props}
          >
            {children}
          </code>
        );
      }
      
      return (
        <div className="relative my-4 rounded-lg overflow-hidden">
          <pre 
            className="p-4 bg-secondary/10 overflow-x-auto"
            {...props}
          >
            {children}
          </pre>
        </div>
      );
    },
    
    blockquote: ({ children, ...props }: MarkdownComponentProps) => (
      <blockquote 
        className="border-l-4 border-primary/30 pl-4 my-4 italic text-muted-foreground"
        {...props}
      >
        {children}
      </blockquote>
    ),
  };

  return (
    <Card className="bg-transparent border-none shadow-none p-4">
      <div className="flex items-start gap-4 mb-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center">
          <Image className="rounded-full hidden sm:flex" src={model_img} alt={model} width={32} height={32} />
        </div>
        <div className="flex flex-col flex-1">
          <span className="font-medium text-sm mb-3">{model}</span>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={components}
              className="text-base text-accent-foreground 
                        [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
                        [&_a]:no-underline [&_p>a]:before:content-[''] [&_p>a]:after:content-['']
                        [&_ol]:space-y-2 [&_ul]:space-y-2
                        [&_li]:pl-1
                        [&_ol>li]:marker:text-primary/70 [&_ol>li]:marker:font-medium
                        [&_ul>li]:marker:text-primary/70
                        [&_p]:my-2"
            >
              {content}
            </ReactMarkdown>
          </div>

          <div className="flex items-center gap-1 mt-1">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full h-8 w-8 relative ${
                isSpeaking ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
              onClick={handleSpeak}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                </>
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full h-8 w-8 ${
                feedback === 'like' ? 'text-green-500 bg-green-500/10' : 'text-muted-foreground'
              }`}
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full h-8 w-8 ${
                feedback === 'dislike' ? 'text-red-500 bg-red-500/10' : 'text-muted-foreground'
              }`}
              onClick={handleDislike}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 text-muted-foreground"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 text-muted-foreground"
              onClick={() => onRegenerate?.(responseId)}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            {sources && sources.length > 0 && (
            <div className="">
              <SourcesPill 
                onClick={() => setSources(responseId, sources)} 
                sources={sources}
              />
            </div>
          )}
          </div>
          
          <AdCard ads={SAMPLE_ADS} />
        </div>
      </div>
    </Card>
  );
}