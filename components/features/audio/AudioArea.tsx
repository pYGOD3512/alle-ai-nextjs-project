"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, RotateCcw, Play, Pause, RotateCcw as Replay, Square, FastForward, Rewind, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RenderPageContent from "@/components/RenderPageContent";
import { Slider } from "@/components/ui/slider";

interface AudioResponse {
  content: string;
  model: string;
  icon: string;
  audioUrl: string;
}

interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
}

export function AudioArea() {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasResponse, setHasResponse] = useState(false);
  const [responses, setResponses] = useState<AudioResponse[]>([]);
  const [activeModel, setActiveModel] = useState("gpt4");
  const [credits, setCredits] = useState(50);
  const [audioStates, setAudioStates] = useState<Record<string, AudioPlayerState>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const handleSubmit = async () => {
    if (!description.trim()) return;

    setIsLoading(true);
    
    // Simulate multiple responses with different audios
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
      setHasResponse(true);
      setIsLoading(false);
    }, 2000);
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
    if (audio) {
      if (audioStates[model]?.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setAudioStates(prev => ({
        ...prev,
        [model]: {
          ...prev[model],
          isPlaying: !prev[model]?.isPlaying
        }
      }));
    }
  };

  const handleStop = (model: string) => {
    const audio = audioRefs.current[model];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
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
      audio.currentTime = 0;
      audio.play();
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

  return (
    <RenderPageContent>
      <div className={cn(
        "max-w-7xl w-full mx-auto flex h-full transition-all duration-300",
        hasResponse ? "gap-4" : "gap-0"
      )}>
        {/* Left side - Prompt Section */}
        <div className={cn(
          "flex mt-5 flex-col h-full transition-all duration-300 mx-auto",
          hasResponse ? "w-1/2" : "w-1/2"
        )}>
          <div className="flex flex-col flex-1 p-4 space-y-4">
            <div className="flex flex-col space-y-2">
              <h2 className="text-lg font-semibold">Describe your Audio</h2>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Input prompt here..."
                className="flex-1 min-h-[100px] resize-none border-borderColorPrimary"
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
              <Tabs defaultValue={responses[0]?.model} onValueChange={setActiveModel}>
                <TabsList className="w-full rounded-none bg-transparent overflow-x-hidden justify-start">
                  {responses.map((response) => (
                    <TabsTrigger
                      key={response.model}
                      value={response.model}
                      className="flex items-center gap-2 data-[state=active]:bg-transparent"
                    >
                      <img 
                        src={response.icon} 
                        alt={response.model} 
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="hidden sm:inline">{response.model}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                <ScrollArea className="h-[calc(100vh-200px)] mt-4">
                  {responses.map((response) => (
                    <TabsContent 
                      key={response.model} 
                      value={response.model}
                      className="mt-0 border border-borderColorPrimary rounded-lg p-4"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <img 
                            src={response.icon} 
                            alt={response.model} 
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
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
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
                                className="h-8 w-8"
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
                                <Replay className="h-4 w-4" />
                              </Button>
                              
                              {/* Speed Controls */}
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
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
                                className="h-8 w-8"
                                onClick={() => handlePlaybackRateChange(response.model, true)}
                              >
                                <FastForward className="h-4 w-4" />
                              </Button>
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
                    </TabsContent>
                  ))}
                </ScrollArea>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </RenderPageContent>
  );
}
