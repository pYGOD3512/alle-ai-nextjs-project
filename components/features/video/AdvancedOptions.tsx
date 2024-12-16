import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  RectangleHorizontal,
  RectangleVertical,
  Square,
  TvMinimalPlay,
  Clock8,
  GalleryVerticalEnd,
  Grid2x2,
  GalleryHorizontal,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoSettings {
  aspectRatio: "16:9" | "1:1" | "9:16";
  quality: "480p" | "720p" | "1080p";
  duration: number;
  display: "column" | "grid" | "carousel";
}

interface AdvancedOptionsProps {
  settings: VideoSettings;
  onSettingsChange: (settings: Partial<VideoSettings>) => void;
  onShowSettingInfo: (setting: keyof VideoSettings) => void;
}

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({
  settings,
  onSettingsChange,
  onShowSettingInfo,
}) => {
  // Format duration to MM:SS
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Duration options in seconds
  const durations = [5, 10, 15, 30, 60, 120];

  return (
    <div className="flex items-center justify-center gap-6 mt-4">
      {/* Aspect Ratio Dropdown */}
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
              onClick={() => onShowSettingInfo("aspectRatio")}
            >
              <Info className="h-3 w-3" />
            </Button>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={settings.aspectRatio}
            onValueChange={(value) =>
              onSettingsChange({
                aspectRatio: value as VideoSettings["aspectRatio"],
              })
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

      {/* Quality Dropdown */}
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
              onClick={() => onShowSettingInfo("quality")}
            >
              <Info className="h-3 w-3" />
            </Button>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={settings.quality}
            onValueChange={(value) =>
              onSettingsChange({ quality: value as VideoSettings["quality"] })
            }
          >
            <DropdownMenuRadioItem value="480p">
              480p - SD
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="720p">
              720p - HD
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="1080p">
              1080p - FHD
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Duration Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex gap-2 h-10 px-4 rounded-xl border-2 transition-all duration-200 group border-muted text-muted-foreground hover:bg-accent/50"
            )}
          >
            <Clock8 className="h-4 w-4" />
            <span className="font-medium">
              {formatDuration(settings.duration)}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="flex items-center justify-between">
            Duration
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 rounded-full hover:bg-accent/50"
              onClick={() => onShowSettingInfo("duration")}
            >
              <Info className="h-3 w-3" />
            </Button>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={settings.duration.toString()}
            onValueChange={(value) =>
              onSettingsChange({ duration: parseInt(value) })
            }
          >
            {durations.map((duration) => (
              <DropdownMenuRadioItem key={duration} value={duration.toString()}>
                {formatDuration(duration)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Display Layout Dropdown */}
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
              {settings.display === "column"
                ? "Column"
                : settings.display === "grid"
                ? "Grid"
                : "Carousel"}
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
              onClick={() => onShowSettingInfo("display")}
            >
              <Info className="h-3 w-3" />
            </Button>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={settings.display}
            onValueChange={(value) =>
              onSettingsChange({ display: value as VideoSettings["display"] })
            }
          >
            <DropdownMenuRadioItem value="column" className="gap-2">
              <GalleryVerticalEnd className="w-4 h-4" />
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
};

export default AdvancedOptions;
