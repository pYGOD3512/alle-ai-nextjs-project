"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-python";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";


const errorData = {
  apiErrors: {
    title: "API Errors",
    errors: [
      {
        code: "401",
        name: "Invalid Authentication",
        cause: "Invalid Authentication",
        solution:
          "Ensure the correct API key and requesting organization are being used.",
      },
      {
        code: "401",
        name: "Incorrect API key provided",
        cause: "The requesting API key is not correct.",
        solution:
          "Ensure the API key used is correct, clear your browser cache, or generate a new one.",
      },
      {
        code: "403",
        name: "Country, region, or territory not supported",
        cause:
          "You are accessing the API from an unsupported country, region, or territory.",
        solution: "Please see this page for more information.",
      },
      {
        code: "429",
        name: "Rate limit reached for requests",
        cause: "You are sending requests too quickly.",
        solution: "Pace your requests. Read the Rate limit guide.",
      },
      {
        code: "500",
        name: "The server had an error while processing your request",
        cause: "Issue on our servers.",
        solution:
          "Retry your request after a brief wait and contact us if the issue persists. Check the status page.",
      },
    ],
  },
  libraryErrors: {
    title: "Library Error Types",
    errors: [
      {
        type: "APIConnectionError",
        cause: "Issue connecting to our services.",
        solution:
          "Check your network settings, proxy configuration, SSL certificates, or firewall rules.",
      },
      {
        type: "APITimeoutError",
        cause: "Request timed out.",
        solution:
          "Retry your request after a brief wait and contact us if the issue persists.",
      },
      {
        type: "AuthenticationError",
        cause: "Your API key or token was invalid, expired, or revoked.",
        solution:
          "Check your API key or token and make sure it is correct and active. You may need to generate a new one from your account dashboard.",
      },
    ],
  },
  errorHandling: {
    title: "Handling Errors",
    code: `import alleAI
from alleAI import alleAI
client = alleAI()

try:
    # Make your alleAI API request here
    response = client.chat.completions.create(
        prompt="Hello world",
        model="alle-ai-mini"
    )
except alleAI.APIError as e:
    # Handle API error here, e.g. retry or log
    print(f"alleAI API returned an API Error: {e}")
    pass
except alleAI.APIConnectionError as e:
    # Handle connection error here
    print(f"Failed to connect to alleAI API: {e}")
    pass
except alleAI.RateLimitError as e:
    # Handle rate limit error (we recommend using exponential backoff)
    print(f"alleAI API request exceeded rate limit: {e}")
    pass`,
  },
};

interface ExpProps {
  title: string;
  children: React.ReactNode;
}

const ExpandableSection = ({ title, children }: ExpProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-lg mb-4">
      <button
        className="w-full p-4 flex items-center justify-between text-left hover:bg-accent rounded-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-semibold">{title}</span>
        {isExpanded ? (
          <ChevronDown className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </button>
      {isExpanded && <div className="p-4 border-t">{children}</div>}
    </div>
  );
};

const CodeBlock = ({ code }: { code: string }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    const button = document.querySelector(".copy-button") as HTMLButtonElement;
    if (button) {
      button.textContent = "Copied!";
      setTimeout(() => {
        button.textContent = "Copy";
      }, 2000);
    }
  };

  return (
    <div className="code-block">
      <pre className="line-numbers">
        <code className="language-python">{code}</code>
      </pre>
      <button className="copy-button" onClick={copyCode}>
        Copy
      </button>
    </div>
  );
};

const ErrorDocs = () => {
  useEffect(() => {
    

    Prism.highlightAll();

   
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <p className="text-muted-foreground mb-8">
        Explore Alle-AI API error codes and solutions. This guide includes an
        overview of error codes you might see from both the API and our official
        Python and Javascript library.
      </p>

      {/* API Errors Table */}
      <h2 className="text-2xl font-bold mb-4">{errorData.apiErrors.title}</h2>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-4 text-left">Code</th>
              <th className="border p-4 text-left">Overview</th>
            </tr>
          </thead>
          <tbody>
            {errorData.apiErrors.errors.map((error, index) => (
              <tr key={index} className="hover:bg-accent">
                <td className="border p-4 font-mono">
                  {error.code} - {error.name}
                </td>
                <td className="border p-4">
                  <div className="mb-2">
                    <span className="font-semibold">Cause:</span> {error.cause}
                  </div>
                  <div>
                    <span className="font-semibold">Solution:</span>{" "}
                    {error.solution}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Library Errors Expandable Sections */}
      <h2 className="text-2xl font-bold mb-4">
        {errorData.libraryErrors.title}
      </h2>
      <div className="mb-8">
        {errorData.libraryErrors.errors.map((error, index) => (
          <ExpandableSection key={index} title={error.type}>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Cause:</span> {error.cause}
              </div>
              <div>
                <span className="font-semibold">Solution:</span>{" "}
                {error.solution}
              </div>
            </div>
          </ExpandableSection>
        ))}
      </div>

      {/* Error Handling Code Example */}
      <h2 className="text-2xl font-bold mb-4">
        {errorData.errorHandling.title}
      </h2>
      <CodeBlock code={errorData.errorHandling.code} />
    </div>
  );
};

export default ErrorDocs;
