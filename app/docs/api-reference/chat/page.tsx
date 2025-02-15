"use client";

import { useRouter, usePathname } from "next/navigation";
import RenderCode from "@/components/RenderCode";
import ApiDocLayout from "@/components/TwoLayout";
import { useEffect,useState } from "react";
import ScrollNavigationWrapper from "@/components/scrollNavigation";
const requestCodes = {
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
    }
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
const requestBody = `
{
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
    }
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
}
`;
const responseBody = `{
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
const parameters = [
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
    description: "Specifies output format (text, audio, etc.).",
  },
  {
    name: "temperature",
    type: "number",
    required: false,
    description: "Controls randomness (0.1 = deterministic, 1.0 = creative).",
  },
  {
    name: "max_tokens",
    type: "integer",
    required: false,
    description: "Maximum response length (default: 2000).",
  },
];
const apiReferenceFields = [
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
    description: "List of models used in the comparison.",
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
    name: "web_search_results",
    type: "array",
    description: "Array of web search results (if applicable).",
    fields: [
      {
        name: "query",
        type: "string",
        description: "The search query used.",
      },
      {
        name: "results",
        type: "array",
        description: "List of search results.",
        fields: [
          {
            name: "title",
            type: "string",
            description: "Title of the search result.",
          },
          {
            name: "url",
            type: "string",
            description: "URL of the search result.",
          },
          {
            name: "description",
            type: "string",
            description: "Description of the search result.",
          },
        ],
      },
    ],
  },
  {
    name: "combination",
    type: "object",
    description: "Combined responses from multiple models.",
    fields: [
      {
        name: "model_combinations",
        type: "array",
        description: "Combinations of models and their responses.",
        fields: [
          {
            name: "type",
            type: "string",
            description: "Type of response (e.g., 'text', 'audio_url').",
          },
          {
            name: "text",
            type: "string",
            description: "AI-generated text (if applicable).",
          },
          {
            name: "audio_url",
            type: "object",
            description: "Contains audio data in base64 format.",
            fields: [
              {
                name: "url",
                type: "string",
                description: "Base64-encoded audio URL.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "summary",
    type: "object",
    description: "Summarized responses from selected models.",
    fields: [
      {
        name: "model_combinations",
        type: "array",
        description: "Summarized combinations of models and their responses.",
        fields: [
          {
            name: "type",
            type: "string",
            description: "Type of response (e.g., 'text', 'audio_url').",
          },
          {
            name: "text",
            type: "string",
            description: "AI-generated text (if applicable).",
          },
          {
            name: "audio_url",
            type: "object",
            description: "Contains audio data in base64 format.",
            fields: [
              {
                name: "url",
                type: "string",
                description: "Base64-encoded audio URL.",
              },
            ],
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

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  return (
    <div className="">
      {/* page one */}

      <div className="ml-10">
        <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />

        <section className="mb-10">
          <h2 id="chat" className="text-3xl font-bold mb-4">
            Chat
          </h2>
          <p className="text-muted-foreground mb-4">
            Learn how to interact with chat models.
          </p>
          <h3 className="text-2l font-semibold text-muted-foreground mb-3">
            Base url
          </h3>
          <p className="text-muted-foreground mb-3">
            The base URL for all completion API requests is:
          </p>
          <div className="">
            <RenderCode
              style={{ maxWidth: "30rem" }}
              language="bash"
              showLanguage={false}
              code=" 
            https://api.example.com/v1
          
          "
            />
          </div>
        </section>

        {/* split layout */}
        <section>
          <ApiDocLayout
            leftContent={
              <div>
                <section className="mb-5">
                  <hr className="border-t-1  dark:border-zinc-700 border-gray-200 my-10 mt-5" />
                  <div className="w-full">
                    <p className="text-muted-foreground mb-4">
                      This endpoint efficiently handles{" "}
                      <span className="dark:bg-zinc-700 bg-gray-200 px-1 rounded">
                        search
                      </span>
                      ,
                      <span className="dark:bg-zinc-700 bg-gray-200 px-1 rounded">
                        combination
                      </span>
                      ,
                      <span className="dark:bg-zinc-700 bg-gray-200 px-1 rounded">
                        summary
                      </span>
                      , and
                      <span className="dark:bg-zinc-700 bg-gray-200 px-1 rounded">
                        comparison
                      </span>{" "}
                      in a single request. It merges the functionality of{" "}
                      <code>/search</code> and <code>/combination</code> to find
                      and refine results, while also summarizing and comparing
                      data for better insights.
                    </p>

                    <h3 className="mb-4  text-sm">Request Headers</h3>
                    <div className="overflow-x-auto text-muted-foreground">
                      <table className="max-w-2xl">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-zinc-700">
                            <th className="py-3 px-4 text-left text-white">
                              Header
                            </th>
                            <th className="py-3 px-4 text-left text-white">
                              Type
                            </th>
                            <th className="py-3 px-4 text-left text-white">
                              Required
                            </th>
                            <th className="py-3 px-4 text-left text-white">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-200 dark:border-zinc-700">
                            <td className="py-3 px-4">Authorization</td>
                            <td className="py-3 px-4">string</td>
                            <td className="py-3 px-4">✅</td>
                            <td className="py-3 px-4">
                              API key for authentication.
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-zinc-700">
                            <td className="py-3 px-4">Content-Type</td>
                            <td className="py-3 px-4">string</td>
                            <td className="py-3 px-4">✅</td>
                            <td className="py-3 px-4">application/json</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
                <div className="">
                  <h3 className="text-xl font-semibold  mb-4">
                    Request Parameters
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-zinc-700">
                          <th className="px-4 py-2 text-left text-white ">
                            Parameter
                          </th>
                          <th className="px-4 py-2 text-left text-white">
                            Type
                          </th>
                          <th className="px-4 py-2 text-left text-white ">
                            Required
                          </th>
                          <th className="px-4 py-2 text-left  text-white">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {parameters.map((param) => (
                          <tr
                            key={param.name}
                            className="border-b border-gray-200 dark:border-accent dark:text-muted-foreground"
                          >
                            <td className="px-4 py-3">
                              <code className="bg-gray-800  px-2 py-1 rounded text-sm">
                                {param.name}
                              </code>
                            </td>
                            <td className="px-4 py-3">
                              <code className="bg-gray-800  px-2 py-1 rounded text-sm">
                                {param.type}
                              </code>
                            </td>
                            <td className="px-4 py-3">
                              {param.required ? (
                                <span className="inline-block w-4 h-4  rounded-full">
                                  {" "}
                                  ✅
                                </span>
                              ) : (
                                <span className="inline-block w-4 h-4  rounded-full">
                                  {" "}
                                  ❌
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 ">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            }
            rightContent={
              <div className="flex">
                {/* response format */}
                <div>
                  <RenderCode
                    language="json"
                    style={{ maxWidth: "30rem", maxHeight: "40rem" }}
                    code={requestBody}
                  />
                  <div className="mt-7">
                    <h3 className="font-semibold  mb-4 mt-5">
                      Request to the API
                    </h3>
                    <RenderCode
                      toggle={true}
                      style={{ maxWidth: "30rem", maxHeight: "40rem" }}
                      languages={[
                        {
                          language: "javascript",
                          code: requestCodes.javascript,
                        },
                        {
                          language: "curl",
                          code: requestCodes.curl,
                        },
                        {
                          language: "python",
                          code: requestCodes.python,
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            }
          />
        </section>
        <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />
        {/* Response section */}
        <ApiDocLayout
          leftContent={
            <div className="mb-10">
              <div>
                <h3 className="font-semibold mb-4">Response Fields</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-zinc-700">
                        <th className="px-4 py-2 text-left text-white">
                          Field
                        </th>
                        <th className="px-4 py-2 text-left text-white">Type</th>
                        <th className="px-4 py-2 text-left text-white">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiReferenceFields.map((field, index) => (
                        // Use a fragment without a key (it doesn't accept keys)
                        <>
                          {/* Render the main field */}
                          <tr
                            key={field.name} // Key for the top-level field
                            className="border-b border-gray-200 dark:border-accent dark:text-muted-foreground"
                          >
                            <td className="px-4 py-3">
                              <code className="bg-gray-800 px-2 py-1 rounded text-sm">
                                {field.name}
                              </code>
                            </td>
                            <td className="px-4 py-3">
                              <code className="bg-gray-800 px-2 py-1 rounded text-sm">
                                {field.type}
                              </code>
                            </td>
                            <td className="px-4 py-3">{field.description}</td>
                          </tr>

                          {/* Render nested fields if they exist */}
                          {field.fields &&
                            field.fields.map((subField, subIndex) => (
                              <tr
                                key={`${field.name}-${subField.name}-${subIndex}`} // Unique key for subfields
                                className="border-b border-gray-200 dark:border-accent dark:text-muted-foreground"
                              >
                                <td className="px-8 py-3">
                                  <code className="bg-gray-800 px-2 py-1 rounded text-sm">
                                    {subField.name}
                                  </code>
                                </td>
                                <td className="px-4 py-3">
                                  <code className="bg-gray-800 px-2 py-1 rounded text-sm">
                                    {subField.type}
                                  </code>
                                </td>
                                <td className="px-4 py-3">
                                  {subField.description}
                                </td>
                              </tr>
                            ))}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }
          rightContent={
            <div>
              <h3 className="font-semibold  mb-4 mt-5">Response format</h3>
              <RenderCode
                maxHeight={"700px"}
                language="json"
                code={responseBody}
              />
            </div>
          }
        />
        <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />
        {/* ai search */}
       
      </div>
    </div>
  );
}
