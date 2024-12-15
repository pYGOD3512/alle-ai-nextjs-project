"use client";
import RenderPageContent from "@/components/RenderPageContent";
import GreetingMessage from "@/components/features/GreetingMessage";
import { usePathname } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Upload, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContentStore } from "@/stores";
import { useHistoryStore } from "@/lib/constants";
import { useRouter } from "next/navigation";
export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const { setContent } = useContentStore();

  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [credits, setCredits] = useState(50);
  const { addHistory } = useHistoryStore();

  const handleSubmit = async () => {
    if (!description) return;
    // testid
    setContent("audio", "input", description);
    const chatId = crypto.randomUUID();
    setDescription("");
    router.push(`/audio/res/${chatId}`);
    addHistory({ title: description, type: "audio" });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
        handleSubmit(); 
    }
  };
  return (
    <RenderPageContent>
      <div className="max-w-7xl w-full mx-auto mt-10 flex flex-col h-full transition-all duration-300">
        <div className="flex flex-col transition-all duration-300 mx-auto w-full sm:w-2/3 md:w-2/3 lg:w-1/2 h-[calc(100svh-14rem)] my-auto">
          {pathname === "/audio" ? (
            <GreetingMessage
              username="Christmas"
              questionText=" What sound are you thinking of today?"
            />
          ) : (
            ""
          )}

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

        <div className="flex-1"> {children} </div>
      </div>
    </RenderPageContent>
  );
}
