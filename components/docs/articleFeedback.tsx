import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Alert } from "@/components/ui/alert";

interface ArticleFeedbackProps {
  articleId?: string;
  onFeedbackSubmit?: (feedback: FeedbackData) => void;
  className?: string;
}

interface FeedbackData {
  isHelpful: boolean | null;
  reason: string | null;
}

interface ToastState {
  show: boolean;
  message: string;
}

const ArticleFeedback: React.FC<ArticleFeedbackProps> = ({
  articleId,
  onFeedbackSubmit,
  className = "",
}) => {
  const [feedback, setFeedback] = useState<FeedbackData>({
    isHelpful: null,
    reason: null,
  });
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
  });

  const positiveOptions = [
    { value: "Accurate", label: "Accurately describes the product or feature" },
    { value: "Solved my problem", label: "Helped me resolve an issue" },
    { value: "Easy to understand", label: "Easy to follow and comprehend" },
    {
      value: "Helped me decide",
      label: "Convinced me to adopt the product or feature",
    },
    { value: "Another reason", label: "Another reason" },
  ];

  const negativeOptions = [
    {
      value: "Inaccurate",
      label: "Doesn't accurately describe the product or feature",
    },
    {
      value: "Couldn't find",
      label: "Missing important information",
    },
    { value: "Hard to understand", label: "Too complicated or unclear" },
    {
      value: "Code sample errors",
      label: "One or more code samples are incorrect",
    },
    { value: "Another reason", label: "Another reason" },
  ];

  const handleInitialFeedback = (isHelpful: boolean): void => {
    if (feedback.isHelpful === null) {
      setFeedback({ isHelpful, reason: null });
    }
  };

  const handleReasonSubmit = (): void => {
    if (feedback.isHelpful !== null && feedback.reason) {
      const message = feedback.isHelpful
        ? "Thanks for your feedback! We're glad this was helpful."
        : "Thanks for your feedback. We'll work on improving this.";

      setToast({ show: true, message });
      onFeedbackSubmit?.(feedback);

      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  return (
    <div className={`max-w-xl pl-8 ${className}`}>
      <div className=" dark:border-zinc-800 mt-8 pt-6">
        {feedback.isHelpful === null ? (
          <div className="flex items-center gap-4 flex-wrap">
            <h3 className="text-lg font-medium">Was this article helpful?</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleInitialFeedback(true)}
                className="flex items-center gap-2 px-3 py-1 rounded-md transition-all duration-200 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
                aria-label="Mark as helpful"
              >
                <ThumbsUp size={16} />
              </button>
              <button
                onClick={() => handleInitialFeedback(false)}
                className="flex items-center gap-2 px-3 py-1 rounded-md transition-all duration-200 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
                aria-label="Mark as not helpful"
              >
                <ThumbsDown size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2">
              {feedback.isHelpful ? "What did you like?" : "What went wrong?"}
            </h4>
            <div className="space-y-2">
              {(feedback.isHelpful ? positiveOptions : negativeOptions).map(
                (option) => (
                  <label key={option.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="feedback-reason"
                      value={option.value}
                      checked={feedback.reason === option.value}
                      onChange={() =>
                        setFeedback({ ...feedback, reason: option.value })
                      }
                      className="text-blue-500"
                    />
                    <div>
                      <div>{option.value}</div>
                      <div className="text-sm text-muted-foreground">
                        {option.label}
                      </div>
                    </div>
                  </label>
                )
              )}
            </div>
            <button
              onClick={handleReasonSubmit}
              disabled={!feedback.reason}
              className={`mt-4 px-4 py-2 rounded-lg transition-all duration-200 ${
                feedback.reason
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-zinc-700 text-gray-400 dark:text-zinc-400 cursor-not-allowed"
              }`}
            >
              Submit
            </button>
          </div>
        )}
      </div>

      {toast.show && (
        <div className="fixed bottom-4 right-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Alert
            className={
              feedback.isHelpful
                ? "dark:bg-green-500/20 bg-zinc-800 "
                : "bg-zinc-800"
            }
          >
            <p className="text-sm text-zinc-200">{toast.message}</p>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default ArticleFeedback;
