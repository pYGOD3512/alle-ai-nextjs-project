"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import RenderCode from "@/components/RenderCode";
import {
  introCodes,
  installSdks,
} from "@/lib/constants/code-snippets-docs/apiDocs";

export default function ApiIntroduction() {
  const router = useRouter();
  const pathname = usePathname();
  // Define the sections manually for this page

  return (
    <main className="flex gap-2">
      {/* Main content */}
      <div className="lg:w-3/4  w-full">
        {/* Introduction Section */}
        <section
          className="min-h-[80vh]  space-y-8"
          data-section="introduction"
        >
          <div className="space-y-6">
            <h2 className="text-4xl  font-bold">Alle-AI</h2>
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
                  <RenderCode language="bash" code={installSdks.python} />
                </div>
                <div>
                  <p className="mb-4">
                    To install the official Node.js library, run the following
                    command in your Node.js project directory:
                  </p>
                  <RenderCode language="bash" code={installSdks.javascript} />
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
              <div>
                <p className="text-muted-foreground mb-4">
                  You can obtain an API key by &nbsp;{" "}
                  <Link href={"/"} target="_blank" className="text-blue-600">
                    registering for an account
                  </Link>{" "}
                  &nbsp; and navigating to the API Keys section in your
                  dashboard.
                </p>
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
              </div>
            </div>
          </div>
        </section>

        {/* codes */}
        <section className="mb-5">
          <RenderCode
            language="python"
            showLanguage={true}
            code={introCodes.loadenvPython}
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
          code={introCodes.curl}
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
              code={introCodes.python}
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
              code={introCodes.javascript}
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
              code={introCodes.streamPython}
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
              code={introCodes.streamJavascript}
            />
          </div>

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
              code={introCodes.handleStreamError}
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
        <section className="mb-20 ">
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
${installSdks.python}`}
            />
          </div>
          <div className="mb-5"></div>

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
${installSdks.javascript}`}
            />
          </div>
          <div className="mb-5"></div>

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
        </section>
      </div>
      {/* Right Side - On This Page */}
      <aside className="hidden lg:block lg:w-1/4 sticky ">
        {/* <OnThisPage pathname={pathname} sections={customSections} /> */}
      </aside>
    </main>
  );
}
