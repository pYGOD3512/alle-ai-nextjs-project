"use client";

import React from "react";
import { textReveal } from "@/lib/utils";
import { motion, Variants } from "framer-motion"

interface option {
  label: String;
}
interface GreetingMessageProp {
  username: string;
  options: option[];
  handlePressed: (option: option) => void;
}

const charVariants = {
  hidden: { opacity: 0},
  reveal: { opacity: 1},
}

const GreetingMessage = ({
  username,
  options,
  handlePressed,
}: GreetingMessageProp) => {

  const greetings = textReveal(`Hi! ${username} 👋`)
  const questionText = textReveal(`What would you like to do today?`)

  return (
    <div className="flex flex-col items-center justify-center  mt-5 ">
      <div className="w-full max-w-md">
        <div className="flex flex-col text-center mb-6">
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
          {questionText.map(({char, id}) => (
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
        <div className="space-y-4">
          {options.map((option, index) => (
            <div
              key={index}
              className="border dark:border border-gray-500 hover:bg-secondary rounded-2xl p-2 cursor-pointer "
              onClick={() => handlePressed(option)}
            >
              <p className="dark:text-gray-400 text-gray-800 text-sm font-medium">
                {option.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GreetingMessage;
