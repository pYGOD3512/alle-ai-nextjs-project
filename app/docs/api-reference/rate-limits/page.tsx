"use client";
import RenderCode from "@/components/RenderCode";
import { OnThisPage } from "@/components/docs/OnThisPage";
export default function Page() {
  return (
    <main className="flex gap-2 px-5">
      {/* main content */}
      <div className="lg:w-3/4 w-full">
        {/* ..........................section one : introduction............................ */}
        <section table-of-content="introduction">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-muted-foreground  ">
              Rate Limits
            </h2>
            <h3 className="text-2xl  font-semibold">
              Learn about API rate limits and how to work with them
            </h3>
            <div className="space-y-4 text-muted-foreground ">
              <p>
                Our Multi-Model AI API Platform provides unified access to a
                wide range of leading AI models including ChatGPT, Gemini,
                DeepSeek, and many others through a single, consistent API
                interface.
              </p>
              <p>
                The allea-ai API uses a number of safeguards against bursts of
                incoming traffic to help maximize its stability. If you send
                many requests in quick succession, you might see error responses
                with status code{" "}
                <span className="bg-gray-400 p-0.5 rounded text-gray-800">
                  402
                </span>
              </p>
            </div>
            {/*  more about limits */}
            <section>
              <div>
                <div>
                  <h1 className="text-2xl font-bold mb-4">
                    Understanding Rate Limits
                  </h1>
                  <p className="text-muted-foreground mb-4">
                    Rate limits are an essential aspect of our API service that
                    help ensure fair usage, maintain system stability, and
                    protect the underlying infrastructure from excessive load.
                    These limits specify how many requests a user can make
                    within a given time period.
                  </p>
                </div>

                <div className="">
                  <h2 className="text-2xl font-semibold mb-4">
                    How Our Rate Limits Work
                  </h2>
                  <p className="text-muted-foreground">
                    Our platform implements a multi-dimensional rate limiting
                    system that accounts for:
                  </p>
                  <ul className="list-disc pl-5 text-muted-foreground">
                    <li>Number of requests per time interval</li>
                    <li>Token usage per request and cumulatively</li>
                    <li>Model-specific constraints</li>
                    <li>Your account&apos;s service tier</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </section>
        {/* ............more with boilerplates codes ... */}
        <section></section>
        {/* feedback */}
        {/* <div>
        <ArticleFeedback/>
      </div> */}
      </div>

      {/* table of contents */}
      <aside className="hidden lg:block w-1/4 sticky">
        <OnThisPage />
      </aside>
    </main>
  );
}
