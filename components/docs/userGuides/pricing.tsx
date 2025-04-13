// @ts-nocheck
import { useState } from "react";
import { models } from "@/lib/models";
import { ChevronDown, ChevronUp } from "lucide-react";
import NavigationContainer from "@/components/NavigationContainer";
const PricingPage = () => {
  // Group models by type
  const modelsByType = models.reduce((acc, model) => {
    if (!acc[model.type]) {
      acc[model.type] = [];
    }
    acc[model.type].push(model);
    return acc;
  }, {});

  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>(
    {}
  );

  const handleExpand = (type: string) => {
    setExpandedTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const renderModelTable = (type: string) => {
    const modelsForType = modelsByType[type] || [];
    const isExpanded = expandedTypes[type] || false;
    const displayedModels = isExpanded
      ? modelsForType
      : modelsForType.slice(0, 5);

    if (modelsForType.length === 0) return null;

    return (
      <div key={type} className="mb-12">
        <h2 className="text-2xl font-bold mb-4 capitalize">{type} Models</h2>
        <p className="text-muted-foreground mb-6">
          {type === "chat" &&
            "Engage in dynamic conversations with our powerful chat models. Perfect for building chatbots, virtual assistants, and more."}
          {type === "image" &&
            "Generate stunning visuals with our cutting-edge image models. Create unique artwork, realistic photos, and creative designs."}
          {type === "audio" &&
            "Process and analyze audio data with our advanced audio models. Transcribe speech, generate music, and enhance audio quality."}
          {type === "video" &&
            "Harness the power of video processing with our state-of-the-art models. Analyze video content, create special effects, and enhance video quality."}
          {type === "multimodal" &&
            "Experience the future with our multimodal models, combining different data types. These models can understand and generate content across text, images, and other modalities."}
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-black dark:border-white ">
              <th className="p-3 text-left">Model Name</th>
              <th className="p-3 text-left">Provider</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Price (per 1,000 requests)</th>
            </tr>
          </thead>
          <tbody>
            {displayedModels.map((model) => (
              <tr key={model.id} className="border-b hover:bg-accent">
                <td className="p-3">{model.name}</td>
                <td className="p-3">{model.provider}</td>
                <td className="p-3">{model.description}</td>
                <td className="p-3">${(Math.random() * 5 + 1).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {modelsForType.length > 5 && (
          <button
            onClick={() => handleExpand(type)}
            className="mt-4 flex items-center text-blue-500 hover:text-blue-700"
          >
            {isExpanded ? "Show Less" : "Show More"}
            {isExpanded ? (
              <ChevronUp className="ml-1 w-4 h-4" />
            ) : (
              <ChevronDown className="ml-1 w-4 h-4" />
            )}
          </button>
        )}
      </div>
    );
  };

  const modelTypes = ["chat", "image", "audio", "video", "multimodal"];

  return (
    <div className=" max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12"></div>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="border p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Free</h2>
          <p className="text-muted-foreground mb-4">
            Get started with basic access.
          </p>
          <ul className="mb-6 text-muted-foreground">
            <li className="mb-2">100 Free Requests/Month</li>
            <li className="mb-2">Limited Model Access</li>
          </ul>
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            Sign Up Free
          </button>
        </div>
        <div className="border p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Pro</h2>
          <p className="text-muted-foreground mb-4">
            For serious developers and businesses.
          </p>
          <ul className="mb-6 text-muted-foreground">
            <li className="mb-2">10,000 Requests/Month</li>
            <li className="mb-2">Access to All Models</li>
            <li className="mb-2">Priority Support</li>
          </ul>
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            Upgrade to Pro
          </button>
        </div>
        {/* Add more tiers as needed */}
      </div>

      {/* Model Pricing */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Model Pricing</h2>
        <p className="text-muted-foreground mb-6">
          Pricing is per 1,000 requests. See the details below.
        </p>
        {modelTypes.map((type) => renderModelTable(type))}
      </div>

      {/* Feature Comparison */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Feature Comparison</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="">
              <th className="p-3 text-left">Feature</th>
              <th className="p-3 text-left">Free</th>
              <th className="p-3 text-left">Pro</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b">
              <td className="p-3">Requests/Month</td>
              <td className="p-3">100</td>
              <td className="p-3">10,000</td>
            </tr>
            <tr className="border-b">
              <td className="p-3">Model Access</td>
              <td className="p-3">Limited</td>
              <td className="p-3">All</td>
            </tr>
            <tr className="border-b">
              <td className="p-3">Support</td>
              <td className="p-3">Standard</td>
              <td className="p-3">Priority</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* FAQs */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">How are requests counted?</h3>
            <p className="text-muted-foreground">
              A request is counted each time you send a query to an AI model.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              What payment methods are accepted?
            </h3>
            <p className="text-muted-foreground">
              We accept all major credit cards.
            </p>
          </div>
          {/* Add more FAQs */}
        </div>
      </div>

      {/* Footer */}
      <p className="text-center mb-5 text-muted-foreground">
        Contact us for custom pricing or enterprise solutions.
      </p>
      <NavigationContainer
        // nextDesciption="Explore Alle-AI models"
        nextUrl="/docs/user-guides/models"
        nextTitle="Models"
        preUrl="/"
        // previousDescription="Overview of our platform"
        previousTitle="Quickstart"
      />
    </div>
  );
};

export default PricingPage;
