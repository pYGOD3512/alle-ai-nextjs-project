"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { ArrowUp, Paperclip, Mic, MicOff, Globe , X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "../ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { MicButton } from "@/components/ui/MicButton";
import { FileUploadButton } from "@/components/ui/file-upload-button";
import { UploadedFile } from "@/lib/types";
import { ALLOWED_FILE_TYPES, validateFile } from "@/lib/utils";
import { FilePreview } from "../ui/file-preview";
import { processFile } from '@/lib/fileProcessing';
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
  isLoading: boolean;
  isWeb?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  inputRef,
  isLoading,
  isWeb,
}: ChatInputProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const { toast } = useToast();
  const [isWebSearch, setIsWebSearch] = useState(false);

  const { isListening, toggleListening } = useSpeechRecognition({
    onTranscript: onChange,
    inputRef
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadFromComputer = () => {
    fileInputRef.current?.click();
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

      let progress = 0;
      const progressInterval = setInterval(() => {
        const increment = Math.max(1, (90 - progress) / 10);
        progress = Math.min(90, progress + increment);
        
        setUploadedFile(prev => 
          prev ? { ...prev, progress } : null
        );
      }, 100);

      if (file.size > 0) {
        const { text } = await processFile(file);
        console.log('content', text);

        clearInterval(progressInterval);
        
        setUploadedFile(prev => 
          prev ? { ...prev, progress: 100 } : null
        );

        await new Promise(resolve => setTimeout(resolve, 500));
        setUploadedFile(prev => 
          prev ? { ...prev, status: 'ready' } : null
        );

        toast({
          title: "File Processed",
          description: `${file.name} has been added successfully`,
        });
      }
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

      let progress = 0;
      const progressInterval = setInterval(() => {
        const increment = Math.max(1, (90 - progress) / 10);
        progress = Math.min(90, progress + increment);
        
        setUploadedFile(prev => 
          prev ? { ...prev, progress } : null
        );
      }, 100);

      const { text } = await processFile(file);
      console.log('content', text);

      clearInterval(progressInterval);
      
      setUploadedFile(prev => 
        prev ? { ...prev, progress: 100 } : null
      );

      await new Promise(resolve => setTimeout(resolve, 500));
      setUploadedFile(prev => 
        prev ? { ...prev, status: 'ready' } : null
      );

      toast({
        title: "File Processed",
        description: `${file.name} has been added successfully`,
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
  };

  const handleRemoveFile = () => {
    if (uploadedFile?.url) {
      const fileText = `[File: ${uploadedFile.name}] `;
      const newValue = value.replace(fileText, '').trim();
      onChange(newValue);
      
      URL.revokeObjectURL(uploadedFile.url);
      setUploadedFile(null);
    }
  };

  useEffect(() => {
    return () => {
      if (uploadedFile?.url) {
        URL.revokeObjectURL(uploadedFile.url);
      }
    };
  }, []);

  const texts = [
    "Your all-in-one AI Platform",
    "Alle-AI: Combine and compare AI models",
    "Alle-AI: Explore innovative AI solutions",
  ];
  const pathname = usePathname();
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((current) => (current + 1) % texts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const isInputEmpty = value.trim() === "";

  const handleWebSearchToggle = () => {
    setIsWebSearch(!isWebSearch);
    toast({
      title: isWebSearch ? "Web Search Disabled" : "Web Search Enabled",
      description: isWebSearch 
        ? "Messages will be processed without web search" 
        : "Your messages will now include web search results",
    });
  };

  return (
    <div className="p-2 bg-background/95 backdrop-blur transition-all duration-300">
      {uploadedFile && (
        <div className="max-w-xl md:max-w-3xl mx-auto mb-2">
          <FilePreview file={uploadedFile} onRemove={handleRemoveFile} />
        </div>
      )}
      
      <div className="max-w-xl md:max-w-3xl mx-auto">
        <div className="flex items-end gap-2 px-4 py-3 rounded-xl bg-backgroundSecondary border border-borderColorPrimary shadow-lg relative">
          <div className="flex gap-1">
            <FileUploadButton
              onUploadFromComputer={handleUploadFromComputer}
              onUploadFromDrive={handleUploadFromDrive}
            />
            
            {isWeb && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleWebSearchToggle}
                      className={`relative flex items-center gap-1.5 rounded-full transition-all duration-300 px-1 ${
                        isWebSearch 
                          ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Globe size={16} />
                      {isWebSearch && (
                        <span className="text-xs">
                            Search
                        </span>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isWebSearch ? "Web search enabled" : "Enable web search"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="flex-1 relative">
            <Textarea 
              ref={inputRef}
              placeholder={"Message multiple models..."}
              className="flex-1 bg-transparent border-0 outline-none text-base resize-none overflow-auto min-h-[2rem] max-h-[10rem] p-0 focus:border-0 focus:ring-0 scrollbar-thin scrollbar-thumb-gray-300"
              value={value}
              onChange={(e) => {
                e.target.style.height = 'inherit';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                onChange(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !isInputEmpty) {
                  e.preventDefault();
                  onSend();
                  if (inputRef?.current) {
                    inputRef.current.style.height = 'inherit';
                  }
                }
              }}
              rows={1}
              style={{
                overflow: value.split('\n').length > 4 ? 'auto' : 'hidden',
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <MicButton 
              isListening={isListening} 
              onClick={toggleListening}
              className="text-muted-foreground hover:text-foreground transition-colors"
            />
            
            {pathname === "/" || pathname.startsWith("/chat") ? (
              <Button
                onClick={onSend}
                size="icon"
                className={`flex-shrink-0 rounded-full h-8 w-8 ${
                  isInputEmpty
                  ? "bg-gray-300 text-gray-500 hover:bg-gray-300"
                  : "bg-bodyColor hover:bg-opacity-70 transition-all duration-200"
                }`}
                disabled={isInputEmpty}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={onSend}
                className={`flex-shrink-0 rounded-md ${
                  isInputEmpty || isLoading
                    ? "bg-gray-300 text-gray-500 hover:bg-gray-300"
                    : "bg-bodyColor hover:bg-opacity-70 transition-all duration-200"
                }`}
                disabled={isInputEmpty || isLoading}
              >
                Generate
              </Button>
            )}
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
        </div>
      </div>

      {(pathname === "/" || pathname.startsWith("/chat")) && (
        <div className="h-6 relative overflow-hidden mt-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-center text-[0.6rem] sm:text-xs absolute w-full text-muted-foreground"
            >
              {texts[textIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
