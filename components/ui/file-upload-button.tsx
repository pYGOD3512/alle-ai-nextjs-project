import { Paperclip, HardDrive, Cloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface FileUploadButtonProps {
  onUploadFromComputer: () => void;
  onUploadFromDrive: () => void;
}

export function FileUploadButton({ 
  onUploadFromComputer, 
  onUploadFromDrive 
}: FileUploadButtonProps) {
    const { toast } = useToast();


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="flex-shrink-0 focus-visible:outline-none">
          <Paperclip className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-background">
        <DropdownMenuItem onClick={onUploadFromDrive} className="gap-2">
          <Cloud className="h-4 w-4" />
          <span>Add from Google Drive</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onUploadFromComputer} className="gap-2">
          <HardDrive className="h-4 w-4" />
          <span>Upload from computer</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}