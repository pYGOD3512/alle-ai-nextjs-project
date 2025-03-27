"use client"

import { useState, useRef, useCallback, useEffect } from "react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Play, Pause, RotateCcw as Replay, Square, FastForward, Rewind, Mic, Download, Heart, Copy, MicOff, Headphones, MicVocal } from "lucide-react";
import { ALLOWED_FILE_TYPES, cn, validateFile } from "@/lib/utils";
import RenderPageContent from "@/components/RenderPageContent";
import { Slider } from "@/components/ui/slider";
import GreetingMessage from "../GreetingMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast"
import { useContentStore, useSelectedModelsStore, useGeneratedAudioStore, useLikedMediaStore } from "@/stores";
import { AUDIO_MODELS } from "@/lib/constants";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { MicButton } from "@/components/ui/MicButton";
import { FileUploadButton } from "@/components/ui/file-upload-button";
import { UploadedFile } from "@/lib/types";
import { processFile } from "@/lib/fileProcessing";
import { FilePreview } from "@/components/ui/file-preview";


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

// static options
const options = [
  {
    label: "Generate a cinematic soundtrack",
    icon: <Headphones className="w-4 h-4 text-yellow-500" />,
    description: "Create dramatic music with epic orchestral sounds"
  },
  {
    label: "Create a lo-fi chill beats track",
    icon: <MicVocal className="w-4 h-4 text-blue-400" />,
    description: "Generate a smooth and mellow lo-fi music track for studying or relaxation"
  },
];

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

  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        });
      }, 0);
    } catch (err) {
      // console.error('Failed to copy text: ', err);
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

  const handlePaste = async (event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        event.preventDefault();
        
        const file = item.getAsFile();
        if (!file) continue;

        const validation = validateFile(file);
        if (!validation.isValid) {
          toast({
            variant: "destructive",
            title: "Error",
            description: validation.error
          });
          return;
        }

        try {
          const fileUrl = URL.createObjectURL(file);
          
          if (uploadedFile?.url) {
            URL.revokeObjectURL(uploadedFile.url);
          }

          const newUploadedFile: UploadedFile = {
            id: crypto.randomUUID(),
            name: `IMG ${new Date().toISOString()}.${file.type.split('/')[1]}`,
            type: file.type,
            size: file.size,
            url: fileUrl,
            status: 'loading',
            progress: 0
          };

          setUploadedFile(newUploadedFile);

          let progress = 0;
          const progressInterval = setInterval(() => {
            const increment = Math.max(1, (90 - progress) / 10);
            progress = Math.min(90, progress + increment);
            
            setUploadedFile(prev => 
              prev ? { ...prev, progress } : null
            );
          }, 100);

          const { text } = await processFile(file);
          // // console.log('content', text);

          clearInterval(progressInterval);
          
          setUploadedFile(prev => 
            prev ? { ...prev, progress: 100 } : null
          );

          await new Promise(resolve => setTimeout(resolve, 500));
          setUploadedFile(prev => 
            prev ? { ...prev, status: 'ready' } : null
          );

          toast({
            title: "Image Uploaded",
            description: "Image has been uploaded successfully",
          });
        } catch (error) {
          if (uploadedFile?.url) {
            URL.revokeObjectURL(uploadedFile.url);
          }
          setUploadedFile(prev => prev ? { ...prev, status: 'error' } : null);
          toast({
            variant: "destructive",
            title: "Processing Failed",
            description: error instanceof Error ? error.message : "Failed to process file"
          });
        }
      }
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
      // console.error('Download failed:', error);
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

  const handleUploadFromComputer = () => {
    fileInputRef.current?.click();
  };

  const handleFileUploadProgress = (progress: number) => {
    setUploadedFile(prev => prev ? { ...prev, progress } : null);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: "Error",
        description: validation.error
      });
      return;
    }

    try {
      // Create blob URL
      const fileUrl = URL.createObjectURL(file);
      
      // Clean up previous blob URL if it exists
      if (uploadedFile?.url) {
        URL.revokeObjectURL(uploadedFile.url);
      }

      const newUploadedFile: UploadedFile = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl,
        status: 'loading',
        progress: 0
      };

      setUploadedFile(newUploadedFile);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        handleFileUploadProgress(Math.random() * 100);
      }, 200);

      // Process the file
      const { text } = await processFile(file);
      // // console.log('content', text);

      // Clear interval and set progress to 100%
      clearInterval(progressInterval);
      handleFileUploadProgress(100);

      // Update file status to ready after a brief delay
      setTimeout(() => {
        setUploadedFile(prev => prev ? { ...prev, status: 'ready' } : null);
      }, 500);

      toast({
        title: "File Processed",
        description: `${file.name} has been added successfully`,
      });
    } catch (error) {
      handleFileError(error);
    }
  };

  const handleUploadFromDrive = async (file: File) => {
    try {
      const validation = validateFile(file);
      if (!validation.isValid) {
        toast({
          variant: "destructive",
          title: "Error",
          description: validation.error
        });
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      
      if (uploadedFile?.url) {
        URL.revokeObjectURL(uploadedFile.url);
      }

      const newUploadedFile: UploadedFile = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl,
        status: 'loading',
        progress: 0
      };

      setUploadedFile(newUploadedFile);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        handleFileUploadProgress(Math.random() * 100);
      }, 200);

      const { text } = await processFile(file);
      // // console.log('content', text);

      // Clear interval and set progress to 100%
      clearInterval(progressInterval);
      handleFileUploadProgress(100);

      // Update status to ready after a brief delay
      setTimeout(() => {
        setUploadedFile(prev => prev ? { ...prev, status: 'ready' } : null);
      }, 500);

      toast({
        title: "File Processed",
        description: `${file.name} has been added successfully`,
      });
    } catch (error) {
      handleFileError(error);
    }
  };

  const handleRemoveFile = () => {
    if (uploadedFile?.url) {
      URL.revokeObjectURL(uploadedFile.url);
      setUploadedFile(null);
    }
  };

  const handleFileError = (error: any) => {
    if (uploadedFile?.url) {
      URL.revokeObjectURL(uploadedFile.url);
    }
    setUploadedFile(prev => prev ? { ...prev, status: 'error' } : null);
    toast({
      variant: "destructive",
      title: "Processing Failed",
      description: error instanceof Error ? error.message : "Failed to process file"
    });
  };

  useEffect(() => {
    return () => {
      if (uploadedFile?.url) {
        URL.revokeObjectURL(uploadedFile.url);
      }
    };
  }, []);

  const handleClicked = (option: { label: String; icon?: React.ReactNode; description?: string }) => {
    setPrompt(option.label as string);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  return (
    <RenderPageContent>
      <div className={cn(
        "max-w-7xl w-full mx-auto mt-10 flex flex-col h-full transition-all duration-300",
        hasResponse ? "gap-4" : "gap-0"
      )}>
        <div className={cn(
          "flex flex-col transition-all duration-300 mx-auto w-full sm:w-2/3 md:w-2/3 lg:w-1/2",
          hasResponse ? "" : "h-[calc(100svh-14rem)] my-auto"
        )}>
          {!hasResponse && 

          <GreetingMessage 
            username="Pascal" 
            questionText=" What sound are you thinking of today?" 
            options={options}
            handlePressed={handleClicked}
          />}
          <div className="flex flex-col flex-1 p-4 space-y-4">

            <div className="flex flex-col space-y-2">
              <Textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your audio..."
                onPaste={handlePaste}
                className="bg-backgroundSecondary flex-1 min-h-[100px] resize-none border-borderColorPrimary focus-visible:outline-none focus:border-2 scrollbar-thin scrollbar-webkit"
              />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept={Object.entries(ALLOWED_FILE_TYPES)
                .flatMap(([, exts]) => exts)
                .join(',')}
            />

            <div className="flex items-center gap-4">

              <FileUploadButton
                onUploadFromComputer={handleUploadFromComputer}
                onUploadFromDrive={handleUploadFromDrive}
                buttonIcon={
                  <Button
                variant="outline" 
                className="flex items-center gap-2 border-borderColorPrimary"
                    onClick={() => {}}
                  >
                    <Upload className="w-4 h-4" />
                    Upload file
                  </Button>
                }
              />

              <MicButton className={`w-10 h-10 bg-transparent rounded-md text-black dark:text-white ${isListening ? "border-none" : "border border-borderColorPrimary"} `} isListening={isListening} onClick={toggleListening} />
              
              <div className="ml-auto text-sm text-muted-foreground">
                {/* Requests left: {credits} */}
                {uploadedFile && (
                  <div className="mb-2">
                    <FilePreview 
                      file={uploadedFile} 
                      onRemove={handleRemoveFile} 
                    />
                  </div>
                )}
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
