import { X, FileText, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { UploadedFile } from "@/lib/types";
import { formatFileSize } from "@/lib/utils";
import { Loader2 } from "lucide-react";


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
  const isImage = file.type.startsWith('image/');

  return (
    <div className="relative group flex items-center gap-2 max-w-[200px] w-fit p-1 bg-muted/30 rounded-lg border border-border">
      <div className="flex-shrink-0">
        {isImage ? (
          <div className="relative w-10 h-10 rounded overflow-hidden">
            <Image
              src={file.url}
              alt={file.name}
              fill
              className="object-cover"
              width={100}
              height={100}
            />
          </div>
        ) : (
          <FileText className="w-8 h-8 text-muted-foreground" />
        )}

        {/* Loading overlay */}
        {file.status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          </div>
        )}
      </div>

    { !isImage && (
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">
          {getFileExtension(file.type)}
        </p>
      </div>
    )}

      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive/90 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        disabled={file.status === 'loading'}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}