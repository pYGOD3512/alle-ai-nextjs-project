import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Check,
  Copy,
  MessageCircle,
  Image,
  Code2,
  Volume2,
  Mic,
  Shield,
  Settings,
  Clock,
  BookOpen,
} from "lucide-react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";

const nextSteps = [
  {
    name: "Chat Completions",
    description:
      "Learn more about generating text responses to natural language prompts",
    icon: <MessageCircle className="w-6 h-6" />,
    link: "#",
  },
  {
    name: "Image Generation",
    description: "Generate images using our DALL·E model",
    icon: <Image className="w-6 h-6" />,
    link: "#",
  },

  {
    name: "Text-to-speech",
    description:
      "Generate human-like voice recordings with our text-to-speech model",
    icon: <Volume2 className="w-6 h-6" />,
    link: "#",
  },
  {
    name: "Speech-to-text",
    description:
      "Create transcriptions of voice recordings with our Whisper model",
    icon: <Mic className="w-6 h-6" />,
    link: "#",
  },
  {
    name: "Video generation",
    description:
      "Analyze and filter user-created content with our moderation model",
    icon: <Shield className="w-6 h-6" />,
    link: "#",
  },
  {
    name: "Video generation",
    description: "Fine-tune our models with your own data",
    icon: <Settings className="w-6 h-6" />,
    link: "#",
  },
  {
    name: "Batch",
    description: "Batch requests for async jobs",
    icon: <Clock className="w-6 h-6" />,
    link: "#",
  },
  {
    name: "Full API Reference",
    description: "View the full REST API reference for OpenAI",
    icon: <BookOpen className="w-6 h-6" />,
    link: "#",
  },
];

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={copyToClipboard}
        className="absolute right-2 top-2 p-2 rounded-md hover:bg-gray-700 transition-colors"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400" />
        )}
      </button>
      <pre className="mt-2">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};

export default function Quickstart() {
  const [installToggle, setInstallToggle] = useState("python");
  const [apiToggle, setApiToggle] = useState("python");

  useEffect(() => {
    Prism.highlightAll();
  }, [installToggle, apiToggle]);

  const CodeToggle = ({ value, onChange }) => {
    return (
      <ToggleGroup
        type="single"
        className="bg-black p-1 rounded-md w-1/4"
        value={value}
        onValueChange={(value) => {
          if (value) onChange(value);
        }}
      >
        <ToggleGroupItem
          value="python"
          className="data-[state=on]:bg-accent w-1/2 data-[state=on]:dark:text-white text-white hover:bg-accent/10 px-4 py-2 transition-colors"
        >
          Python
        </ToggleGroupItem>
        <ToggleGroupItem
          value="javascript"
          className="data-[state=on]:bg-accent data-[state=on]:dark:text-white text-white hover:bg-accent/10 px-4 py-2 transition-colors"
        >
          Javascript
        </ToggleGroupItem>
      </ToggleGroup>
    );
  };

  const installCommands = {
    python: "pip install alle-ai",
    javascript: "npm install alle-ai",
  };

  const apiCode = {
    python: `import alleai

# Initialize the client
client = alleai.Client(api_key="your_api_key")

# Make a request
response = client.generate_text(prompt="Hello, world!")
print(response)`,
    javascript: `const alleai = require('alleai');

// Initialize the client
const client = new alleai.Client({ apiKey: 'your_api_key' });

// Make a request
client.generateText({ prompt: 'Hello, world!' })
  .then(response => console.log(response))
  .catch(error => console.error(error));`,
  };

  return (
    <div className="text-base">
      <section className="mb-6">
        <p className="text-muted-foreground text-lg">
          The Alle-AI API brings together the best AI models, including ChatGPT,
          Claude, Gemini and more into one powerful platform. Whether you want
          to chat, generate images, create audio, or produce videos, Alle-AI
          makes it easy and seamless. This guide will show you how to use the
          API to generate natural conversations, create smart search embeddings,
          and turn text into stunning visuals, sound, and video.
        </p>
      </section>

      <section className="mb-6">
        <h2 id="create_key" className="font-bold text-3xl mb-3">
          Create and export an API key
        </h2>
        <p className="leading-8">
          <span className="text-blue-600 font-semibold">
            <Link href="/developer" target="_blank">
              Create an API key in the dashboard here.{" "}
            </Link>
          </span>
          Once you generate your API key, store it securely in a safe location,
          such as a{" "}
          <span className="bg-black p-1 rounded-md text-blue-600">.env</span>{" "}
          file. Then, import it into your code when needed.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-3xl font-bold mb-3">Install the SDK</h2>
        <div className="mb-5">
          <CodeToggle value={installToggle} onChange={setInstallToggle} />
        </div>
        <CodeBlock
          code={installCommands[installToggle]}
          language={installToggle}
        />
      </section>

      <section className="mb-6">
        <h2 className="text-3xl font-bold mb-3">Make your first API request</h2>
        <p className="mb-6">
          With your Alle-AI API key set as an environment variable, you're ready
          to start using our platform. For now, we only support access through{" "}
          <span className="text-blue-600 font-semibold">Our official SDK</span>,
          as shown below.
        </p>
        <div className="mb-5">
          <CodeToggle value={apiToggle} onChange={setApiToggle} />
        </div>
        <CodeBlock code={apiCode[apiToggle]} language={apiToggle} />
      </section>

      <section className="mb-6">
        <h2 className="text-3xl font-bold mb-3">Next Steps</h2>
        <p className="text-muted-foreground text-lg mb-6">
          Now that you've made your first Alle-AI API request, you can explore
          the following resources:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nextSteps.map((step, index) => (
            <Link
              key={index}
              href={step.link}
              className="p-4 border rounded-lg hover:border-blue-600 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                {step.icon}
                <h3 className="font-semibold">{step.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
