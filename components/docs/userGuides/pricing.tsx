import { useState } from "react";
import { models } from "@/lib/models";
import { ChevronDown, ChevronUp } from "lucide-react";
import NavigationContainer from "@/components/NavigationContainer";

// Define the Model interface
interface Model {
  id: string;
  name: string;
  type: string;
}

const PricingPage: React.FC = () => {
  // Group models by type
  const modelsByType: Record<string, Model[]> = models.reduce(
    (acc: Record<string, Model[]>, model: Model) => {
      if (!acc[model.type]) {
        acc[model.type] = [];
      }
      acc[model.type].push(model);
      return acc;
    },
    {}
  );

  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>(
    {}
  );

  const handleExpand = (type: string): void => {
    setExpandedTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const renderModelTable = (type: string) => {
    const modelsForType: Model[] = modelsByType[type] || [];
    const isExpanded: boolean = expandedTypes[type] || false;
    const displayedModels: Model[] = isExpanded
      ? modelsForType
      : modelsForType.slice(0, 5);

    if (modelsForType.length === 0) return null;

    const calculatePricing = (modelName: string) => {
      const nameLength: number = modelName.length;
      const inputTokens: number = 1 + nameLength / 10; // Base $1 + length-based factor
      const outputTokens: number = inputTokens * 2; // Double the input cost
      const pricePerThousand: number = 5 + Math.floor(nameLength / 5); // Base $5 + $1 per 5 chars

      return {
        inputTokens: `$${inputTokens.toFixed(2)}`,
        outputTokens: `$${outputTokens.toFixed(2)}`,
        pricePerThousand: `$${pricePerThousand.toFixed(2)}`,
      };
    };

    return (
      <div key={type} className="mb-12">
        <h2 className="text-xl font-bold mb-4 capitalize">{type} Models</h2>
        <p className="text-muted-foreground mb-6">
          {type === "chat" && ""}
          {type === "image" && ""}
          {type === "audio" && ""}
          {type === "video" && ""}
          {type === "multimodal" && ""}
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-300 dark:border-accent">
              <th className="p-2 text-left  text-xs font-bold uppercase">
                Model
              </th>
              <th className="p-2 text-center text-xs font-bold uppercase">
                Input Tokens (Per Million)
              </th>
              <th className="p-2 text-center text-xs font-bold uppercase">
                Output Tokens (Per Million)
              </th>
              <th className="p-2 text-center text-xs font-bold uppercase">
                Price per 1,000 Requests
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedModels.map((model: Model) => {
              const pricing = calculatePricing(model.name);
              return (
                <tr
                  key={model.id}
                  className="border-b border-gray-300 dark:border-accent hover:bg-accent"
                >
                  <td className="p-2 text-left text-xs text-muted-foreground">
                    {model.name}
                  </td>
                  <td className="p-2 text-center text-muted-foreground text-xs">
                    {pricing.inputTokens}
                  </td>
                  <td className="p-2 text-center text-muted-foreground text-xs">
                    {pricing.outputTokens}
                  </td>
                  <td className="p-2 text-center text-muted-foreground text-xs">
                    {pricing.pricePerThousand}
                  </td>
                </tr>
              );
            })}
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

  const modelTypes: ("chat" | "image" | "audio" | "video" | "multimodal")[] = [
    "chat",
    "image",
    "audio",
    "video",
    "multimodal",
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-muted-foreground max-w-3xl mb-12">
        <p>
          AlleAI unites the world’s best AI models for chat, image, audio, and
          video into a single, powerful API. Our credit-based system makes
          accessing these diverse capabilities simple, transparent, and
          cost-effective. With one API request, you can combine multiple models
          to generate or edit text, visuals, audio, or videos, tailored to your
          project’s needs.
        </p>
      </div>

      {/* Model Pricing */}
      <div className="mb-12">
        {modelTypes.map((type) => renderModelTable(type))}
      </div>

      {/* FAQs */}
      {/* Footer */}
      <NavigationContainer
        nextUrl="/docs/user-guides/models"
        nextTitle="Models"
        preUrl="/"
        previousTitle="Quickstart"
      />
    </div>
  );
};

export default PricingPage;
