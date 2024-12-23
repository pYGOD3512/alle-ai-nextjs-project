import { X, FileText } from "lucide-react";
import Image from "next/image";
import { UploadedFile } from "@/lib/types";
import { formatFileSize } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { useState } from "react";

interface FilePreviewProps {
  file: UploadedFile;
  onRemove: () => void;
}

const getFileExtension = (type: string) => {
    switch (type) {
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'DOC';
      case 'text/plain':
        return 'TXT';
      case 'application/pdf':
        return 'PDF';
      case 'image/jpeg':
        return 'JPG';
      case 'image/png':
        return 'PNG';
      case 'image/svg+xml':
        return 'SVG';
      case 'image/webp':
        return 'WEBP';
      default:
        return type.split('/').pop()?.toUpperCase() || 'UNKNOWN';
    }
  };

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const isImage = file.type.startsWith('image/');

  return (
    <>
      <div className="relative group flex items-center gap-2 max-w-[200px] w-fit p-2 bg-muted/30 rounded-lg border border-borderColorPrimary">
        <div className="flex-shrink-0 relative">
          {isImage ? (
            <div 
              className="relative w-10 h-10 rounded overflow-hidden cursor-pointer"
              onClick={() => setIsPreviewOpen(true)}
            >
              <Image
                src={file.url}
                alt={file.name}
                className="object-cover"
                width={100}
                height={100}
              />
            </div>
          ) : (
            <FileText className="w-8 h-8 text-muted-foreground" />
          )}

          {/* Loading overlay with progress */}
          {file.status === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 rounded">
              <Loader2 className="w-4 h-4 animate-spin text-primary mb-1" />
              {file.progress !== undefined && (
                <span className="text-[10px] text-primary font-medium">
                  {Math.round(file.progress)}%
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground">
              {getFileExtension(file.type)} • {formatFileSize(file.size)}
            </p>
            
            {/* Progress bar */}
            {file.status === 'loading' && file.progress !== undefined && (
              <Progress 
                value={file.progress} 
                className="h-1 w-full bg-muted"
                indicatorClassName="bg-primary"
              />
            )}
          </div>
        </div>

        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive/90 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          disabled={file.status === 'loading'}
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Image Preview Modal */}
      {isImage && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-xl p-0 focus-visible:outline-none">
            <DialogHeader className="sr-only">
              <DialogTitle className="text-lg font-medium">
                Image Preview
              </DialogTitle>
            </DialogHeader>
            
              <Image
                src={file.url}
                alt={file.name}
                className="w-full h-full object-contain rounded-lg"
                width={100}
                height={100}
              />
            
            {/* <div className="p-4 border-t">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {getFileExtension(file.type)} • {formatFileSize(file.size)}
              </p>
            </div> */}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}