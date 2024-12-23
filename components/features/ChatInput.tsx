"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { ArrowUp, Paperclip, Mic, MicOff } from "lucide-react";
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
}

export function ChatInput({
  value,
  onChange,
  onSend,
  inputRef,
  isLoading,
}: ChatInputProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const { toast } = useToast();

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
        status: 'loading'
      };

      setUploadedFile(newUploadedFile);

      // If this is the actual file (not placeholder), process it
      if (file.size > 0) {
        // Process the file
        const { text } = await processFile(file);
        console.log('content', text);

        // Update status to ready
        setUploadedFile(prev => prev ? { ...prev, status: 'ready' } : null);

        toast({
        title: "File Processed",
        description: `${file.name} has been added successfully`,
        className: "bg-toastBackgroundColor border-borderColorPrimary text-foreground"
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
        status: 'loading'
      };

      setUploadedFile(newUploadedFile);

      // Process the file
      const { text } = await processFile(file);

      console.log('content', text )
      // Update file status to ready
      setUploadedFile(prev => prev ? { ...prev, status: 'ready' } : null);

      toast({
        title: "File Processed",
        description: `${file.name} has been added successfully`,
        className: "bg-toastBackgroundColor border-borderColorPrimary text-foreground"
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
      // Remove file reference from input value
      const fileText = `[File: ${uploadedFile.name}] `;
      const newValue = value.replace(fileText, '').trim();
      onChange(newValue);
      
      // Cleanup URL and reset state
      URL.revokeObjectURL(uploadedFile.url);
      setUploadedFile(null);
    }
  };

  // Here we cleanup blob URL when component unmounts or file changes
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
    }, 5000); // Change text every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const isInputEmpty = value.trim() === "";

  return (
    <div className={` p-2 bg-background/95 backdrop-blur transition-all duration-300`}>
      {uploadedFile && (
        <div className="max-w-xl md:max-w-3xl mx-auto mb-2">
          <FilePreview 
            file={uploadedFile} 
            onRemove={handleRemoveFile} 
          />
        </div>
      )}
      <div className="max-w-xl md:max-w-3xl mx-auto flex items-end gap-1 border-2 rounded-2xl p-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept={Object.entries(ALLOWED_FILE_TYPES)
            .flatMap(([, exts]) => exts)
            .join(',')}
        />
        
        <FileUploadButton
          onUploadFromComputer={handleUploadFromComputer}
          onUploadFromDrive={handleUploadFromDrive}
        />

        <Textarea 
          ref={inputRef}
          placeholder="Message multiple models..."
          className="flex-1 bg-transparent border-0 outline-none text-base resize-none overflow-auto min-h-[2rem] max-h-[10rem] p-0 focus:border-0 focus:ring-0"
          value={value}
          onChange={(e) => {
            e.target.style.height = 'inherit';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
            onChange(e.target.value);
          }}
          onKeyDown={(e) => e.key === "Enter" && !isInputEmpty && onSend()}
          rows={1}
          style={{
            overflow: value.split('\n').length > 4 ? 'auto' : 'hidden',
            scrollbarWidth: 'none',
          }}
        />
        <MicButton isListening={isListening} onClick={toggleListening} />
        {/* conditional rendering */}
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
            className={`flex-shrink-0 rounded-md select-none ${
              isInputEmpty
                ? "bg-gray-300 text-gray-500 hover:bg-gray-300"
                : "bg-bodyColor hover:bg-opacity-70 transition-all duration-200"
            }`}
            disabled={isInputEmpty || isLoading }
          >
            Generate
          </Button>
        )}
      </div>
      {/* conditional rendering */}
      {pathname === "/" || pathname.startsWith("/chat") ? (
        <div className="h-6 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-center text-[0.6rem] sm:text-xs mt-2 absolute w-full"
            >
              {texts[textIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
