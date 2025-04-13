"use client";
import RenderCode from "@/components/RenderCode";
import Link from "next/link";
import ApiDocLayout from "@/components/TwoLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import NavigationContainer from "@/components/NavigationContainer";
import { videoGenCodes } from "@/lib/constants/code-snippets-docs/apiDocs";
import { apiDocsEndpoints } from "@/lib/constants/code-snippets-docs/apiDocs";
const response = `
{
  "created": 1589478378,
  "data": [
    { "model": "tts-1"
      "url": "https://..."
    },
    { "model":"gemini"
      "url": "https://..."
    }
  ]
}

`;
const generateRequest = [
  {
    name: "models",
    type: "string[]",
    required: true,
    description: "Array of selected models for generating video from text.",
  },
  {
    name: "prompt",
    type: "string",
    required: true,
    description:
      "The text description to generate video from. Maximum length is 4096 characters.",
  },
  {
    name: "output_format",
    type: "'mp4' | 'mov'",
    required: false,
    description:
      "The output video format. Supported values are 'mp4' or 'mov'. Optional.",
  },
  {
    name: "duration",
    type: "number",
    required: false,
    description: "The duration of the generated video in seconds. Optional.",
  },
  {
    name: "aspect_ratio",
    type: "string",
    required: false,
    description:
      "The aspect ratio of the video (e.g., '16:9', '4:3'). Optional.",
  },
];

const videoEditRequest = [
  {
    name: "models",
    type: "string[]",
    required: true,
    description: "Array of selected models for video editing.",
  },
  {
    name: "prompt",
    type: "string",
    required: true,
    description: "The text description to guide the video editing process.",
  },
  {
    name: "videoUrl",
    type: "string",
    required: true,
    description:
      "A base64-encoded string or a web URL pointing to the video file to edit.",
  },
];

export default function ApiVideoGenerationDocs() {
  return (
    <div className=" ml-10">
      {/* intro */}
      <section className="mb-10">
        <h2 data-section="video-generation" className="text-3xl font-bold mb-4">
          Video Generation API
        </h2>
        <ApiDocLayout
          leftContent={
            <Card className="bg-background p-4">
              <div className="text-muted-foreground">
                <p className="text-muted-foreground">
                  Learn how to generate videos from text or edit video by text
                  combining multiple audio models.
                </p>
                <h3>The API supports three primary operations:</h3>
                <ul>
                  <li className="text-muted-foreground">
                    <strong className="text-black dark:text-white">
                      Create video : &nbsp;
                    </strong>
                    Generates video from the input text.
                  </li>
                  <li>
                    <strong className="text-black dark:text-white">
                      Edit video :&nbsp;
                    </strong>
                    Edits a given video content base on text description.
                  </li>
                </ul>
              </div>
            </Card>
          }
          rightContent={
            <Card className="bg-background p-4 mt-5">
              <h2 className="text-3xl font-bold mb-4">Authentication</h2>
              <p className="text-muted-foreground mb-4">
                All API requests require authentication using an API key.
              </p>
              {/* Base URL and Endpoint */}
              <div className="bg-muted/50 mb-4 p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">Base URL</h4>
                <RenderCode
                  code={`${apiDocsEndpoints.BaseUrl}/video`}
                  language="bash"
                  className="text-sm block mb-2"
                  showLanguage={false}
                  isLink={true}
                />
              </div>
              <p className="text-muted-foreground mb-4">
                You can obtain an API key by &nbsp;{" "}
                <Link href={"/"} target="_blank" className="text-blue-600">
                  registering for an account
                </Link>{" "}
                &nbsp; and navigating to the API Keys section in your dashboard.
              </p>
            </Card>
          }
        />
      </section>
      <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />
      {/* text to image */}
      <section className="mt-5 mb-10">
        <ApiDocLayout
          leftContent={
            <Card className="bg-background p-4">
              <h2 className="text-3xl font-bold mb-4">Text-to-Video API</h2>
              <div className="mb-4 text-muted-foreground">
                <p>
                  Generates videos from the input text with multiple video
                  models.
                </p>
              </div>
              <section className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Request Body</h3>
                <div className="space-y-6">
                  {generateRequest.map((field, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{field.name}</span>
                        <span className="text-muted-foreground font-mono">
                          {field.type}
                        </span>
                        <span
                          className={
                            field.required
                              ? "text-red-500"
                              : "text-muted-foreground"
                          }
                        >
                          {field.required ? "Required" : "Optional"}
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        {field.description}
                      </p>
                      <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />
                    </div>
                  ))}
                </div>
              </section>
            </Card>
          }
          rightContent={
            <Card className="bg-background p-4">
              <div className="mb-4 mt-4">
                <h4 className="font-semibold p-3">video generation endpoint</h4>
                <RenderCode
                  code={apiDocsEndpoints.video.generate}
                  language="bash"
                  className="text-sm"
                  showLanguage={false}
                  isLink={true}
                />
              </div>
              <div className="mb-7">
                <RenderCode
                  showLanguage={false}
                  title="Example request body"
                  code={videoGenCodes.body}
                  language="json"
                />
              </div>
              <div className="mb-6">
                <Tabs defaultValue="python">
                  <TabsList>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="node">Node.js</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                  </TabsList>
                  <TabsContent value="python">
                    <RenderCode
                      showLanguage={false}
                      title="Example request "
                      code={videoGenCodes.python}
                      language="python"
                    />
                  </TabsContent>
                  <TabsContent value="node">
                    <RenderCode
                      showLanguage={false}
                      title="Example request "
                      code={videoGenCodes.javascript}
                      language="javascript"
                    />
                  </TabsContent>
                  <TabsContent value="curl">
                    <RenderCode
                      showLanguage={false}
                      title="Example request "
                      code={videoGenCodes.curl}
                      language="bash"
                    />
                  </TabsContent>
                </Tabs>
              </div>
              <div className="">
                <RenderCode
                  showLanguage={false}
                  title="Example response"
                  language="json"
                  code={response}
                />
              </div>
            </Card>
          }
        />
        <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />
      </section>
      {/* Create video edit */}
      <section className="">
        <ApiDocLayout
          leftContent={
            <Card className="bg-background p-4">
              <h2
                data-section="video-generation-edits"
                className="text-3xl font-bold mb-3"
              >
                Edit Video
              </h2>
              <p className="text-muted-foreground mb-5">
                Edit a video content base on description prompt.
              </p>

              <h2 className="text-xl font-semibold mb-4">Request body</h2>
              {videoEditRequest.map((field, index) => (
                <div key={index} className="space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{field.name}</span>
                    <span className="text-muted-foreground font-mono">
                      {field.type}
                    </span>
                    <span
                      className={
                        field.required
                          ? "text-red-500"
                          : "text-muted-foreground"
                      }
                    >
                      {field.required ? "Required" : "Optional"}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{field.description}</p>
                  <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />
                </div>
              ))}
            </Card>
          }
          rightContent={
            <Card className="bg-background p-4 mb-10">
              <div className="mb-4 mt-4">
                <h4 className="font-semibold p-3">video edit endpoint</h4>
                <RenderCode
                  code={apiDocsEndpoints.video.edit}
                  language="bash"
                  className="text-sm"
                  showLanguage={false}
                  isLink={true}
                />
              </div>
              <div className="mb-8">
                <RenderCode
                  showLanguage={false}
                  title="Example request body"
                  code={videoGenCodes.editBody}
                  language="json"
                />
              </div>
              <div className="mb-5">
                <Tabs defaultValue="javascript">
                  <TabsList>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                  </TabsList>
                  <TabsContent value="javascript">
                    <RenderCode
                      showLanguage={false}
                      title="Example request"
                      language="javascript"
                      code={videoGenCodes.editJavascript}
                    />
                  </TabsContent>
                  <TabsContent value="curl">
                    <RenderCode
                      showLanguage={false}
                      title="Example request"
                      language="bash"
                      code={videoGenCodes.editCurl}
                    />
                  </TabsContent>
                  <TabsContent value="python">
                    <RenderCode
                      showLanguage={false}
                      title="Example request"
                      language="python"
                      code={videoGenCodes.editPython}
                    />
                  </TabsContent>
                </Tabs>
              </div>
              {/* response */}
              <div className="mt-5">
                <RenderCode
                  code={response}
                  showLanguage={false}
                  title="Response"
                />
              </div>
            </Card>
          }
        />
        <section></section>
      </section>
      <NavigationContainer
        preUrl="/docs/api-reference/introduction"
        previousTitle="Getting Started"
        // previousDescription="Return to the introduction or main guide"
        nextTitle=" Analytics & Monitoring"
        // nextDesciption=" Gain insights into system performance, user behavior, and API interactions through comprehensive analytics and monitoring tools."
        nextUrl=""
      />
    </div>
  );
}
