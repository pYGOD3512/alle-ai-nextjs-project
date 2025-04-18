// Type definition for the simplified model data
export type ModelBasicInfo = {
  id: string;
  name: string;
  type: "chat" | "image" | "audio" | "video" | "multimodal";
};

// Type definitions for different model pricing structures
type ImageModelPricing = {
  capabilities: ("image-gen" | "image-edit")[];
  perImage: string;
  perThousandRequest: string;
}

type AudioModelPricing = {
  capabilities: ("stt" | "tts" | "audio-gen")[];
  perMinInput: string;
  perSecGenerated: string;
  perTenThousandRequests: string;
}

type VideoModelPricing = {
  capabilities: ("text-video" | "video-edit")[];
  perSecGenerated: string;
  perThousandRequests: string;
}

// Combined type using discriminated union
type ModelPricing = {
  id: string;
  name: string;
} & (
  | ({ type: "chat" })
  | ({ type: "image" } & ImageModelPricing)
  | ({ type: "audio" } & AudioModelPricing)
  | ({ type: "video" } & VideoModelPricing)
  | ({ type: "multimodal" })
);

// Array of models with pricing information
export const modelBasicInfo: ModelPricing[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    type: "chat"
  },
  {
    id: "gemini-1-5-pro",
    name: "Gemini 1.5 Pro",
    type: "chat"
  },
  {
    id: "claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    type: "chat"
  },
  {
    id: "sonar-large-32k-online",
    name: "Sonar Large 32k Online",
    type: "chat"
  },
  {
    id: "gpt-4o-mini",
    name: "GPT 4o-mini",
    type: "chat"
  },
  {
    id: "gemini-1.0-pro",
    name: "Gemini 1.0 Pro",
    type: "chat"
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    type: "chat"
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    type: "chat"
  },
  {
    id: "claude-3-hiaku",
    name: "Claude 3 Hiaku",
    type: "chat"
  },
  {
    id: "sonar-small-32k-online",
    name: "Sonar Small 32k Online",
    type: "chat"
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    type: "chat"
  },
  {
    id: "chatgpt-3-5",
    name: "ChatGPT 3.5",
    type: "chat"
  },
  {
    id: "llama-3-70b-instruct",
    name: "Llama 3 70B Instruct",
    type: "chat"
  },
  {
    id: "mistral-7b-instruct",
    name: "Mistral 7B Instruct",
    type: "chat"
  },
  {
    id: "perplexity",
    name: "Perplexity",
    type: "chat"
  },
  {
    id: "llama-2-13b",
    name: "Llama 2 13B",
    type: "chat"
  },
  {
    id: "dall-e-3",
    name: "DALL-E 3",
    type: "image",
    capabilities: ["image-gen", "image-edit"],
    perImage: "$0.08",
    perThousandRequest: "$80.00"
  },
  {
    id: "stable-diffusion",
    name: "Stable Diffusion",
    type: "image",
    capabilities: ["image-gen"],
    perImage: "$0.05",
    perThousandRequest: "$50.00"
  },
  {
    id: "stable-diffusion-xl",
    name: "Stable Diffusion XL",
    type: "image",
    capabilities: ["image-gen", "image-edit"],
    perImage: "$0.10",
    perThousandRequest: "$100.00"
  },
  {
    id: "titan-image-generator",
    name: "Titan Image Generator",
    type: "image",
    capabilities: ["image-gen"],
    perImage: "$0.12",
    perThousandRequest: "$120.00"
  },
  {
    id: "whisper-ai",
    name: "Whisper AI",
    type: "audio",
    capabilities: ["stt", "tts"],
    perMinInput: "$0.10",
    perSecGenerated: "$0.02",
    perTenThousandRequests: "$150.00"
  },
  {
    id: "musicgen-ai",
    name: "MusicGen AI",
    type: "audio",
    capabilities: ["audio-gen"],
    perMinInput: "$0.15",
    perSecGenerated: "$0.03",
    perTenThousandRequests: "$200.00"
  },
  {
    id: "sora-ai",
    name: "Sora AI",
    type: "video",
    capabilities: ["text-video"],
    perSecGenerated: "$0.50",
    perThousandRequests: "$500.00"
  },
  {
    id: "runway-gen-2",
    name: "Runway Gen-2",
    type: "video",
    capabilities: ["text-video", "video-edit"],
    perSecGenerated: "$0.45",
    perThousandRequests: "$450.00"
  },
  {
    id: "luma-ai-video",
    name: "Luma AI",
    type: "video",
    capabilities: ["text-video"],
    perSecGenerated: "$0.55",
    perThousandRequests: "$550.00"
  },
  {
    id: "kling-ai-video",
    name: "Kling AI",
    type: "video",
    capabilities: ["video-edit"],
    perSecGenerated: "$0.48",
    perThousandRequests: "$480.00"
  },
  {
    id: "animate-diff-video",
    name: "Animate Diff (Video)",
    type: "video",
    capabilities: ["text-video", "video-edit"],
    perSecGenerated: "$0.40",
    perThousandRequests: "$400.00"
  }
];
