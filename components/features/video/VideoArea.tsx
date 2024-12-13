"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useContentStore } from "@/stores";
import { useSelectedModelsStore, VIDEO_MODELS } from "@/lib/constants";
import RenderPageContent from "@/components/RenderPageContent";
import { Plus, Copy, Info, Play, Pause, Volume2, VolumeX, Maximize2, Download, Heart, Grid2x2, RectangleHorizontal, TvMinimalPlay, RectangleVertical, Square, GalleryHorizontal, GalleryVerticalEnd, Clock8   } from "lucide-react";
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
import { cn } from "@/lib/utils";
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

const VideoResponse = React.memo(({ video, onLike }: { 
  video: VideoResponse, 
  onLike: (video: VideoResponse) => void 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    isPlaying,
    setIsPlaying,
    isMuted,
    setIsMuted,
    isFullscreen,
    setIsFullscreen
  } = useVideoControls();

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
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="w-full h-full"
        onEnded={() => setIsPlaying(false)}
        loop
      />
      
      {/* Overlay Container */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300">
        {/* Top Controls - Model Info */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center gap-1">
          <div className="h-8 w-8 rounded-full backdrop-blur-sm flex items-center justify-center overflow-hidden">
            <Image
              src={modelInfo.icon}
              alt={modelInfo.name}
              width={20}
              height={20}
              className="object-contain rounded-full"
            />
          </div>
          <span className="font-medium text-white text-sm backdrop-blur-sm px-2 py-1 rounded-full bg-white/10">
            {modelInfo.name}
          </span>
        </div>

        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-2">
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

          <div className="flex-1" />

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
  );
});
VideoResponse.displayName = 'VideoResponse';

const VideoArea = () => {
  const { content } = useContentStore();
  const { selectedModels } = useSelectedModelsStore();
  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasResponse, setHasResponse] = useState(false);
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [settings, setSettings] = useState<VideoSettings>({
    aspectRatio: "16:9",
    quality: "720p",
    duration: 10,
    display: "grid",
  });
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [currentSettingInfo, setCurrentSettingInfo] = useState<'aspectRatio' | 'quality' | 'duration' | 'display'>('aspectRatio');

  const showSettingInfo = (setting: 'aspectRatio' | 'quality' | 'duration' | 'display') => {
    setCurrentSettingInfo(setting);
    setInfoModalOpen(true);
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
    newVideos[index].liked = !video.liked;
    setVideos(newVideos);
    
    if (newVideos[index].liked) {
      toast({
        title: "Video Liked",
        description: `You liked ${modelInfo?.name}'s video generation`,
      });
    } else {
      toast({
        title: "Video Unliked",
        description: `You unliked ${modelInfo?.name}'s video generation`,
      });
    }
  }, [videos, toast]);

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
                    username="Christmas" 
                    questionText="Ready to create your next video masterpiece?"
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
                            .map((video, index) => (
                              <CarouselItem key={index}>
                                <div className="rounded-lg overflow-hidden">
                                  <VideoResponse video={video} onLike={handleLike} />
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
                        .map((video, index) => (
                          <div key={index} className="rounded-lg overflow-hidden">
                            <VideoResponse video={video} onLike={handleLike} />
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
            <div className="relative flex items-center gap-2 mb-2">
              <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl border border-borderColorPrimary transition-colors">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-accent/50"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <input
                  type="text"
                  placeholder="Describe your video..."
                  className="flex-1 bg-transparent outline-none text-base"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={handleSubmit}
                    disabled={!prompt.trim() || selectedModels.video.length === 0}
                    className={cn(
                      "rounded-xl px-6",
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