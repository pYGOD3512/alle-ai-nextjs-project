'use client';

import { Card } from "@/components/ui/card";
import { Volume2, VolumeX, ThumbsUp, ThumbsDown, Copy, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AdCard } from "@/components/features/AdCard";

interface ModelResponseProps {
  model: string;
  content: string;
  model_img: string;
  responseId: string;
  onFeedbackChange?: (responseId: string, feedback: 'like' | 'dislike' | null) => void;
  onRegenerate?: (responseId: string) => void;
  feedback?: 'like' | 'dislike' | null;
}

const SAMPLE_ADS = [
  {
    id: "1",
    title: "Boost Your Business with AI-Powered Automation",
    description: "Automate tasks and scale your business faster with AI-driven solutions. Get started today!",
    imageUrl: "https://plus.unsplash.com/premium_photo-1679397476740-a236a0c87fad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW9uZXl8ZW58MHx8MHx8fDA%3D",
    link: "https://automation.ai",
    pill: "🤖 Try Automation Tools"
  },
  {
    id: "2",
    title: "Transform Your Marketing with AI Insights",
    description: "Leverage AI to unlock deep marketing insights, optimize your strategy, and grow your brand.",
    imageUrl: "https://plus.unsplash.com/premium_photo-1679397476740-a236a0c87fad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW9uZXl8ZW58MHx8MHx8fDA%3D",
    link: "https://marketing.ai",
    pill: "📊 Discover Marketing AI"
  },
  {
    id: "3",
    title: "AI Tools for Data-Driven Decisions",
    description: "Make smarter business decisions with powerful AI analytics and data-driven insights.",
    imageUrl: "https://plus.unsplash.com/premium_photo-1679397476740-a236a0c87fad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW9uZXl8ZW58MHx8MHx8fDA%3D",
    link: "https://data.ai",
    pill: "📈 Try Data Analytics Tools"
  }
];

export function ModelResponse({ 
  model_img, 
  model, 
  content, 
  responseId,
  onFeedbackChange,
  onRegenerate,
  feedback = null
}: ModelResponseProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(content);
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

  return (
    <Card className="bg-transparent border-none shadow-none p-4">
      <div className="flex items-start gap-4 mb-3">
        <div className="rounded-full flex items-center justify-center">
          <Image className="rounded-full hidden sm:flex" src={model_img} alt={model} width={80} height={80} />
        </div>
        <div className="flex flex-col flex-1">
          <span className="font-medium text-sm mb-3">{model}</span>
          <p className="text-sm text-muted-foreground">{content}</p>
          
          <div className="flex items-center gap-2 mt-4">
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
              onClick={() => {
                toast({
                  title: "Regenerating response",
                  description: "Please wait while we generate a new response.",
                });
                // Add regeneration logic here
              }}
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