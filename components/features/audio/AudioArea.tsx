"use client";

import { useState, useRef } from "react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, RotateCcw, Play, Pause, RotateCcw as Replay, Square, FastForward, Rewind, Mic, Download, Heart, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RenderPageContent from "@/components/RenderPageContent";
import { Slider } from "@/components/ui/slider";
import GreetingMessage from "../GreetingMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast"
import { SearchHistoryModal } from "@/components/ui/modals";
interface AudioResponse {
  content: string;
  model: string;
  icon: string;
  audioUrl: string;
  liked?: boolean;
}

interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
}

export function AudioArea() {
  const [description, setDescription] = useState("");
  const [submittedPrompt, setSubmittedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasResponse, setHasResponse] = useState(false);
  const [responses, setResponses] = useState<AudioResponse[]>([]);
  const [activeModel, setActiveModel] = useState("gpt4");
  const [credits, setCredits] = useState(50);
  const [audioStates, setAudioStates] = useState<Record<string, AudioPlayerState>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const { toast } = useToast()

  const ResponseSkeleton = () => (
    <div className="border border-borderColorPrimary rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      
      <Skeleton className="h-4 w-3/4" />
      
      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-md" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-10" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      </div>
    </div>
  );


  const handleSubmit = async () => {
    if (!description.trim()) return;

    setIsLoading(true);
    setHasResponse(true);
    setSubmittedPrompt(description);
    setDescription("");
    
    // Simulate API call
    setTimeout(() => {
      const simulatedResponses: AudioResponse[] = [
        {
          content: "Something about the audio",
          model: "Whisper",
          icon: "/models/gpt-4.png",
          audioUrl: "/audio/sample3.mp3"
        },
        {
          content: "Something about the audio",
          model: "MusicGen",
          icon: "/models/dream.png",
          audioUrl: "/audio/sample4.mp3"
        },
      ];
      
      setResponses(simulatedResponses);
      setIsLoading(false);
    }, 5000);
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(submittedPrompt);
      setTimeout(() => {
        toast({
          title: "Copied!",
          description: "Prompt copied to clipboard",
          duration: 3000,
          className: "bg-toastBackgroundColor border border-borderColorPrimary text-foreground",
        });
      }, 0);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to copy prompt",
          duration: 3000,
        });
      }, 0);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const initializeAudioState = (model: string) => {
    if (!audioStates[model]) {
      setAudioStates(prev => ({
        ...prev,
        [model]: {
          isPlaying: false,
          currentTime: 0,
          duration: 0,
          playbackRate: 1
        }
      }));
    }
  };

  const handlePlayPause = (model: string) => {
    const audio = audioRefs.current[model];
    if (!audio) return;

    if (audioStates[model]?.isPlaying) {
      // Pausing current audio
      audio.pause();
      setCurrentlyPlaying(null);
    } else {
      // Pause any currently playing audio first
      if (currentlyPlaying && currentlyPlaying !== model) {
        const currentAudio = audioRefs.current[currentlyPlaying];
        if (currentAudio) {
          currentAudio.pause();
          setAudioStates(prev => ({
            ...prev,
            [currentlyPlaying]: {
              ...prev[currentlyPlaying],
              isPlaying: false
            }
          }));
        }
      }

      // Play the new audio
      audio.play();
      setCurrentlyPlaying(model);
    }

    setAudioStates(prev => ({
      ...prev,
      [model]: {
        ...prev[model],
        isPlaying: !prev[model]?.isPlaying
      }
    }));
  };

  const handleStop = (model: string) => {
    const audio = audioRefs.current[model];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setCurrentlyPlaying(null);
      setAudioStates(prev => ({
        ...prev,
        [model]: {
          ...prev[model],
          isPlaying: false,
          currentTime: 0
        }
      }));
    }
  };

  const handleReplay = (model: string) => {
    const audio = audioRefs.current[model];
    if (audio) {
      // Pause any currently playing audio first
      if (currentlyPlaying && currentlyPlaying !== model) {
        const currentAudio = audioRefs.current[currentlyPlaying];
        if (currentAudio) {
          currentAudio.pause();
          setAudioStates(prev => ({
            ...prev,
            [currentlyPlaying]: {
              ...prev[currentlyPlaying],
              isPlaying: false
            }
          }));
        }
      }

      audio.currentTime = 0;
      audio.play();
      setCurrentlyPlaying(model);
      setAudioStates(prev => ({
        ...prev,
        [model]: {
          ...prev[model],
          isPlaying: true,
          currentTime: 0
        }
      }));
    }
  };

  const handleTimeUpdate = (model: string) => {
    const audio = audioRefs.current[model];
    if (audio) {
      setAudioStates(prev => ({
        ...prev,
        [model]: {
          ...prev[model],
          currentTime: audio.currentTime
        }
      }));
    }
  };

  const handleLoadedMetadata = (model: string) => {
    const audio = audioRefs.current[model];
    if (audio) {
      setAudioStates(prev => ({
        ...prev,
        [model]: {
          ...prev[model],
          duration: audio.duration
        }
      }));
    }
  };

  const handleSliderChange = (model: string, value: number[]) => {
    const audio = audioRefs.current[model];
    if (audio) {
      audio.currentTime = value[0];
      setAudioStates(prev => ({
        ...prev,
        [model]: {
          ...prev[model],
          currentTime: value[0]
        }
      }));
    }
  };

  const handlePlaybackRateChange = (model: string, faster: boolean) => {
    const audio = audioRefs.current[model];
    if (audio) {
      const newRate = faster ? 
        Math.min(audio.playbackRate + 0.5, 2) : 
        Math.max(audio.playbackRate - 0.5, 0.5);
      
      audio.playbackRate = newRate;
      setAudioStates(prev => ({
        ...prev,
        [model]: {
          ...prev[model],
          playbackRate: newRate
        }
      }));
    }
  };

  const handleDownload = async (audioUrl: string, model: string) => {
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${model}-response.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleLike = (model: string) => {
    const response = responses.find(r => r.model === model);
    const newLikedState = !response?.liked;
    
    setTimeout(() => {
      toast({
        title: newLikedState ? "Liked" : "Unliked",
        description: `${model} response ${newLikedState ? "liked" : "unliked"}`,
        duration: 3000,
        className:"bg-toastBackgroundColor border-borderColorPrimary text-foreground" 
      });
    }, 0);

    setResponses(prev => prev.map(response => 
      response.model === model 
        ? { ...response, liked: newLikedState }
        : response
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <RenderPageContent>
      <div className={cn(
        "max-w-7xl w-full mx-auto mt-10 flex flex-col h-full transition-all duration-300",
        hasResponse ? "gap-4" : "gap-0"
      )}>
        {/* Left side - Prompt Section */}
        <div className={cn(
          "flex flex-col transition-all duration-300 mx-auto w-full sm:w-2/3 md:w-2/3 lg:w-1/2",
          hasResponse ? "" : "h-[calc(100svh-14rem)] my-auto"
        )}>
          {!hasResponse && ( <GreetingMessage username="Christmas" questionText=" What sound are you thinking of today?"/>)}
          <div className="flex flex-col flex-1 p-4 space-y-4">
            <div className="flex flex-col space-y-2">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your audio..."
                className="flex-1 min-h-[100px] resize-none border-borderColorPrimary focus-visible:outline-none focus:border-2 scrollbar-thin scrollbar-webkit"
              />
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline" 
                className="flex items-center gap-2 border-borderColorPrimary"
                onClick={() => {}}
              >
                <Upload className="w-4 h-4" />
                Upload file
              </Button>
              <Button 
                variant="outline"
                className="flex items-center gap-2 border-borderColorPrimary"
                onClick={() => {}}
              >
                <Mic className="w-4 h-4" />
              </Button>
              <div className="ml-auto text-sm text-muted-foreground">
                Requests left: {credits}
              </div>
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={!description.trim() || isLoading}
              className="w-full mt-auto"
            >
              {isLoading ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>

        {/* Right side - Response Section */}
        {hasResponse && (
          <div className="w-full sm:w-2/3 lg:w-1/2 h-full mx-auto">
            <div className="p-4">
              <ScrollArea className="">
                <div className="mb-6 rounded-lg">
                  <div className="flex items-start gap-4 justify-between mb-2">
                    <p className="text-sm text-muted-foreground">{submittedPrompt}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleCopyPrompt}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {isLoading ? (
                    <>
                      <ResponseSkeleton />
                      <ResponseSkeleton />
                    </>
                  ) : (
                    responses.map((response) => (
                      <div 
                        key={response.model}
                        className="border border-borderColorPrimary rounded-lg p-4"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Image 
                            src={response.icon} 
                            alt={response.model} 
                            width={34}
                            height={34}
                            className="w-6 h-6 rounded-full"
                            />
                            <h3 className="font-medium">{response.model}</h3>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {response.content}
                          </p>

                          <div className="border rounded-lg p-4">
                            <div className="space-y-4">
                              {/* Playback Controls */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8 focus-visible:outline-none"
                                    onClick={() => handlePlayPause(response.model)}
                                  >
                                    {audioStates[response.model]?.isPlaying ? (
                                      <Pause className="h-4 w-4" />
                                    ) : (
                                      <Play className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8 focus-visible:outline-none"
                                    onClick={() => handleStop(response.model)}
                                  >
                                    <Square className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8"
                                    onClick={() => handleReplay(response.model)}
                                  >
                                    <Replay className="h-4 w-4 focus-visible:outline-none" />
                                  </Button>
                                  
                                  {/* Speed Controls */}
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8 focus-visible:outline-none"
                                    onClick={() => handlePlaybackRateChange(response.model, false)}
                                  >
                                    <Rewind className="h-4 w-4" />
                                  </Button>
                                  <span className="text-xs">
                                    {audioStates[response.model]?.playbackRate || 1}x
                                  </span>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8 focus-visible:outline-none"
                                    onClick={() => handlePlaybackRateChange(response.model, true)}
                                  >
                                    <FastForward className="h-4 w-4" />
                                  </Button>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8 focus-visible:outline-none"
                                    onClick={() => handleLike(response.model)}
                                  >
                                    <Heart 
                                      className={cn(
                                        "h-4 w-4",
                                        response.liked && "fill-current text-red-500"
                                      )} 
                                    />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8 focus-visible:outline-none"
                                    onClick={() => handleDownload(response.audioUrl, response.model)}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Time and Progress */}
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                  <span>{formatTime(audioStates[response.model]?.currentTime || 0)}</span>
                                  <span>{formatTime(audioStates[response.model]?.duration || 0)}</span>
                                </div>
                                
                                <Slider
                                  value={[audioStates[response.model]?.currentTime || 0]}
                                  max={audioStates[response.model]?.duration || 100}
                                  step={0.1}
                                  onValueChange={(value) => handleSliderChange(response.model, value)}
                                  className="focus-visible:outline-none"
                                />
                              </div>
                            </div>
                            
                            <audio
                              ref={(el) => {
                                if (el) {
                                  audioRefs.current[response.model] = el;
                                  initializeAudioState(response.model);
                                }
                              }}
                              src={response.audioUrl}
                              onTimeUpdate={() => handleTimeUpdate(response.model)}
                              onLoadedMetadata={() => handleLoadedMetadata(response.model)}
                              onEnded={() => {
                                setCurrentlyPlaying(null);
                                setAudioStates(prev => ({
                                  ...prev,
                                  [response.model]: {
                                    ...prev[response.model],
                                    isPlaying: false,
                                    currentTime: 0
                                  }
                                }));
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </div>
    </RenderPageContent>
  );
}
