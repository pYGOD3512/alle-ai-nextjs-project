import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div 
      className={cn(
        "flex items-center gap-2 p-3 mb-0 rounded-lg text-sm",
        type === 'length' ? (
          percentage && percentage > 100 
            ? "bg-destructive/10 text-destructive border border-destructive/20" 
            : "bg-warning/10 text-warning border border-warning/20"
        ) : "bg-destructive/10 text-destructive border border-destructive/20",
        className
      )}
    >
      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      {type === 'length' ? (
        <span>
          Context length exceeded by <span className="font-medium">{excessPercentage}%</span>. 
          Please reduce your content to continue.
        </span>
      ) : (
        <span>
          {message || "Some models don't support image uploads: "}
          {models.length > 0 && (
            <span className="font-bold italic"> {models.join(', ')}</span>
          )}
        </span>
      )}
    </div>
  );
}