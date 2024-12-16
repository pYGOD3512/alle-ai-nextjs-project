"use client";
import RenderPageContent from "@/components/RenderPageContent";
import GreetingMessage from "@/components/features/GreetingMessage";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelectedModelsStore } from "@/lib/constants";
import AdvancedOptions from "@/components/features/video/AdvancedOptions";
import { useHistoryStore } from "@/lib/constants";
import { useRouter } from "next/navigation";
interface VideoSettings {
  aspectRatio: "16:9" | "1:1" | "9:16";
  quality: "480p" | "720p" | "1080p";
  duration: number;
  display: "column" | "grid" | "carousel";
}

function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [prompt, setPrompt] = useState("");
  const { selectedModels } = useSelectedModelsStore();
  const { addHistory } = useHistoryStore();
  const router = useRouter();
  const [currentSettingInfo, setCurrentSettingInfo] = useState<
    "aspectRatio" | "quality" | "duration" | "display"
  >("aspectRatio");
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [settings, setSettings] = useState<VideoSettings>({
    aspectRatio: "16:9",
    quality: "720p",
    duration: 10,
    display: "grid",
  });
  const showSettingInfo = (
    setting: "aspectRatio" | "quality" | "duration" | "display"
  ) => {
    setCurrentSettingInfo(setting);
    setInfoModalOpen(true);
  };
  const handleSubmit = () => {
    if (!prompt) return;
    const chatId = crypto.randomUUID();

    router.push(`/video/res/${chatId}`);
    addHistory({ title: prompt, type: "video", generateId: chatId });
  };
  return (
    <RenderPageContent>
      <div className="flex flex-col h-full">
        <div className="flex-1"> {children} </div>
        <div className="max-w-6xl mx-auto p-4">
          {pathname === "/video" ? (
            <GreetingMessage
              username="christmas"
              questionText="Ready to create your next video masterpiece?"
            />
          ) : (
            ""
          )}
        </div>
        {/* prompt section */}
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
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      !prompt.trim() || selectedModels.video.length === 0
                    }
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
            <AdvancedOptions
              onShowSettingInfo={showSettingInfo}
              settings={settings}
              onSettingsChange={setSettings}
            />
          </div>
        </div>
      </div>
    </RenderPageContent>
  );
}

export default Layout;
