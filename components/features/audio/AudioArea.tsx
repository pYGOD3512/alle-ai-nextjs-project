

import { useState, useRef, useCallback, useEffect } from "react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Play, Pause, RotateCcw as Replay, Square, FastForward, Rewind, Mic, Download, Heart, Copy, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import RenderPageContent from "@/components/RenderPageContent";
import { Slider } from "@/components/ui/slider";
import GreetingMessage from "../GreetingMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast"
import { useContentStore } from "@/stores";
import { useSelectedModelsStore, useGeneratedAudioStore, AUDIO_MODELS } from "@/lib/constants";
import { useLikedMediaStore } from "@/lib/constants";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { MicButton } from "@/components/ui/MicButton";


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
  const { content } = useContentStore();
  const { selectedModels } = useSelectedModelsStore();
  const { responses, lastPrompt, setResponses, updateResponse, setLastPrompt } = useGeneratedAudioStore();
  const { addLikedMedia, removeLikedMedia } = useLikedMediaStore();
  
  const [prompt, setPrompt] = useState("");
  const [submittedPrompt, setSubmittedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasResponse, setHasResponse] = useState(false);
  const [audioStates, setAudioStates] = useState<Record<string, AudioPlayerState>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const { toast } = useToast();
  const [credits, setCredits] = useState(50);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { isListening, toggleListening } = useSpeechRecognition({
    onTranscript: setPrompt,
    inputRef: textareaRef
  });

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
    if (!prompt.trim() || selectedModels.audio.length === 0) return;

    setIsLoading(true);
    setHasResponse(true);
    setSubmittedPrompt(prompt);
    setPrompt("");
    
    // Clear previous responses
    setResponses([]);
    
    // Simulate API call
    setTimeout(() => {
      const simulatedResponses = selectedModels.audio.map(modelId => {
        const modelInfo = AUDIO_MODELS.find(model => model.id === modelId);
        return {
          modelId,
          content: `Generated audio response for ${modelInfo?.name}`,
          audioUrl: `/audio/sample1.mp3`,
          liked: false
        };
      });
      
      setResponses(simulatedResponses);
      setLastPrompt(prompt);
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

  const handleLike = useCallback((modelId: string) => {
    const response = responses.find(r => r.modelId === modelId);
    const modelInfo = AUDIO_MODELS.find(m => m.id === modelId);
    
    if (!response || !modelInfo) return;

    const newResponses = responses.map(r => 
      r.modelId === modelId ? { ...r, liked: !r.liked } : r
    );
    setResponses(newResponses);
    
    const newLikedState = !response.liked;
    if (newLikedState) {
      // Add to liked media store
      addLikedMedia({
        type: 'audio',
        url: response.audioUrl,
        modelName: modelInfo.name,
        modelIcon: modelInfo.icon,
        modelId: modelId,
        prompt: submittedPrompt,
        liked: true
      });

      toast({
        title: "Audio Liked",
        description: `You liked ${modelInfo.name}'s audio generation`,
      });
    } else {
      // Remove from liked media store
      const likedItems = useLikedMediaStore.getState().getLikedMediaByType('audio');
      const likedItem = likedItems.find(item => 
        item.modelId === modelId && 
        item.url === response.audioUrl
      );
      if (likedItem) {
        removeLikedMedia(likedItem.id);
      }

      toast({
        title: "Audio Unliked",
        description: `You unliked ${modelInfo.name}'s audio generation`,
      });
    }
  }, [responses, submittedPrompt, addLikedMedia, removeLikedMedia, toast]);

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
        {/*Prompt Section */}
        <div className={cn(
          "flex flex-col transition-all duration-300 mx-auto w-full sm:w-2/3 md:w-2/3 lg:w-1/2",
          hasResponse ? "" : "h-[calc(100svh-14rem)] my-auto"
        )}>
          {!hasResponse && ( <GreetingMessage username="Pascal" questionText=" What sound are you thinking of today?"/>)}
          <div className="flex flex-col flex-1 p-4 space-y-4">
            <div className="flex flex-col space-y-2">
              <Textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
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

              <MicButton className="w-10 h-10 rounded-md border border-borderColorPrimary" isListening={isListening} onClick={toggleListening} />
              
              <div className="ml-auto text-sm text-muted-foreground">
                Requests left: {credits}
              </div>
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={!prompt.trim() || isLoading || selectedModels.audio.length === 0}
              className="w-full mt-auto"
            >
              {isLoading ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>

        {/* Response Section */}
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
                    // We show the loading for each response based on the number of models selected by the user.
                    selectedModels.audio.map((modelId) => (
                      <ResponseSkeleton key={modelId} />
                    ))
                  ) : (
                    responses.map((response) => {
                      const modelInfo = AUDIO_MODELS.find(model => model.id === response.modelId);
                      return (
                        <div 
                          key={response.modelId}
                          className="border border-borderColorPrimary rounded-lg p-4"
                        >
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Image 
                                src={modelInfo?.icon || ''} 
                                alt={modelInfo?.name || ''} 
                                width={34}
                                height={34}
                                className="w-6 h-6 rounded-full"
                              />
                              <h3 className="font-medium">{modelInfo?.name}</h3>
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
                                      onClick={() => handlePlayPause(response.modelId)}
                                    >
                                      {audioStates[response.modelId]?.isPlaying ? (
                                        <Pause className="h-4 w-4" />
                                      ) : (
                                        <Play className="h-4 w-4" />
                                      )}
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="h-8 w-8 focus-visible:outline-none"
                                      onClick={() => handleStop(response.modelId)}
                                    >
                                      <Square className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="h-8 w-8"
                                      onClick={() => handleReplay(response.modelId)}
                                    >
                                      <Replay className="h-4 w-4 focus-visible:outline-none" />
                                    </Button>
                                    
                                    {/* Speed Controls */}
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="h-8 w-8 focus-visible:outline-none"
                                      onClick={() => handlePlaybackRateChange(response.modelId, false)}
                                    >
                                      <Rewind className="h-4 w-4" />
                                    </Button>
                                    <span className="text-xs">
                                      {audioStates[response.modelId]?.playbackRate || 1}x
                                    </span>
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="h-8 w-8 focus-visible:outline-none"
                                      onClick={() => handlePlaybackRateChange(response.modelId, true)}
                                    >
                                      <FastForward className="h-4 w-4" />
                                    </Button>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="h-8 w-8 focus-visible:outline-none"
                                      onClick={() => handleLike(response.modelId)}
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
                                      onClick={() => handleDownload(response.audioUrl, response.modelId)}
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Time and Progress */}
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>{formatTime(audioStates[response.modelId]?.currentTime || 0)}</span>
                                    <span>{formatTime(audioStates[response.modelId]?.duration || 0)}</span>
                                  </div>
                                  
                                  <Slider
                                    value={[audioStates[response.modelId]?.currentTime || 0]}
                                    max={audioStates[response.modelId]?.duration || 100}
                                    step={0.1}
                                    onValueChange={(value) => handleSliderChange(response.modelId, value)}
                                    className="focus-visible:outline-none"
                                  />
                                </div>
                              </div>
                              
                              <audio
                                ref={(el) => {
                                  if (el) {
                                    audioRefs.current[response.modelId] = el;
                                    initializeAudioState(response.modelId);
                                  }
                                }}
                                src={response.audioUrl}
                                onTimeUpdate={() => handleTimeUpdate(response.modelId)}
                                onLoadedMetadata={() => handleLoadedMetadata(response.modelId)}
                                onEnded={() => {
                                  setCurrentlyPlaying(null);
                                  setAudioStates(prev => ({
                                    ...prev,
                                    [response.modelId]: {
                                      ...prev[response.modelId],
                                      isPlaying: false,
                                      currentTime: 0
                                    }
                                  }));
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
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
