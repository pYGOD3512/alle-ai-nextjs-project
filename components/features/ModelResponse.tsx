'use client';

import { Card } from "@/components/ui/card";
import { Volume2, VolumeX, ThumbsUp, ThumbsDown, Copy, RefreshCw, Globe, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
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
import { SourcesPill } from '@/components/features/SourcesPill';
import type { HTMLAttributes, ImgHTMLAttributes, AnchorHTMLAttributes } from 'react';
import React from "react";
import { MarkdownImage } from '@/components/markdown/MarkdownImage';
import { cn } from "@/lib/utils";
import { 
  MarkdownTable, 
  MarkdownThead, 
  MarkdownTr, 
  MarkdownTh, 
  MarkdownTd 
} from '@/components/markdown/MarkdownTable';
import { MarkdownCode } from '@/components/markdown/MarkdownCode';
import { SummaryContent } from "./SummaryContent";
import { SUMMARY_DATA } from "@/lib/constants";

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

type CodeProps = {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
} & HTMLAttributes<HTMLElement>;

interface ImageGroup {
  id: string;
  images: Array<{ src: string; alt: string; }>;
}

let currentGroup: ImageGroup | null = null;
const imageGroups = new Map<string, ImageGroup>();

// Add this helper function to extract images from markdown
function extractImagesFromMarkdown(content: string): { src: string; alt: string; }[] {
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  const images: { src: string; alt: string; }[] = [];
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    images.push({
      alt: match[1] || '',
      src: match[2] || ''
    });
  }

  return images;
}

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
  const [showAllImages, setShowAllImages] = useState(false);

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

  // Memoize the components object
  const components: Components = useMemo(() => ({
    a: ({ children, href, ...props }: LinkProps) => {
      if (!href) return <>{children}</>;
      
      if (href.match(/youtube\.com|youtu\.be/)) {
        return (
          <>
            <br />
            <YouTubeEmbed key={href} url={href} />
            <br />
          </>
        );
      }
      
      return <CustomLink href={href} {...props}>{children}</CustomLink>;
    },
    
    p: ({ children, ...props }: MarkdownComponentProps) => {
      const childArray = React.Children.toArray(children);
      const imageCount = childArray.filter(child => 
        React.isValidElement(child) && child.type === 'img'
      ).length;

      if (imageCount > 0) {
        return (
          <div className={cn(
            "my-2 gap-2",
            imageCount > 1 ? "grid grid-cols-3 sm:grid-cols-4 max-w-xl" : "block max-w-[150px]"
          )}>
            {children}
          </div>
        );
      }

      return <p {...props}>{children}</p>;
    },
    
    img: ({ src, alt, ...props }: ImgHTMLAttributes<HTMLImageElement> & { node?: any }) => {
      if (!src) return null;
      return <MarkdownImage src={src} alt={alt} />;
    },
    
    code: ({ inline, className, children, ...props }: CodeProps) => {
      return (
        <MarkdownCode inline={inline} className={className} {...props}>
          {children}
        </MarkdownCode>
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
    
    table: ({ children, ...props }: MarkdownComponentProps) => (
      <MarkdownTable {...props}>{children}</MarkdownTable>
    ),
    
    thead: ({ children, ...props }: MarkdownComponentProps) => (
      <MarkdownThead {...props}>{children}</MarkdownThead>
    ),
    
    tr: ({ children, ...props }: MarkdownComponentProps) => (
      <MarkdownTr {...props}>{children}</MarkdownTr>
    ),
    
    th: ({ children, ...props }: MarkdownComponentProps) => (
      <MarkdownTh {...props}>{children}</MarkdownTh>
    ),
    
    td: ({ children, ...props }: MarkdownComponentProps) => (
      <MarkdownTd {...props}>{children}</MarkdownTd>
    ),
  }), []);

  // Get display limit based on screen size
  const getDisplayLimit = () => {
    if (typeof window === 'undefined') return 2; // Default for SSR
    if (window.innerWidth >= 1024) return 4; // lg
    if (window.innerWidth >= 768) return 3; // md
    return 2; // Default (sm and below)
  };

  // Extract images from content
  const images = useMemo(() => extractImagesFromMarkdown(content), [content]);
  
  // Calculate visible images and remaining count
  const displayLimit = getDisplayLimit();
  const visibleImages = showAllImages ? images : images.slice(0, displayLimit);
  const remainingCount = images.length - displayLimit;

  // Remove images from content to prevent double rendering
  const textContent = useMemo(() => {
    return content.replace(/!\[(.*?)\]\((.*?)\)/g, '');
  }, [content]);

  return (
    <Card className="bg-transparent border-none shadow-none p-4">
      <div className="flex items-start gap-4 mb-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center">
          <Image className="rounded-full hidden sm:flex" src={model_img} alt={model} width={32} height={32} />
        </div>
        <div className="flex flex-col flex-1">
          <span className="font-medium text-sm mb-3">{model}</span>
          
          {/* Render images grid if there are images */}
          {images.length > 0 && (
            <div className={cn(
              "my-4 gap-2",
              showAllImages 
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
                : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            )}>
              {visibleImages.map((img, index) => {
                const isLastImage = !showAllImages && index === displayLimit - 1;
                const showOverlay = isLastImage && remainingCount > 0;

                return (
                  <div 
                    key={`${img.src}-${index}`}
                    className="relative"
                    onClick={() => showOverlay && setShowAllImages(true)}
                  >
                    <MarkdownImage 
                      src={img.src}
                      alt={img.alt}
                      className={cn(
                        showOverlay && "cursor-pointer"
                      )}
                      showOverlay={showOverlay}
                      overlayContent={`+${remainingCount}`}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Render markdown content */}
          {model === "AI Summary" ? (
            <SummaryContent
              summary={SUMMARY_DATA.summary}
              consistencies={SUMMARY_DATA.consistencies}
              inconsistencies={SUMMARY_DATA.inconsistencies}
              finalAnswer={SUMMARY_DATA.finalAnswer}
            />
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                key={`${responseId}-${content}`}
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
                          [&_p]:my-2
                          [&_pre]:bg-transparent [&_pre]:p-0 [&_pre]:m-0
                          [&_code]:bg-transparent"
              >
                {textContent}
              </ReactMarkdown>
            </div>
          )}

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