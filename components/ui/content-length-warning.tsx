import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ContentLengthWarningProps {
  percentage?: number;
  className?: string;
  type?: 'length' | 'incompatible-models';
  message?: string;
  models?: string[];
}

export function ContentLengthWarning({ 
  percentage, 
  className,
  type = 'length',
  message,
  models = []
}: ContentLengthWarningProps) {
  // Calculate excess percentage
  const excessPercentage = percentage ? Math.round(percentage - 100) : 0;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="mb-2 w-full"
    >
      <div 
        className={cn(
          "flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-[14px] backdrop-blur-sm w-full",
          type === 'length' ? (
            percentage && percentage > 100 
              ? "bg-red-500/10 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50" 
              : "bg-yellow-500/10 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/50"
          ) : "bg-red-500/10 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50",
          className
        )}
      >
        <AlertTriangle className="h-3 w-3 flex-shrink-0" />
        <span className="text-center">
          {type === 'length' ? (
            <>
              Context length exceeded by <span className="font-medium">{excessPercentage}%</span>. 
              Please reduce your content to continue.
            </>
          ) : (
            <>
              {message || "Some models don't support image uploads: "}
              {models.length > 0 && (
                <span className="font-bold italic"> {models.join(', ')}</span>
              )}
            </>
          )}
        </span>
      </div>
    </motion.div>
  );
}