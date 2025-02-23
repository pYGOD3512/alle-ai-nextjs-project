import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface CombinedLoaderProps {
  modelNames: string[];
}

export function CombinedLoader({ modelNames }: CombinedLoaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Create loading messages based on model names
  const loadingMessages = [
    `Combining ${modelNames.join(' & ')}...`,
    `${modelNames.join(' & ')} working together...`,
    `Creating a unified response...`
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000); // Switch every 2 seconds

    return () => clearInterval(interval);
  }, [loadingMessages.length]);

  return (
    <div className="grid grid-cols-auto-fit gap-4 max-w-[90%] mx-auto">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-sm animate-pulse bg-gradient-to-r from-primary via-primary/50 to-primary/20 bg-clip-text text-transparent"
        >
          {loadingMessages[currentIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}