"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { useContentStore, useSelectedModelsStore, useGeneratedImagesStore, useLikedMediaStore } from "@/stores";
import { Copy, Download, Share2, Heart, Plus } from "lucide-react";
import { IMAGE_MODELS } from '@/lib/constants';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShareDialog } from "@/components/ui/modals";

import { Skeleton as AntdSkeleton} from 'antd';
import { Button } from '@/components/ui/button';

type SizeType = 'default' | 'small' | 'large';
type ButtonShapeType = 'circle' | 'square' | 'round' | 'default';
type AvatarShapeType = 'circle' | 'square';

interface ImageResponse {
  modelId: string;
  imageUrl: string;
  liked?: boolean;
}

interface SelectedImage {
  modelId: string;
  imageUrl: string;
  liked?: boolean;
}

const ImageArea = () => {
  const { content } = useContentStore();
  const { selectedModels } = useSelectedModelsStore();
  const { images, lastPrompt, setImages, updateImage, setLastPrompt } = useGeneratedImagesStore();
  const { addLikedMedia, removeLikedMedia } = useLikedMediaStore();
  
  const [loading, setLoading] = useState(() => {
    return !lastPrompt || lastPrompt !== content.image.input;
  });

  const { toast } = useToast();
  const [active, setActive] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [sharingImage, setSharingImage] = useState<{ url: string; modelName: string } | null>(null);

  useEffect(() => {
    if (content.image.input) {
      // We check local storage to see if we have images for that section (here used prompt to test the efficiency) then we load it
      if (lastPrompt === content.image.input && images.length > 0) {
        setLoading(false);
        return;
      }

      
      setLoading(true);
      setImages([]);
      
      setTimeout(() => {
        const simulatedResponses = selectedModels.image.map(modelId => ({
          modelId,
          imageUrl: `/images/${modelId}.jpg`,
          liked: false
        }));
        
        setImages(simulatedResponses);
        setLastPrompt(content.image.input);
        setLoading(false);
      }, 2000);
    }
  }, [content.image.input, selectedModels.image]);

  const handleLike = (modelId: string, isModal: boolean = false) => {
    const image = images.find(img => img.modelId === modelId);
    const modelInfo = getModelInfo(modelId);
    const newLikedState = !image?.liked;
    
    // Update local state
    updateImage(modelId, { liked: newLikedState });
    
    if (isModal && selectedImage) {
      setSelectedImage({
        ...selectedImage,
        liked: newLikedState
      });
    }

    if (newLikedState) {
      // Add to liked media store
      addLikedMedia({
        type: 'image',
        url: image?.imageUrl || '',
        modelName: modelInfo?.name || '',
        modelIcon: modelInfo?.icon || '',
        modelId: modelId,
        prompt: content.image.input,
        liked: true
      });

      toast({
        title: "Liked",
        description: `${modelInfo?.name} image liked`,
        duration: 3000,
        className: "bg-toastBackgroundColor border-borderColorPrimary text-foreground"
      });
    } else {
      // Remove from liked media store - find the image's ID first
      const likedItems = useLikedMediaStore.getState().getLikedMediaByType('image');
      const likedItem = likedItems.find(item => 
        item.modelId === modelId && 
        item.url === image?.imageUrl
      );
      if (likedItem) {
        removeLikedMedia(likedItem.id);
      }

      toast({
        title: "Unliked",
        description: `${modelInfo?.name} image unliked`,
        duration: 3000,
        className: "bg-toastBackgroundColor border-borderColorPrimary text-foreground"
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content.image.input);
    toast({
      title: "Copied",
      description: "Image URL copied to clipboard",
      duration: 3000,
      className: "bg-toastBackgroundColor border-borderColorPrimary text-foreground"
    });
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

      toast({
        title: "Success",
        description: "Image downloaded successfully",
        duration: 3000,
        className: "bg-toastBackgroundColor border-borderColorPrimary text-foreground"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
        duration: 3000,
        className: "bg-toastBackgroundColor border-borderColorPrimary text-foreground"
      });
    }
  };

  const handleShareClick = (imageUrl: string, modelName: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSharingImage({ url: imageUrl, modelName });
    setIsShareDialogOpen(true);
  };

  const getModelInfo = (modelId: string) => {
    return IMAGE_MODELS.find(model => model.id === modelId);
  };

  const handleImageClick = (image: ImageResponse) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const ImageSkeleton = ({ modelId }: { modelId: string }) => (
    <div className="relative w-80 h-80 lg:w-96 lg:h-96">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/5 p-2 rounded-lg">
        <AntdSkeleton.Avatar active size="small" className="w-6 h-6" />
        <AntdSkeleton.Button active size="small" className="!w-24 !min-w-0" />
      </div>

      <AntdSkeleton.Image 
        active={active} 
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

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-around mb-8">
          <span className="text-base">{content.image.input}</span>
          <div className="relative">
            <button
              onClick={handleCopy}
              className="flex items-center px-4 py-2 bg-background hover:bg-backgroundSecondary hover:border-borderColorPrimary text-foreground rounded-md transition-all duration-200"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 max-[700px]:grid-cols-1 gap-y-4 lg:gap-x-6 justify-items-center">
          {loading ? (
            selectedModels.image.map((modelId) => (
              <ImageSkeleton key={modelId} modelId={modelId} />
            ))
          ) : (
            images.map((image) => {
              const modelInfo = getModelInfo(image.modelId);
              return (
                <div key={image.modelId} className="relative group">
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/50 p-2 rounded-lg select-none">
                    <Image 
                      src={modelInfo?.icon || ''} 
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
                      src={image.imageUrl}
                      alt={`Generated by ${modelInfo?.name}`}
                      width={400}
                      height={400}
                      className="w-80 h-80 lg:w-96 lg:h-96 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105 hover:cursor-pointer"
                      onClick={() => handleImageClick(image)}
                    />

                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex justify-end gap-3">
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(image.modelId);
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
          <DialogContent className="max-w-[1000px] w-[90vw]">
            <DialogHeader>
              <DialogTitle className="sr-only">
                Image Details
              </DialogTitle>
            </DialogHeader>
            {selectedImage && (
              <div className="flex gap-8 max-lg:flex-col">
                <div className="flex-1">
                  <div className="relative">
                    <Image
                      src={selectedImage.imageUrl}
                      alt={`Generated by ${getModelInfo(selectedImage.modelId)?.name}`}
                      width={500}
                      height={500}
                      className="w-full h-auto rounded-lg"
                    />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="flex justify-end gap-3">
                        <Button 
                          onClick={() => handleLike(selectedImage.modelId, true)}
                          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors focus-visible:outline-none"
                        >
                          <Heart 
                            className={`w-5 h-5 ${selectedImage.liked ? 'text-red-500 fill-red-500' : 'text-white'}`}
                          />
                        </Button>
                        <Button 
                          onClick={() => handleDownload(
                            selectedImage.imageUrl, 
                            getModelInfo(selectedImage.modelId)?.name || 'generated'
                          )}
                          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors focus-visible:outline-none"
                        >
                          <Download className="w-5 h-5 text-white" />
                        </Button>
                        <Button 
                          onClick={(e) => handleShareClick(selectedImage.imageUrl, getModelInfo(selectedImage.modelId)?.name || 'generated', e)}
                          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors focus-visible:outline-none"
                        >
                          <Share2 className="w-5 h-5 text-white" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Image 
                        src={getModelInfo(selectedImage.modelId)?.icon || ''}
                        alt={getModelInfo(selectedImage.modelId)?.name || ''}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="font-medium text-lg">
                          {getModelInfo(selectedImage.modelId)?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {getModelInfo(selectedImage.modelId)?.provider}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Prompt</h4>
                      <p className="text-sm text-muted-foreground">{content.image.input}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Details</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Resolution: 1024 x 1024</p>
                        <p>Generated: {new Date().toLocaleDateString()}</p>
                        <p>Model Type: {getModelInfo(selectedImage.modelId)?.type}</p>
                      </div>
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