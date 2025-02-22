// @ts-nocheck
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import RenderCode from "@/components/RenderCode";
import { useActiveSectionStore } from "@/stores/ui";
import { OnThisPage } from "@/components/docs/OnThisPage";
import { ChevronRight, ChevronLeft } from "lucide-react";

const hheading = [
  {
    id: "Random test",
    href: "",
  },
  {
    id: "Random heading 2 ",
    href: "",
  },
  {
    id: "test heading 3",
    href: "",
  },
];

export default function ApiIntroduction() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <main className="flex gap-2">
      {/* Main content */}
      <div className="w-3/4">
        {/* Introduction Section */}
        <section
          className="min-h-[80vh]  space-y-8"
          data-section="introduction"
        >
          <div className="space-y-6">
            <h2 className="text-4xl text-white font-bold">Alle-AI</h2>
            <h3 className="text-2xl text-muted-foreground font-semibold">
              API Reference
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                You can interact with the API through HTTP or Websocket requests
                from any language, via our official Python bindings or our
                official Node.js libraries.
              </p>
              <div className="space-y-6">
                <div>
                  <p className="mb-4">
                    To install the official Python bindings, run the following
                    command:
                  </p>
                  <RenderCode language="bash" code="$ pip install alleai" />
                </div>
                <div>
                  <p className="mb-4">
                    To install the official Node.js library, run the following
                    command in your Node.js project directory:
                  </p>
                  <RenderCode language="bash" code="$ npm install alleai" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Authentication Section */}
        <section
          className="min-h-[80vh] py-5 space-y-8"
          data-section="authentication"
        >
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Authentication</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl mb-4">API Keys</h3>
                <p className="text-muted-foreground mb-4">
                  Authenticate using API keys scoped to projects (recommended)
                  or legacy user keys.
                </p>
                <ul className="list-disc text-muted-foreground pl-6 space-y-2">
                  <li>
                    <strong className="font-medium">Project keys:</strong>{" "}
                    Restricted to a single project (secure by default).
                  </li>
                  <li>
                    <strong className="font-medium">User keys:</strong> Access
                    all projects/organizations (deprecated; migrate to project
                    keys).
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 px-6 py-4 rounded-lg">
                <strong className="font-bold block mb-1">Security Note:</strong>
                <span>
                  🔒 Never expose API keys client-side. Use backend environment
                  variables or secret managers in production.
                </span>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl">Making authenticated requests</h3>
                <p className="text-muted-foreground">
                  Authentication to the API is performed via HTTP Bearer
                  authentication. Provide your API key as the Bearer token value
                  in the Authorization header.
                </p>
                <RenderCode
                  language="bash"
                  code="curl --request POST \
  --url https://api.alleai.com/v1/chat/completions \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json'"
                />
              </div>
            </div>
          </div>
        </section>

        {/* codes */}
        <section className="mb-5">
          <RenderCode
            language="python"
            showLanguage={true}
            code={`# Best practice: Load from environment
import os
from your_api_sdk import Client

client = Client(api_key=os.getenv("API_SECRET"))`}
          />
        </section>

        <h3 className="text-2xl mt-4 font-semibold mb-5">
          Include your key in your request
        </h3>
        <RenderCode
          showLanguage={true}
          language="bash"
          code={`# cURL example
curl https://api.yourservice.com/v1/endpoint \
  -H "Authorization: Bearer $API_KEY"`}
        />

        <h3 className="mt-4 mb-3 text-2xl font-semibold">Making request</h3>
        <p className="text-muted-foreground text-2xl mb-4">
          Basic Example (curl)
        </p>
        <RenderCode
          showLanguage={true}
          language="bash"
          code={`
    curl https://api.yourservice.com/v1/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "model": "your-model-v1",
    "messages": [{"role": "user", "content": "Hello!"}],
    "temperature": 0.7
  }'`}
        />
        {/* alle-ai Examples */}
        <div className=""></div>
        <section className="mb-20 mt-7">
          <h3 className="text-2xl mb-3">Using the Alle-AI Python Package</h3>
          <p className="text-muted-foreground mb-4">
            Example of initializing the Alle-AI client in Python:
          </p>
          <div className="mb-5">
            <RenderCode
              showLanguage={true}
              language="python"
              code={`from alleai.client import alleai
client = alleai(
  api_key='YOUR_API_KEY',
)`}
            />
          </div>

          <h3 className="text-2xl mb-3">Using the Alle-AI Node.js Package</h3>
          <p className="text-muted-foreground mb-4">
            Example of initializing the Alle-AI client in Node.js:
          </p>
          <div className="mb-5">
            <RenderCode
              showLanguage={true}
              language="javascript"
              code={`import { alleaiClient } from 'alleai';
const client = new alleaiClient({
  apiKey: 'YOUR_API_KEY',
});`}
            />
          </div>
        </section>

        {/* Page 3 streaming */}
        <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />

        {/* Streaming */}
        <section className="mb-20">
          <h2 className="text-3xl mb-4" data-section="streaming">
            Streaming
          </h2>
          <p className="text-muted-foreground mb-4">
            The Alleai API provides the ability to stream responses back to a
            client in order to allow partial results for certain requests. To
            achieve this, we follow the Server-sent events standard. Our
            official Node and Python libraries include helpers to make parsing
            these events simpler.
          </p>
          <p className="text-muted-foreground mb-4">
            Streaming is supported for both the Chat Completions API and the
            Assistants API. This section focuses on how streaming works for Chat
            Completions. Learn more about how streaming works in the Assistants
            API here.
          </p>

          <h3 className="text-2xl mb-4">Streaming in Python</h3>
          <p className="text-muted-foreground mb-4">
            In Python, a streaming request looks like:
          </p>
          <div className="mb-5">
            <RenderCode
              showLanguage={true}
              language="python"
              code={`from alleai import Alleai

client = Alleai()

stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Say this is a test"}],
    stream=True,
)
for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="")`}
            />
          </div>

          <h3 className="text-2xl mb-4">Streaming in Node.js / TypeScript</h3>
          <p className="text-muted-foreground mb-4">
            In Node.js / TypeScript, a streaming request looks like:
          </p>
          <div className="mb-5">
            <RenderCode
              showLanguage={true}
              language="javascript"
              code={`import Alleai from "alleai";

const alleai = new Alleai();

async function main() {
    const stream = await alleai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "Say this is a test" }],
        stream: true,
    });
    for await (const chunk of stream) {
        process.stdout.write(chunk.choices[0]?.delta?.content || "");
    }
}

main();`}
            />
          </div>

          <h3 className="text-2xl mb-4">Parsing Server-sent Events</h3>
          <p className="text-muted-foreground mb-4">
            Parsing Server-sent events is non-trivial and should be done with
            caution. Simple strategies like splitting by a new line may result
            in parsing errors. We recommend using existing client libraries when
            possible.
          </p>

          {/* Best Practices for Streaming */}
          <h3 className="text-2xl mb-4">Best Practices for Streaming</h3>
          <p className="text-muted-foreground mb-4">
            When working with streaming in the Alleai API, consider the
            following best practices to ensure a smooth and efficient
            implementation:
          </p>
          <ul className="list-disc text-muted-foreground pl-6 mb-4">
            <li>
              <strong className="font-medium">Use Client Libraries:</strong>{" "}
              Always prefer using the official Alleai client libraries for
              Python and Node.js, as they handle Server-sent events parsing and
              connection management for you.
            </li>
            <li>
              <strong className="font-medium">Handle Errors Gracefully:</strong>{" "}
              Streaming connections can fail due to network issues or timeouts.
              Implement retry logic and error handling to ensure robustness.
            </li>
            <li>
              <strong className="font-medium">Monitor Rate Limits:</strong>{" "}
              Streaming requests count toward your API rate limits. Monitor your
              usage to avoid exceeding limits and being throttled.
            </li>
            <li>
              <strong className="font-medium">Optimize for Latency:</strong>{" "}
              Streaming is ideal for reducing perceived latency in applications.
              Ensure your client-side logic is optimized to process and display
              chunks as they arrive.
            </li>
          </ul>

          {/* Example: Handling Errors in Streaming */}
          <h3 className="text-2xl mb-4">Handling Errors in Streaming</h3>
          <p className="text-muted-foreground mb-4">
            Here’s an example of how to handle errors gracefully in a Python
            streaming request:
          </p>
          <div className="mb-5">
            <RenderCode
              showLanguage={true}
              language="python"
              code={`from alleai import Alleai
import time

client = Alleai()

try:
    stream = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Say this is a test"}],
        stream=True,
    )
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            print(chunk.choices[0].delta.content, end="")
except Exception as e:
    print(f"An error occurred: {e}")
    # Implement retry logic here
    time.sleep(2)
    print("Retrying...")`}
            />
          </div>

          {/* Example: Monitoring Rate Limits */}
          <h3 className="text-2xl mb-4">Monitoring Rate Limits</h3>
          <p className="text-muted-foreground mb-4">
            To avoid hitting rate limits, you can monitor your usage and
            implement backoff strategies. Here’s an example in Node.js:
          </p>
          <div className="mb-5">
            <RenderCode
              showLanguage={true}
              language="javascript"
              code={`import Alleai from "alleai";

const alleai = new Alleai();

async function makeStreamingRequest() {
    try {
        const stream = await alleai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "Say this is a test" }],
            stream: true,
        });
        for await (const chunk of stream) {
            process.stdout.write(chunk.choices[0]?.delta?.content || "");
        }
    } catch (error) {
        console.error("Rate limit exceeded or other error:", error);
        // Implement backoff and retry logic here
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Retrying...");
    }
}

makeStreamingRequest();`}
            />
          </div>
        </section>

        {/* Page 4 SDK and libs */}
        <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />

        {/* SDKs and Libraries */}
        <section className="mb-20">
          <h2 className="text-3xl mb-4" data-section="sdk">
            SDKs and Libraries
          </h2>
          <p className="text-muted-foreground mb-4">
            The Alleai API is designed to be easy to use with our official SDKs
            and libraries for Python and Node.js. These libraries handle
            authentication, request formatting, and response parsing, so you can
            focus on building your application.
          </p>

          {/* Python SDK */}
          <h3 className="text-2xl mb-4">Python SDK</h3>
          <p className="text-muted-foreground mb-4">
            The official Alleai Python SDK provides a simple and intuitive
            interface for interacting with the API. Here’s how to get started:
          </p>
          <div className="mb-5">
            <RenderCode
              showLanguage={true}
              language="bash"
              code={`# Install the Python SDK
pip install alleai`}
            />
          </div>
          <div className="mb-5">
            <RenderCode
              showLanguage={true}
              language="python"
              code={`from alleai import Alleai

# Initialize the client
client = Alleai(api_key="your_api_key")

# Make a request
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello, world!"}]
)

# Print the response
print(response.choices[0].message.content)`}
            />
          </div>

          {/* Node.js SDK */}
          <h3 className="text-2xl mb-4">Node.js SDK</h3>
          <p className="text-muted-foreground mb-4">
            The official Alleai Node.js SDK is built for modern JavaScript and
            TypeScript applications. Here’s how to use it:
          </p>
          <div className="mb-5">
            <RenderCode
              showLanguage={true}
              language="bash"
              code={`# Install the Node.js SDK
npm install alleai`}
            />
          </div>
          <div className="mb-5">
            <RenderCode
              showLanguage={true}
              language="javascript"
              code={`import { Alleai } from 'alleai';

// Initialize the client
const client = new Alleai({
  apiKey: 'your_api_key',
});

// Make a request
async function main() {
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: 'Hello, world!' }],
  });

  // Print the response
  console.log(response.choices[0].message.content);
}

main();`}
            />
          </div>

          {/* Best Practices for SDKs */}
          <h3 className="text-2xl mb-4">Best Practices for Using SDKs</h3>
          <p className="text-muted-foreground mb-4">
            To get the most out of the Alleai SDKs, follow these best practices:
          </p>
          <ul className="list-disc text-muted-foreground pl-6 mb-4">
            <li>
              <strong className="font-medium">Environment Variables:</strong>{" "}
              Store your API key in environment variables to keep it secure and
              avoid hardcoding it in your application.
            </li>
            <li>
              <strong className="font-medium">Error Handling:</strong> Always
              wrap API calls in try-catch blocks to handle errors gracefully.
            </li>
            <li>
              <strong className="font-medium">TypeScript Support:</strong> If
              you're using Node.js, consider using TypeScript for better type
              safety and autocompletion.
            </li>
            <li>
              <strong className="font-medium">Keep SDKs Updated:</strong>{" "}
              Regularly update the SDKs to benefit from the latest features and
              bug fixes.
            </li>
          </ul>

          {/* Example: Using Environment Variables */}
          <h3 className="text-2xl mb-4">Using Environment Variables</h3>
          <p className="text-muted-foreground mb-4">
            Here’s an example of how to securely use environment variables with
            the Python SDK:
          </p>
          <div className="">
            <RenderCode
              showLanguage={true}
              language="python"
              code={`import os
from alleai import Alleai

# Load API key from environment variable
client = Alleai(api_key=os.getenv("ALLEAI_API_KEY"))

# Make a request
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello, world!"}]
)

# Print the response
print(response.choices[0].message.content)`}
            />
          </div>
        </section>
      </div>
      {/* Right Side - On This Page */}
      <aside className="w-1/4 sticky ">
        <OnThisPage pathname={pathname} sections={hheading} />
      </aside>
    </main>
  );
}
