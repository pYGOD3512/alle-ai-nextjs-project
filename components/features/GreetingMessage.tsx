"use client";

import React from "react";

interface option {
  label: String;
}
interface GreetingMessageProp {
  username: string;
  options: option[];
  handlePressed: (option: option) => void;
}

const GreetingMessage = ({
  username,
  options,
  handlePressed,
}: GreetingMessageProp) => {
  return (
    <div className="flex flex-col items-center justify-center  mt-5 ">
      <div className="w-full max-w-md">
        <div className="flex flex-col text-center mb-6">
          <h2 className="text-3xl font-bold mb-2 break-words">
            Hi there, Happy late night! {username} 👋
          </h2>
          <p className="text-lg text-gray-500">
            What would you like to do today?
          </p>
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
