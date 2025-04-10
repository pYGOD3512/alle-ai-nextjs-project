import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Info, CheckCircle2 } from "lucide-react";
import { models } from "@/lib/models";
import type { ModelDetails } from "@/lib/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import RenderCode from "@/components/RenderCode";
import NavigationContainer from "@/components/NavigationContainer";
const faqs = [
  {
    title: "Can I use multiple models for text generation?",
    description:
      "Yes, you can combine multiple models in a single API call to leverage their unique strengths and improve the quality of generated text.",
  },
  {
    title: "Do you support streaming for text generation?",
    description:
      "Yes, we support streaming for real-time text generation, allowing you to receive responses incrementally as they are generated.",
  },
  {
    title: "What are the rate limits for text generation?",
    description:
      "Rate limits depend on your subscription plan. Check our pricing page for more details.",
  },
];

export default function TextGenerationDocs() {
  // Filter models for text generation (type: "chat")
  const chatModels = models.filter(
    (model) => model.type === "chat"
  ) as ModelDetails[];
  const [selectedModels, setSelectedModels] = useState([
    chatModels[0]?.name.toLowerCase().replace(/ /g, "_") || "",
  ]);
  const [activeTab, setActiveTab] = useState("python");
  const [expanded, setExpanded] = useState<number | null>(null);

  // Example code for Python
  const exampleCodePython = (modelNames: string[]) => `from alleai.core import AlleAIClient

# Initialize client
client = AlleAIClient(api_key="[YOUR API KEY HERE]")

# Basic text generation
response = client.chat.completions({
    "models": ["gpt-4o", "deepseek-r1", "claude-3.5-sonnet"],
    "messages": [
        {"system": "You are a helpful assistant."},
        {
            "user": [
                {"type": "text", "text": "What is photosynthesis?"}
            ]
        }
    ],
    "response_format": {"type": "text"}
})

# Print the generated text
print(response.text)

# For advanced requests, refer to API reference documentation

# Access response metadata
print(f"Generation time: {response.metadata.generation_time}s")
print(f"Models used: {response.metadata.models}")
print(f"Total cost: {response.metadata.cost} credits")
`;

  // Example code for JavaScript
  const exampleCodeJS = (modelNames: string[]) => `const client = require("alleai-sdk");

async function runChat() {
    const alleai = new client.AlleAI({
        apiKey: "[YOUR API KEY HERE]"
    });

    const chat = await alleai.chat.completions({
        models: ["gpt-4o", "deepseek-r1", "claude-3.5-sonnet"],
        messages: [
            { system: "You are a helpful assistant." },
            {
                user: [
                    {
                        type: "text",
                        text: "What is photosynthesis?"
                    }
                ]
            }
        ],
        response_format: { type: "text" }
    });

    console.log(chat);
}

runChat();
`;

  return (
    <div className="pb-16 w-full max-w-[100%] pr-4">
      <div className="space-y-8">
        {/* Title Section */}
        <div>
          <div className="prose prose-blue max-w-none">
            <p className="text-muted-foreground text-lg">
              The Alle-AI Model Hub provides a powerful API for generating
              high-quality text using multiple state-of-the-art language models.
              Combine the strengths of different models in a single API call for
              enhanced creativity and accuracy.
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
                {chatModels.map((model) => (
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
                  code={exampleCodePython(selectedModels)}
                  language="python"
                  showLanguage={true}
                />
              </TabsContent>
              <TabsContent value="javascript">
                <RenderCode
                  code={exampleCodeJS(selectedModels)}
                  language="javascript"
                  showLanguage={true}
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
              <code className="bg-gray-100 text-black px-1 rounded">text</code>:
              Generated text content
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
