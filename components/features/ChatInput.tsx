"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { ArrowUp, Paperclip, Globe , X } from "lucide-react";
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
import { FooterText } from "../FooterText";
import { useSelectedModelsStore } from "@/stores";
import { ModelSelectionModal, PromptModal } from "@/components/ui/modals";

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
  onWebSearchToggle?: (enabled: boolean) => void;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  inputRef,
  isLoading,
  isWeb,
  onWebSearchToggle
}: ChatInputProps) {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const { toast } = useToast();
  const [isWebSearch, setIsWebSearch] = useState(false);
  const { selectedModels } = useSelectedModelsStore();
  const [showModelPrompt, setShowModelPrompt] = useState(false);
  const [modelSelectionModalOpen, setModelSelectionModalOpen] = useState(false);


  const pathname = usePathname();

  const { isListening, toggleListening } = useSpeechRecognition({
    onTranscript: onChange,
    inputRef
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const isInputEmpty = value.trim() === "";

  const handleWebSearchToggle = () => {
    const newValue = !isWebSearch;
    setIsWebSearch(newValue);
    onWebSearchToggle?.(newValue);
    toast({
      title: newValue ? "Web Search Enabled" : "Web Search Disabled",
      description: newValue 
        ? "Your messages will now include web search results"
        : "Messages will be processed without web search",
    });
  };

  const handleSendClick = () => {
    if ((pathname === "/chat" && selectedModels.chat.length < 2) || (pathname === "/image" && selectedModels.image.length < 2) ) {
      setShowModelPrompt(true);
      return;
    }
    onSend();
  };

  return (
    <>
      <div className="p-2 bg-background/95 backdrop-blur transition-all duration-300">
        {uploadedFile && (
          <div className="max-w-xl md:max-w-3xl mx-auto mb-2">
            <FilePreview file={uploadedFile} onRemove={handleRemoveFile} />
          </div>
        )}
        
        <div className="max-w-xl md:max-w-3xl mx-auto">
          <div className="flex flex-col p-1 border bg-backgroundSecondary border-borderColorPrimary rounded-xl focus-within:border-borderColorPrimary">
            <Textarea 
              ref={inputRef}
              placeholder={"Message multiple models..."}
              className="w-full bg-transparent min-h-[2rem] max-h-[10rem] border-none text-base resize-none focus-visible:outline-none overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300"
              value={value}
              onChange={(e) => {
                const target = e.target;
                target.style.height = 'auto';
                const newHeight = Math.min(target.scrollHeight, 150);
                target.style.height = `${newHeight}px`;
                onChange(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !isInputEmpty) {
                  e.preventDefault();
                  handleSendClick();
                  if (inputRef?.current) {
                    inputRef.current.style.height = 'auto';
                  }
                }
              }}
              onPaste={handlePaste}
              rows={1}
              style={{
                overflowY: value.split('\n').length > 4 || (inputRef?.current?.scrollHeight || 0) > 150 ? 'auto' : 'hidden'
              }}
            />
            
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <FileUploadButton
                  onUploadFromComputer={handleUploadFromComputer}
                  onUploadFromDrive={handleUploadFromDrive}
                />
                
                {isWeb && (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleWebSearchToggle}
                          className={`relative flex items-center gap-1 rounded-full transition-all duration-300 px-2 py-1 ${
                            isWebSearch 
                              ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <Globe size={16} />
                          <span className="text-xs">
                            {isWebSearch ? "Web search" : ""}
                          </span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isWebSearch ? "Web search enabled" : "Enable web search"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              <div className="flex items-center gap-2">
                <MicButton 
                  isListening={isListening} 
                  onClick={toggleListening}
                  className={`text-white dark:text-black bg-bodyColor hover:bg-opacity-70 transition-all duration-200 ${
                    !isInputEmpty
                      && "hidden"
                      }`}
                />
                
                <Button
                  onClick={handleSendClick}
                  size= {pathname.startsWith('/chat') ? `icon` : `default`}
                  className={`flex-shrink-0 ${pathname.startsWith('/chat') ? "rounded-full h-8 w-8" : "rounded-md"} ${
                    isInputEmpty
                      ? "bg-gray-300 text-gray-500 hover:bg-gray-300"
                      : "bg-bodyColor hover:bg-opacity-70 transition-all duration-200"
                  }`}
                  disabled={isInputEmpty || isLoading}
                >
                  {pathname.startsWith('/chat') ? <ArrowUp className="h-4 w-4" /> : 'Generate' }
                </Button>
              </div>
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

        {pathname.startsWith("/chat") && (
            <FooterText />
        )}
      </div>

      <PromptModal
        isOpen={showModelPrompt}
        onClose={() => setShowModelPrompt(false)}
        title="No Models Selected"
        message="Please select at least 2 models to start a conversation"
        metadata={{
          // link: {
          //   text: "Learn why",
          //   url: "/hub/getting-started"
          // }
        }}
        actions={[
          {
            label: "Close",
            onClick: () => setShowModelPrompt(false),
            variant: "outline"
          },
          {
            label: "Select Models",
            onClick: () => {
              setShowModelPrompt(false);
              setModelSelectionModalOpen(true)
            },
            variant: "default"
          }
        ]}
      />

      <ModelSelectionModal
        isOpen={modelSelectionModalOpen}
        onClose={() => setModelSelectionModalOpen(false)}
      />
    </>
  );
}
