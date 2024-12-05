"use client"
import React, { useState } from "react";

interface AnimatedGenerateButtonProps {
  onClick: () => void; 
  isLoading: boolean; 
}

const AnimatedGenerateButton: React.FC<AnimatedGenerateButtonProps> = ({
  onClick,
  isLoading,
}) => {
  return (
    <div className="flex items-center justify-center p-1 ">
      <button
        onClick={onClick}
        disabled={isLoading} 
        className={`
          relative 
          px-4 
          py-3 
          text-gray-800 
          dark:text-white
          text-sm
          bg-white 
          dark:bg-gray-800 
          rounded-lg 
          border 
          border-gray-300 
          dark:border-gray-700
          overflow-hidden 
          transform 
          transition-all 
          duration-300 
          hover:scale-105 
          focus:outline-none 
          animated-border-wrapper
          ${isLoading ? "scale-95 cursor-not-allowed" : ""}
        `}
      >
        {isLoading ? (
          <div className="spinner "></div> 
        ) : (
          "Generate"
        )}
        <span className="animated-border-overlay"></span>
      </button>

      <style jsx>{`
        .animated-border-wrapper {
          position: relative;
          overflow: hidden;
        }

        .animated-border-overlay {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(
            90deg,
            #ff6b6b,
            #4ecdc4,
            #45b7d1,
            #ff6b6b
          );
          background-size: 400% 100%;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
          border-radius: 0.5rem;
        }

        .animated-border-wrapper:hover .animated-border-overlay {
          animation: borderAnimation 3s ease infinite;
          opacity: 1;
        }

        @keyframes borderAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid transparent;
          border-top: 3px solid #4ecdc4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedGenerateButton;
