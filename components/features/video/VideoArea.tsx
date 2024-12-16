"use client";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useContentStore } from "@/stores";
import { useSelectedModelsStore, VIDEO_MODELS } from "@/lib/constants";
import RenderPageContent from "@/components/RenderPageContent";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { VideoSettingsInfoModal } from "@/components/ui/modals";
import { Progress } from "@/components/ui/progress";
import { useLikedMediaStore } from "@/lib/constants";

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
    setIsFullscreen,
  };
};

const VideoResponse = React.memo(
  ({
    video,
    onLike,
    onNext,
    onPrevious,
    hasNext,
    hasPrevious,
  }: {
    video: VideoResponse;
    onLike: (video: VideoResponse) => void;
    onNext?: () => void;
    onPrevious?: () => void;
    hasNext?: boolean;
    hasPrevious?: boolean;
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
      setIsFullscreen,
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

      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
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
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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

    const modelInfo = VIDEO_MODELS.find((m) => m.id === video.modelId);
    if (!modelInfo) return null;

    return (
      <div
        ref={containerRef}
        className="relative group rounded-lg overflow-hidden bg-black"
      >
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
            <div className="relative cursor-pointer" onClick={handleSeek}>
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
  }
);
VideoResponse.displayName = "VideoResponse";

const VideoArea = () => {
  const { content } = useContentStore();
  const { selectedModels } = useSelectedModelsStore();
  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [settings, setSettings] = useState<VideoSettings>({
    aspectRatio: "16:9",
    quality: "720p",
    duration: 10,
    display: "grid",
  });
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [currentSettingInfo, setCurrentSettingInfo] = useState<
    "aspectRatio" | "quality" | "duration" | "display"
  >("aspectRatio");
  const { addLikedMedia, removeLikedMedia } = useLikedMediaStore();

  

  const handleLike = useCallback(
    (video: VideoResponse) => {
      const newVideos = [...videos];
      const index = newVideos.findIndex((v) => v.modelId === video.modelId);
      const modelInfo = VIDEO_MODELS.find((m) => m.id === video.modelId);
      const newLikedState = !video.liked;
      newVideos[index].liked = newLikedState;
      setVideos(newVideos);

      if (newLikedState) {
        // Add to liked media store
        addLikedMedia({
          type: "video",
          url: video.videoUrl,
          modelName: modelInfo?.name || "",
          modelIcon: modelInfo?.icon || "",
          modelId: video.modelId,
          prompt: prompt,
          liked: true,
        });

        toast({
          title: "Video Liked",
          description: `You liked ${modelInfo?.name}'s video generation`,
        });
      } else {
        // Remove from liked media store - find the video's ID first
        const likedItems = useLikedMediaStore
          .getState()
          .getLikedMediaByType("video");
        const likedItem = likedItems.find(
          (item) =>
            item.modelId === video.modelId && item.url === video.videoUrl
        );
        if (likedItem) {
          removeLikedMedia(likedItem.id);
        }

        toast({
          title: "Video Unliked",
          description: `You unliked ${modelInfo?.name}'s video generation`,
        });
      }
    },
    [videos, toast, addLikedMedia, removeLikedMedia, prompt]
  );

  useEffect(() => {
    // Create a mapping of model IDs to specific videos
    const modelVideoMap: Record<string, string> = {
      sora: "/videos/video1.mp4",
      runway: "/videos/video2.mp4",
      luma: "/videos/video3.mp4",
      kling: "/videos/video4.mp4",
      "animate-diff": "/videos/video5.mp4",
    };

    // Simulate API call
    setTimeout(() => {
      // Create responses only for selected models with their assigned videos
      const simulatedResponses: VideoResponse[] = selectedModels.video.map(
        (modelId) => ({
          modelId,
          // Use the specific video for each model
          videoUrl: modelVideoMap[modelId],
          liked: false,
        })
      );

      setVideos(simulatedResponses);
      setLoading(false);
    }, 3000);
  }, [prompt, selectedModels.video]);

  const handleNext = useCallback(
    (currentIndex: number) => {
      const filteredVideos = videos.filter((video) =>
        VIDEO_MODELS.find((m) => m.id === video.modelId)
      );
      if (currentIndex < filteredVideos.length - 1) {
        return filteredVideos[currentIndex + 1];
      }
      return null;
    },
    [videos]
  );

  const handlePrevious = useCallback(
    (currentIndex: number) => {
      const filteredVideos = videos.filter((video) =>
        VIDEO_MODELS.find((m) => m.id === video.modelId)
      );
      if (currentIndex > 0) {
        return filteredVideos[currentIndex - 1];
      }
      return null;
    },
    [videos]
  );

  return (
    <div className="flex-1">
      <div className="flex flex-col h-full">
        {/* Video Display Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="max-w-6xl mx-auto p-4">
              <div
                className={cn(
                  settings.display === "grid"
                    ? "grid grid-cols-2 gap-6"
                    : settings.display === "carousel"
                    ? "relative"
                    : "space-y-6"
                )}
              >
                {loading ? (
                  // Show skeletons only for valid selected models
                  selectedModels.video
                    .filter((modelId) =>
                      VIDEO_MODELS.find((m) => m.id === modelId)
                    )
                    .map((_, i) => <VideoSkeleton key={i} />)
                ) : settings.display === "carousel" ? (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {videos
                        .filter((video) =>
                          VIDEO_MODELS.find((m) => m.id === video.modelId)
                        )
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
                    .filter((video) =>
                      VIDEO_MODELS.find((m) => m.id === video.modelId)
                    )
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
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
      <VideoSettingsInfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        settingType={currentSettingInfo}
      />
    </div>
  );
};

export default VideoArea;
