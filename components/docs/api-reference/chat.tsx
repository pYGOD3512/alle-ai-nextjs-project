"use client";

import { useRouter, usePathname } from "next/navigation";
import RenderCode from "@/components/RenderCode";
import ApiDocLayout from "@/components/TwoLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ArrowRight } from "lucide-react";

import {
  apiReference,
  requestCodes,
  basicParameter,
  apiReferenceFields,
  basicRequest,
  basicResponse,
} from "@/lib/constants/docs";

export default function ApiTextGenerationDocs() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="min-h-[80vh] py-16">
      <div className="ml-10 space-y-16">
        {/* Chat Completion Section */}
        <section 
          className="min-h-[80vh]"
          data-section="endpoints-chat"
        >
          <Card className="p-8 bg-background">
            <div className="space-y-12">
              {/* Header */}
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  Chat Completion
                </h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    The Chat Completion endpoint is our unified gateway to
                    multiple AI models including ChatGPT, Claude, Gemini,
                    and more. This endpoint allows you to generate
                    human-like text responses using state-of-the-art
                    language models.
                  </p>
                </div>
              </div>

              {/* Main Content */}
              <ApiDocLayout
                leftContent={
                  <div className="space-y-8">
                    {/* Overview */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">Overview</h3>
                      <div className="text-muted-foreground space-y-4">
                        <p>
                          Access multiple AI models through a single endpoint.
                          Choose from:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>OpenAI's ChatGPT (GPT-3.5, GPT-4)</li>
                          <li>Anthropic's Claude</li>
                          <li>Google's Gemini</li>
                          <li>And more leading AI models</li>
                        </ul>
                      </div>
                    </div>

                    {/* Base URL and Endpoint */}
                    <div className="bg-muted/50 p-6 rounded-lg border space-y-4">
                      <h4 className="font-semibold">Base URL</h4>
                      <RenderCode
                        code="https://api.yourdomain.com/v1/ai/generate"
                        language="bash"
                        className="text-sm"
                        showLanguage={false}
                      />
                      <p className="text-sm text-muted-foreground">
                        All API requests should be made to this base URL using
                        HTTPS.
                      </p>
                    </div>
                  </div>
                }
                rightContent={
                  <div className="space-y-8">
                    <Card className="p-6 bg-background">
                      <div className="space-y-6">
                        <h3 className="text-2xl font-semibold">Example Request</h3>
                        <Tabs defaultValue="curl" className="w-full">
                          <TabsList>
                            <TabsTrigger value="curl">cURL</TabsTrigger>
                            <TabsTrigger value="python">Python</TabsTrigger>
                            <TabsTrigger value="node">Node.js</TabsTrigger>
                          </TabsList>
                          <TabsContent value="curl">
                            <RenderCode
                              code={requestCodes.curl}
                              language="bash"
                            />
                          </TabsContent>
                          <TabsContent value="python">
                            <RenderCode
                              code={requestCodes.python}
                              language="python"
                            />
                          </TabsContent>
                          <TabsContent value="node">
                            <RenderCode
                              code={requestCodes.node}
                              language="javascript"
                            />
                          </TabsContent>
                        </Tabs>
                      </div>
                    </Card>
                  </div>
                }
              />
            </div>
          </Card>
        </section>

        <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 " />

        {/* Request Parameters Section */}
        <div className="">
          <ApiDocLayout
            leftContent={
              <Card className=" bg-background">
                <h3 className="text-2l font-semibold text-muted-foreground mb-3">
                  Request Parameters
                </h3>
                <div className="space-y-6">
                  {basicParameter.map((param) => (
                    <div key={param.name} className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="bg-gray-800 px-2 py-1 rounded text-sm">
                          {param.name}
                        </code>
                        <code className="text-muted-foreground px-2 py-1 rounded text-sm">
                          {param.type}
                        </code>
                        {param.required && (
                          <span className="text-red-500 text-sm">
                            required
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {param.description}
                      </p>
                      <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 " />
                    </div>
                  ))}
                </div>
              </Card>
            }
            rightContent={
              <Card className="p-6 bg-background">
                <h3 className="font-semibold mb-3">
                  API Request Example: Simplified JSON Format
                </h3>
                <RenderCode
                  language="json"
                  maxHeight="400px"
                  maxWidth
                  code={basicRequest}
                />
              </Card>
            }
          />
        </div>

        <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 " />

        {/* split layout */}
        <section>
          <ApiDocLayout
            leftContent={
              <div>
                <section className="mb-5">
                  <hr className="border-t-1  dark:border-zinc-700 border-gray-200 my-10 mt-5" />
                  <Card className="p-6 bg-background">
                    <div className="w-full">
                      <h3 className="mb-4 text-sm">Request Headers</h3>
                      <div className="overflow-x-auto text-muted-foreground">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Header</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Required</TableHead>
                              <TableHead>Description</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>Authorization</TableCell>
                              <TableCell>string</TableCell>
                              <TableCell>✅</TableCell>
                              <TableCell>API key for authentication.</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Content-Type</TableCell>
                              <TableCell>string</TableCell>
                              <TableCell>✅</TableCell>
                              <TableCell>application/json</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </Card>
                </section>
              </div>
            }
            rightContent={
              <div>
                <Card className="p-6 bg-background">
                  <div className="mt-3">
                    <h3 className="font-semibold mb-4 mt-5">
                      Request to the API
                    </h3>
                    <Tabs defaultValue="javascript">
                      <TabsList>
                        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                        <TabsTrigger value="curl">cURL</TabsTrigger>
                        <TabsTrigger value="python">Python</TabsTrigger>
                      </TabsList>
                      <TabsContent value="javascript">
                        <RenderCode
                          language="javascript"
                          code={requestCodes.javascript}
                        />
                      </TabsContent>
                      <TabsContent value="curl">
                        <RenderCode language="bash" code={requestCodes.curl} />
                      </TabsContent>
                      <TabsContent value="python">
                        <RenderCode
                          language="python"
                          code={requestCodes.python}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                </Card>
              </div>
            }
          />
        </section>

        <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 " />

        {/* Response section */}
        <ApiDocLayout
          leftContent={
            <div className="mb-5">
              <Card className="p-6 bg-background">
                <h3 className="font-semibold mb-4">Response Fields</h3>
                <div className="space-y-6">
                  {apiReferenceFields.map((field) => (
                    <div key={field.name}>
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="bg-gray-800 px-2 py-1 rounded text-sm">
                            {field.name}
                          </code>
                          <code className="text-muted-foreground px-2 py-1 rounded text-sm">
                            {field.type}
                          </code>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {field.description}
                        </p>
                      </div>

                      {field.fields && (
                        <div className="pl-6 space-y-4 border-l dark:border-zinc-700 border-gray-200">
                          {field.fields.map((subField, subIndex) => (
                            <div
                              key={`${field.name}-${subField.name}-${subIndex}`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <code className="bg-gray-800 px-2 py-1 rounded text-sm">
                                  {subField.name}
                                </code>
                                <code className="text-muted-foreground px-2 py-1 rounded text-sm">
                                  {subField.type}
                                </code>
                              </div>
                              <p className="text-muted-foreground text-sm">
                                {subField.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-6" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          }
          rightContent={
            <div>
              <Card className="p-6 bg-background">
                <h3 className="font-semibold mb-4 mt-5">Response format</h3>
                <RenderCode
                  maxHeight="400px"
                  maxWidth="700px"
                  language="json"
                  code={basicResponse}
                />
              </Card>
            </div>
          }
        />
        <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 " />
        {/* Api search : enabling web search  */}
        <div className="mt-10 ">
          <h2
            data-section="chat-search"
            className="text-3xl mb-4 font-semibold text-gray-800 dark:text-gray-200"
          >
            <span className="bg-accent text-muted-foreground rounded-md px-2 py-1 font-mono  mr-2">
              web_search
            </span>
            Parameter
          </h2>
          <div>
            <ApiDocLayout
              leftContent={
                <div>
                  <Card className="p-4 bg-background">
                    <p className="text-muted-foreground mb-4">
                      The approach used in earlier examples demonstrated a
                      simple request body. You can enhance the model's
                      capabilities by enabling web search. To do this, include
                      the <code>web_search</code> field in your request body.
                      This field accepts a boolean value:
                    </p>
                    <ul className="list-disc ml-4 mt-2 mb-4 text-muted-foreground">
                      <li>
                        <span className="text-red-500 dark:text-red-400 font-bold">
                          false
                        </span>{" "}
                        (default): Web search is disabled. The model will rely
                        solely on its internal knowledge.
                      </li>
                      <li>
                        <span className="text-green-500 dark:text-green-400 font-bold">
                          true
                        </span>
                        : Web search is enabled. The model will consult external
                        web resources to enhance its responses.
                      </li>
                    </ul>
                    <div className="mt-5">
                      <h3 className="text-2xl  mt-4">
                        Structure of <code>web_search_results</code>
                      </h3>

                      <p className="mt-2 text-muted-foreground">
                        The <code>web_search_results</code> field is an array of
                        objects. Each object represents the search results for a
                        specific query.
                      </p>

                      <ul className="list-disc ml-6 mt-2 text-muted-foreground">
                        <li>
                          <code>query</code>: The search query that was used to
                          retrieve these results.
                        </li>
                        <li>
                          <code>results</code>: An array of search result
                          objects. Each object represents a single search
                          result.
                        </li>
                      </ul>

                      <h3 className="text-xl font-semibold  mt-4">
                        Structure of Search Result Objects
                      </h3>

                      <p className="mt-2 text-muted-foreground">
                        Each search result object within the{" "}
                        <code>results</code> array has the following structure:
                      </p>

                      <ul className="list-disc ml-6 mt-2 text-muted-foreground">
                        <li>
                          <code>title</code>: The title of the search result.
                        </li>
                        <li>
                          <code>url</code>: The URL of the search result.
                        </li>
                        <li>
                          <code>description</code>: A short description or
                          snippet of the search result.
                        </li>
                      </ul>

                      <p className="mt-4 text-muted-foreground">
                        If the <code>websearch</code> parameter was not set to{" "}
                        <code>true</code> in the API request, the{" "}
                        <code>web_search_results</code> field will not be
                        present in the response.
                      </p>
                    </div>
                  </Card>
                </div>
              }
              rightContent={
                <Card className="bg-background p-4">
                  <p className="mt-4 mb-5 text-sm text-muted-foreground text-center">
                    For example, to enable web search, your request body should
                    include:
                  </p>
                  <RenderCode
                    language="json"
                    code={`{
    "web_search": true,
    "other_field": "some_value"  // Other fields in your request
  }`}
                  />
                  <div className="mt-5">
                    <h3 className="text-2xl font-bold  mt-4">
                      Web Search Results
                    </h3>

                    <p className="mt-2 text-muted-foreground mb-5">
                      If the <code>websearch</code> parameter was set to
                      <code>true</code> in the API request, the response will
                      include a <code>web_search_results</code> field. This
                      field contains the results of web searches performed by
                      the model to enhance its response.
                    </p>
                    <RenderCode
                      language="json"
                      code={`{
    // ... other fields in the response ...
    "web_search_results": [
      {
        "query": "The search query used",
        "results": [
          {
            "title": "Title of the search result",
            "url": "URL of the search result",
            "description": "Short description of the search result"
          },
          // ... more search results for this query ...
        ]
      },
      // ... more sets of search results for different queries ...
    ]
  }`}
                    />
                  </div>
                </Card>
              }
            />
          </div>
        </div>

        <hr className="border-t-1 dark:border-zinc-700 border-gray-200  " />
        {/*model  comparison  */}

        <div className="mt-10 ">
          <h2 data-section="chat-comparison" className="text-3xl font-bold mb-3">
            Model Output
            <span className="bg-accent text-muted-foreground rounded-md px-2 py-1 font-mono  mr-2">
              Comparison
            </span>
          </h2>
          <ApiDocLayout
            leftContent={
              <Card className="bg-background p-4">
                <p className="mb-4 text-muted-foreground">
                  The <code>comparison</code> field is an <b>optional</b>{" "}
                  parameter in the API request. Including this field enables the
                  API to perform comparisons across different AI models and
                  return the comparison results along with the regular model
                  outputs. If the <code>comparison</code> field is omitted, no
                  model comparisons will be performed, and only the standard
                  model outputs will be returned.
                </p>
                <p className="text-muted-foreground mb-4">
                  If you include the <code>comparison</code> field, it accepts
                  an array of comparison objects, where each object defines a
                  specific comparison type and the models to be included.
                </p>
                <section>
                  <h3 className="text-xl mt-3 font-bold">Comparison Types</h3>

                  <p className="mt-2 text-muted-foreground">
                    The <code>type</code> field specifies the type of comparison
                    to be performed. The following types are currently
                    supported:
                  </p>

                  <ul className="list-disc ml-6 mt-2 text-muted-foreground">
                    <li>
                      <code className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 py-1 rounded font-mono">
                        text
                      </code>
                      : Compares the text output of the specified models.
                    </li>
                    <li>
                      <code className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-2 py-1 rounded font-mono">
                        audio_url
                      </code>
                      : Compares the audio content accessible at the provided
                      URLs.
                    </li>
                    {/* Add other comparison types as needed, using different background colors */}
                  </ul>

                  <h3 className="text-xl font-bold mt-4">
                    Models - Format{" "}
                    <span className="text-red-500 dark:text-red-400 font-bold">
                      (Important)
                    </span>
                  </h3>

                  <p className="mt-2 text-muted-foreground">
                    The <code>models</code> field is an array of strings. Each
                    string specifies a &nbsp;
                    <span className="font-bold text-orange-500 dark:text-orange-400">
                      combination &nbsp;
                    </span>
                    of models to be used in the comparison. Models within each
                    string are joined together with plus signs (
                    <code>
                      <span className="text-red-600">+</span>
                    </code>
                    ). This indicates that the models will be used in a combined
                    or ensemble manner for that specific comparison. For
                    example:
                  </p>

                  <ul className="list-disc ml-6 mt-2 text-muted-foreground">
                    <li>
                      <code className="bg-gray-200 dark:bg-gray-700  px-2 py-1 rounded font-mono">
                        "gpt-4o<span className="text-red-600">+</span>
                        deepseek-r1
                        <span className="text-red-600">+</span>
                        claude-3.5-sonnet"
                      </code>
                      : This specifies a comparison involving GPT-4, Deepseek,
                      and Claude.
                    </li>
                    <li>
                      <code className="bg-gray-100 dark:bg-gray-700  px-2 py-1 rounded font-mono">
                        "selected_model_one
                        <span className="text-red-600">+</span>
                        yet-another-model"
                      </code>
                      : Another example with audio models.
                    </li>
                  </ul>

                  <p className="mt-2 text-muted-foreground">
                    Each string in the <code>models</code> array represents a
                    distinct set of models to be used &nbsp;
                    <span className="font-bold text-orange-500 dark:text-orange-400">
                      together &nbsp;
                    </span>
                    in a single comparison. You can have multiple strings in the{" "}
                    <code>models</code> array if you want to compare different
                    combinations of models for the same comparison{" "}
                    <code>type</code>.
                  </p>
                </section>
              </Card>
            }
            rightContent={
              <Card className="bg-background p-4">
                <p className=" text-muted-foreground mb-3">
                  The <code>comparison</code> array has the following structure:
                </p>
                <RenderCode
                  language="json"
                  code={` [
    {
      "type": "comparison_type",  // Required: The type of comparison
      "models": ["model_string_1", "model_string_2", ...] // Required: Array of model strings
    },
    {
      "type": "another_comparison_type",
      "models": ["another_model_string"]
    },
    // ... more comparison objects
  ]`}
                />
                <div className="mt-5">
                  <h3 className="text-2xl font-bold mt-4">Response Format</h3>

                  <p className="mt-4 text-muted-foreground mb-5">
                    The API response will be a JSON object. If the{" "}
                    <code>comparison</code> field was included in the request,
                    the response will include the comparison results in a
                    specific format, along with the regular model outputs.
                  </p>
                </div>
                <RenderCode
                  language="json"
                  code={`{
    // ... other fields in the response ...
    "comparison": {
      "model_string_1": [ // e.g., "gpt-4o+deepseek-r1+claude-3.5-sonnet"
        {
          "type": "output_type", // e.g., "text", "audio_url"
          "text": "The model's text output" // Only present if type is "text"
          "audio_url": {            // Only present if type is "audio_url"
            "url": "data:audio/wav;base64,..."
          }
        },
        // ... more output objects for this model string ...
      ],
      "model_string_2": [ // e.g., "another-audio-model+yet-another-model"
        {
          "type": "output_type",
          "audio_url": {
            "url": "data:audio/wav;base64,..."
          }
        },
        // ... more output objects for this model string ...
      ],
      // ... more model strings and their outputs ...
    }
  }`}
                />
                <p className="mt-4 text-muted-foreground">
                  If the <code>comparison</code> field was not included in the
                  API request, the <code>comparison_results</code> field will
                  not be present in the response.
                </p>
              </Card>
            }
          />
        </div>
        {/*  summary and comparison */}
        <hr className="border-t-1 dark:border-zinc-700 border-gray-200  " />

        <div className="mt-10">
          <h2 data-section="chat-summary" className="text-3xl font-bold ">
            <span className="bg-accent text-muted-foreground rounded-md px-2 py-1 font-mono  mr-2">
              Summary
            </span>
            and{" "}
            <span className="bg-accent text-muted-foreground rounded-md px-2 py-1 font-mono  mr-2">
              Combination
            </span>
            Fields (Optional)
          </h2>

          <p className="mt-4 text-muted-foreground">
            The <code>summary</code> and <code>combination</code> fields are
            both optional parameters that allow you to request summarized model
            outputs and specify different combinations of models, respectively.
            Both fields use the same structure as the{" "}
            <a
              href="#comparison"
              className="text-blue-500 hover:text-blue-700 underline"
            >
              <code>comparison</code> field
            </a>
            . Please refer to that section for details on the allowed types and
            model string format.
          </p>

          <p className="mt-4 text-muted-foreground">
            The <code>summary_results</code> and{" "}
            <code>combination_results</code> in the API response mirror the
            structure of the <code>comparison_results</code>. See the &nbsp;
            <a
              href="#comparison"
              className="text-blue-500 hover:text-blue-700 underline"
            >
              Response Format
            </a>
            &nbsp; section for more information.
          </p>
        </div>
      </div>
    </div>
  );
}
