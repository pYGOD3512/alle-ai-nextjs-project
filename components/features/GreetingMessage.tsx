"use client";

import React, { useState, useEffect, useRef } from "react";
import { textReveal } from "@/lib/utils";
import { motion } from "framer-motion"
import { Sparkles, Wand2, MessagesSquare, Zap } from "lucide-react";
import { useAuthStore } from "@/stores";

interface option {
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

interface GreetingMessageProp {
  username?: string;
  options?: option[];
  handlePressed?: (option: option) => void;
  questionText?: string;
}

const charVariants = {
  hidden: { opacity: 0 },
  reveal: { opacity: 1 },
};

const defaultOptions = [
  {
    label: "Get creative inspiration",
    icon: <Wand2 className="w-4 h-4" />,
  },
  {
    label: "Solve problems together",
    icon: <Zap className="w-4 h-4" />,
  },
];

const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const GreetingMessage = ({
  options,
  handlePressed = () => {},
  questionText,
}: GreetingMessageProp) => {
  const handleOptionClick = (option: option) => {
    handlePressed({
      ...option,
      label: `${option.description?.toLowerCase()}`
    });
  };

  const { user } = useAuthStore();

  const greetings = textReveal(`${getTimeBasedGreeting()}, ${user?.first_name}!`)
  const questionTextArray = textReveal(questionText ? questionText : "What would you like to do today?")

  return (
    <div className="w-full max-w-2xl mx-auto px-2">
      <div className="text-center space-y-4 mb-8">
        <motion.h2 
          initial="hidden" 
          whileInView="reveal" 
          transition={{staggerChildren: .02}} 
          className="mb-2 break-words"
        >
          {greetings.map(({char, id}) => (
              <motion.span
              key={id}
              transition={{duration: 0.5}}
              variants={charVariants}
              className="text-md sm:text-2xl"
              >
                {char}
              </motion.span>
          ))}
          </motion.h2>

          {/* <motion.p 
          initial="hidden" 
          whileInView="reveal" 
          transition={{staggerChildren: .015}} 
          className="text-lg text-gray-500"
          >
          {questionTextArray.map(({char, id}) => (
              <motion.span
              key={id}
              transition={{duration: 0.5}}
              variants={charVariants}
              >
                {char}
              </motion.span>
            ))}
          </motion.p> */}
      </div>

      {options && options.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          {options && options.map((option, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + (index * 0.1), duration: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOptionClick(option)}
              className="group inline-flex items-center  gap-2 px-3 py-1.5 bg-background/50 hover:bg-primary/5 border border-borderColorPrimary hover:border-primary/30 rounded-full text-sm transition-all duration-200"
            >
              <div className="flex-shrink-0 text-primary group-hover:text-primary/80 transition-colors">
                {option.icon}
              </div>
              <span className="font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                {option.label}
              </span>
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default GreetingMessage;
