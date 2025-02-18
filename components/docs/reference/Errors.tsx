"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import RenderCode from "@/components/RenderCode";
import NavigationContainer from "@/components/NavigationContainer";

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
  errorExamples: [
    {
      language: "python",
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
    pass`
    },
    {
      language: "javascript",
      code: `const alleAI = require('alleai');
const client = new alleAI();

async function handleRequest() {
  try {
    // Make your alleAI API request here
    const response = await client.chat.completions.create({
      prompt: "Hello world",
      model: "alle-ai-mini"
    });
    return response;
  } catch (error) {
    if (error instanceof alleAI.APIError) {
      // Handle API error here, e.g. retry or log
      console.error(\`alleAI API returned an API Error: \${error}\`);
    } else if (error instanceof alleAI.APIConnectionError) {
      // Handle connection error here
      console.error(\`Failed to connect to alleAI API: \${error}\`);
    } else if (error instanceof alleAI.RateLimitError) {
      // Handle rate limit error (we recommend using exponential backoff)
      console.error(\`alleAI API request exceeded rate limit: \${error}\`);
    } else {
      // Handle unexpected errors
      console.error(\`Unexpected error: \${error}\`);
    }
  }
}

handleRequest();`
    }
  ]
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
        className="w-full px-4 py-2 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-medium">{title}</span>
        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>
      {isExpanded && <div className="px-4 py-2">{children}</div>}
    </div>
  );
};

const ErrorDocs = () => {
  return (
    <div className="pb-16 w-full max-w-[100%] pr-4">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Error Handling</h1>
          <p className="text-muted-foreground">
            Learn how to handle errors in your API requests and understand common error scenarios.
          </p>
        </div>

        {/* API Errors Section */}
        <section>
          <h2 className="text-2xl font-bold mb-2">{errorData.apiErrors.title}</h2>
          <p className="text-muted-foreground mb-4">
            Common API errors you might encounter and how to resolve them.
          </p>
          {errorData.apiErrors.errors.map((error, index) => (
            <ExpandableSection
              key={index}
              title={`${error.code}: ${error.name}`}
            >
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Cause:</strong> {error.cause}
                </p>
                <p>
                  <strong className="text-foreground">Solution:</strong> {error.solution}
                </p>
              </div>
            </ExpandableSection>
          ))}
        </section>

        {/* Library Errors Section */}
        <section>
          <h2 className="text-2xl font-bold mb-2">
            {errorData.libraryErrors.title}
          </h2>
          <p className="text-muted-foreground mb-4">
            Specific errors that can occur when using our client libraries.
          </p>
          {errorData.libraryErrors.errors.map((error, index) => (
            <ExpandableSection key={index} title={error.type}>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Cause:</strong> {error.cause}
                </p>
                <p>
                  <strong className="text-foreground">Solution:</strong> {error.solution}
                </p>
              </div>
            </ExpandableSection>
          ))}
        </section>

        {/* Error Handling Examples */}
        <section>
          <h2 className="text-2xl font-bold mb-2">Error Handling Examples</h2>
          <p className="text-muted-foreground mb-4">
            Here are examples of how to properly handle errors in your code using our client libraries.
          </p>
          <div className="space-y-4">
            <RenderCode
              languages={errorData.errorExamples}
              toggle={true}
              maxHeight={400}
              className="w-full"
            />
          </div>
        </section>

        {/* Navigation */}
        <NavigationContainer
          previousTitle="Rate Limits"
          previousDescription="Understanding API rate limits"
          preUrl="/docs/user-guides/limits"
          nextTitle="Updates"
          nextDesciption="Learn about API updates"
          nextUrl="/docs/user-guides/updates"
        />
      </div>
    </div>
  );
};

export default ErrorDocs;
