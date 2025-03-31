import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Alert } from "@/components/ui/alert";

interface ArticleFeedbackProps {
  articleId?: string;
  onFeedbackSubmit?: (feedback: FeedbackType) => void;
  className?: string;
}

type FeedbackType = boolean | null;

interface ToastState {
  show: boolean;
  message: string;
}

const ArticleFeedback: React.FC<ArticleFeedbackProps> = ({
  articleId,
  onFeedbackSubmit,
  className = "",
}) => {
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
  });

  const handleFeedback = (isHelpful: boolean): void => {
    if (feedback === null) {
      setFeedback(isHelpful);
      const message = isHelpful
        ? "Thanks for your feedback! We're glad this was helpful."
        : "Thanks for your feedback. We'll work on improving this.";

      setToast({ show: true, message });
      onFeedbackSubmit?.(isHelpful);

      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  return (
    <div className={`max-w-xl mx-auto ${className}`}>
      <div className="border-t border-zinc-800 mt-8 pt-6">
        <h3 className="text-lg font-medium text-zinc-200 mb-4">
          Was this article helpful?
        </h3>

        <div className="flex gap-4">
          <button
            onClick={() => handleFeedback(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              feedback === true
                ? "bg-green-500/20 text-green-400"
                : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
            }`}
            disabled={feedback !== null}
            aria-label="Mark as helpful"
          >
            <ThumbsUp size={18} />
            <span>Yes</span>
          </button>

          <button
            onClick={() => handleFeedback(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              feedback === false
                ? "bg-red-500/20 text-red-400"
                : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
            }`}
            disabled={feedback !== null}
            aria-label="Mark as not helpful"
          >
            <ThumbsDown size={18} />
            <span>No</span>
          </button>
        </div>
      </div>

      {toast.show && (
        <div className="fixed bottom-4 right-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Alert className={feedback ? "bg-green-500/20" : "bg-zinc-800"}>
            <p className="text-sm text-zinc-200">{toast.message}</p>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default ArticleFeedback;
