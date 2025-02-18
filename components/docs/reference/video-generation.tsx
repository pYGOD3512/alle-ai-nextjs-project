import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Info, CheckCircle2 } from "lucide-react";
import { models } from "@/lib/models";
import type { ModelDetails } from "@/lib/types";
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import Link from "next/link";
import RenderCode from "@/components/RenderCode";
import NavigationContainer from "@/components/NavigationContainer";
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
  const [expanded, setExpanded] = useState<number | null>(null);

  // Code examples for both languages
  const getCodeExamples = (modelNames: string[]) => [
    {
      language: "python",
      code: `import alleai

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
    f.write(response.video_data)`
    },
    {
      language: "javascript",
      code: `const alleai = require('alleai');
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

    // Save the generated video
    fs.writeFileSync('output.mp4', response.videoData);

    // Example 2: Apply style transfer to a video
    const inputVideo = fs.readFileSync('input.mp4');
    const styledResponse = await client.processVideo({
      file: inputVideo,
      task: 'style_transfer',
      style: 'van_gogh',  // Artistic style
      models: ${JSON.stringify(modelNames)}
    });

    // Save the styled video
    fs.writeFileSync('styled_output.mp4', styledResponse.videoData);

    // Example 3: Interpolate frames for smoother video
    const interpolateResponse = await client.processVideo({
      file: inputVideo,
      task: 'frame_interpolation',
      models: ${JSON.stringify(modelNames)}
    });

    // Save the interpolated video
    fs.writeFileSync('interpolated_output.mp4', interpolateResponse.videoData);

    // Access response metadata
    console.log(\`Generation time: \${response.metadata.generationTime}s\`);
    console.log(\`Models used: \${response.metadata.models}\`);
    console.log(\`Total cost: \${response.metadata.cost} credits\`);
  } catch (error) {
    console.error('Error generating or processing video:', error);
  }
}

generateVideo();`
    }
  ];

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
          <Tabs defaultValue="python">
            <TabsList>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="python">
              <div className="bg-zinc-800 text-white p-4 rounded-md">
                <RenderCode language="bash" code={`pip install alleai`} />
              </div>
            </TabsContent>
            <TabsContent value="javascript">
              <div className="bg-zinc-800 text-white p-4 rounded-md">
                <RenderCode language="bash" code={`npm install alleai`} />
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
        <div className="space-y-4 mt-8">
          <h2 className="text-2xl font-bold">Code Examples</h2>
          <RenderCode
            languages={getCodeExamples(selectedModels)}
            toggle={true}
            maxHeight={400}
            className="w-full"
          />
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

        {/* Next Steps Section */}
        <NavigationContainer
          previousTitle="Video Generation"
          previousDescription="Interacting with video models"
          preUrl="/docs/user-guides/video-generation"
          nextTitle="File uploads"
          nextDesciption="Attaching files to request "
          nextUrl="/docs/user-guides/file-uploads"
        />
      </div>
    </div>
  );
}
