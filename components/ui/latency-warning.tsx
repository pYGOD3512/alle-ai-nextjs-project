import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

interface LatencyWarningProps {
  isVisible: boolean;
  feature: 'combine' | 'compare';
}

export function LatencyWarning({ isVisible, feature }: LatencyWarningProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-2 w-full"
        >
          <div className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-[14px] bg-sideBarBackground border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm w-full">
            <Info className="h-3 w-3 flex-shrink-0" />
            <span className="text-center">
              Web search + {feature === 'combine' ? 'Combine' : 'Compare'} may cause latency
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 