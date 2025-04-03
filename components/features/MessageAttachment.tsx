"use client";

import { useState } from "react";
import Image from "next/image";
import { FileIcon, X, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MessageAttachmentProps {
  file: {
    name: string;
    type: string;
    size: number;
    url: string;
  };
  className?: string;
}

export function MessageAttachment({ file, className }: MessageAttachmentProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Determine if the file is an image based on file type or extension
  const isImage = file.type.startsWith('image/') || 
                 /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$/i.test(file.name);
  
  const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
  const isText = file.type === 'text/plain' || /\.(txt|md|rtf)$/i.test(file.name);
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const fileSize = formatFileSize(file.size);
  
  // Get file extension from name
  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toUpperCase() || '';
  };
  
  const fileExtension = getFileExtension(file.name);

  return (
    <div className={cn(
      "relative flex flex-col rounded-lg border border-borderColorPrimary overflow-hidden mb-3 max-w-md w-full sm:max-w-[70%] md:max-w-[50%] lg:max-w-[40%]",
      className
    )}>
      {isImage ? (
        <div className="relative">
          <div 
            className={cn(
              "relative overflow-hidden transition-all duration-300",
              expanded ? "max-h-[500px]" : "max-h-[200px]"
            )}
          >
            <Image
              src={file.url}
              alt={file.name}
              width={400}
              height={expanded ? 500 : 200}
              className="object-contain w-full h-auto"
              onClick={() => setExpanded(!expanded)}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center p-3 bg-backgroundSecondary">
          <div className="flex items-center justify-center h-10 w-10 rounded bg-background text-foreground mr-3">
            <FileIcon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {fileExtension} • {fileSize}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}