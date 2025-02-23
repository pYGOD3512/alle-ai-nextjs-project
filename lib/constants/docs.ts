// api guides

interface searchParams {
  section_id: string;
  keywords: string[];
  title: string;
  description?: string;
}
interface GuideSection {
  id: string;
  title: string;
  href: string;
  description?: string;
  searchParams?: searchParams[];
}

interface Guide {
  id?: string;
  title: string;
  href?: string;
  description?: string;
  sections: GuideSection[];
}

interface userGuides {
  id?: string;
  title: string;
  section: GuideSection[];
}


const href = "/docs/api";

const hrefApi = "/docs/api-reference";
// user guides guides

export const guides: Guide[] = [
  {
    id: "get-started",
    title: "Get Started",
    description: "Learn the basics of using Alle-AI",
    sections: [
      {
        id: "quickstart",
        title: "Quickstart",
        href: href,
        description: "Learn how to make your first API request.",
      },
      {
        id: "pricing",
        title: "Pricing",
        href: href,
      },
      {
        id: "models",
        title: "Models",
        href: href,
      },
    ],
  },
  {
    id: "platform-usage",
    title: "Capabilities",
    description: "Explore the core functionalities of Alle-AI",
    sections: [
      {
        id: "text-generation",
        title: "Text Generation",
        href: href,
      },
      {
        id: "audio-generation",
        title: "Audio Generation",
        href: href,
      },

      {
        id: "image-generation",
        title: "Image Generation",
        href: href,
      },
      {
        id: "video-generation",
        title: "Video Generation",
        href: href,
      },

      {
        id: "file-uploads",
        title: "Attachments",
        href: href,
      },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    description: "",
    sections: [
      {
        id: "libraries",
        title: "Libraries",
        href: "",
      },
      {
        id: "prompts-inputs",
        title: "Prompt examples",
        href: "",
      },
      {
        id: "limits",
        title: "Rate limits",
        href: "",
      },
      {
        id: "error-codes",
        title: "Error codes",
        href: "",
      },
    ],
  },

  {
    id: "support",
    title: "Help & Support  ",
    description: "Find help and resources to assist you with Alle-AI",
    sections: [
      {
        id: "faq",
        title: "FAQ",
        href: "/collection",
      },
      {
        id: "contact-us",
        title: "Contact Us",
        href: "/contact-us",
      },
      {
        id: "model_glossary",
        title: "Model Glossary",
        href: "/model-glossary",
      },
      {
        id: "changelog",
        title: "changelog",
        href: "/changelog",
      },
    ],
  },
  {
    id: "updates",
    title: "Updates",
    description: "Stay informed about the latest features and improvements",
    sections: [
      {
        id: "new-features",
        title: "New Features & Updates",
        href: href,
      },
      {
        id: "release-notes",
        title: "Release Notes",
        href: href,
      },
    ],
  },
];

// user guides

export const userGuides: userGuides[] = [
  {
    title: "Get Started",
    id: "get-started",
    section: [
      {
        id: "overview",
        href: "/docs/user-guides",
        title: "Platform overview",
        searchParams: [
          {
            section_id: "get_started",
            keywords: ["get started", "Alle AI"],
            title: "Getting Started",
          },
          {
            section_id: "capabilities",
            keywords: [
              "audio generation",
              "text generation",
              "video generation",
              "audio generation",
            ],
            title: "Platform Capabilities",
            description: "A summary of our platform Overview",
          },
          {
            section_id: "quick_start",
            keywords: [],
            title: "Quick Start",
            description: "Set up Everything",
          },
        ],
      },
    ],
  },
  {
    title: "Using the Platform",
    id: "using-platform",
    section: [
      {
        id: "chat",
        title: "Text generation",
        href: "",
        searchParams: [],
      },
      {
        id: "image",
        title: "Image generation",
        href: "",
        searchParams: [],
      },
      {
        id: "audio",
        title: "Audio generation",
        href: "",
        searchParams: [],
      },
      {
        id: "video",
        title: "Video generation",
        href: "",
        searchParams: [],
      },
      {
        id: "advance-concepts",
        title: "Advanced Guides",
        href: "",
        searchParams: [],
      },
    ],
  },
  {
    title: "Interactions ",
    id: "chat-interactions",
    section: [
      {
        id: "history",
        title: "Managing Chat History",
        href: "",
      },
      {
        id: "prompts",
        title: "Using Prompts Effectively",
        href: "",
      },
    ],
  },
  {
    title: "Help and support",
    id: "support",
    section: [
      {
        id: "faq",
        title: "FAQ",
        href: "/collection",
      },
      {
        id: "contact-us",
        title: "Contact Us",
        href: "/contact-us",
      },
      {
        id: "model_glossary",
        title: "Model Glossary",
        href: "/model-glossary",
      },
    ],
  },
  {
    id: "devs",
    title: "Developer Guides",
    section: [
      {
        id: "api-ref",
        title: "API Reference",
        href: "",
      },
      {
        id: "api-limt",
        title: "Rate Limits",
        href: "",
      },
    ],
  },
];

// main api reference
interface endPointProps {
  id: string;
  keywords: [];
  title: string;
  href: string;
}
interface sectionProps {
  id: string;
  title: string;
  href: string;
  sections?: endPointProps[];
}
interface apiREfprops {
  title: string;
  sections: sectionProps[];
  id: string;
}

export const apiReference: apiREfprops[] = [
  {
    title: "API Reference",
    id: "reference",
    sections: [
      {
        id: "introduction",
        title: "Introduction",
        href: "introduction",
      },
      {
        id: "authentication",
        title: "Authentication",
        href: "authentication",
      },
      {
        id: "streaming",
        title: "Streaming",
        href: "streaming",
      },
      {
        id: "sdk",
        title: "SDK & Libraries",
        href: "sdk",
      },
    ],
  },
  {
    title: "Endpoints",
    id: "endpoints",
    sections: [
      {
        id: "chat",
        title: "Chat",
        href: "endpoints-chat",
        sections: [
          {
            id: "chat",
            title: "Completion",
            keywords: [],
            href: "chat-endpoints",
          },
          {
            id: "web-search",
            title: "Search",
            keywords: [],
            href: "chat-search",
          },
          {
            id: "comparison",
            title: "Comparison",
            keywords: [],
            href: "chat-comparison",
          },
          {
            id: "summary",
            title: "Summary",
            keywords: [],
            href: "chat-summary",
          },
          {
            id: "compare",
            title: "Combination",
            keywords: [],
            href: "chat-combination",
          },
        ],
      },
      {
        id: "image-generation",
        title: "Image Generation",
        href: "/docs/api-reference/image",
        sections: [
          {
            id: "image-generation",
            title: "Text-to-Image",
            keywords: [],
            href: "image-generation",
          },
          {
            id: "image-generation-edits",
            title: "Image Editing",
            keywords: [],
            href: "image-generation-edits",
          },
        ],
      },

      {
        id: "audio-generation",
        title: "Audio Generation",
        href: "/docs/api-reference/audio",
        sections: [
          {
            id: "text-to-speech",
            title: "Text-to-Speech",
            keywords: [],
            href: "audio-text-to-speech",
          },
          {
            id: "speech-to-text",
            title: "Speech-to-text ",
            keywords: [],
            href: "audio-speech-to-text",
          },
          {
            id: "create-sounds",
            title: "create audio ",
            keywords: [],
            href: "audio-generate",
          },
        ],
      },
      {
        id: "video-generation",
        title: "Video Generation",
        href: "/docs/api-reference/video",
        sections: [
          {
            id: "text-video",
            title: "Text-to-Video",
            keywords: [],
            href: "video-generation",
          },
          {
            id: "video-edit",
            title: "video-edits",
            keywords: [],
            href: "video-generation-edits",
          },
        ],
      },
    ],
  },
  {
    id: "analytics",
    title: "Analytics & Monitoring",
    sections: [
      {
        id: "usage-metrics",
        title: "Usage Metrics",
        href: "/docs/api-reference/analytics/usage-metrics",
      },
      {
        id: "performance-monitoring",
        title: "Performance Monitoring",
        href: "/docs/api-reference/analytics/performance-monitoring",
      },
      {
        id: "logs",
        title: "API Logs",
        href: "/docs/api-reference/analytics/logs",
      },
    ],
  },
];

//  tutorial nav items
export const tutorial = [
  {
    id: "tutorials",
    title: "Tutorials",
    href: "/docs/tutorials",
    sections: [
      {
        id: "using-platform",
        title: "Overview",
        description:
          "An introduction to the platform, its features, and how to navigate through its functionalities.",
      },

      {
        id: "text-ai",
        title: "Text generation",
        description:
          "Explore AI-powered text generation, including creative writing, summarization, and automated content creation.",
      },
      {
        id: "image-ai",
        title: "Image generation",
        description:
          "Generate high-quality images using AI, from artistic illustrations to realistic visuals.",
      },
      {
        id: "audio-ai",
        title: "Audio generation",
        description:
          "Create AI-generated audio, including speech synthesis, music, and sound effects.",
      },
      {
        id: "video-ai",
        title: "Video generation",
        description:
          "Utilize AI for video creation, editing, and automated scene generation.",
      },
      {
        id: "prompts",
        title: "Prompts",
        description:
          "Learn how to craft effective prompts to get the best results from AI models.",
      },
      {
        id: "history",
        title: "Managing Your History",
        description:
          "View, manage, and delete past interactions with AI to keep track of your generated content.",
      },
    ],
  },
];
export const apiEndPoints = [
  "chat",
  "search",
  "comparison",
  "summary",
  "combination",
];

// chat completion endpoints
export const basicRequest = `
{
    "models": ["gpt-4o", "claude-3.5-sonnet"],
    "messages": [
      {
        "system": {
          "type": "text",
          "text": "You are a helpful assistant."
        },
        "user": {
          "type": "text",
          "text": "Hello, how are you?"
        }
      }
    ],
    "response_format": {
      "type": "text",
      "model_specific": {
        "gpt-4o": "text",
        "claude-3.5-sonnet": "text"
      }
    },
    "temperature": 0.7,
    "max_tokens": 1000,
    "stream": false
}

`;

export const basicResponse = `
{
  "id": "alleai-12345",
  "object": "ai.comparison",
  "models": ["gpt-4o", "deepseek-r1", "claude-3.5-sonnet"],
  "responses": [
    {
      "model": "gpt-4o",
      "message": {
        "role": "assistant",
        "content": "Hi there! How can I assist you today?"
      }
    },
    {
      "model": "deepseek-r1",
      "message": {
        "role": "assistant",
        "content": "Hello! What can I do for you today?"
      }
    },
    {
      "model": "claude-3.5-sonnet",
      "message": {
        "role": "assistant",
        "content": "Hey! How can I help you?"
      }
    }
  ]
}

`;

export const requestCodes = {
  curl: `curl -X POST https://api.yourdomain.com/v1/ai/generate \
-H "Authorization: Bearer YOUR_API_KEY" \
-H "Content-Type: application/json" \
-d '{
  "models": ["gpt-4o", "deepseek-r1", "claude-3.5-sonnet"],  
  "messages": [
    {
      "system": [
        {
          "type": "text",
          "text": "You are a helpful assistant."
        }
      ]
    },
    {
      "user": [
        {
        "type": "text",
        "text": "What is photosynthesis?"
      }
    ]
  ],
  "response_format": {
    "type": "text",
    "model_specific": {
      "gpt-4o": "text",
      "deepseek-r1": "audio_url"
    }
  },
  "temperature": 0.7,
  "max_tokens": 2000
}'

`,
  javascript: `const alleai = require('alleai');

const requestBody = {
  models: ["gpt-4o", "deepseek-r1", "claude-3.5-sonnet"],
  messages: [
    {
      system: [
        {
          type: "text",
          text: "You are a helpful assistant."
        }
      ]
    },
    {
      user: [
        {
          type: "text",
          text: "What is photosynthesis?"
        }
      ]
    }
  ],
  response_format: {
    type: "text",
    model_specific: {
      "gpt-4o": "text",
      "deepseek-r1": "audio_url"
    }
  },
  temperature: 0.7,
  max_tokens: 2000
};

alleai.generate(requestBody)
  .then(response => {
    console.log('Response:', response);
  })
  .catch(error => {
    console.error('Error:', error);
  });

`,
  python: `const alleai = require('alleai');

const requestBody = {
  models: ["gpt-4o", "deepseek-r1", "claude-3.5-sonnet"],
  messages: [
    {
      system: [
        {
          type: "text",
          text: "You are a helpful assistant."
        }
      ]
    },
    {
      user: [
        {
          type: "text",
          text: "What is photosynthesis?"
        }
      ]
    }
  ],
  response_format: {
    type: "text",
    model_specific: {
      "gpt-4o": "text",
      "deepseek-r1": "audio_url"
    }
  },
  temperature: 0.7,
  max_tokens: 2000
};

alleai.generate(requestBody)
  .then(response => {
    console.log('Response:', response);
  })
  .catch(error => {
    console.error('Error:', error);
  });

`,
};

export const requestBody = `
{
    "models": ["gpt-4o", "deepseek-r1", "claude-3.5-sonnet"],  
    "messages": [
      {
        "system": [
          {
            "type": "text",
            "text": "You are a helpful assistant.",
            "model_specific": {
              "gpt-4o": "This is the system prompt specifically for GPT-4o at this point in the conversation. It will override the default system prompt",
              "deepseek-r1": "This is the system prompt specifically for Deepseek-r1 at this point in the conversation. It will override the default system prompt",
              "claude-3.5-sonnet": "This is the system prompt specifically for Claude at this point in the conversation. It will override the default system prompt"
            }
          },
          {
            "type": "audio_url",
            "audio_url": {
              "url": "data:audio/wav;base64,..."
            },
            "model_specific": {
              "gpt-4o": {
                "url": "data:audio/wav;base64,..."
              },
              "deepseek-r1": {
                "url": "data:audio/wav;base64,..."
              },
              "claude-3.5-sonnet": {
                "url": "data:audio/wav;base64,..."
              }
            }
          }
        ]
      },
      {
        "user": [
          {
            "type": "text",
            "text": "What is photosynthesis?"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "data:image/png;base64,..."
            }
          },
          {
            "type": "audio_url",
            "audio_url": {
              "url": "data:audio/wav;base64,..."
            }
          },
          {
            "type": "video_url",
            "video_url": {
              "url": "data:video/mp4;base64,..."
            }
          }
        ]
      },
      {
        "assistants":{
          "gpt-4o": [
              {
                  "type": "text",
                  "text": "Photosynthesis is the process by which green plants and some other organisms use..."
              },
              {
                  "type": "image_url",
                  "image_url": {
                      "url": "data:image/png;base64,..."
                  }
              },
              {
                  "type": "audio_url",
                  "audio_url": {
                      "url": "data:audio/wav;base64,..."
                  }
              },
              {
                  "type": "video_url",
                  "video_url": {
                      "url": "data:video/mp4;base64,..."
                  }
              }
          ],
          "deepseek-r1": [
              {
                  "type": "text",
                  "text": "Photosynthesis is a process used by plants and other organisms to convert..."
              },
              {
                  "type": "audio_url",
                  "audio_url": {
                      "url": "data:audio/wav;base64,..."
                  }
              }
          ],
          "claude-3.5-sonnet": [
              {
                  "type": "text",
                  "text": "Photosynthesis is the process by which green plants produce energy from light..."
              }
          ]
        }
      }
    ],
    "web_search": true,
    "summary":[
        {
            "type":"text",
            "models":["gpt-4o+deepseek-r1+claude-3.5-sonnet"]
        },
        {
            "type":"audio_url",
            "models":["gpt-4o+claude-3.5-sonnet"]
        },
        {
            "type":"text",
            "models":["gpt-4o"]
        }
    ],
    "combination":[
        {
            "type":"text",
            "models":["gpt-4o+deepseek-r1+claude-3.5-sonnet"] 
        },
        {
            "type":"audio_url",
            "models":["gpt-4o+claude-3.5-sonnet"]  
        }
    ],
    "response_format": {
      "type": "text",
      "model_specific": {
        "gpt-4o": "text",
        "deepseek-r1": "audio_url",
        "claude-3.5-sonnet": "text"
      }
    },
    "temperature": 0.7, 
    "max_tokens": 2000,
    "top_p": 1,
    "frequency_penalty": 0.2,
    "presence_penalty": 0.3,
    "stream": false,
    "metadata": {
      "request_id": "12345",
      "user_id": "67890",
      "timestamp": "2025-02-06T12:00:00Z"
    },
    "model_specific_params": {
      "gpt-4o": {
        "temperature": 0.7,
        "max_tokens": 2000,
        "top_p": 1,
        "frequency_penalty": 0.2,
        "presence_penalty": 0.3,
        "stream": false
      },
      "deepseek-r1": {
        "temperature": 0.5,
        "max_tokens": 2000,
        "top_p": 1,
        "frequency_penalty": 0.2,
        "presence_penalty": 0.3,
        "stream": false
      },
      "claude-3.5-sonet": {
        "temperature": 0.4,
        "max_tokens": 2000,
        "top_p": 1,
        "frequency_penalty": 0.2,
        "presence_penalty": 0.3,
        "stream": false
      }
    }
  }
  
`;

export const responseBody = `{
    "id": "alleai-12345",
    "object": "ai.comparison",
    "created": 1738935425,
    "models": ["gpt-4o", "deepseek-r1", "claude-3.5-sonnet"],
    "responses": [
      {
        "model": "gpt-4o",
        "message": {
          "role": "assistant",
          "content": "Hi there! How can I assist you today?"
        },
        "finish_reason": "stop",
        "tokens_used": {
          "prompt_tokens": 8,
          "completion_tokens": 10,
          "total_tokens": 18
        }
      },
      {
        "model": "deepseek-r1",
        "message": {
          "role": "assistant",
          "content": "Hello! What can I do for you today?"
        },
        "finish_reason": "stop",
        "tokens_used": {
          "prompt_tokens": 7,
          "completion_tokens": 12,
          "total_tokens": 19
        }
      },
      {
        "model": "claude-3.5-sonnet",
        "message": {
          "role": "assistant",
          "content": "Hey! How can I help you?"
        },
        "finish_reason": "stop",
        "tokens_used": {
          "prompt_tokens": 9,
          "completion_tokens": 11,
          "total_tokens": 20
        }
      }
    ],
    "web_search_results": [
      {
        "query": "photosynthesis",
        "results": [
          {
            "title": "Photosynthesis - Wikipedia",
            "url": "https://en.wikipedia.org/wiki/Photosynthesis",
            "description": "Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy that can later be released to fuel the organisms' activities."
          },
          {
            "title": "Photosynthesis | National Geographic Society",
            "url": "https://www.nationalgeographic.org/encyclopedia/photosynthesis/",
            "description": "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll."
          }
        ]
      }
    ],
    "combination": {
        "gpt-4o+deepseek-r1+claude-3.5-sonnet": [
            {
                "type": "text",
                "text": "Photosynthesis is the process by which green plants and some other organisms use..."
            },
            {
                "type": "audio_url",
                "audio_url": {
                    "url": "data:audio/wav;base64,..."
                }
            }
        ],
        "gpt-4o+deepseek-r1": [
            {
                "type": "text",
                "text": "Photosynthesis is the process by which green plants and some other organisms use..."
            }
        ],
        "deepseek-r1+claude-3.5-sonnet": [
            {
                "type": "text",
                "text": "Photosynthesis is a process used by plants and other organisms to convert..."
            }
        ]
    },
    "summary": {
        "gpt-4o+claude-3.5-sonnet": [
            {
                "type": "text",
                "text": "Photosynthesis is the process by which green plants and some other organisms use..."
            },
            {
                "type": "audio_url",
                "audio_url": {
                    "url": "data:audio/wav;base64,..."
                }
            }
        ],
        "gpt4o+deepseek-r1+claude-3.5-sonnet": [
            {
                "type": "text",
                "text": "Photosynthesis is a process used by plants and other organisms to convert..."
            }
        ]
    },
    "usage": {
      "total_requests": 1,
      "api_credits_used": 5 ,
        "total_cost": 0.05

    }
  }
  
`;

//  parameters

export const basicParameter = [
  {
    name: "models",
    type: "array",
    required: true,
    description:
      "List of models to use (gpt-4, deepseek-1, claude-3.5-sonnet). Relates to 'models' in the simplified JSON, specifying the model(s) to process the request.",
  },
  {
    name: "messages",
    type: "array",
    required: true,
    description:
      "User messages, system prompts, and multimedia inputs. Maps to 'messages' in the simplified JSON, where user and system messages are structured.",
  },
  {
    name: "response_format",
    type: "object",
    required: true,
    description:
      "Specifies output format (text, audio, etc.) with model-specific configurations. This corresponds to 'response_format' in the simplified JSON, defining the format and specifics for each model.",
  },
  {
    name: "temperature",
    type: "number",
    required: false,
    description:
      "Controls randomness in model outputs (0.1 = deterministic, 1.0 = creative). Maps to 'temperature' in the simplified JSON for controlling output behavior.",
  },
  {
    name: "max_tokens",
    type: "integer",
    required: false,
    description:
      "Maximum length of response in tokens (default: 2000). Relates to 'max_tokens' in the simplified JSON, controlling the length of the model's response.",
  },
  {
    name: "stream",
    type: "boolean",
    required: false,
    description:
      "Enables streaming of partial responses as they're generated. Corresponds to 'stream' in the simplified JSON, enabling or disabling the streaming feature.",
  },
];
export const parameters = [
  {
    name: "models",
    type: "array",
    required: true,
    description:
      "List of models to use (gpt-4, deepseek-1, claude-3.5-sonnet).",
  },
  {
    name: "messages",
    type: "array",
    required: true,
    description: "User messages, system prompts, and multimedia inputs.",
  },
  {
    name: "response_format",
    type: "object",
    required: true,
    description:
      "Specifies output format (text, audio, etc.) with model-specific configurations.",
  },
  {
    name: "web_search",
    type: "boolean",
    required: false,
    description:
      "Enables or disables web search capability for generating responses.",
  },
  {
    name: "summary",
    type: "array",
    required: false,
    description:
      "Configuration for generating summaries using different model combinations and output types.",
  },
  {
    name: "combination",
    type: "array",
    required: false,
    description:
      "Settings for combining outputs from multiple models with specified output types.",
  },
  {
    name: "temperature",
    type: "number",
    required: false,
    description:
      "Controls randomness in model outputs (0.1 = deterministic, 1.0 = creative).",
  },
  {
    name: "max_tokens",
    type: "integer",
    required: false,
    description: "Maximum length of response in tokens (default: 2000).",
  },
  {
    name: "top_p",
    type: "number",
    required: false,
    description:
      "Nucleus sampling parameter that controls diversity of model outputs (0.0-1.0).",
  },
  {
    name: "frequency_penalty",
    type: "number",
    required: false,
    description:
      "Reduces likelihood of repeating similar phrases (-2.0 to 2.0, default: 0.2).",
  },
  {
    name: "presence_penalty",
    type: "number",
    required: false,
    description:
      "Encourages discussing new topics (-2.0 to 2.0, default: 0.3).",
  },
  {
    name: "stream",
    type: "boolean",
    required: false,
    description: "Enables streaming of partial responses as they're generated.",
  },
  {
    name: "metadata",
    type: "object",
    required: false,
    description:
      "Additional request metadata including request_id, user_id, and timestamp.",
  },
  {
    name: "model_specific_params",
    type: "object",
    required: false,
    description:
      "Model-specific parameter overrides for temperature, max_tokens, etc.",
  },
];

export const apiReferenceFields = [
  {
    name: "id",
    type: "string",
    description: "Unique identifier for the response.",
  },
  {
    name: "object",
    type: "string",
    description: "Type of object returned (e.g., 'ai.comparison').",
  },
  {
    name: "created",
    type: "number",
    description: "Timestamp of when the response was created.",
  },
  {
    name: "models",
    type: "array",
    description: "List of models used in in API call.",
  },
  {
    name: "responses",
    type: "array",
    description: "Array of responses from each model.",
    fields: [
      {
        name: "model",
        type: "string",
        description: "Name of the model (e.g., 'gpt-4o', 'deepseek-r1').",
      },
      {
        name: "message",
        type: "object",
        description: "The response content from the model.",
        fields: [
          {
            name: "role",
            type: "string",
            description: "Role of the message (e.g., 'assistant').",
          },
          {
            name: "content",
            type: "string",
            description: "The actual response text from the model.",
          },
        ],
      },
      {
        name: "finish_reason",
        type: "string",
        description: "Reason for stopping the response (e.g., 'stop').",
      },
      {
        name: "tokens_used",
        type: "object",
        description: "Token usage details for the response.",
        fields: [
          {
            name: "prompt_tokens",
            type: "number",
            description: "Number of tokens used in the prompt.",
          },
          {
            name: "completion_tokens",
            type: "number",
            description: "Number of tokens used in the completion.",
          },
          {
            name: "total_tokens",
            type: "number",
            description: "Total tokens used (prompt + completion).",
          },
        ],
      },
    ],
  },

  {
    name: "usage",
    type: "object",
    description: "API usage details.",
    fields: [
      {
        name: "total_requests",
        type: "number",
        description: "Total number of requests made.",
      },
      {
        name: "api_credits_used",
        type: "number",
        description: "Number of API credits used.",
      },
      {
        name: "total_cost",
        type: "number",
        description: "Total cost of the API usage.",
      },
    ],
  },
];

//  image generation api

export const imageHeaders = [];
