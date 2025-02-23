import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { textReveal } from "@/lib/utils";

interface CombinedLoaderProps {
  modelNames: string[];
}

export function CombinedLoader({ modelNames }: CombinedLoaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);
  
  // Create loading messages based on model names
  const loadingMessages = [
    `Combining ${modelNames.join(' & ')}...`,
    `${modelNames.join(' & ')} working together...`,
    `Creating a unified response...`
  ];

  const currentMessage = textReveal(loadingMessages[currentIndex]);

  const handleNext = () => {
    setIsPulsing(false); // Stop pulsing first
    setTimeout(() => {
      setIsExiting(true);
    }, 200); // Short pause before starting exit animation
  };

  const handleExitComplete = () => {
    setIsExiting(false);
    setIsPulsing(true);
    setCurrentIndex((prev) => (prev + 1) % loadingMessages.length);
  };

  useEffect(() => {
    // Calculate approximate streaming duration:
    // (number of characters × stagger delay) + base animation duration + 1 second wait
    const streamDuration = currentMessage.length * 0.03 + 0.5 + 1;
    const timeout = setTimeout(handleNext, streamDuration * 1000);
    return () => clearTimeout(timeout);
  }, [currentIndex, currentMessage.length]);

  return (
    <div className="grid grid-cols-auto-fit gap-4 max-w-[90%] mx-auto mt-2">
      <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
        {!isExiting && (
          <motion.p
            key={currentIndex}
            initial="hidden"
            animate="reveal"
            exit={{ opacity: 0 }}
            transition={{ staggerChildren: 0.03 }}
            className={`text-sm bg-gradient-to-r from-primary via-primary/50 to-primary/20 bg-clip-text text-transparent ${isPulsing ? 'animate-pulse' : ''}`}
          >
            {currentMessage.map(({ char, id }) => (
              <motion.span
                key={id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  reveal: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.5 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}