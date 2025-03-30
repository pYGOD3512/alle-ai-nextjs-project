// user guides
interface GuideSection {
  id: string;
  title: string;
  href: string;
  description?: string;
  keywords?: keywordsProps[];
}

interface Guide {
  id?: string;
  title: string;
  href?: string;
  description?: string;
  sections: GuideSection[];
}

const href = "/docs/api";
const BaseUrl = "/docs/api-reference";
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
        keywords: [
          {
            BaseUrl: "",
            searchTerms: [
              {
                hash: "",
                description: "",
                words: [],
              },
            ],
          },
        ],
      },
      {
        id: "pricing",
        title: "Pricing",
        href: href,
        keywords: [
          {
            BaseUrl: "",
            searchTerms: [
              {
                hash: "",
                description: "",
                words: [],
              },
            ],
          },
        ],
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
        keywords: [
          {
            BaseUrl: "",
            searchTerms: [
              {
                hash: "",
                description: "",
                words: [],
              },
            ],
          },
        ],
      },
      {
        id: "audio-generation",
        title: "Audio Generation",
        href: href,
        keywords: [
          {
            BaseUrl: "",
            searchTerms: [
              {
                hash: "",
                description: "",
                words: [],
              },
            ],
          },
        ],
      },

      {
        id: "image-generation",
        title: "Image Generation",
        href: href,
        keywords: [
          {
            BaseUrl: "",
            searchTerms: [
              {
                hash: "",
                description: "",
                words: [],
              },
            ],
          },
        ],
      },
      {
        id: "video-generation",
        title: "Video Generation",
        href: href,
        keywords: [
          {
            BaseUrl: "",
            searchTerms: [
              {
                hash: "",
                description: "",
                words: [],
              },
            ],
          },
        ],
      },

      {
        id: "file-uploads",
        title: "Attachments",
        href: href,
        keywords: [
          {
            BaseUrl: "",
            searchTerms: [
              {
                hash: "",
                description: "",
                words: [],
              },
            ],
          },
        ],
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
        keywords: [
          {
            BaseUrl: "",
            searchTerms: [
              {
                hash: "",
                description: "",
                words: [],
              },
            ],
          },
        ],
      },
      {
        id: "release-notes",
        title: "Release Notes",
        href: href,
        keywords: [
          {
            BaseUrl: "",
            searchTerms: [
              {
                hash: "",
                description: "",
                words: [],
              },
            ],
          },
        ],
      },
    ],
  },
];

// main api reference
interface endPointProps {
  id: string;
  keywords: keywordsProps[];
  title: string;
  href: string;
}
interface sectionProps {
  id: string;
  title: string;
  href: string;
  sections?: endPointProps[];
  keywords?: keywordsProps[];
  description?: string;
}
interface searchtermsprops {
  hash: string;
  words: string[];
  description?: string;
}
interface keywordsProps {
  BaseUrl: string;
  searchTerms: searchtermsprops[];
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

        keywords: [
          {
            BaseUrl: `${BaseUrl}/introduction`,
            searchTerms: [
              {
                hash: "alle-ai",
                words: [
                  "introduction",
                  "overview",
                  "getting started",
                  "api",
                  "alle ai",
                  "documentation",
                  "HTTP",
                  "WebSocket",
                  "Python bindings",
                  "Node.js library",
                ],
                description:
                  "Get started with Alle-AI's API. Learn about our HTTP and WebSocket endpoints, authentication, and available SDKs.",
              },
            ],
          },
        ],
      },
      {
        id: "authentication",
        title: "Authentication",
        href: "authentication",

        keywords: [
          {
            BaseUrl: `${BaseUrl}/introduction`,
            searchTerms: [
              {
                hash: "authentication",
                words: [
                  "auth",
                  "api key",
                  "project key",
                  "security",
                  "token",
                  "credentials",
                  "authentication",
                  "project keys",
                  "user keys",
                  "secure",
                ],
                description:
                  "Learn how to authenticate your API requests using project keys and manage API credentials securely.",
              },
            ],
          },
        ],
      },
      {
        id: "streaming",
        title: "Streaming",
        href: "streaming",

        keywords: [
          {
            BaseUrl: `${BaseUrl}/introduction`,
            searchTerms: [
              {
                hash: "streaming",
                words: [
                  "stream",
                  "real-time",
                  "streaming response",
                  "live",
                  "continuous",
                  "data stream",
                  "websocket",
                  "events",
                  "sse",
                ],
                description:
                  "Implement real-time data streaming using WebSocket connections and handle continuous data updates efficiently.",
              },
            ],
          },
        ],
      },
      {
        id: "sdk",
        title: "SDK & Libraries",
        href: "sdk",

        keywords: [
          {
            BaseUrl: `${BaseUrl}/introduction`,
            searchTerms: [
              {
                hash: "sdks-and-libraries",
                words: [
                  "sdk",
                  "library",
                  "package",
                  "npm",
                  "pip",
                  "installation",
                  "python",
                  "javascript",
                  "node",
                  "bindings",
                  "client libraries",
                  "packages",
                ],
                description:
                  "Explore our official SDKs and libraries for Python, Node.js, and other platforms to integrate Alle-AI into your applications.",
              },
            ],
          },
        ],
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
        description:
          "Endpoints for multi-model AI chat interactions, enabling users to send messages and receive responses from multiple AI models within a single request.",
        sections: [
          {
            id: "chat",
            title: "Completion",
            keywords: [
              {
                BaseUrl: `${BaseUrl}/chat-endpoints`,
                searchTerms: [
                  {
                    hash: "",
                    words: [
                      "Chat Completion",
                      "API Endpoint",
                      "ChatGPT",
                      "Claude",
                      "Gemini",
                      "Text Generation",
                      "HTTPS",
                      "AI Models",
                      "Base URL",
                      "OpenAI",
                      "Anthropic",
                      "Google",
                    ],
                    description:
                      "Learn how to use the Chat Completion endpoint, a single API to access AI models like ChatGPT, Claude, and Gemini for generating human-like text over HTTPS, with example calls in Node.js, Python, and more.",
                  },
                  {
                    hash: "",
                    description:
                      "Set up request parameters for the Chat Completion endpoint with a JSON example showing names, types, and required fields.",
                    words: [
                      "Request Parameters",
                      "Chat Completion",
                      "API Request",
                      "JSON",
                      "Parameters",
                      "Required Fields",
                      "Keywords",
                    ],
                  },
                  {
                    hash: "",
                    description:
                      "Add required headers like Authorization and Content-Type to Chat Completion requests, with examples in cURL, Python, and Node.js",
                    words: [
                      "Request Headers",
                      "Authorization",
                      "Content-Type",
                      "API Key",
                      "JSON",
                      "HTTPS",
                      "cURL",
                      "Python",
                      "Node.js",
                    ],
                  },
                  {
                    hash: "",
                    words: [
                      "Response Fields",
                      "Response Format",
                      "JSON",
                      "Chat Completion",
                      "Text Generation",
                      "Field Types",
                    ],
                    description:
                      "Check the response fields from the Chat Completion endpoint, including types and a JSON format example.",
                  },
                ],
              },
            ],
            href: "chat-endpoints",
          },
          {
            id: "web-search",
            title: "Search",
            keywords: [
              {
                BaseUrl: `${BaseUrl}/chat-search`,
                searchTerms: [
                  {
                    hash: "",
                    words: [
                      "Chat Completion",
                      "Web Search",
                      "web_search",
                      "API Request",
                      "JSON",
                      "Boolean",
                      "web_search_results",
                      "Search Query",
                      "Search Results",
                      "Response Format",
                    ],
                    description:
                      "Enable web search in the Chat Completion endpoint by setting the web_search boolean in your JSON request, and get enhanced responses with web_search_results including queries and search result details.",
                  },
                  {
                    hash: "",
                    words: [
                      "Web Search Endpoint",
                      "Dedicated Endpoint",
                      "messages",
                      "response_format",
                      "max_tokens",
                      "Web Search Results",
                      "cURL",
                      "Python",
                      "Node.js",
                      "Base URL",
                    ],
                    description:
                      "Use the dedicated web search endpoint to get web search results directly, with parameters like messages and response_format, plus example requests in cURL, Python, and Node.js.",
                  },
                ],
              },
            ],
            href: "chat-search",
          },
          {
            id: "comparison",
            title: "Comparison",
            keywords: [
              {
                BaseUrl: `${BaseUrl}/chat-comparison`,
                searchTerms: [
                  {
                    hash: "",
                    words: [
                      "Model Comparison",
                      "comparison",
                      "API Request",
                      "Comparison Types",
                      "text",
                      "audio_url",
                      "models",
                      "JSON",
                      "Response Format",
                      "GPT-4",
                      "Claude",
                      "Deepseek",
                    ],
                    description:
                      "Add the optional comparison field to your API request to compare outputs from models like GPT-4, Claude, and Deepseek, with types like text or audio_url, and get results in JSON.",
                  },
                ],
              },
            ],
            href: "chat-comparison",
          },
          {
            id: "summary",
            title: "Summary",
            keywords: [
              {
                BaseUrl: `${BaseUrl}/chat-summary`,
                searchTerms: [
                  {
                    hash: "",
                    words: [
                      "Chat Completion",
                      "summary",
                      "API Request",
                      "JSON",
                      "models",
                      "GPT-4",
                      "Claude",
                      "messages",
                      "response_format",
                      "max_tokens",
                    ],
                    description:
                      "Add the optional summary parameter to your Chat Completion request in JSON to get both full model outputs from GPT-4 or Claude and a concise summary, using messages, response_format, and max_tokens.",
                  },
                  {
                    hash: "",
                    words: [
                      "Summary Endpoint",
                      "Dedicated Endpoint",
                      "summary",
                      "messages",
                      "response_format",
                      "temperature",
                      "Base URL",
                      "cURL",
                      "Python",
                      "Node.js",
                    ],
                    description:
                      "Use the dedicated summary endpoint at [baseUrl]/summary to get only a summary of model responses, with messages, response_format, and temperature, plus examples in cURL, Python, and Node.js.",
                  },
                ],
              },
            ],
            href: "chat-summary",
          },
          {
            id: "compare",
            title: "Combination",
            keywords: [
              {
                BaseUrl: `${BaseUrl}/chat-combinations`,
                searchTerms: [
                  {
                    hash: "",
                    words: [
                      "Chat Completion",
                      "combination",
                      "API Request",
                      "JSON",
                      "models",
                      "GPT-4",
                      "Deepseek",
                      "Claude",
                      "text",
                      "audio_url",
                      "messages",
                      "response_format",
                      "max_tokens",
                    ],
                    description:
                      "Add the optional combination parameter to your Chat Completion request in JSON to merge outputs from models like GPT-4, Deepseek, and Claude into a single result for text or audio_url, alongside individual responses, using messages, response_format, and max_tokens.",
                  },
                  {
                    hash: "",
                    words: [
                      "Combination Endpoint",
                      "Dedicated Endpoint",
                      "combination",
                      "messages",
                      "response_format",
                      "temperature",
                      "Base URL",
                      "cURL",
                      "Python",
                      "Node.js",
                    ],
                    description:
                      "Use the dedicated combination endpoint at [baseUrl]/combinations to get only a merged result from specified models, with messages, response_format, and temperature, plus examples in cURL, Python, and Node.js.",
                  },
                ],
              },
            ],
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
        title: "Getting started",
        description: `Welcome to Alle-ai! We’re happy to have you. Alle-ai brings together the world’s
               leading AI models for chat, image, video, and audio generation in one unified platform designed 
               to power creativity and productivity. To get started, check out the guide below for a quick tour.`,
               
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
      "A list of AI model names that will process your request. You can include options like 'gpt-4', 'deepseek-1', or 'claude-3.5-sonnet' to decide which models generate responses or handle tasks, based on what each one is good at.",
    keywords: ["model names", "gpt-4", "deepseek-1", "claude-3.5-sonnet"],
  },
  {
    name: "messages",
    type: "array",
    required: true,
    description:
      "The full set of inputs and context for the models to work with. This includes optional system instructions to guide the models’ behavior (like setting their role or tone), user inputs such as text questions, audio recordings, images, or videos for the models to respond to, and prior assistant responses organized by model name to keep the conversation flowing. Each message can contain content in formats like text, audio URLs, image URLs, or video URLs, giving you flexibility in how you communicate with the models.",
    keywords: [
      "system instructions",
      "user inputs",
      "assistant responses",
      "text",
      "audio URLs",
      "image URLs",
      "video URLs",
    ],
  },
  {
    name: "response_format",
    type: "object",
    required: true,
    description:
      "Controls how the models deliver their output to you. You specify the main format—whether you want text, an audio URL, an image URL, or a video URL—and can optionally set different formats for specific models if you’re using more than one. This ensures the response matches what you need, tailored to each model’s contribution.",
    keywords: [
      "main format",
      "text",
      "audio URL",
      "image URL",
      "video URL",
      "specific models",
    ],
  },
  {
    name: "web_search",
    type: "boolean",
    required: false,
    description:
      "Lets you decide if the models can search the web to include up-to-date or outside information in their responses. Turn it on with true to broaden their knowledge, or keep it off with false to rely only on what the models already know.",
    keywords: ["web search", "true", "false"],
  },
  {
    name: "summary",
    type: "array",
    required: false,
    description:
      "Configures how to get a shorter version of the response, perfect for quick insights. You can choose the format—like text, audio URL, image URL, or video URL—and pick which models (from your 'models' list) should create the summary, letting you customize how it’s condensed and presented.",
    keywords: [
      "shorter version",
      "format",
      "text",
      "audio URL",
      "image URL",
      "video URL",
      "models",
    ],
  },
  {
    name: "combination",
    type: "array",
    required: false,
    description:
      "Sets up how to merge responses from multiple models into one cohesive output. You define the format—text, audio URL, image URL, or video URL—and select which models’ answers to blend, combining their strengths into a single result that suits your needs.",
    keywords: [
      "merge responses",
      "format",
      "text",
      "audio URL",
      "image URL",
      "video URL",
      "models",
    ],
  },
  {
    name: "temperature",
    type: "number",
    required: false,
    description:
      "Adjusts how creative or predictable the models’ responses are. Use a lower value (like 0.1) for straightforward, focused answers, or a higher value (up to 1.0) for more imaginative or varied replies, depending on the tone you’re aiming for.",
    keywords: ["creative", "predictable", "lower value", "higher value"],
  },
  {
    name: "max_tokens",
    type: "integer",
    required: false,
    description:
      "Caps the length of the response, measured in small units like words or characters. Set a number to keep answers brief or allow them to run longer, giving you control over how much detail you get back.",
    keywords: ["length", "small units", "brief", "longer"],
  },
  {
    name: "top_p",
    type: "number",
    required: false,
    description:
      "Shapes how varied the models’ responses can be. A lower value (like 0.5) keeps answers focused on the most likely ideas, while a higher value (up to 1.0) lets the models explore a wider range of possibilities, balancing focus with diversity.",
    keywords: ["varied", "lower value", "higher value", "focus", "diversity"],
  },
  {
    name: "frequency_penalty",
    type: "number",
    required: false,
    description:
      "Controls how much the models repeat themselves. A higher value (up to 2.0) pushes them to avoid reusing phrases or ideas, keeping things fresh, while a lower or negative value (down to -2.0) lets them repeat more if that’s what you want.",
    keywords: ["repeat", "higher value", "lower value", "fresh"],
  },
  {
    name: "presence_penalty",
    type: "number",
    required: false,
    description:
      "Influences whether the models stick to what’s already been said or bring up new topics. A higher value (up to 2.0) encourages fresh ideas, while a lower or negative value (down to -2.0) keeps them focused on the current discussion.",
    keywords: [
      "new topics",
      "higher value",
      "lower value",
      "current discussion",
    ],
  },
  {
    name: "stream",
    type: "boolean",
    required: false,
    description:
      "Determines if you get the response bit by bit as it’s being created (with true) or all at once when it’s finished (with false). Streaming is handy for real-time updates, while waiting gives you the complete answer in one go.",
    keywords: ["bit by bit", "true", "all at once", "false", "real-time"],
  },
  {
    name: "metadata",
    type: "object",
    required: false,
    description:
      "Adds extra details about your request, like a unique request ID, a user ID, or a timestamp. This is optional but useful for keeping track of requests or linking them to specific people or times.",
    keywords: ["extra details", "request ID", "user ID", "timestamp"],
  },
  {
    name: "model_specific_params",
    type: "object",
    required: false,
    description:
      "Fine-tunes settings for individual models, overriding the general options. You can adjust things like system instructions, creativity level, response length, or repetition controls for specific models (like 'gpt-4' or 'deepseek-1'), giving you precise control over each one’s behavior.",
    keywords: [
      "fine-tunes",
      "system instructions",
      "creativity level",
      "response length",
      "repetition controls",
      "specific models",
    ],
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
