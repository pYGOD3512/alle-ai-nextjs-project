import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSidebarStore, CHAT_MODELS, IMAGE_MODELS, AUDIO_MODELS, VIDEO_MODELS } from "@/lib/constants";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Feedback</DialogTitle>
        </DialogHeader>
        <p>Feedback Modal</p>
      </DialogContent>
    </Dialog>
  );
}

export function TextSizeModal({ isOpen, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Text Size</DialogTitle>
        </DialogHeader>
        <p>Text Size Modal</p>
      </DialogContent>
    </Dialog>
  );
}

export function ModelSelectionModal({ isOpen, onClose }: ModalProps) {
  const currentPage = useSidebarStore((state) => state.currentPage);
  
  const getModelsForPage = () => {
    switch (currentPage) {
      case "Chat":
        return CHAT_MODELS;
      case "Image Generation":
        return IMAGE_MODELS;
      case "Audio Generation":
        return AUDIO_MODELS;
      case "Video Generation":
        return VIDEO_MODELS;
      default:
        return CHAT_MODELS;
    }
  };

  const models = getModelsForPage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{currentPage} Model Selection</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          {models.map((model) => (
            <div key={model.id} className="flex items-center gap-3 p-2 border rounded-lg">
              <img src={model.icon} alt={model.name} className="w-8 h-8" />
              <div>
                <h3 className="font-medium">{model.name}</h3>
                <p className="text-sm text-muted-foreground">{model.preview}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SettingsModal({ isOpen, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <p>Settings Modal</p>
      </DialogContent>
    </Dialog>
  );
}

export function UserProfileModal({ isOpen, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        <p>User Profile Modal</p>
      </DialogContent>
    </Dialog>
  );
}

export function ReferModal({ isOpen, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refer</DialogTitle>
        </DialogHeader>
        <p>Refer Modal</p>
      </DialogContent>
    </Dialog>
  );
}