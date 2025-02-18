// @ts-nocheck
import React, { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  atomOneDark,
  github,
  darcula,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Copy, Check } from "lucide-react";
import { useTheme } from "next-themes";

interface CodeProps {
  showLanguage?: boolean;
  style?: React.CSSProperties;
  className?: string;
  toggle?: boolean;
  languages?: { language: string; code: string }[];
  language?: string;
  code?: string;
  maxHeight?: string | number | boolean;
  maxWidth?: string | number | boolean;
}

const RenderCode = ({
  showLanguage = true,
  style,
  className,
  toggle = false,
  languages = [],
  language,
  code,
  maxHeight = "300px",
  maxWidth = "100%",
}: CodeProps) => {
  const { resolvedTheme } = useTheme();
  const [isCopied, setIsCopied] = useState(false);
  const [currentCode, setCurrentCode] = useState(
    code || (languages.length > 0 ? languages[0].code : "")
  );
  const [currentLanguage, setCurrentLanguage] = useState(
    language || (languages.length > 0 ? languages[0].language : "")
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleLanguageChange = (language: string, code: string) => {
    setCurrentCode(code);
    setCurrentLanguage(language);
  };

  const shouldShowToggle = toggle && languages.length > 0;

  return (
    <div
      className={`rounded-lg overflow-hidden border border-gray-200 dark:border-accent relative ${className}`}
      style={style}
    >
      {shouldShowToggle && (
        <div className="flex flex-wrap gap-2 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          {languages.map(({ language, code }) => (
            <div
              key={language}
              className={`flex items-center gap-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                currentLanguage === language
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
              }`}
              onClick={() => handleLanguageChange(language, code)}
            >
              <span className="text-sm font-medium text-muted-foreground">
                {language.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}

      {showLanguage && (
        <div
          className="flex justify-between items-center px-4 py-2 text-muted-foreground border-b border-gray-200 dark:border-gray-700"
          style={{ width: "100%" }}
        >
          <span className="text-sm font-medium text-muted-foreground">
            {currentLanguage.toUpperCase()}
          </span>
        </div>
      )}

      <button
        onClick={handleCopy}
        className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors absolute top-2 right-2"
        aria-label="Copy code"
        title="Copy code"
      >
        {isCopied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      <div style={{ maxHeight, maxWidth, overflow: "auto" }}>
        <SyntaxHighlighter
          language={currentLanguage}
          style={resolvedTheme === "dark" ? darcula : github} // Rely on the theme for colors
          customStyle={{
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
          }}
          showLineNumbers
          lineNumberStyle={{
            marginRight: "1rem",
          }}
        >
          {currentCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default RenderCode;
