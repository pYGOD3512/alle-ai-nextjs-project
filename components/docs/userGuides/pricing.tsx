import { useState } from "react";
import { modelBasicInfo } from "@/lib/modelPricing";
import { ChevronDown, ChevronUp } from "lucide-react";
import NavigationContainer from "@/components/NavigationContainer";

// Define the Model interfaces based on our pricing types
type BaseModel = {
  id: string;
  name: string;
  type: "chat" | "image" | "audio" | "video" | "multimodal";
};

type ImageModel = BaseModel & {
  type: "image";
  capabilities: ("image-gen" | "image-edit")[];
  perImage: string;
  perThousandRequest: string;
};

type AudioModel = BaseModel & {
  type: "audio";
  capabilities: ("stt" | "tts" | "audio-gen")[];
  perMinInput: string;
  perSecGenerated: string;
  perTenThousandRequests: string;
};

type VideoModel = BaseModel & {
  type: "video";
  capabilities: ("text-video" | "video-edit")[];
  perSecGenerated: string;
  perThousandRequests: string;
};

type Model = BaseModel | ImageModel | AudioModel | VideoModel;

const PricingPage: React.FC = () => {
  // Group models by type
  const modelsByType: Record<string, Model[]> = modelBasicInfo.reduce(
    (acc: Record<string, Model[]>, model: Model) => {
      if (!acc[model.type]) {
        acc[model.type] = [];
      }
      acc[model.type].push(model);
      return acc;
    },
    {}
  );

  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({});

  const handleExpand = (type: string): void => {
    setExpandedTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // Helper function to format capabilities
  const formatCapabilities = (capabilities: string[]): string => {
    return capabilities.join(", ");
  };

  const renderModelTable = (type: string) => {
    const modelsForType: Model[] = modelsByType[type] || [];
    const isExpanded: boolean = expandedTypes[type] || false;
    const displayedModels: Model[] = isExpanded
      ? modelsForType
      : modelsForType.slice(0, 5);

    if (modelsForType.length === 0) return null;

    // Calculate placeholder pricing for chat models
    const calculateChatPricing = (modelName: string) => {
      const nameLength: number = modelName.length;
      const inputTokens: number = 1 + nameLength / 10;
      const outputTokens: number = inputTokens * 2;
      const pricePerThousand: number = 5 + Math.floor(nameLength / 5);

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
          {type === "chat" && "Pricing for chat-based language models"}
          {type === "image" && "Pricing for image generation and editing models"}
          {type === "audio" && "Pricing for audio processing and generation models"}
          {type === "video" && "Pricing for video generation and editing models"}
          {type === "multimodal" && "Pricing for multimodal AI models"}
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-300 dark:border-accent">
              <th className="p-2 text-left text-xs font-bold uppercase">
                Model
              </th>
              {type === "chat" ? (
                <>
                  <th className="p-2 text-center text-xs font-bold uppercase">
                    Input Tokens (Per Million)
                  </th>
                  <th className="p-2 text-center text-xs font-bold uppercase">
                    Output Tokens (Per Million)
                  </th>
                  <th className="p-2 text-center text-xs font-bold uppercase">
                    Price per 1,000 Requests
                  </th>
                </>
              ) : type === "image" ? (
                <>
                  <th className="p-2 text-center text-xs font-bold uppercase">
                    Capabilities
                  </th>
                  <th className="p-2 text-center text-xs font-bold uppercase">
                    Per Image (Standard)
                  </th>
                  <th className="p-2 text-center text-xs font-bold uppercase">
                    Price per 1,000 Requests
                  </th>
                </>
              ) : type === "audio" ? (
                <>
                  <th className="p-2 text-center text-xs font-bold uppercase">
                    Capabilities
                  </th>
                  <th className="p-2 text-center text-xs font-bold uppercase">
                    Per Min of Audio Input
                  </th>
                  <th className="p-2 text-center text-xs font-bold uppercase">
                    Per Sec of Generated Audio
                  </th>
                  <th className="p-2 text-center text-xs font-bold uppercase">
                    Price per 10,000 Requests
                  </th>
                </>
              ) : type === "video" ? (
                <>
                  <th className="p-2 text-center text-xs font-bold uppercase">
                    Capabilities
                  </th>
                  <th className="p-2 text-center text-xs font-bold uppercase">
                    Per Sec of Generated Video
                  </th>
                  <th className="p-2 text-center text-xs font-bold uppercase">
                    Price per 1,000 Requests
                  </th>
                </>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {displayedModels.map((model: Model) => {
              if (type === "chat") {
                const pricing = calculateChatPricing(model.name);
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
              } else if (type === "image" && "capabilities" in model) {
                const imageModel = model as ImageModel;
                return (
                  <tr
                    key={model.id}
                    className="border-b border-gray-300 dark:border-accent hover:bg-accent"
                  >
                    <td className="p-2 text-left text-xs text-muted-foreground">
                      {model.name}
                    </td>
                    <td className="p-2 text-center text-muted-foreground text-xs">
                      {formatCapabilities(imageModel.capabilities)}
                    </td>
                    <td className="p-2 text-center text-muted-foreground text-xs">
                      {imageModel.perImage}
                    </td>
                    <td className="p-2 text-center text-muted-foreground text-xs">
                      {imageModel.perThousandRequest}
                    </td>
                  </tr>
                );
              } else if (type === "audio" && "capabilities" in model) {
                const audioModel = model as AudioModel;
                return (
                  <tr
                    key={model.id}
                    className="border-b border-gray-300 dark:border-accent hover:bg-accent"
                  >
                    <td className="p-2 text-left text-xs text-muted-foreground">
                      {model.name}
                    </td>
                    <td className="p-2 text-center text-muted-foreground text-xs">
                      {formatCapabilities(audioModel.capabilities)}
                    </td>
                    <td className="p-2 text-center text-muted-foreground text-xs">
                      {audioModel.perMinInput}
                    </td>
                    <td className="p-2 text-center text-muted-foreground text-xs">
                      {audioModel.perSecGenerated}
                    </td>
                    <td className="p-2 text-center text-muted-foreground text-xs">
                      {audioModel.perTenThousandRequests}
                    </td>
                  </tr>
                );
              } else if (type === "video" && "capabilities" in model) {
                const videoModel = model as VideoModel;
                return (
                  <tr
                    key={model.id}
                    className="border-b border-gray-300 dark:border-accent hover:bg-accent"
                  >
                    <td className="p-2 text-left text-xs text-muted-foreground">
                      {model.name}
                    </td>
                    <td className="p-2 text-center text-muted-foreground text-xs">
                      {formatCapabilities(videoModel.capabilities)}
                    </td>
                    <td className="p-2 text-center text-muted-foreground text-xs">
                      {videoModel.perSecGenerated}
                    </td>
                    <td className="p-2 text-center text-muted-foreground text-xs">
                      {videoModel.perThousandRequests}
                    </td>
                  </tr>
                );
              }
              return null;
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

  const ChatModelsSection = () => (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6">Chat Models</h2>
      <div className="text-muted-foreground mb-8">
        <p>
          Our chat models offer state-of-the-art natural language processing capabilities.
          Pricing is based on input and output tokens, with competitive rates for high-volume usage.
        </p>
      </div>
      {/* Add any chat-specific content here */}
      {renderModelTable("chat")}
    </section>
  );

  const ImageModelsSection = () => (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6">Image Models</h2>
      <div className="text-muted-foreground mb-8">
        <p>
          Transform your ideas into stunning visuals with our image generation and editing models.
          Choose from various capabilities including image generation and editing features.
        </p>
      </div>
      {/* Add any image-specific content here */}
      {renderModelTable("image")}
    </section>
  );

  const AudioModelsSection = () => (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6">Audio Models</h2>
      <div className="text-muted-foreground mb-8">
        <p>
          Process and generate audio with our advanced audio models.
          Features include speech-to-text, text-to-speech, and audio generation capabilities.
        </p>
      </div>
      {/* Add any audio-specific content here */}
      {renderModelTable("audio")}
    </section>
  );

  const VideoModelsSection = () => (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6">Video Models</h2>
      <div className="text-muted-foreground mb-8">
        <p>
          Create and edit videos using our cutting-edge video models.
          Generate videos from text or edit existing videos with advanced AI capabilities.
        </p>
      </div>
      {/* Add any video-specific content here */}
      {renderModelTable("video")}
    </section>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-muted-foreground max-w-3xl mb-12">
        <p>
          AlleAI unites the world's best AI models for chat, image, audio, and
          video into a single, powerful API. Our credit-based system makes
          accessing these diverse capabilities simple, transparent, and
          cost-effective. With one API request, you can combine multiple models
          to generate or edit text, visuals, audio, or videos, tailored to your
          project's needs.
        </p>
      </div>

      {/* Model Sections */}
      <div className="mb-12">
        <ChatModelsSection />
        <ImageModelsSection />
        <AudioModelsSection />
        <VideoModelsSection />
      </div>

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
