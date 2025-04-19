"use client"
import React from 'react';
import RenderCode from "@/components/RenderCode";

const errorHandlingPython = `from alleai.core import AlleAIClient, APIError, RateLimitError
import time

# Initialize client
client = AlleAIClient(api_key="your_api_key")

def handle_api_request(max_retries=3):
    for attempt in range(max_retries):
        try:
            # Your API request here
            response = client.chat.completions({
                "models": ["gpt-4o"],
                "messages": [{"user": [{"type": "text", "text": "Hello!"}]}]
            })
            return response
            
        except RateLimitError as e:
            if attempt == max_retries - 1:
                print(f"Rate limit exceeded after {max_retries} attempts")
                raise
            
            wait_time = (attempt + 1) * 2  # Exponential backoff
            print(f"Rate limit hit, waiting {wait_time} seconds...")
            time.sleep(wait_time)
            continue
            
        except APIError as e:
            print(f"API Error: {e.status_code} - {e.message}")
            # Handle specific status codes
            if e.status_code == 401:
                print("Authentication failed. Check your API key.")
            elif e.status_code == 400:
                print("Bad request. Check your input parameters.")
            raise
            
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            raise`;

const errorHandlingJS = `const { AlleAIClient, APIError, RateLimitError } = require("alleai-sdk");

// Initialize client
const client = new AlleAIClient({ apiKey: "your_api_key" });

async function handleApiRequest(maxRetries = 3) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            // Your API request here
            const response = await client.chat.completions({
                models: ["gpt-4o"],
                messages: [{ user: [{ type: "text", text: "Hello!" }] }]
            });
            return response;
            
        } catch (error) {
            if (error instanceof RateLimitError) {
                if (attempt === maxRetries - 1) {
                    console.error(\`Rate limit exceeded after \${maxRetries} attempts\`);
                    throw error;
                }
                
                const waitTime = (attempt + 1) * 2000; // Exponential backoff in ms
                console.log(\`Rate limit hit, waiting \${waitTime/1000} seconds...\`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }
            
            if (error instanceof APIError) {
                console.error(\`API Error: \${error.status_code} - \${error.message}\`);
                // Handle specific status codes
                switch (error.status_code) {
                    case 401:
                        console.error("Authentication failed. Check your API key.");
                        break;
                    case 400:
                        console.error("Bad request. Check your input parameters.");
                        break;
                }
                throw error;
            }
            
            console.error(\`Unexpected error: \${error.message}\`);
            throw error;
        }
    }
}`;

export default function ErrorHandling() {
  return (
    <section className="flex gap-2 px-5 max-w-4xl">
      <div className="documentation-container">
        <h1 className="text-3xl font-bold mb-6">Error Handling</h1>

        <section className="mb-8">
          <p className="text-muted-foreground mb-6">
            Our SDK provides comprehensive error handling capabilities to help you build robust applications. 
            This guide covers common error scenarios and best practices for handling them effectively.
          </p>

          <div className="bg-background border border-borderColorPrimary rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Error Types</h2>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-medium min-w-[120px]">APIError:</span>
                <span>Base error class for all API-related errors. Includes status code and detailed error message.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium min-w-[120px]">RateLimitError:</span>
                <span>Thrown when you exceed the rate limits for your tier. Includes retry-after information.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium min-w-[120px]">AuthError:</span>
                <span>Authentication-related errors (invalid API key, expired tokens, etc).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium min-w-[120px]">ValidationError:</span>
                <span>Invalid input parameters or request format.</span>
              </li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Implementation Examples</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Python</h3>
              <p className="text-muted-foreground mb-4">
                Example showing comprehensive error handling in Python with retry logic:
              </p>
              <RenderCode
                code={errorHandlingPython}
                language="python"
                showLanguage={true}
              />
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Node.js</h3>
              <p className="text-muted-foreground mb-4">
                Equivalent implementation in Node.js:
              </p>
              <RenderCode
                code={errorHandlingJS}
                language="javascript"
                showLanguage={true}
              />
            </div>
          </div>

          <div className="bg-background border border-borderColorPrimary rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-medium">Implement Retry Logic:</span>
                <span>Use exponential backoff for rate limits and transient failures. Start with a small delay and increase it with each retry.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">Handle Specific Errors:</span>
                <span>Catch and handle specific error types differently. For example, retry on rate limits but fail fast on validation errors.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">Log Errors Properly:</span>
                <span>Include relevant context in error logs (request ID, timestamps, etc). Use appropriate logging levels for different error types.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">Graceful Degradation:</span>
                <span>Have fallback strategies for when services are unavailable. Consider implementing circuit breakers for critical systems.</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </section>
  );
}
