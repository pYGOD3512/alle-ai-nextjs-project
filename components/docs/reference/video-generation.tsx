import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Info, CheckCircle2 } from "lucide-react";
import { models } from "@/lib/models";
import type { ModelDetails } from "@/lib/types";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import Link from "next/link";

// Static data
const suggestions = [
  { title: "Text Generation", href: "/text-generation" },
  { title: "Image Generation", href: "/image-generation" },
  { title: "Audio Generation", href: "/audio-generation" },
];

const faqs = [
  {
    title: "What video formats are supported?",
    description:
      "We support popular video formats like MP4, AVI, and MOV. Check the API documentation for a full list of supported formats.",
  },
  {
    title: "Can I generate videos from text prompts?",
    description:
      "Yes, you can generate videos from text prompts using our state-of-the-art models. Specify the prompt and desired video length in your API request.",
  },
  {
    title: "How do I handle video processing errors?",
    description:
      "Common errors include unsupported formats or exceeding file size limits. Refer to the error handling section for detailed solutions.",
  },
];

export default function VideoGenerationDocs() {
  // Filter models for video generation (type: "video")
  const videoModels = models.filter(
    (model) => model.type === "video"
  ) as ModelDetails[];
  const [selectedModels, setSelectedModels] = useState([
    videoModels[0]?.name.toLowerCase().replace(/ /g, "_") || "",
  ]);
  const [activeTab, setActiveTab] = useState("python");
  const [expanded, setExpanded] = useState<number | null>(null);

  // Example code for Python
  const exampleCodePython = (modelNames: string[]) => (
    <pre className="language-python bg-gray-900 text-white p-4 rounded-md">
      <code>
        {`import alleai

client = alleai.Client(api_key="[YOUR API KEY HERE]")

# Example 1: Generate a video from a text prompt
response = client.generate_video(
    prompt="A futuristic cityscape with flying cars at sunset",
    models=${JSON.stringify(modelNames)},
    duration=10,  # Duration in seconds
    resolution="1080p"
)

# Save the generated video
with open("output.mp4", "wb") as f:
    f.write(response.video_data)

# Example 2: Apply style transfer to a video
with open("input.mp4", "rb") as file:
    response = client.process_video(
        file=file,
        task="style_transfer",
        style="van_gogh",  # Artistic style
        models=${JSON.stringify(modelNames)}
    )

# Save the styled video
with open("styled_output.mp4", "wb") as f:
    f.write(response.video_data)

# Example 3: Interpolate frames for smoother video
with open("input.mp4", "rb") as file:
    response = client.process_video(
        file=file,
        task="frame_interpolation",
        models=${JSON.stringify(modelNames)}
    )

# Save the interpolated video
with open("interpolated_output.mp4", "wb") as f:
    f.write(response.video_data)`}
      </code>
    </pre>
  );

  // Example code for JavaScript
  const exampleCodeJS = (modelNames: string[]) => (
    <pre className="language-javascript bg-gray-900 text-white p-4 rounded-md">
      <code>
        {`const alleai = require('alleai');
const fs = require('fs');

const client = new alleai.Client({ apiKey: '[YOUR API KEY HERE]' });

async function generateVideo() {
  try {
    // Example 1: Generate a video from a text prompt
    const response = await client.generateVideo({
      prompt: 'A futuristic cityscape with flying cars at sunset',
      models: ${JSON.stringify(modelNames)},
      duration: 10,  // Duration in seconds
      resolution: '1080p'
    });

    fs.writeFileSync('output.mp4', response.videoData);

    // Example 2: Apply style transfer to a video
    const videoFile = fs.readFileSync('input.mp4');
    const styleResponse = await client.processVideo({
      file: videoFile,
      task: 'style_transfer',
      style: 'van_gogh',  // Artistic style
      models: ${JSON.stringify(modelNames)}
    });

    fs.writeFileSync('styled_output.mp4', styleResponse.videoData);

    // Example 3: Interpolate frames for smoother video
    const interpolationResponse = await client.processVideo({
      file: videoFile,
      task: 'frame_interpolation',
      models: ${JSON.stringify(modelNames)}
    });

    fs.writeFileSync('interpolated_output.mp4', interpolationResponse.videoData);
  } catch (error) {
    console.error('Error:', error);
  }
}

generateVideo();`}
      </code>
    </pre>
  );

  useEffect(() => {
    Prism.highlightAll();
  }, [activeTab]);

  return (
    <div className="pb-16 w-full max-w-[100%] pr-4">
      <div className="space-y-8">
        {/* Title Section */}
        <div>
          <div className="prose prose-blue max-w-none">
            <p className="text-muted-foreground text-lg">
              The Alle-AI Model Hub provides a powerful API for generating and
              processing high-quality videos. Whether you need to create videos
              from text prompts, apply artistic styles, or enhance video
              smoothness, our API makes it easy to integrate video generation
              into your applications.
            </p>
          </div>
        </div>

        {/* Prerequisites Section */}
        <div className="bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-gray-500 dark:text-gray-300 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Prerequisites
              </h3>
              <p className="text-gray-800 dark:text-gray-200">
                This guide assumes basic familiarity with:
              </p>
              <ul className="list-none mt-2 space-y-1">
                {[
                  "REST APIs",
                  "Python or JavaScript/Node.js",
                  "Command line interface",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center text-gray-800 dark:text-gray-200"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Installation Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Installation</h2>
          <Tabs defaultValue="python" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="python">
              <div className="bg-zinc-800 text-white p-4 rounded-md">
                <pre className="text-sm">pip install alleai</pre>
              </div>
            </TabsContent>
            <TabsContent value="javascript">
              <div className="bg-zinc-800 text-white p-4 rounded-md">
                <pre className="text-sm">npm install alleai</pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Available Models Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Available Models</h2>
          <p className="text-muted-foreground mb-4">
            Each model has unique strengths and specializations. You can use
            multiple models in a single API call by including their identifiers
            in your request:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border border-gray-200 text-left font-semibold">
                    Model Identifier
                  </th>
                  <th className="py-2 px-4 border border-gray-200 text-left font-semibold">
                    Provider
                  </th>
                  <th className="py-2 px-4 border border-gray-200 text-left font-semibold">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {videoModels.map((model) => (
                  <tr
                    key={model.id}
                    className="hover:bg-gray-50 dark:hover:bg-zinc-800"
                  >
                    <td className="py-2 px-4 border border-gray-200 font-mono text-sm">
                      {model.name.toLowerCase().replace(/ /g, "_")}
                    </td>
                    <td className="py-2 px-4 border border-gray-200">
                      {model.provider}
                    </td>
                    <td className="py-2 px-4 border border-gray-200">
                      {model.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Code Examples Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Code Examples</h2>
          <p className="text-muted-foreground mb-4">
            Below are comprehensive examples showing both basic and advanced
            usage of the API, including multi-model generation:
          </p>
          <Tabs defaultValue="python" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="python">
              <div className="relative rounded-md">
                {exampleCodePython(selectedModels)}
                <Button
                  className="absolute top-2 right-2"
                  variant="ghost"
                  onClick={() => {
                    const codeElement = document.querySelector(
                      "pre.language-python code"
                    );
                    if (codeElement?.textContent) {
                      navigator.clipboard.writeText(codeElement.textContent);
                    }
                  }}
                >
                  <Copy size={16} />
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="javascript">
              <div className="relative rounded-md">
                {exampleCodeJS(selectedModels)}
                <Button
                  className="absolute top-2 right-2"
                  variant="ghost"
                  onClick={() => {
                    const codeElement = document.querySelector(
                      "pre.language-javascript code"
                    );
                    if (codeElement?.textContent) {
                      navigator.clipboard.writeText(codeElement.textContent);
                    }
                  }}
                >
                  <Copy size={16} />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Response Format Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Response Format</h2>
          <p>The API response includes:</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              <code className="bg-gray-100 text-black px-1 rounded">
                video_data
              </code>
              : Generated or processed video in binary format (Python) or URL
              (JavaScript)
            </li>
            <li>
              <code className="bg-gray-100 text-black px-1 rounded">
                metadata
              </code>
              : Object containing generation time, models used, and cost
            </li>
            <li>
              <code className="bg-gray-100 text-black px-1 rounded">error</code>
              : Error message if the generation or processing failed
            </li>
          </ul>
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">
              Read More on Error Handling and Error Messages
            </h3>
            <p className="text-muted-foreground">
              Here are some common error messages you might encounter and how to
              resolve them:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <code className="bg-gray-100 text-black px-1 rounded">
                  INVALID_VIDEO_FORMAT
                </code>
                : Ensure the video format is supported.
              </li>
              <li>
                <code className="bg-gray-100 text-black px-1 rounded">
                  VIDEO_SIZE_EXCEEDED
                </code>
                : Compress or split the video to reduce its size.
              </li>
              <li>
                <code className="bg-gray-100 text-black px-1 rounded">
                  PROCESSING_FAILED
                </code>
                : Check the video content and try again.
              </li>
            </ul>
          </div>
        </div>

        {/* FAQs Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b pb-3">
                <div
                  className="cursor-pointer flex items-center justify-between text-lg font-medium"
                  onClick={() => setExpanded(expanded === index ? null : index)}
                >
                  <span>{faq.title}</span>
                  <span>
                    {expanded === index ? (
                      <ChevronUp className="text-muted-foreground" />
                    ) : (
                      <ChevronDown className="text-muted-foreground" />
                    )}
                  </span>
                </div>
                {expanded === index && (
                  <div className="mt-2 text-muted-foreground">
                    {faq.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* What to Read Next Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">What to Read Next</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {suggestions.map((suggestion, index) => (
              <Link key={index} href={suggestion.href}>
                <div className="block p-4 bg-black text-white rounded-lg shadow-md dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-zinc-300 transition duration-200">
                  <div className="flex items-center justify-between">
                    <span>{suggestion.title}</span>
                    <ChevronRight className="text-current" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
