"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { ArrowUp, Paperclip, Globe , X, Layers, FileText, Scale } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner"

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
import { useSelectedModelsStore, useWebSearchStore, useCombinedModeStore, useCompareModeStore } from "@/stores";
import { ModelSelectionModal, PromptModal } from "@/components/ui/modals";
import { ContentLengthWarning } from "../ui/content-length-warning";
import { useModelsStore } from "@/stores/models";


import { useSettingsStore } from "@/stores";
import { useAuthStore } from "@/stores";
import { PlansModal } from "@/components/ui/modals";
import { chatApi } from "@/lib/api/chat";
import { useTheme } from "next-themes";

import { sendGAEvent } from '@next/third-parties/google'
import { LatencyWarning } from "../ui/latency-warning";

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (fileContent?: {
    uploaded_files: Array<{
      file_name: string;
      file_size: string;
      file_type: string;
      file_content: string;
    }>;
  }) => void;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
  isLoading: boolean;
  isSending?: boolean;
  isWeb?: boolean;
  isCombined?: boolean;
  onWebSearchToggle?: (enabled: boolean) => void;
  onCombinedToggle?: (enabled: boolean) => void;
  disableCombined?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  inputRef,
  isLoading,
  isSending,
  isWeb,
  isCombined,
  onWebSearchToggle,
  onCombinedToggle,
  disableCombined
}: ChatInputProps) {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const { isWebSearch, setIsWebSearch } = useWebSearchStore();
  const { isCombinedMode, setIsCombinedMode } = useCombinedModeStore();
  const { isCompareMode, setIsCompareMode } = useCompareModeStore();
  const { selectedModels, inactiveModels, isLoadingLatest } = useSelectedModelsStore();
  const [showModelPrompt, setShowModelPrompt] = useState(false);
  const { chatModels, setChatModels, setLoading: setModelsLoading, setError: setModelsError } = useModelsStore();
  const [modelSelectionModalOpen, setModelSelectionModalOpen] = useState(false);
  const [fileContent, setFileContent] = useState<{
    uploaded_files: Array<{
      file_name: string;
      file_size: string;
      file_type: string;
      file_content: any;
    }>;
  } | null>(null);
  const [showCombinedPrompt, setShowCombinedPrompt] = useState(false);
  const [contentPercentage, setContentPercentage] = useState<number>(0);
  const [incompatibleModels, setIncompatibleModels] = useState<string[]>([]);
  const [incompatibleModelNames, setIncompatibleModelNames] = useState<string[]>([]);

  

  const pathname = usePathname();

  const { isListening, toggleListening } = useSpeechRecognition({
    onTranscript: onChange,
    inputRef
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_CONTENT_LENGTH = 27000;
  const IMAGE_COMPATIBLE_MODELS = [
    'gpt-4o',
    'gemini-1-5-pro',
    'gemini-2-0-flash',
    'gpt-4',
    'gpt-4-5',
    'gpt-4o-mini',
    'grok-2-vision',
    'claude-3-7-sonnet'
  ];

  const { personalization, setPersonalizationSetting } = useSettingsStore();
  const { plan, user } = useAuthStore();
  const isFreeUser = plan === 'free' || !plan;
  const [showSummaryPrompt, setShowSummaryPrompt] = useState(false);
  const [plansModalOpen, setPlansModalOpen] = useState(false);
  const [promptConfig, setPromptConfig] = useState<any>(null);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const getRandomDelay = () => Math.random() * 8;

  const { theme, resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const [showLatencyWarning, setShowLatencyWarning] = useState(false);
  const [activeFeature, setActiveFeature] = useState<'combine' | 'compare' | null>(null);

  useEffect(() => {
    if ((pathname === '/chat' || pathname === '/image') && inputRef?.current) {
      inputRef.current.focus();
    }
  }, [pathname]);

  useEffect(() => {
    // Only check if there's an uploaded image file
    if (uploadedFile && uploadedFile.type.startsWith('image/')) {
      // Get active models (models that are selected but not inactive)
      const activeModelIds = selectedModels.chat.filter(
        modelId => !inactiveModels.includes(modelId)
      );
      
      // Find which active models don't support images
      const incompatibleModelsList = activeModelIds.filter(
        modelId => !IMAGE_COMPATIBLE_MODELS.includes(modelId)
      );
      
      // Update state with incompatible models
      setIncompatibleModels(incompatibleModelsList);
      
      // Get model names for display
      const modelNames = incompatibleModelsList.map(modelId => {
        const model = chatModels.find(m => m.model_uid === modelId);
        return model?.model_name || modelId;
      });

      setIncompatibleModelNames(modelNames);
    } else {
      // Clear incompatible models if no image is uploaded
      setIncompatibleModels([]);
      setIncompatibleModelNames([]);
    }
  }, [uploadedFile, selectedModels.chat, inactiveModels, chatModels, toast]);

  // Function to check if all active models support image uploads
  const checkImageCompatibility = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setIncompatibleModels([]);
      return { compatible: true, incompatibleModels: [] };
    }
    
    // Get active models (models that are selected but not inactive)
    const activeModelIds = selectedModels.chat.filter(
      modelId => !inactiveModels.includes(modelId)
    );
    
    // Find which active models don't support images
    const incompatibleModelsList = activeModelIds.filter(
      modelId => !IMAGE_COMPATIBLE_MODELS.includes(modelId)
    );

    setIncompatibleModels(incompatibleModelsList);
    
    return {
      compatible: incompatibleModelsList.length === 0,
      incompatibleModels: incompatibleModelsList
    };
  };
  

  const calculateContentPercentage = (fileContent: any = '', textareaContent: string = ''): number => {
    // If there's no content, return 0
    if (!fileContent && !textareaContent) return 0;
    
      // If fileContent is a File object (image), don't include it in calculation
    if (fileContent instanceof File) {
      return Math.round((textareaContent.length / MAX_CONTENT_LENGTH) * 100);
    }
  
    // For string content
    if (typeof fileContent === 'string') {
      const contentToCount =  fileContent;
      const totalLength = contentToCount.length + textareaContent.length;
      return Math.round((totalLength / MAX_CONTENT_LENGTH) * 100);
    }

    // Default case - just count the textarea content
    return Math.round((textareaContent.length / MAX_CONTENT_LENGTH) * 100);
  };


  // effect to watch both content sources
  useEffect(() => {
    const fileContentLength = fileContent?.uploaded_files?.[0]?.file_content?.length || 0;
    const textareaContentLength = value.length;
    const newPercentage = calculateContentPercentage(
      fileContent?.uploaded_files?.[0]?.file_content || '',
      value
    );
    setContentPercentage(newPercentage);
  }, [fileContent, value]);

  // Add this helper function to check if content is over limit
  const isContentOverLimit = (percentage: number): boolean => {
    return percentage > 100;
  };

  // Add this helper function at the top of your file
  function generateUUID(): string {
  // Check if native crypto.randomUUID is available
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  
  // Fallback implementation for browsers without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

  const handlePaste = async (event: React.ClipboardEvent) => {
    if(pathname.includes('/image')) return;

    const items = event.clipboardData.items;
    
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        event.preventDefault();
        
        const file = item.getAsFile();
        if (!file) continue;

        const validation = validateFile(file);
        if (!validation.isValid) {
          toast.error(`Error ${validation.error}`);
          return;
        }

        try {
          const fileUrl = URL.createObjectURL(file);
          
          if (uploadedFile?.url) {
            URL.revokeObjectURL(uploadedFile.url);
          }

          const newUploadedFile: UploadedFile = {
            id: generateUUID(),
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

          await handleProcessFile(file, text);

          toast.success('file uploaded');
        } catch (error) {
          if (uploadedFile?.url) {
            URL.revokeObjectURL(uploadedFile.url);
          }
          setUploadedFile(prev => prev ? { ...prev, status: 'error' } : null);
          toast.error(`${error instanceof Error ? error.message : "Failed to upload file"}`);
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
        toast.error(`${validation.error}`);

        return;
      }

      const compatibility = checkImageCompatibility(file);
      // console.log("Initial compatibility check:", compatibility);

      const fileUrl = URL.createObjectURL(file);
      
      if (uploadedFile?.url) {
        URL.revokeObjectURL(uploadedFile.url);
      }

      const newUploadedFile: UploadedFile = {
        id: generateUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl,
        status: 'loading',
        progress: 0,
        timestamp: Date.now()
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

        clearInterval(progressInterval);
        
        setUploadedFile(prev => 
          prev ? { ...prev, progress: 100 } : null
        );

        await new Promise(resolve => setTimeout(resolve, 500));
        setUploadedFile(prev => 
          prev ? { ...prev, status: 'ready' } : null
        );

        await handleProcessFile(file, text);

      toast.success(`file uploaded`);

      }
    } catch (error) {
      if (uploadedFile?.url) {
        URL.revokeObjectURL(uploadedFile.url);
      }
      setUploadedFile(prev => prev ? { ...prev, status: 'error' } : null);
      toast.error(`${error instanceof Error ? error.message : "Failed to upload file"}`);

    }
  };
  

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      toast.error(`${validation.error}`);

      return;
    }

    // Check image compatibility
    const compatibility = checkImageCompatibility(file);
    // console.log("Initial compatibility check:", compatibility);

    try {
      const { text } = await processFile(file);
      const processedContent = await handleProcessFile(file, text);
      // console.log('uploaded file content is', processedContent);

      const fileUrl = URL.createObjectURL(file);
      
      if (uploadedFile?.url) {
        URL.revokeObjectURL(uploadedFile.url);
      }

      const newUploadedFile: UploadedFile = {
        id: generateUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl,
        status: 'loading',
        progress: 0,
        timestamp: Date.now()
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

      clearInterval(progressInterval);
      
      setUploadedFile(prev => 
        prev ? { ...prev, progress: 100 } : null
      );

      await new Promise(resolve => setTimeout(resolve, 500));
      setUploadedFile(prev => 
        prev ? { ...prev, status: 'ready' } : null
      );

      toast.success(`file uploaded`);

    } catch (error) {
      if (uploadedFile?.url) {
        URL.revokeObjectURL(uploadedFile.url);
      }
      setUploadedFile(prev => prev ? { ...prev, status: 'error' } : null);
      toast.error(`${error instanceof Error ? error.message : "Failed to upload file"}`);
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
    setFileContent(null);
    setContentPercentage(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
    sendGAEvent('buttonClick', 'toggleFeature', { featureName: 'Web-Search', status: newValue});

    
    // If enabling web search, disable combined mode
    // if (newValue && isCombinedMode) {
    //   setIsCombinedMode(false);
    //   onCombinedToggle?.(false);
    // }
    
    onWebSearchToggle?.(newValue);
  };

  const handleCombinedToggle = () => {
    // Check for minimum active models before enabling combined mode
    if (!isCombinedMode && activeModelsCount < 2) {
      setShowCombinedPrompt(true);
      return;
    }

    const newValue = !isCombinedMode;
    sendGAEvent('buttonClick', 'toggleFeature', { featureName: 'Combine', status: newValue});

    // If enabling combined mode, disable web search and compare mode
    if (newValue) {
      // if (isWebSearch) {
      //   setIsWebSearch(false);
      //   onWebSearchToggle?.(false);
      // }
      if (isCompareMode) {
        setIsCompareMode(false);
      }
    }
    
    setIsCombinedMode(newValue);
    onCombinedToggle?.(newValue);
  };

  const handleSendClick = () => {
    if ((pathname === "/chat" && selectedModels.chat.length < 2) || (pathname === "/image" && selectedModels.image.length < 2) ) {
      setShowModelPrompt(true);
      return;
    }
    onSend(fileContent || undefined);
    handleRemoveFile();
    
    // Reset textarea height to default state
    if (inputRef?.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleProcessFile = async (file: File, text: string) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isImage = file.type.startsWith('image/') || 
                 /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$/i.test(file.name);

    const fileTypeForBackend = isImage ? "image" : (fileExtension || 'unknown');

    let fileContent: any;

    // Calculate content percentage for non-image files
    if (isImage) {
      fileContent = file;
      setContentPercentage(0);
    } else {
      fileContent = text;
      const percentage = calculateContentPercentage(text, value);
      setContentPercentage(percentage);
    }

    const content = {
      uploaded_files: [{
        file_name: file.name,
        file_size: `${(file.size / 1024).toFixed(1)}KB`,
        file_type: fileTypeForBackend,
        file_content: fileContent,
      }]
    };

    setFileContent(content);
    return content; 
  };

    // Determine current content type based on pathname
    const getCurrentType = (): 'chat' | 'image' | 'audio' | 'video' => {
      if (pathname.startsWith('/image')) return 'image';
      if (pathname.startsWith('/audio')) return 'audio';
      if (pathname.startsWith('/video')) return 'video';
      return 'chat';
    };
  
    // Here we get the history of the various pages
    const currentType = getCurrentType();
  
    // Add this helper function to get section-specific styles
    const getSectionStyles = (type: 'chat' | 'image' | 'audio' | 'video') => {
      switch (type) {
        case 'image':
          return {
            bgColor: 'bg-purple-500/10',
            hoverBg: 'hover:bg-purple-500/20',
            iconColor: 'text-purple-500'
          };
        case 'audio':
          return {
            bgColor: 'bg-blue-500/10',
            hoverBg: 'hover:bg-blue-500/20',
            iconColor: 'text-blue-500'
          };
        case 'video':
          return {
            bgColor: 'bg-yellow-500/10',
            hoverBg: 'hover:bg-yellow-500/20',
            iconColor: 'text-yellow-500'
          };
        default:
          return {
            bgColor: 'bg-green-500/10',
            hoverBg: 'hover:bg-green-500/20',
            iconColor: 'text-green-500'
          };
      }
    };

  // Calculate active models count
  const activeModelsCount = selectedModels.chat.filter(
    modelId => !inactiveModels.includes(modelId)
  ).length;

  // Add an effect to monitor active models count
  useEffect(() => {
    if (isCombinedMode && activeModelsCount < 2) {
      // Automatically disable combined mode
      setIsCombinedMode(false);
      onCombinedToggle?.(false);
      
      // Show notification
      toast.warning('Combine disabled: Minimum of 2 active models required');
    }
  }, [activeModelsCount, isCombinedMode, onCombinedToggle]);

  const handleSummaryToggle = () => {
    if (!isCompareMode && activeModelsCount < 2) {
      setShowSummaryPrompt(true);
      return;
    }

    if (isFreeUser) {
      setPromptConfig({
        title: "Upgrade Required",
        message: "Please upgrade your plan to enable the Compare feature.",
        actions: [
          {
            label: "Upgrade Plan",
            onClick: () => {
              setShowPromptModal(false);
              setPlansModalOpen(true)
            },
            variant: "outline"
          },
        ],
      });
      setShowPromptModal(true);
      return;
    }

    // Toggle the compareMode state immediately
    const newValue = !isCompareMode;
    
    // If enabling compare mode, disable combined mode
    if (newValue && isCombinedMode) {
      setIsCombinedMode(false);
      onCombinedToggle?.(false);
    }
    
    setIsCompareMode(newValue);
    sendGAEvent('buttonClick', 'toggleFeature', { featureName: 'Comparison', status: newValue});
  };

  // Add this effect to handle latency warning
  useEffect(() => {
    if (isWebSearch && (isCombinedMode || isCompareMode)) {
      setActiveFeature(isCombinedMode ? 'combine' : 'compare');
      setShowLatencyWarning(true);
      
      // Hide warning after 5 seconds
      const timer = setTimeout(() => {
        setShowLatencyWarning(false);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowLatencyWarning(false);
    }
  }, [isWebSearch, isCombinedMode, isCompareMode]);

  return (
    <>
      <div className="p-2 bg-background/95 backdrop-blur transition-all duration-300">
        {uploadedFile && (
          <div className="max-w-xl md:max-w-3xl mx-auto mb-2">
            <FilePreview file={uploadedFile} onRemove={handleRemoveFile} />
          </div>
        )}

        <div className="max-w-xl md:max-w-3xl mx-auto">
          {contentPercentage > 100 && (
            <ContentLengthWarning percentage={contentPercentage} />
          )}

          {/* Show incompatible models warning if needed */}
          {uploadedFile?.type.startsWith('image/') && incompatibleModels.length > 0 && (
            <ContentLengthWarning 
              type="incompatible-models"
              message="The following models don't support image uploads:"
              models={incompatibleModelNames}
            />
          )}

          {showLatencyWarning && activeFeature && (
            <LatencyWarning isVisible={showLatencyWarning} feature={activeFeature} />
          )}

          <div className="flex flex-col p-3 border dark:border-none shadow-xl bg-background dark:bg-backgroundSecondary rounded-3xl focus-within:border-borderColorPrimary">
            <Textarea 
              ref={inputRef}
              placeholder={"Message multiple models..."}
              className={`w-full bg-transparent ${(pathname === '/chat' || pathname === '/image') ? 'min-h-[3.5rem]': 'min-h-[3rem]' }  max-h-[10rem] border-none text-base resize-none focus-visible:outline-none overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300`}
              value={value}
              onChange={(e) => {
                const target = e.target;
                target.style.height = 'auto';
                const newHeight = Math.min(target.scrollHeight, 150);
                target.style.height = `${newHeight}px`;
                onChange(e.target.value);
                const fileContentLength = fileContent?.uploaded_files?.[0]?.file_content?.length || 0;
                const newPercentage = calculateContentPercentage(
                  fileContent?.uploaded_files?.[0]?.file_content || '',
                  e.target.value
                );
                setContentPercentage(newPercentage);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !isInputEmpty && !isLoading && !isSending && contentPercentage < 100 && incompatibleModels.length < 1) {
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
            
            <div className="flex items-center justify-between px-3">
              <div className="flex items-center gap-1">
                {pathname.startsWith('/chat') && 
                  <FileUploadButton
                    onUploadFromComputer={handleUploadFromComputer}
                    onUploadFromDrive={handleUploadFromDrive}
                    disabled={isWebSearch}
                  />
                }
                
                {isWeb && (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          disabled={isLoading || !!uploadedFile || isLoadingLatest || isSending}
                          onClick={handleWebSearchToggle}
                          className={`relative flex items-center gap-1 rounded-full transition-all duration-300 p-[0.4rem] ${
                            isWebSearch 
                              ? `border border-green-500/10 ${getSectionStyles(currentType).bgColor} ${getSectionStyles(currentType).iconColor}  hover:bg-green-500/20`
                              : 'border border-borderColorPrimary text-muted-foreground hover:text-foreground'
                          } ${!!uploadedFile ? 'opacity-50 cursor-pointer' : ''}`}
                        >
                          <Globe size={16} />
                          {isWebSearch ? <span className="text-[0.8rem]">Search</span> : ''}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {!!uploadedFile 
                          ? <p>Web search disabled for file upload</p>
                          : <p>{isWebSearch ? "Search the web" : "Search the web"}</p>
                        }
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {isCombined && (
                <>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          disabled={isLoading || isSending || isLoadingLatest}
                          onClick={handleCombinedToggle}
                          className={`relative flex items-center gap-1 rounded-full transition-all duration-300 p-[0.4rem] overflow-hidden ${
                            isCombinedMode 
                              ? `border border-green-500/10 ${getSectionStyles(currentType).bgColor} ${getSectionStyles(currentType).iconColor}  hover:bg-green-500/20`
                              : 'border border-borderColorPrimary text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <Layers size={16} />
                          <span className="text-[0.8rem]">Combine</span>
                          
                          {/* Add the animation effect when combined mode is active */}
                          {(
                            <motion.div 
                              className={`absolute inset-0 bg-gradient-to-r ${
                                isDarkMode 
                                  ? "from-transparent via-white/10 to-transparent" 
                                  : "from-transparent via-black/5 to-transparent"
                              }`}
                              initial={{ x: "-100%", opacity: 0 }}
                              animate={{ x: "100%", opacity: [0, 1, 0] }}
                              transition={{ 
                                repeat: Infinity, 
                                repeatDelay:  getRandomDelay(),
                                duration: 2,  // Slower animation
                                ease: "easeInOut" 
                              }}
                            />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isCombinedMode ? "Combine selected models" : "Combine selected models"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          disabled={isLoading || isSending || isLoadingLatest}
                          onClick={handleSummaryToggle}
                          className={`relative flex items-center gap-1 rounded-full transition-all duration-300 p-[0.4rem] overflow-hidden ${
                            isCompareMode 
                              ? `border border-green-500/10 ${getSectionStyles(currentType).bgColor} ${getSectionStyles(currentType).iconColor} hover:bg-green-500/20`                              : 'border border-borderColorPrimary text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {(
                            <motion.div 
                              className={`absolute inset-0 bg-gradient-to-r ${
                                isDarkMode 
                                  ? "from-transparent via-white/10 to-transparent" 
                                  : "from-transparent via-black/5 to-transparent"
                              }`}
                              initial={{ x: "-100%", opacity: 0 }}
                              animate={{ x: "100%", opacity: [0, 1, 0] }}
                              transition={{ 
                                repeat: Infinity, 
                                repeatDelay:  getRandomDelay(),
                                duration: 2,  // Slower animation
                                ease: "easeInOut" 
                              }}
                            />
                          )}
                          <Scale size={18} className="" />
                          <span className="text-[0.8rem]">Compare</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isCompareMode ? "Compare AI models" : "Compare AI models"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
                )}
                
              </div>

              <div className="flex items-center gap-2">
                <MicButton 
                  isListening={isListening} 
                  onClick={toggleListening}
                  className={`text-white dark:text-black bg-bodyColor hover:bg-opacity-70 transition-all duration-200 
                    ${ !isInputEmpty && ""}
                      `}
                />
                
                <Button
                  onClick={handleSendClick}
                  size= {pathname.startsWith('/chat') ? `icon` : `default`}
                  className={`flex-shrink-0 h-9 ${pathname.startsWith('/chat') ? "rounded-full w-9" : "rounded-full"} ${
                    isInputEmpty
                      ? ""
                      : "bg-bodyColor hover:bg-opacity-70 transition-all duration-200"
                  }`}
                  disabled={isInputEmpty || isLoading || isSending || isLoadingLatest || isContentOverLimit(contentPercentage) || (uploadedFile?.type.startsWith('image/') && 
                    incompatibleModels.length > 0)}
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

        {pathname.startsWith("/chat/res") && (
            <FooterText />
        )}      </div>

      <PromptModal
        isOpen={showModelPrompt}
        onClose={() => setShowModelPrompt(false)}
        title="No Models Selected"
        message="Please select at least 2 models to start a conversation"
        metadata={{
          link: {
            text: "Learn why",
            url: "/collection/3742473-others/models-selection"
          }
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

      <PromptModal
        isOpen={showCombinedPrompt}
        onClose={() => setShowCombinedPrompt(false)}
        title="NOTICE"
        message="At least 2 active models are required to generate summary and combined responses on Alle-AI."
        actions={[
          {
            label: "Ok",
            onClick: () => setShowCombinedPrompt(false),
            variant: "default"
          }
        ]}
      />

      <PromptModal
        isOpen={showSummaryPrompt}
        onClose={() => setShowSummaryPrompt(false)}
        title="NOTICE"
        message="At least 2 active models are required to enable summary feature on Alle-AI."
        actions={[
          {
            label: "Ok",
            onClick: () => setShowSummaryPrompt(false),
            variant: "default"
          }
        ]}
      />

      <ModelSelectionModal
        isOpen={modelSelectionModalOpen}
        onClose={() => setModelSelectionModalOpen(false)}
      />

      <PlansModal
        isOpen={plansModalOpen}
        onClose={() => setPlansModalOpen(false)}
      />

      {promptConfig && (
        <PromptModal
          isOpen={showPromptModal}
          onClose={() => setShowPromptModal(false)}
          {...promptConfig}
        />
      )}
    </>
  );
}

