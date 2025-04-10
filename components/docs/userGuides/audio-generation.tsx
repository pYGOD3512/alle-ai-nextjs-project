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
import { GuidesAudiodeGeneration } from "@/lib/constants/code-snippets-docs/userGuides";
// Static data
const suggestions = [
  { title: "Text Generation", href: "/text-generation" },
  { title: "Image Generation", href: "/image-generation" },
  { title: "Video Generation", href: "/video-generation" },
];

const faqs = [
  {
    title: "Can I generate audio in multiple formats?",
    description:
      "Yes, you can generate audio in various formats such as MP3, WAV, and FLAC. Specify the desired format in your API request.",
  },
  {
    title: "Do you support real-time audio streaming?",
    description:
      "Yes, we support real-time audio streaming for applications that require immediate playback or processing of generated audio.",
  },
  {
    title: "What languages are supported for audio generation?",
    description:
      "Our models support a wide range of languages, including English, Spanish, French, German, and more. Check the model documentation for specific language support.",
  },
];

export default function AudioGenerationDocs() {
  // Filter models for audio generation (type: "audio")
  const audioModels = models.filter(
    (model) => model.type === "audio"
  ) as ModelDetails[];
  const [selectedModels, setSelectedModels] = useState([
    audioModels[0]?.name.toLowerCase().replace(/ /g, "_") || "",
  ]);
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="pb-16 w-full max-w-[100%] pr-4">
      <div className="space-y-8">
        {/* Title Section */}
        <div>
          <div className="prose prose-blue max-w-none">
            <p className="text-muted-foreground text-lg">
              {`The Alle-AI Model Hub offers a powerful API for generating
              high-quality audio using multiple state-of-the-art foundation
              models. Our unique multi-model approach enables seamless blending
              of different models' strengths in a single API call, eliminating
              the need to manage complex infrastructure or individual model
              endpoints. Whether you're creating music, speech, or sound
              effects, our API simplifies the process and enhances creative
              possibilities.`}
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
          <Tabs defaultValue="python" /* onValueChange={setActiveTab} */>
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
                {audioModels.map((model) => (
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
          <div className="space-y-6">
            <Tabs defaultValue="python" className="w-full">
              <TabsList>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="javascript">Node.js</TabsTrigger>
              </TabsList>
              <TabsContent value="python">
                <RenderCode
                  code={GuidesAudiodeGeneration.python}
                  language="python"
                  showLanguage={false}
                />
              </TabsContent>
              <TabsContent value="javascript">
                <RenderCode
                  code={GuidesAudiodeGeneration.javascript}
                  language="javascript"
                  showLanguage={false}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Response Format Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Response Format</h2>
          <p>The API response includes:</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              <code className="bg-gray-100 text-black px-1 rounded">
                audio_data
              </code>
              : Generated audio in binary format (Python) or URL (JavaScript)
            </li>
            <li>
              <code className="bg-gray-100 text-black px-1 rounded">
                metadata
              </code>
              : Object containing generation time, models used, and cost
            </li>
            <li>
              <code className="bg-gray-100 text-black px-1 rounded">error</code>
              : Error message if the generation failed
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
                  INVALID_API_KEY
                </code>
                : Ensure your API key is correct and has not expired.
              </li>
              <li>
                <code className="bg-gray-100 text-black px-1 rounded">
                  MODEL_NOT_FOUND
                </code>
                : Check that the model identifier is correct and supported.
              </li>
              <li>
                <code className="bg-gray-100 text-black px-1 rounded">
                  RATE_LIMIT_EXCEEDED
                </code>
                : Upgrade your plan or reduce the frequency of requests.
              </li>
              <li>
                <code className="bg-gray-100 text-black px-1 rounded">
                  INVALID_AUDIO_FORMAT
                </code>
                : Ensure the audio format specified is supported (e.g., MP3,
                WAV).
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
        <NavigationContainer
          previousTitle="Text Generation"
          previousDescription="Interacting with chat models"
          preUrl=""
          nextTitle="Audio Generation"
          nextDesciption="Learn interacting with audio models "
          nextUrl="/docs/user-guides/audio-generation"
        />
      </div>
    </div>
  );
}
