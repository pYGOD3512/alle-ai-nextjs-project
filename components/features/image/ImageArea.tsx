"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { useContentStore, useSelectedModelsStore, useGeneratedImagesStore, useLikedMediaStore } from "@/stores";
import { Copy, Download, Share2, Heart, Plus, RefreshCcw, X, Loader } from "lucide-react";
import { toast } from "sonner"
import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShareDialog } from "@/components/ui/modals";

import { Skeleton as AntdSkeleton} from 'antd';
import { Button } from '@/components/ui/button';
import { chatApi, LikeState } from '@/lib/api/chat';
import { useConversationStore } from '@/stores/models';
import { useModelsStore } from '@/stores/models';
import { useParams } from 'next/navigation';

type SizeType = 'default' | 'small' | 'large';
type ButtonShapeType = 'circle' | 'square' | 'round' | 'default';
type AvatarShapeType = 'circle' | 'square';

interface GeneratedImageResponse {
  id: number;
  model_uid: string;
  response: string; // This is the image URL
  model_plan: string;
  input_cost: string;
  output_cost: string;
}

interface SelectedImage {
  modelId: string;
  imageUrl: string;
  liked?: boolean;
}

const RetryImageGeneration = ({ modelInfo, onRetry, isRetrying }: { 
  modelInfo: { name: string; icon: string; }; 
  onRetry: () => void;
  isRetrying?: boolean; 
}) => {
  return (
    <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-lg overflow-hidden bg-background/50">
      {/* Model Info Header */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/50 p-2 rounded-lg">
        <Image 
          src={modelInfo.icon ? modelInfo.icon : '/images/models/default.png'} 
          alt={modelInfo.name} 
          width={32}
          height={32}
          className="w-6 h-6 rounded-full"
        />
        <span className="text-white text-sm font-medium">
          {modelInfo.name}
        </span>
      </div>

      {/* Simple centered retry button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Button 
          onClick={onRetry}
          variant="secondary" 
          className="gap-2"
          disabled={isRetrying}
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
};

interface ImageResponse {
  modelId: string;
  imageUrl: string;
  liked: boolean;
  id?: number;
}

interface GeneratedImage {
  modelId: string;
  imageUrl: string;
  liked: boolean;
  id: number;
}

// Define the response structure from the API
interface LoadedImageResponse {
  prompt: string;
  prompt_id: number;
  responses: Array<{
    id: number | string; // Accept both number and string since API might return either
    model: {
      uid: string;
      name: string;
      image: string;
      model_plan: string;
    };
    body: string;
    liked: boolean | null;
  }>;
}

const PromptDisplay = ({ text, maxLength }: { text: string; maxLength: number }) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  const displayText = expanded ? text : text.substring(0, maxLength)
  
  return (
    <div className="flex flex-col">
      <div className="text-base">
        {displayText}
        <button
          onClick={toggleExpand}
          className="text-sm italic text-muted-foreground hover:text-primary/80 mt-1 self-start"
        >
          {expanded ? 'See less' : 'See more'}
        </button>
      </div>
    </div>
  );
};

const ImageArea = () => {
  const { content, setContent } = useContentStore();
  const { selectedModels, inactiveModels, setTempSelectedModels, saveSelectedModels, setLoadingLatest } = useSelectedModelsStore();
  const { conversationId, promptId, generationType, setConversationId } = useConversationStore();
  const { imageModels } = useModelsStore();
  const router = useRouter();
  const params = useParams();
  const loadConversationId = params.chatId as string;

  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [loadingModels, setLoadingModels] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [retryingModels, setRetryingModels] = useState<string[]>([]);
  const [imageModelsLoaded, setImageModelsLoaded] = useState(false);


  useEffect(() => {
    const generateImage = async (modelId: string) => {
      if (!conversationId || !promptId) return;
      
      try {
        const response = await chatApi.generateResponse({
          conversation: conversationId,
          model: modelId,
          is_new: true,
          prompt: promptId
        });

        if (response.status && response.data) {
          // Add the new image as soon as it's generated
          setGeneratedImages(prev => [...prev, {
            modelId: response.data.model_uid,
            imageUrl: response.data.response,
            liked: false,
            id: response.data.id
          }]);
        } else {
          setErrors(prev => ({
            ...prev,
            [modelId]: response.message || 'Failed to generate image'
          }));
        }
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          [modelId]: 'Failed to generate image'
        }));
      } finally {
        setLoadingModels(prev => prev.filter(id => id !== modelId));
      }
    };

    const handleInitialResponse = async () => {
      console.log('Hi');
      if (!conversationId || !promptId) {
        console.log('No conversationId or promptId');
        return;
      }
      
      const activeModels = selectedModels.image.filter(
        modelId => !inactiveModels.includes(modelId)
      );
      
      console.log('Active Models after filter:', activeModels);
      
      setLoadingModels(activeModels);
      setGeneratedImages([]);
      setErrors({});

      console.log('About to start image generation for models:', activeModels);
      
      activeModels.forEach(modelId => {
        generateImage(modelId);
      });
    };

    const loadConversation = async () => {
      if (!loadConversationId) {
        // console.log('no conversation id');
        return;
      }
      
      setConversationId(loadConversationId);     
      setIsLoadingConversation(true);
      setLoadingLatest(true);

      
      try {
        // console.log('Loading conversation content');
        const response = await chatApi.getConversationContent('image', loadConversationId);
        // console.log('Loaded conversation content:', response);
        
        if (response && response[0]?.prompt) {
          setContent("image", "input", response[0].prompt);
        }

        response.forEach(promptData => {
          const loadedImages: GeneratedImage[] = promptData.responses.map(resp => ({
            modelId: resp.model.uid,
            imageUrl: resp.body,
            liked: resp.liked ?? false,
            id: Number(resp.id)
          }));
          
          setGeneratedImages(prev => [...prev, ...loadedImages]);
        });

      } catch (error) {
        // console.error('Error loading conversation:', error);
        router.replace('/image');
        toast.error('Failed to load conversation');
      } finally {
        setIsLoadingConversation(false);
      }
    };

    if (generationType === 'new') {
      handleInitialResponse();
    } else if(generationType === 'load'){
      loadConversation();
    }
  }, []);

  useEffect(() => {
    // Check if chat models are loaded
    if (imageModels && imageModels.length > 0) {
      setImageModelsLoaded(true);
    }
  }, [imageModels]);

  useEffect(()=>{
    if (conversationId && generationType === 'load' && imageModelsLoaded) {
      getConversationModels(conversationId);
    }
  },[conversationId, generationType, imageModelsLoaded])

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [sharingImage, setSharingImage] = useState<{ url: string; modelName: string } | null>(null);

  const getConversationModels = (conversationId: string) => {
    chatApi.getModelsForConversation(conversationId)
      .then(response => {
        // // console.log('Models used in conversation:', response);
        const modelUids = response.map((model: any) => model.model_uid);
        setTempSelectedModels(modelUids);
        saveSelectedModels('image');

        // Toggle inactive models using toggleModelActive
        response.forEach((model: { model_uid: string, active: number }) => {
          if (model.active === 0) {
            useSelectedModelsStore.getState().toggleModelActive(model.model_uid);
          }
        });
      })
      .catch(error => {
        // console.error('Error fetching models for conversation:', error);
      })
      .finally(() => {
        setLoadingLatest(false);
      });
  };


  const handleImageClick = (image: GeneratedImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleLike = async (modelId: string, imageId: number) => {
    const image = selectedImage?.modelId === modelId ? 
      selectedImage : 
      generatedImages.find(img => img.modelId === modelId);
      
    const modelInfo = getModelInfo(modelId);
    const newLikedState: LikeState = image?.liked ? 'none' : 'liked';
    
    try {
      const response = await chatApi.updateLikeState(imageId.toString(), newLikedState);
      
      if (response.status) {
        // Update both generatedImages and selectedImage if open
        setGeneratedImages(prev => prev.map(img =>
          img.modelId === modelId ? { ...img, liked: !img.liked } : img
        ));

        // Update selectedImage if it's the same image
        if (selectedImage?.modelId === modelId) {
          setSelectedImage(prev => prev ? { ...prev, liked: !prev.liked } : null);
        }

        toast(`${modelInfo?.name} image ${newLikedState === 'liked' ? 'liked' : 'unliked'}`)
      } else {
        toast.error('Ooops! something went wrong')
      }
    } catch (error) {
      // console.error('Error updating like state:', error);
      toast.error('Ooops! something went wrong')

    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content.image.input);
    toast('Copied');
  };

  const handleDownload = async (imageUrl: string, modelName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${modelName}-generated-image.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast('Image downloaded');
    } catch (error) {
      // console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  const handleShareClick = (imageUrl: string, modelName: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSharingImage({ url: imageUrl, modelName });
    setIsShareDialogOpen(true);
  };

  const getModelInfo = (modelId: string) => {
    const model = imageModels.find(model => model.model_uid === modelId);
    return model ? {
      name: model.model_name,
      icon: model.model_image || '',
      provider: model.model_provider,
      type: model.model_plan
    } : null;
  };

  const handleRetry = async (modelId: string) => {
    if (!conversationId || !promptId) return;

    // Add model to loading state to show skeleton
    setLoadingModels(prev => [...prev, modelId]);
    setErrors(prev => ({ ...prev, [modelId]: '' }));
    setGeneratedImages(prev => prev.filter(img => img.modelId !== modelId));

    try {
      const response = await chatApi.generateResponse({
        conversation: conversationId,
        model: modelId,
        is_new: false,
        prompt: promptId
      });

      if (response.status && response.data) {
        setGeneratedImages(prev => [...prev, {
          modelId: response.data.model_uid,
          imageUrl: response.data.response,
          liked: false,
          id: response.data.id
        }]);
      } else {
        setErrors(prev => ({
          ...prev,
          [modelId]: response.message || 'Failed to generate image'
        }));
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        [modelId]: 'Failed to generate image'
      }));
    } finally {
      // Remove model from loading state
      setLoadingModels(prev => prev.filter(id => id !== modelId));
    }
  };

  const ImageSkeleton = ({ modelId }: { modelId: string }) => {
    const modelInfo = getModelInfo(modelId);
    console.log('modelInfo', modelInfo);

    return (
      <div className="relative w-80 h-80 lg:w-96 lg:h-96">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/5 p-2 rounded-lg">
          {modelInfo ? (
            <>
              <Image 
                src={modelInfo.icon ? modelInfo.icon : '/images/models/default.png'} 
                alt={modelInfo.name} 
                width={32}
                height={32}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-white text-sm font-medium">
                {modelInfo.name}
              </span>
            </>
          ) : (
            <>
              <AntdSkeleton.Avatar active size="small" className="w-6 h-6" />
              <AntdSkeleton.Button active size="small" className="!w-24 !min-w-0" />
            </>
          )}
        </div>

        <AntdSkeleton.Image 
          active={true} 
          className="!w-full !h-full !aspect-square"
          style={{
            width: '100%',
            height: '100%',
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex justify-end gap-3">
            {[1, 2, 3].map((i) => (
              <AntdSkeleton.Button 
                key={`${modelId}-btn-${i}`}
                active 
                size="small" 
                className="!w-9 !h-9 !min-w-0 !rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Only show the prompt section when not loading conversation */}
        {!isLoadingConversation && content.image.input && (
          <div className="flex items-start justify-around mb-8">
            <div className="">
              {content.image.input.length > 100 ? (
                <PromptDisplay text={content.image.input} maxLength={100} />
              ) : (
                <span className="text-base">{content.image.input}</span>
              )}
            </div>
            <div className="relative">
              <button
                onClick={handleCopy}
                className="flex items-center px-4 py-2 bg-background hover:bg-backgroundSecondary hover:border-borderColorPrimary text-foreground rounded-md transition-all duration-200"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Show loading state only when loading conversation */}
        {isLoadingConversation && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Loading content...</p>
            </div>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 max-[700px]:grid-cols-1 gap-y-4 lg:gap-x-6 justify-items-center">
          {generationType === 'new' ? (
            // For new generations, use selectedModels filter
            selectedModels.image
              .filter(modelId => !inactiveModels.includes(modelId))
              .map((modelId) => {
                const image = generatedImages.find(img => img.modelId === modelId);
                const isLoading = loadingModels.includes(modelId);
                const error = errors[modelId];
                const modelInfo = getModelInfo(modelId);
                console.log(selectedModels.image, 'the image selected models');
                console.log(generationType, 'This is the generation type');
                console.log(isLoading, 'This is isLoading');
                console.log(loadingModels, 'This is the loading models');

                if (isLoading) {
                  console.log('isLoading Images', isLoading);
                  return <ImageSkeleton key={modelId} modelId={modelId} />;
                }

                if (error) {
                  return (
                    <RetryImageGeneration
                      key={modelId}
                      modelInfo={modelInfo!}
                      onRetry={() => handleRetry(modelId)}
                      isRetrying={isLoading}
                    />
                  );
                }

                if (!image || !modelInfo) return null;

                return (
                  <div key={image.id} className="relative group">
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/50 p-2 rounded-lg select-none">
                      <Image 
                        src={modelInfo.icon ? modelInfo.icon : '/images/models/default.png'} 
                        alt={modelInfo.name} 
                        width={32}
                        height={32}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-white text-sm font-medium">
                        {modelInfo.name}
                      </span>
                    </div>

                    <div className="relative overflow-hidden rounded-lg">
                      <Image 
                        src={image.imageUrl ? image.imageUrl : '/images/models/default.png'}
                        alt={`Generated by ${modelInfo?.name}`}
                        width={400}
                        height={400}
                        className="w-80 h-80 lg:w-96 lg:h-96 rounded-lg transition-transform duration-300 group-hover:scale-105 hover:cursor-pointer"
                        onClick={() => handleImageClick(image)}
                      />

                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex justify-end gap-3">
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(image.modelId, image.id);
                            }}
                            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors focus-visible:outline-none"
                          >
                            <Heart 
                              className={`w-5 h-5 ${image.liked ? 'text-red-500 fill-red-500' : 'text-white'}`}
                            />
                          </Button>
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(image.imageUrl, modelInfo?.name || 'generated');
                            }} 
                            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors focus-visible:outline-none"
                          >
                            <Download className="w-5 h-5 text-white" />
                          </Button>
                          <Button 
                            onClick={(e) => handleShareClick(image.imageUrl, modelInfo?.name || 'generated', e)}
                            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors focus-visible:outline-none"
                          >
                            <Share2 className="w-5 h-5 text-white" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            // For loaded conversations, render all images directly
            generatedImages.map((image) => {
              const modelInfo = getModelInfo(image.modelId);
              
              return (
                <div key={image.id} className="relative group">
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/50 p-2 rounded-lg select-none">
                    <Image 
                      src={modelInfo?.icon ? modelInfo.icon : '/images/models/default.png'} 
                      alt={modelInfo?.name || ''} 
                      width={32}
                      height={32}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-white text-sm font-medium">
                      {modelInfo?.name}
                    </span>
                  </div>

                  <div className="relative overflow-hidden rounded-lg">
                    <Image 
                      src={image.imageUrl ? image.imageUrl : '/images/models/default.png'}
                      alt={`Generated by ${modelInfo?.name}`}
                      width={400}
                      height={400}
                      className="w-80 h-80 lg:w-96 lg:h-96 rounded-lg transition-transform duration-300 group-hover:scale-105 hover:cursor-pointer"
                      onClick={() => handleImageClick(image)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex justify-end gap-3">
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(image.modelId, image.id);
                          }}
                          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors focus-visible:outline-none"
                        >
                          <Heart 
                            className={`w-5 h-5 ${image.liked ? 'text-red-500 fill-red-500' : 'text-white'}`}
                          />
                        </Button>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(image.imageUrl, modelInfo?.name || 'generated');
                          }} 
                          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors focus-visible:outline-none"
                        >
                          <Download className="w-5 h-5 text-white" />
                        </Button>
                        <Button 
                          onClick={(e) => handleShareClick(image.imageUrl, modelInfo?.name || 'generated', e)}
                          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors focus-visible:outline-none"
                        >
                          <Share2 className="w-5 h-5 text-white" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleModalClose()}>
          <DialogContent 
            className="w-[90vw] h-[90vw] max-w-2xl max-h-[60vh] md:max-w-4xl md:max-h-[90vh] md:w-[80vh] md:h-[80vh] lg:w-[90vh] lg:h-[90vh] p-0 overflow-hidden border-none flex items-center justify-center"
          >
            <DialogHeader className="sr-only">
              <DialogTitle>Generated image</DialogTitle>
            </DialogHeader>
            
            {selectedImage && (
              <div className="relative w-full h-full group">
                {/* Image - Ensures it scales correctly */}
                <Image
                  src={selectedImage.imageUrl ? selectedImage.imageUrl : '/images/models/default.png'}
                  alt={`Generated by ${getModelInfo(selectedImage.modelId)?.name}`}
                  fill
                  className="object-contain"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* Top info */}
                  <div className="absolute top-0 left-0 right-0 p-6 flex items-center gap-3">
                    <Image 
                      src={getModelInfo(selectedImage.modelId)?.icon || ''}
                      alt={getModelInfo(selectedImage.modelId)?.name || ''}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-lg text-white">
                        {getModelInfo(selectedImage.modelId)?.name}
                      </h3>
                      <p className="text-sm text-white/80">
                        {getModelInfo(selectedImage.modelId)?.provider}
                      </p>
                    </div>
                  </div>

                  {/* Bottom controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white/90 mb-4 max-w-[80%]">{content.image.input}</p>
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => handleLike(selectedImage.modelId, selectedImage.id)}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors focus-visible:outline-none"
                      >
                        <Heart 
                          className={`w-5 h-5 ${selectedImage.liked ? 'text-red-500 fill-red-500' : 'text-white'}`}
                        />
                      </Button>
                      <Button 
                        onClick={() => handleDownload(selectedImage.imageUrl, getModelInfo(selectedImage.modelId)?.name || 'generated')}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors focus-visible:outline-none"
                      >
                        <Download className="w-5 h-5 text-white" />
                      </Button>
                      <Button 
                        onClick={() => handleShareClick(selectedImage.imageUrl, getModelInfo(selectedImage.modelId)?.name || 'generated')}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors focus-visible:outline-none"
                      >
                        <Share2 className="w-5 h-5 text-white" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
      {sharingImage && (
        <ShareDialog
          isOpen={isShareDialogOpen}
          onClose={() => {
            setIsShareDialogOpen(false);
            setSharingImage(null);
          }}
          imageUrl={sharingImage.url}
          modelName={sharingImage.modelName}
        />
      )}
    </div>
  );
};

export default ImageArea;