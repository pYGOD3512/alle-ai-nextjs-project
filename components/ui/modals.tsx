import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
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


interface TextSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TextSizeModal({ isOpen, onClose }: TextSizeModalProps) {
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