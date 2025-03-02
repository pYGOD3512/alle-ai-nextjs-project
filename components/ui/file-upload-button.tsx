'use client'; 

import { Plus, HardDrive, Cloud } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GoogleDriveModal } from "@/components/ui/modals";
import { driveService } from '@/lib/services/driveServices';
import { validateFile } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast"; 
import { dropboxService } from "@/lib/services/dropboxServices";
import { oneDriveService, OneDriveResponse } from '@/lib/services/onedriveServices';

interface FileUploadButtonProps {
  onUploadFromComputer: () => void;
  onUploadFromDrive: (file: File) => void; 
  buttonIcon?: React.ReactNode;
}

interface DriveFile { 
  id: string;
  name: string;
  type: 'folder' | 'file';
  mimeType: string;
  size?: string;
  thumbnailUrl?: string;
}

export function FileUploadButton({ 
  onUploadFromComputer, 
  onUploadFromDrive,
  buttonIcon
}: FileUploadButtonProps) {
  const [showDriveModal, setShowDriveModal] = useState(false);
  const { toast } = useToast();

  const handleDriveFileSelect = async (file: DriveFile) => {
    try {
      // Create a placeholder for loading state
      const placeholderBlob = new Blob([], { type: file.mimeType });
      const placeholderUrl = URL.createObjectURL(placeholderBlob);
      
      const placeholderFile = new File([placeholderBlob], file.name, { 
        type: file.mimeType 
      });

      // Show loading state
      onUploadFromDrive(placeholderFile);

      // Get gapi instance and access token
      const gapi = driveService.getGapi();
      if (!gapi) {
        throw new Error('Google Drive API not initialized');
      }
      const accessToken = gapi.auth.getToken().access_token;
      
      // Special handling for PDFs
      const isPDF = file.mimeType === 'application/pdf';
      console.log('Downloading file:', { name: file.name, type: file.mimeType, isPDF });

      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': file.mimeType
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
      }

      // Get the file data as ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();
      console.log('File downloaded, size:', arrayBuffer.byteLength);

      // For PDFs, verify the file signature
      if (isPDF) {
        const firstBytes = new Uint8Array(arrayBuffer.slice(0, 5));
        const pdfSignature = String.fromCharCode(...firstBytes);
        if (pdfSignature !== '%PDF-') {
          throw new Error('Invalid PDF file format');
        }
      }

      // Create a regular File object
      const driveFile = new File(
        [arrayBuffer], 
        file.name, 
        { type: file.mimeType }
      );

      console.log('File created:', { 
        name: driveFile.name, 
        type: driveFile.type, 
        size: driveFile.size 
      });

      // Validate the file
      const validation = validateFile(driveFile);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Clean up placeholder
      URL.revokeObjectURL(placeholderUrl);

      // Process file exactly like a local file
      onUploadFromDrive(driveFile);
      setShowDriveModal(false);

      toast({
        title: "File Processed",
        description: `${file.name} has been added successfully`,
      });
    } catch (error) {
      console.error('Error processing Drive file:', error);
      // Add more detailed error information
      const errorMessage = error instanceof Error 
        ? `${error.message}\n${error.stack}` 
        : "Failed to process file";
      console.error('Detailed error:', errorMessage);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process file"
      });
    }
  };

  const handleDropboxSelect = async () => {
    try {
      dropboxService.openChooser({
        success: async (files) => {
          if (files && files.length > 0) {
            const file = files[0];
            
            // Create a placeholder for loading state
            const placeholderBlob = new Blob([], { type: getMimeType(file.name) });
            const placeholderUrl = URL.createObjectURL(placeholderBlob);
            
            const placeholderFile = new File([placeholderBlob], file.name, { 
              type: getMimeType(file.name)
            });

            // Show loading state
            onUploadFromDrive(placeholderFile);

            try {
              // Download the actual file
              const response = await fetch(file.link);
              if (!response.ok) {
                throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
              }

              // Get the file data as ArrayBuffer
              const arrayBuffer = await response.arrayBuffer();
              console.log('File downloaded, size:', arrayBuffer.byteLength);

              // Create a regular File object
              const dropboxFile = new File(
                [arrayBuffer], 
                file.name, 
                { type: getMimeType(file.name) }
              );

              // Validate the file
              const validation = validateFile(dropboxFile);
              if (!validation.isValid) {
                throw new Error(validation.error);
              }

              // Clean up placeholder
              URL.revokeObjectURL(placeholderUrl);

              // Process file
              onUploadFromDrive(dropboxFile);

              toast({
                title: "File Processed",
                description: `${file.name} has been added successfully`,
              });
            } catch (error) {
              throw error;
            }
          }
        },
        cancel: () => {
          toast({
            title: "Cancelled",
            description: `File upload cancelled`,
          });
        },
        linkType: 'direct',
        multiselect: false,
        folderselect: false,
        extensions: ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.webp'],
        sizeLimit: 100 * 1024 * 1024 // 100MB
      });
    } catch (error) {
      console.error('Error processing Dropbox file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process file"
      });
    }
  };

  const handleOneDriveSelect = () => {
    toast({
      title: "Almost There",
      description: "Client ID required",
    });
  }
  
  const getMimeType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'txt': 'text/plain',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp'
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {buttonIcon ? buttonIcon : (
            <Button variant="ghost2" className="flex-shrink-0 focus-visible:outline-none border-none p-0" aria-label="Upload File">
              <Plus size={28} className="border border-borderColorPrimary rounded-full p-[0.3rem]" />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 bg-backgroundSecondary border-borderColorPrimary">
          <DropdownMenuItem 
            onClick={() => setShowDriveModal(true)} 
            className="gap-2"
          >
            <Image 
              src={'/icons/google-drive.png'}
              alt="google-drive-logo"
              width={100}
              height={100}
              className="w-4 h-4"
            />
            <span>Add from Google Drive</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleDropboxSelect} 
            className="gap-2"
          >
            <Image 
              src="/icons/dropbox.png"
              alt="dropbox-logo"
              width={100}
              height={100}
              className="w-4 h-4"
            />
            <span>Add from Dropbox</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOneDriveSelect} className="gap-2">
            <Image 
              src="/icons/onedrive.png" 
              alt="OneDrive" 
              width={100} 
              height={100} 
              className="w-4 h-4"
            />
            <span>Add from OneDrive</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onUploadFromComputer} className="gap-2">
            <HardDrive className="h-4 w-4" />
            <span>Upload from computer</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <GoogleDriveModal 
        isOpen={showDriveModal} 
        onClose={() => setShowDriveModal(false)}
        onFileSelect={handleDriveFileSelect}
      />
    </>
  );
}