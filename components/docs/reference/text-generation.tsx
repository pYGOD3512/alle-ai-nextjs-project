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
  { title: "Image Generation", href: "/image-generation" },
  { title: "Audio Generation", href: "/audio-generation" },
  { title: "Video Generation", href: "/video-generation" },
];

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
  const exampleCodePython = (modelNames: string[]) => (
    <pre className="language-python bg-gray-900 text-white p-4 rounded-md">
      <code>
        {`import alleai

client = alleai.Client(api_key="[YOUR API KEY HERE]")

# Example 1: Basic text generation
response = client.generate_text(
    prompt="Write a short story about a futuristic city",
    models=${JSON.stringify(modelNames)},
    max_tokens=500
)

# Print the generated text
print(response.text)

# Example 2: Advanced options
response = client.generate_text(
    prompt="Explain quantum computing in simple terms",
    models=${JSON.stringify(modelNames)},
    max_tokens=300,
    temperature=0.7,  # Controls creativity
    top_p=0.9,       # Controls diversity
    stop=["\\n", "###"]  # Stop sequences
)

# Access response metadata
print(f"Generation time: {response.metadata.generation_time}s")
print(f"Models used: {response.metadata.models}")
print(f"Total cost: {response.metadata.cost} credits")`}
      </code>
    </pre>
  );

  // Example code for JavaScript
  const exampleCodeJS = (modelNames: string[]) => (
    <pre className="language-javascript bg-gray-900 text-white p-4 rounded-md">
      <code>
        {`const alleai = require('alleai');

const client = new alleai.Client({ apiKey: '[YOUR API KEY HERE]' });

async function generateText() {
  try {
    // Example 1: Basic text generation
    const response = await client.generateText({
      prompt: 'Write a short story about a futuristic city',
      models: ${JSON.stringify(modelNames)},
      maxTokens: 500
    });
    
    console.log('Generated Text:', response.text);

    // Example 2: Advanced options
    const advancedResponse = await client.generateText({
      prompt: 'Explain quantum computing in simple terms',
      models: ${JSON.stringify(modelNames)},
      maxTokens: 300,
      temperature: 0.7,  // Controls creativity
      topP: 0.9,         // Controls diversity
      stop: ["\\n", "###"]  // Stop sequences
    });

    // Access response metadata
    console.log('Generation time:', advancedResponse.metadata.generationTime);
    console.log('Models used:', advancedResponse.metadata.models);
    console.log('Total cost:', advancedResponse.metadata.cost, 'credits');
  } catch (error) {
    console.error('Error:', error);
  }
}

generateText();`}
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
