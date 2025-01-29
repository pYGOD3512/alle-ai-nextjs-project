"use client";

import React from "react";
import { textReveal } from "@/lib/utils";
import { motion } from "framer-motion"
import { Sparkles, Wand2, MessagesSquare, Zap } from "lucide-react";

interface option {
  label: String;
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

const GreetingMessage = ({
  username = "Guest",
  options = defaultOptions,
  handlePressed = () => {},
  questionText = "What would you like to do today?",
}: GreetingMessageProp) => {
  const greetings = textReveal(`Hi! ${username} 🎉`)
  const questionTextArray = textReveal(questionText)

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-8">
      <div className="text-center space-y-4 mb-8">
        <motion.h2 
          initial="hidden" 
          whileInView="reveal" 
          transition={{staggerChildren: .02}} 
          className="text-3xl font-bold mb-2 break-words"
        >
          {greetings.map(({char, id}) => (
              <motion.span
              key={id}
              transition={{duration: 0.5}}
              variants={charVariants}
              className="text-md sm:text-lg"
              >
                {char}
              </motion.span>
            ))}
          </motion.h2>

          <motion.p 
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
          </motion.p>
      </div>

      {options.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {options.map((option, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.8 + (index * 0.1),
                duration: 0.2
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePressed(option)}
              className="group relative flex items-center gap-2 p-2 sm:p-3 bg-background/50 hover:bg-primary/5 border border-borderColorPrimary hover:border-primary/30 rounded-xl transition-all duration-200"
            >
              <div className="flex-shrink-0 p-2 rounded-lg text-primary group-hover:bg-primary/10 transition-colors">
                {option.icon}
              </div>
              <span className="font-medium text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                {option.label}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default GreetingMessage;
