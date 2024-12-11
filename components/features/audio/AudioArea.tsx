"use client";

import { useState, useRef } from "react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, RotateCcw, Play, Pause, RotateCcw as Replay, Square, FastForward, Rewind, Mic, Download, Heart, Copy, ChevronDown, ChevronUp, Settings, Volume2, AudioWaveform , Music, CircleEqual   } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RenderPageContent from "@/components/RenderPageContent";
import { Slider } from "@/components/ui/slider";
import GreetingMessage from "../GreetingMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  const [openAdvanced, setOpenAdvanced] = useState<Record<string, boolean>>({});
  const [audioEffects, setAudioEffects] = useState<Record<string, {
    reverb: number;
    echo: number;
    volume: number;
    pan: number;
    eq: {
      low: number;
      mid: number;
      high: number;
    };
  }>>({});

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
      setDescription(""); // Clear the textarea after submission
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

  const initializeAudioEffects = (model: string) => {
    if (!audioEffects[model]) {
      setAudioEffects(prev => ({
        ...prev,
        [model]: {
          reverb: 0,
          echo: 0,
          volume: 100,
          pan: 0,
          eq: {
            low: 0,
            mid: 0,
            high: 0
          }
        }
      }));
    }
  };

  const handleEffectChange = (model: string, effect: string, value: number) => {
    setAudioEffects(prev => ({
      ...prev,
      [model]: {
        ...prev[model],
        [effect]: value
      }
    }));
    // Here you would apply the effect to the audio
    // This would require Web Audio API implementation
  };

  return (
    <RenderPageContent>
      <div className={cn(
        "max-w-7xl w-full mx-auto mt-10 flex h-full transition-all duration-300",
        hasResponse ? "gap-4" : "gap-0"
      )}>
        {/* Left side - Prompt Section */}
        <div className={cn(
          "flex flex-col transition-all duration-300 mx-auto",
          hasResponse ? "w-1/2" : "w-1/2 max-h-screen mt-40"
        )}>
          {!hasResponse && ( <GreetingMessage username="Christmas" questionText=" What sound are you thinking of today?"/>)}
          <div className="flex flex-col flex-1 p-4 space-y-4">
            <div className="flex flex-col space-y-2">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Input prompt here..."
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
          <div className="w-1/2 h-full border-l">
            <div className="p-4">
              <ScrollArea className="h-[calc(100vh-200px)]">
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

                              <Collapsible
                                open={openAdvanced[response.model]}
                                onOpenChange={(isOpen) => 
                                  setOpenAdvanced(prev => ({
                                    ...prev,
                                    [response.model]: isOpen
                                  }))
                                }
                                className="mt-4 space-y-2"
                              >
                                <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                  {openAdvanced[response.model] ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                  Advanced Options
                                </CollapsibleTrigger>
                                
                                <CollapsibleContent className="space-y-4">
                                  {/* Volume Control */}
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Volume2 className="h-4 w-4" />
                                      <span className="text-sm">Master Volume</span>
                                    </div>
                                    <Slider
                                      value={[audioEffects[response.model]?.volume || 100]}
                                      max={100}
                                      step={1}
                                      onValueChange={(value) => handleEffectChange(response.model, 'volume', value[0])}
                                      className="focus-visible:outline-none"
                                    />
                                  </div>

                                  {/* Stereo Pan */}
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Music className="h-4 w-4" />
                                      <span className="text-sm">Stereo Pan</span>
                                    </div>
                                    <Slider
                                      value={[audioEffects[response.model]?.pan || 0]}
                                      min={-100}
                                      max={100}
                                      step={1}
                                      onValueChange={(value) => handleEffectChange(response.model, 'pan', value[0])}
                                      className="focus-visible:outline-none"
                                    />
                                  </div>

                                  {/* EQ Controls */}
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <CircleEqual   className="h-4 w-4" />
                                      <span className="text-sm">CircleEqual  </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                      <div className="space-y-2">
                                        <span className="text-xs text-muted-foreground">Low</span>
                                        <Slider
                                          orientation="vertical"
                                          className="h-24 focus-visible:outline-none"
                                          value={[audioEffects[response.model]?.eq?.low || 0]}
                                          min={-12}
                                          max={12}
                                          step={1}
                                          onValueChange={(value) => handleEffectChange(response.model, 'eq.low', value[0])}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <span className="text-xs text-muted-foreground">Mid</span>
                                        <Slider
                                          orientation="vertical"
                                          className="h-24 focus-visible:outline-none"
                                          value={[audioEffects[response.model]?.eq?.mid || 0]}
                                          min={-12}
                                          max={12}
                                          step={1}
                                          onValueChange={(value) => handleEffectChange(response.model, 'eq.mid', value[0])}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <span className="text-xs text-muted-foreground">High</span>
                                        <Slider
                                          orientation="vertical"
                                          className="h-24 focus-visible:outline-none"
                                          value={[audioEffects[response.model]?.eq?.high || 0]}
                                          min={-12}
                                          max={12}
                                          step={1}
                                          onValueChange={(value) => handleEffectChange(response.model, 'eq.high', value[0])}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Effects */}
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <AudioWaveform  className="h-4 w-4" />
                                      <span className="text-sm">Effects</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <span className="text-xs text-muted-foreground">Reverb</span>
                                        <Slider
                                          value={[audioEffects[response.model]?.reverb || 0]}
                                          max={100}
                                          step={1}
                                          onValueChange={(value) => handleEffectChange(response.model, 'reverb', value[0])}
                                          className="focus-visible:outline-none"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <span className="text-xs text-muted-foreground">Echo</span>
                                        <Slider
                                          value={[audioEffects[response.model]?.echo || 0]}
                                          max={100}
                                          step={1}
                                          onValueChange={(value) => handleEffectChange(response.model, 'echo', value[0])}
                                          className="focus-visible:outline-none"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex justify-end pt-4 border-t border-borderColorPrimary">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        // Close the advanced panel for this response
                                        setOpenAdvanced(prev => ({
                                          ...prev,
                                          [response.model]: false
                                        }));
                                        
                                        // Here we'll later add the actual application of effects
                                        toast({
                                          title: "Settings Applied",
                                          description: "Audio effects have been updated",
                                          duration: 3000,
                                          className: "bg-toastBackgroundColor border border-borderColorPrimary text-foreground",
                                        });
                                      }}
                                    >
                                      Apply Changes
                                    </Button>
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
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
