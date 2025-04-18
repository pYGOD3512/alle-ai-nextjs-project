"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner"

import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useContentStore, useSelectedModelsStore, useLikedMediaStore } from "@/stores";
import { VIDEO_MODELS } from "@/lib/constants";
import RenderPageContent from "@/components/RenderPageContent";
import { Plus, Copy, Info, Play, Pause, Volume2, VolumeX, Maximize2, Download, Heart, Grid2x2, RectangleHorizontal, TvMinimalPlay, RectangleVertical, Square, GalleryHorizontal, GalleryVerticalEnd, Clock8, ChevronLeft, ChevronRight, Mic, MicOff, Upload, Film, Clock9, Clapperboard, Aperture } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ALLOWED_FILE_TYPES, cn, validateFile } from "@/lib/utils";
import GreetingMessage from "../GreetingMessage";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { VideoSettingsInfoModal } from "@/components/ui/modals";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { MicButton } from "@/components/ui/MicButton";
import { FileUploadButton } from "@/components/ui/file-upload-button";
import { UploadedFile } from "@/lib/types";
import { processFile } from "@/lib/fileProcessing";
import { FilePreview } from "@/components/ui/file-preview";

interface VideoResponse {
  modelId: string;
  videoUrl: string;
  liked?: boolean;
}

interface VideoSettings {
  aspectRatio: "16:9" | "1:1" | "9:16";
  quality: "480p" | "720p" | "1080p";
  duration: number;
  display: "column" | "grid" | "carousel";
}

// static options
const options = [
  {
    label: "Make a time-lapse video",
    icon: <Clock9 className="w-4 h-4 text-blue-500" />, // Blue for time and clarity
    description: "Generate a time-lapse video of a natural or urban scene"
  },
  {
    label: "Generate a deepfake video",
    icon: <Clapperboard className="w-4 h-4 text-green-500" />, // Green for tech and AI theme
    description: "Create a hyper-realistic deepfake video of a person saying or doing something"
  },
  {
    label: "Make a cinematic music video",
    icon: <Film className="w-4 h-4 text-red-500" />, // Red for dramatic video themes
    description: "Create a music video with a cinematic vibe and compelling storytelling"
  },
  {
    label: "Create a drone footage video",
    icon: <Aperture className="w-4 h-4 text-teal-500" />, // Teal for aerial and futuristic feel
    description: "Generate stunning aerial views captured by a drone"
  }
];

const VideoSkeleton = () => (
  <div className="border border-borderColorPrimary rounded-lg p-4 space-y-4">
    <div className="flex items-center gap-2 mb-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-4 w-24" />
    </div>
    <Skeleton className="w-full aspect-video rounded-lg" />
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
      <Skeleton className="h-8 w-24" />
    </div>
  </div>
);

const useVideoControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  return {
    isPlaying,
    setIsPlaying,
    isMuted,
    setIsMuted,
    isFullscreen,
    setIsFullscreen
  };
};

const VideoResponse = React.memo(({ 
  video, 
  onLike,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious 
}: { 
  video: VideoResponse, 
  onLike: (video: VideoResponse) => void,
  onNext?: () => void,
  onPrevious?: () => void,
  hasNext?: boolean,
  hasPrevious?: boolean
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const {
    isPlaying,
    setIsPlaying,
    isMuted,
    setIsMuted,
    isFullscreen,
    setIsFullscreen
  } = useVideoControls();


  // Calculate progress percentage
  const progress = duration ? (currentTime / duration) * 100 : 0;

  // Add event listeners for time updates
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // Handle seeking
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Format time for display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };


  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, []);

  const modelInfo = VIDEO_MODELS.find(m => m.id === video.modelId);
  if (!modelInfo) return null;

  return (
    <div ref={containerRef} className="relative group rounded-lg overflow-hidden bg-black">
      {/* Model Badge */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 select-none">
        <Image 
          src={modelInfo.icon} 
          alt={modelInfo.name} 
          width={20}
          height={20}
          className="rounded-full"
        />
        <span className="text-sm text-white font-medium">
          {modelInfo.name}
        </span>
      </div>

      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="w-full aspect-video object-contain"
        loop
        muted={isMuted}
      />

      {/* Add fullscreen navigation controls */}
      {isFullscreen && (
        <>
          {hasPrevious && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          {hasNext && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
        </>
      )}

      {/* Video Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Seeker Bar */}
        <div className="flex flex-col gap-2 w-full mb-2">
          <div 
            className="relative cursor-pointer" 
            onClick={handleSeek}
          >
            <Progress 
              value={progress} 
              className="h-1 cursor-pointer hover:h-1.5 transition-all"
            />
          </div>
          <div className="flex justify-between text-xs text-white/80">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Existing Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
              onClick={() => onLike(video)}
            >
              <Heart 
                className="h-4 w-4" 
                fill={video.liked ? "red" : "none"} 
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
              onClick={toggleFullscreen}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
VideoResponse.displayName = 'VideoResponse';

const VideoArea = () => {
  const { content } = useContentStore();
  const { selectedModels } = useSelectedModelsStore();
  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasResponse, setHasResponse] = useState(false);
  ;
  const [prompt, setPrompt] = useState("");
  const [settings, setSettings] = useState<VideoSettings>({
    aspectRatio: "16:9",
    quality: "720p",
    duration: 10,
    display: "grid",
  });
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [currentSettingInfo, setCurrentSettingInfo] = useState<'aspectRatio' | 'quality' | 'duration' | 'display'>('aspectRatio');
  const { addLikedMedia, removeLikedMedia } = useLikedMediaStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isListening, toggleListening } = useSpeechRecognition({
    onTranscript: setPrompt,
    inputRef: textareaRef
  });

  const showSettingInfo = (setting: 'aspectRatio' | 'quality' | 'duration' | 'display') => {
    setCurrentSettingInfo(setting);
    setInfoModalOpen(true);
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
          toast.error(`${validation.error}`)
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

          toast('Image uploaded')
        } catch (error) {
          if (uploadedFile?.url) {
            URL.revokeObjectURL(uploadedFile.url);
          }
          setUploadedFile(prev => prev ? { ...prev, status: 'error' } : null);
          toast.error(`${error instanceof Error ? error.message : "Failed to process file"}`)
        }
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const DurationControl = () => {
    const durations = [5, 10, 15, 30, 60, 120]; // Duration options in seconds

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={cn(
              "flex gap-2 h-10 px-4 rounded-xl border-2 transition-all duration-200 group border-muted text-muted-foreground hover:bg-accent/50"
            )}
          >
            <Clock8 className="h-4 w-4" />
            <span className="font-medium">{formatDuration(settings.duration)}</span>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="flex items-center justify-between">
            Duration
            <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 rounded-full hover:bg-accent/50"
            onClick={() => showSettingInfo('duration')}
            >
                <Info className="h-3 w-3" />
            </Button>
            </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup 
            value={settings.duration.toString()}
            onValueChange={(value) => 
              setSettings(prev => ({ ...prev, duration: parseInt(value) }))
            }
          >
            {durations.map((duration) => (
              <DropdownMenuRadioItem 
                key={duration} 
                value={duration.toString()}
              >
                {formatDuration(duration)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const AdvancedOptions = () => (
    <div className="flex items-center justify-center gap-6 mt-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={cn(
              "flex gap-2 h-10 px-4 rounded-xl border-2 transition-all duration-200 group border-muted text-muted-foreground hover:bg-accent/50"
            )}
          >
            <RectangleHorizontal className="h-4 w-4" />
            <span className="font-medium">{settings.aspectRatio}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[120px]">
          <DropdownMenuLabel className="flex items-center justify-between">
            Aspect Ratio
            <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 rounded-full hover:bg-accent/50"
            onClick={() => showSettingInfo('aspectRatio')}
            >
                <Info className="h-3 w-3" />
            </Button>
            </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup 
            value={settings.aspectRatio} 
            onValueChange={(value) => 
              setSettings(prev => ({ ...prev, aspectRatio: value as VideoSettings["aspectRatio"] }))
            }
          >
            <DropdownMenuRadioItem value="16:9" className="gap-2">
              <RectangleHorizontal className="w-4 h-4" />
              16:9
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="1:1" className="gap-2">
              <Square className="w-4 h-4" />
              1:1
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="9:16" className="gap-2">
              <RectangleVertical className="w-4 h-4" />
              9:16
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={cn(
              "flex gap-2 h-10 px-4 rounded-xl border-2 transition-all duration-200 group",
              settings.quality === "1080p" 
                ? "border-primary text-primary hover:bg-primary/10"
                : "border-muted text-muted-foreground hover:bg-accent/50"
            )}
          >
            <TvMinimalPlay className="h-4 w-4" />
            <span className="font-medium">{settings.quality}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[120px]">
          <DropdownMenuLabel className="flex items-center justify-between">
            Quality
            <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 rounded-full hover:bg-accent/50"
            onClick={() => showSettingInfo('quality')}
            >
                <Info className="h-3 w-3" />
            </Button>
            </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup 
            value={settings.quality}
            onValueChange={(value) => 
              setSettings(prev => ({ ...prev, quality: value as VideoSettings["quality"] }))
            }
          >
            <DropdownMenuRadioItem value="480p">480p - SD</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="720p">720p - HD</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="1080p">1080p - FHD</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DurationControl />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={cn(
              "flex gap-2 h-10 px-4 rounded-xl border-2 transition-all duration-200 group border-muted text-muted-foreground hover:bg-accent/50"
            )}
          >
            {settings.display === "column" ? (
                <GalleryVerticalEnd className="h-4 w-4" />
                ) : settings.display === "grid" ? (
                <Grid2x2 className="h-4 w-4" />
                ) : (
                <GalleryHorizontal className="h-4 w-4" />
                )}
            <span className="font-medium">
              {settings.display === "column" ? "Column" : settings.display === "grid" ? "Grid" : "Carousel"}
              
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="flex items-center justify-between">
            Display Layout
            <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 rounded-full hover:bg-accent/50"
            onClick={() => showSettingInfo('display')}
            >
                <Info className="h-3 w-3" />
            </Button>
            </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup 
            value={settings.display}
            onValueChange={(value) => 
              setSettings(prev => ({ ...prev, display: value as VideoSettings["display"] }))
            }
          >
            <DropdownMenuRadioItem value="column" className="gap-2">
              <GalleryVerticalEnd  className="w-4 h-4" />
              Column View
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="grid" className="gap-2">
              <Grid2x2 className="w-4 h-4" />
              Grid View
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="carousel" className="gap-2">
              <GalleryHorizontal className="w-4 h-4" />
              Carousel View
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const responsesContainerClass = cn(
    "space-y-6",
    settings.display === "grid" && "grid grid-cols-2 gap-6 space-y-0"
  );

  const handleLike = useCallback((video: VideoResponse) => {
    const newVideos = [...videos];
    const index = newVideos.findIndex(v => v.modelId === video.modelId);
    const modelInfo = VIDEO_MODELS.find(m => m.id === video.modelId);
    const newLikedState = !video.liked;
    newVideos[index].liked = newLikedState;
    setVideos(newVideos);
    
    if (newLikedState) {
      // Add to liked media store
      addLikedMedia({
        type: 'video',
        url: video.videoUrl,
        modelName: modelInfo?.name || '',
        modelIcon: modelInfo?.icon || '',
        modelId: video.modelId,
        prompt: prompt,
        liked: true
      });

      toast(`${modelInfo?.name}'s video liked`)
    } else {
      // Remove from liked media store - find the video's ID first
      const likedItems = useLikedMediaStore.getState().getLikedMediaByType('video');
      const likedItem = likedItems.find(item => 
        item.modelId === video.modelId && 
        item.url === video.videoUrl
      );
      if (likedItem) {
        removeLikedMedia(likedItem.id);
      }

      toast(`${modelInfo?.name}'s video unliked`)

    }
  }, [videos, toast, addLikedMedia, removeLikedMedia, prompt]);

  const handleSubmit = useCallback(async () => {
    if (!prompt.trim() || selectedModels.video.length === 0) return;

    setLoading(true);
    setHasResponse(true);
    
    // Create a mapping of model IDs to specific videos
    const modelVideoMap: Record<string, string> = {
      'sora': '/videos/video1.mp4',
      'runway': '/videos/video2.mp4',
      'luma': '/videos/video3.mp4',
      'kling': '/videos/video4.mp4',
      'animate-diff': '/videos/video5.mp4'
    };

    // Simulate API call
    setTimeout(() => {
      // Create responses only for selected models with their assigned videos
      const simulatedResponses: VideoResponse[] = selectedModels.video.map(modelId => ({
        modelId,
        // Use the specific video for each model
        videoUrl: modelVideoMap[modelId],
        liked: false
      }));
      
      setVideos(simulatedResponses);
      setLoading(false);
    }, 3000);
  }, [prompt, selectedModels.video]);

  const handleNext = useCallback((currentIndex: number) => {
    const filteredVideos = videos.filter(video => VIDEO_MODELS.find(m => m.id === video.modelId));
    if (currentIndex < filteredVideos.length - 1) {
      return filteredVideos[currentIndex + 1];
    }
    return null;
  }, [videos]);

  const handlePrevious = useCallback((currentIndex: number) => {
    const filteredVideos = videos.filter(video => VIDEO_MODELS.find(m => m.id === video.modelId));
    if (currentIndex > 0) {
      return filteredVideos[currentIndex - 1];
    }
    return null;
  }, [videos]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      toast.error(`${validation.error}`)

      return;
    }

    try {
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

      // Create a more natural progress simulation
      let progress = 0;
      const progressInterval = setInterval(() => {
        // Exponential slowdown as we approach 90%
        const increment = Math.max(1, (90 - progress) / 10);
        progress = Math.min(90, progress + increment);
        
        setUploadedFile(prev => 
          prev ? { ...prev, progress } : null
        );
      }, 100);

      // Process the file
      const { text } = await processFile(file);
      // // console.log('content', text);

      // Complete the progress animation
      clearInterval(progressInterval);
      
      // Jump to 100% and show completion
      setUploadedFile(prev => 
        prev ? { ...prev, progress: 100 } : null
      );

      // Short delay before showing ready state
      await new Promise(resolve => setTimeout(resolve, 500));
      setUploadedFile(prev => 
        prev ? { ...prev, status: 'ready' } : null
      );

      toast('File uploaded');
    } catch (error) {
      if (uploadedFile?.url) {
        URL.revokeObjectURL(uploadedFile.url);
      }
      setUploadedFile(prev => prev ? { ...prev, status: 'error' } : null);
      toast.error(`${error instanceof Error ? error.message : "Failed to upload file"}`)
    }
  };

  const handleUploadFromComputer = () => {
    fileInputRef.current?.click();
  };

  const handleUploadFromDrive = async (file: File) => {
    try {
      const validation = validateFile(file);
      if (!validation.isValid) {
        toast.error(`${validation.error}`)
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

      // Create a more natural progress simulation
      let progress = 0;
      const progressInterval = setInterval(() => {
        // Exponential slowdown as we approach 90%
        const increment = Math.max(1, (90 - progress) / 10);
        progress = Math.min(90, progress + increment);
        
        setUploadedFile(prev => 
          prev ? { ...prev, progress } : null
        );
      }, 100);

      const { text } = await processFile(file);
      // // console.log('content', text);
      setPrompt(text);

      // Complete the progress animation
      clearInterval(progressInterval);
      
      // Jump to 100% and show completion
      setUploadedFile(prev => 
        prev ? { ...prev, progress: 100 } : null
      );

      // Short delay before showing ready state
      await new Promise(resolve => setTimeout(resolve, 500));
      setUploadedFile(prev => 
        prev ? { ...prev, status: 'ready' } : null
      );

      toast('File uploaded');
      toast('File uploaded');
    } catch (error) {
      if (uploadedFile?.url) {
        URL.revokeObjectURL(uploadedFile.url);
      }
      setUploadedFile(prev => prev ? { ...prev, status: 'error' } : null);
      toast.error(`${error instanceof Error ? error.message : "Failed to upload file"}`)

    }
  };

  const handleRemoveFile = () => {
    if (uploadedFile?.url) {
      URL.revokeObjectURL(uploadedFile.url);
      setUploadedFile(null);
    }
  };

  // Add cleanup effect
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
      <div className="flex flex-col h-full">
        {/* Video Display Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="max-w-6xl mx-auto p-4">
              {!hasResponse ? (
                <div className="mt-64">
                    <GreetingMessage
                    username="Pascal" 
                    questionText="Ready to create your next video masterpiece?"
                    options={options}
                    handlePressed={handleClicked}
                    />
                </div>
              ) : (
                <div className={cn(
                  settings.display === "grid" 
                    ? "grid grid-cols-2 gap-6" 
                    : settings.display === "carousel"
                    ? "relative"
                    : "space-y-6"
                )}>
                  {loading ? (
                    // Show skeletons only for valid selected models
                    selectedModels.video
                      .filter(modelId => VIDEO_MODELS.find(m => m.id === modelId))
                      .map((_, i) => (
                        <VideoSkeleton key={i} />
                      ))
                  ) : (
                    settings.display === "carousel" ? (
                      <Carousel className="w-full">
                        <CarouselContent>
                          {videos
                            .filter(video => VIDEO_MODELS.find(m => m.id === video.modelId))
                            .map((video, index, filteredArray) => (
                              <CarouselItem key={index}>
                                <div className="rounded-lg overflow-hidden">
                                  <VideoResponse 
                                    video={video} 
                                    onLike={handleLike}
                                    onNext={() => handleNext(index)}
                                    onPrevious={() => handlePrevious(index)}
                                    hasNext={index < filteredArray.length - 1}
                                    hasPrevious={index > 0}
                                  />
                                </div>
                              </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    ) : (
                      // Regular grid or column display
                      videos
                        .filter(video => VIDEO_MODELS.find(m => m.id === video.modelId))
                        .map((video, index, filteredArray) => (
                          <div key={index} className="rounded-lg overflow-hidden">
                            <VideoResponse 
                              video={video} 
                              onLike={handleLike}
                              onNext={() => handleNext(index)}
                              onPrevious={() => handlePrevious(index)}
                              hasNext={index < filteredArray.length - 1}
                              hasPrevious={index > 0}
                            />
                          </div>
                        ))
                    )
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Prompt Input Area */}
        <div className="border-borderColorPrimary p-4">
          <div className="max-w-4xl mx-auto">
            {uploadedFile && (
              <div className="mb-2">
                <FilePreview 
                  file={uploadedFile} 
                  onRemove={handleRemoveFile} 
                />
              </div>
            )}
            
            <div className="relative flex items-center gap-2 mb-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept={Object.entries(ALLOWED_FILE_TYPES)
                  .flatMap(([, exts]) => exts)
                  .join(',')}
              />
              
              <div className="flex-1 flex items-end gap-2 px-4 py-3 rounded-xl border bg-backgroundSecondary border-borderColorPrimary transition-colors shadow-lg relative">
                <div className="flex justify-center items-center relative">
                    

                    <FileUploadButton
                    onUploadFromComputer={handleUploadFromComputer}
                    onUploadFromDrive={handleUploadFromDrive}
                    buttonIcon={
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 rounded-full focus-visible:outline-none"
                        >
                        <Plus className="absolute p-1 border border-borderColorPrimary -top-1 rounded-full h-8 w-8" />
                        </Button>
                    }
              />
                </div>
                
                <Textarea
                  ref={textareaRef}
                  placeholder="Describe your video..."
                  className="flex-1 bg-transparent border-0 outline-none text-base resize-none overflow-auto min-h-[2rem] max-h-[10rem] p-0 focus:border-0 focus:ring-0"
                  value={prompt}
                  onPaste={handlePaste}
                  onChange={(e) => {
                    e.target.style.height = 'inherit';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                    setPrompt(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  rows={1}
                  style={{
                    overflow: prompt.split('\n').length > 4 ? 'auto' : 'hidden',
                    scrollbarWidth: 'none',
                  }}
                />

                <MicButton isListening={isListening} onClick={toggleListening} 
                className={`rounded-full h-8 w-8 bg-bodyColor hover:bg-opacity-70 transition-all duration-200 text-white dark:text-black ${
                    prompt.trim()
                      && "hidden"
                      }`}
                />

                <div className="flex items-center gap-2">
                  <Button 
                    onClick={handleSubmit}
                    disabled={!prompt.trim() || loading || selectedModels.video.length < 2}
                    className={cn(
                      "rounded-xl px-4",
                      "transition-all duration-200",
                      prompt.trim() && selectedModels.video.length > 0
                        ? "bg-bodyColor hover:bg-opacity-70 transition-all duration-200"
                        : "bg-gray-300 text-gray-500 hover:bg-gray-300"
                    )}
                  >
                    Generate
                  </Button>
                </div>
              </div>
            </div>
            <AdvancedOptions />
          </div>
        </div>
      </div>
      <VideoSettingsInfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        settingType={currentSettingInfo}
      />
    </RenderPageContent>
  );
};

export default VideoArea;