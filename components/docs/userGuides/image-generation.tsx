import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Copy, Info, CheckCircle2 } from "lucide-react";
import { models } from "@/lib/models";
import type { ModelDetails } from "@/lib/types";
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import RenderCode from "@/components/RenderCode";
import { GuidesImageGeneration } from "@/lib/constants/code-snippets-docs/userGuides";
import NavigationContainer from "@/components/NavigationContainer";
// Static data
const suggestions = [
  { title: "Text Generation", href: "/text-generation" },
  { title: "Audio Generation", href: "/audio-generation" },
  { title: "Working with Files", href: "/working-with-files" },
];

const faqs = [
  {
    title: "Can I choose just a single model?",
    description:
      "No, we encourage the use of multiple models to achieve the best results. Using a variety of models helps ensure a broader range of creative outputs and greater flexibility.",
  },
  {
    title: "Do we support streaming of responses?",
    description:
      "Yes, we support streaming of responses. This allows for faster processing and real-time feedback, making it ideal for applications where you need quick updates without waiting for a full response.",
  },
  {
    title: "What are the error messages and how can I avoid them?",
    description: (
      <>
        Read more on{" "}
        <a href="your-link-here" className="text-blue-500 hover:underline">
          error messages and their corresponding meaning and how to avoid them
          here
        </a>
        .
      </>
    ),
  },
];

export default function ImageGenerationDocs() {
  const imageModels = models.filter(
    (model) => model.type === "image"
  ) as ModelDetails[];
  const [selectedModels, setSelectedModels] = useState([
    imageModels[0]?.name.toLowerCase().replace(/ /g, "_") || "",
  ]);
  const [expanded, setExpanded] = useState<number | null>(null);

  // Code examples for both languages
  const getCodeExamples = (modelNames: string[]) => [
    {
      language: "python",
      code: `import alleai

client = alleai.Client(api_key="[YOUR API KEY HERE]")

# Example 1: Basic image generation
response = client.generate_image(
    prompt="A futuristic cityscape at sunset, highly detailed",
    models=${JSON.stringify(modelNames)},
    size="1024x1024"
)

# Save the generated image
with open("output.png", "wb") as f:
    f.write(response.image_data)

# Example 2: Advanced options
response = client.generate_image(
    prompt="A serene mountain landscape with a lake",
    models=${JSON.stringify(modelNames)},
    size="1024x1024",
    negative_prompt="blurry, low quality, distorted",
    num_outputs=1,
    seed=42,  # For reproducible results
    style_preset="photographic"  # Available presets: photographic, digital-art, anime, cinematic
)

# Access response metadata
print(f"Generation time: {response.metadata.generation_time}s")
print(f"Models used: {response.metadata.models}")
print(f"Total cost: {response.metadata.cost} credits")`,
    },
    {
      language: "javascript",
      code: `const alleai = require('alleai');

const client = new alleai.Client({ apiKey: '[YOUR API KEY HERE]' });

async function generateImage() {
  try {
    // Example 1: Basic image generation
    const response = await client.generateImage({
      prompt: 'A futuristic cityscape at sunset, highly detailed',
      models: ${JSON.stringify(modelNames)},
      size: '1024x1024'
    });

    // Save the generated image
    const fs = require('fs');
    fs.writeFileSync('output.png', response.imageData);

    // Example 2: Advanced options
    const advancedResponse = await client.generateImage({
      prompt: 'A serene mountain landscape with a lake',
      models: ${JSON.stringify(modelNames)},
      size: '1024x1024',
      negativePrompt: 'blurry, low quality, distorted',
      numOutputs: 1,
      seed: 42,  // For reproducible results
      stylePreset: 'photographic'  // Available presets: photographic, digital-art, anime, cinematic
    });

    // Access response metadata
    console.log(\`Generation time: \${response.metadata.generationTime}s\`);
    console.log(\`Models used: \${response.metadata.models}\`);
    console.log(\`Total cost: \${response.metadata.cost} credits\`);
  } catch (error) {
    console.error('Error generating image:', error);
  }
}

generateImage();`,
    },
  ];

  return (
    <div className="pb-16 w-full max-w-[100%] pr-4">
      {" "}
      {/* Added right padding */}
      <div className="space-y-8">
        {/* Title Section */}
        <div>
          <div className="prose prose-blue max-w-none">
            <p className="text-muted-foreground text-lg">
              The Alle-AI Model Hub provides a powerful API that enables
              high-quality image generation using multiple state-of-the-art
              foundation models. Our unique multi-model approach allows you to
              combine different models' strengths in a single API call, without
              managing complex infrastructure or individual model endpoints.
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
                {imageModels.map((model) => (
                  <tr
                    key={model.name}
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
                  code={GuidesImageGeneration.python}
                  language="python"
                  showLanguage={false}
                />
              </TabsContent>
              <TabsContent value="javascript">
                <RenderCode
                  code={GuidesImageGeneration.javascript}
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
                image_data
              </code>
              : Generated image in binary format (Python) or URL (JavaScript)
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
          previousTitle="Audio Generation"
          previousDescription="Interacting with audio models"
          preUrl="/docs/user-guides/audio-generation"
          nextTitle="Video Generation"
          nextDesciption="Learn interacting with video models "
          nextUrl="/docs/user-guides/video-generation"
        />
      </div>
    </div>
  );
}
