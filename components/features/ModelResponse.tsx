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
}

const SourcesPill = ({ onClick }: SourcesPillProps) => {
  return (
    <div 
      onClick={onClick}
      className="relative inline-flex items-center px-2.5 py-2 
                text-xs font-medium group
                rounded-full cursor-pointer
                border border-borderColorPrimary
                overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 
                    bg-gradient-to-r from-secondary/30 via-secondary/50 to-secondary/30 
                    opacity-0 group-hover:opacity-100 
                    transition-opacity duration-300" 
      />
      
      {/* Animated shine effect */}
      <div className="absolute inset-0 
                    bg-gradient-to-r from-transparent via-white/10 to-transparent 
                    translate-x-[-200%] group-hover:translate-x-[200%]
                    transition-transform duration-1000 ease-in-out" 
      />
      
      {/* Text content */}
      <span className="relative z-10 transition-colors duration-300
                   group-hover:text-secondary-foreground">
        Sources
      </span>
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

  return (
    <Card className="bg-transparent border-none shadow-none p-4">
      <div className="flex items-start gap-4 mb-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center">
          <Image className="rounded-full hidden sm:flex" src={model_img} alt={model} width={32} height={32} />
        </div>
        <div className="flex flex-col flex-1">
          <span className="font-medium text-sm mb-3">{model}</span>
          <p className="text-sm text-muted-foreground">{content}</p>

          {/* Sources pill with new animations */}
          {sources && sources.length > 0 && (
            <div className="mt-4">
              <SourcesPill onClick={() => setSources(responseId, sources)} />
            </div>
          )}

          <div className="flex items-center gap-1 mt-4">
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
          </div>
          
          <AdCard ads={SAMPLE_ADS} />
        </div>
      </div>
    </Card>
  );
}