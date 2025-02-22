"use client";
import RenderCode from "@/components/RenderCode";
import Link from "next/link";
import ApiDocLayout from "@/components/TwoLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import NavigationContainer from "@/components/NavigationContainer";
const requestbody = `{
  type: "text-to-image",
  prompt:
    "a serene mountain landscape with a lake reflecting the sunset, photorealistic style",
  models: ["stable-diffusion-xl", "midjourney-v5", "dalle-3"],
  options: {
    width: 1024,
    height: 768,
    num_outputs_per_model: 1,
    guidance_scale: 7.5,
    seed: 42,
    safety_check: true,
  },
  quality: "hd",
  response_format: "url",
};`;

const curl = `
curl https://alleai.com/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": ["dall-e-3","midjourney"],
    "prompt": "A cute baby sea otter",
    "n": 1,
    "size": "1024x1024"
  }'
`;
const python = `
from alleai import alleImage
client = alleImage()

client.images.generate(
  models=["dall-e-3","midjourney"],
  prompt="A cute baby sea otter",
  n=1,
  size="1024x1024"
)

`;

const node = `
import alleai from "alleImage";

const image = new alleai();

async function main() {
  const image = await openai.images.generate({ model: "dall-e-3", prompt: "A cute baby sea otter" });

  console.log(image.data);
}
main();
`;
const response = `
{
  "created": 1589478378,
  "data": [
    { "model": "dall-e-3"
      "url": "https://..."
    },
    { "model":"midjourney"
      "url": "https://..."
    }
  ]
}

`;
const requestBodyFields = [
  {
    name: "type",
    type: "string",
    required: true,
    description:
      "indicate the type of request [text-to-image] or [image-editing] ",
  },
  {
    name: "prompt",
    type: "string",
    required: true,
    description:
      "A text description of the desired image(s). The maximum length is 1000 characters for dall-e-2 and 4000 characters for dall-e-3.",
  },
  {
    name: "models",
    type: "array",
    required: true,
    description: "Array of selected images models for API call",
  },

  {
    name: "quality",
    type: "string",
    required: false,
    description:
      "The quality of the image that will be generated. hd creates images with finer details and greater consistency across the image. This param is only supported for dall-e-3. Defaults to standard.",
  },
  {
    name: "response_format",
    type: "string or null",
    required: false,
    description:
      "The format in which the generated images are returned. Must be one of url or b64_json. URLs are only valid for 60 minutes after the image has been generated. Defaults to url.",
  },
  {
    name: "size",
    type: "string or null",
    required: false,
    description:
      "The size of the generated images. Must be one of 256x256, 512x512, or 1024x1024 for dall-e-2. Must be one of  1024x1024, 1792x1024, or 1024x1792 for dall-e-3 models. Defaults to 1024x1024.",
  },
];
const requestEdit = `
{
type:"image-edit"
models:['dall-e-3','midjourney'],
prompt:"modify the cap",
options:[
]      // other options
}
`;
const EditRequestBody = [
  {
    name: "type",
    type: "string",
    required: true,
    description:
      "image-edit, this is required to get and edited edition of original images",
  },
  {
    name: "images",
    type: "file",
    required: true,
    description:
      "The image to edit. Must be a valid PNG file, less than 4MB, and square. If mask is not provided, image must have transparency, which will be used as the mask.",
  },
  {
    name: "prompt",
    type: "string",
    required: true,
    description:
      "A text description of the desired image(s). The maximum length is 1000 characters.",
  },
  {
    name: "prompt",
    type: "string",
    required: true,
    description:
      "A text description of the desired image(s). The maximum length is 1000 characters.",
  },
  {
    name: "models",
    type: "string",
    required: true,
    description: "The models to be use for image generation.",
  },
  {
    name: "response_format",
    type: "string or null",
    required: false,
    description:
      "The format in which the generated images are returned. Must be one of url or b64_json. URLs are only valid for 60 minutes after the image has been generated.",
  },
];

const editRequestCurl = `
curl https://api.alleai.com/v1/images/edits \
  -H "Authorization: Bearer $alleai_key" \
  -F image="@otter.png" \
  -F models =['dall-3-e","midjourney"]\
  -F prompt="A cute baby sea otter wearing a beret" \
  -F size="1024x1024"

`;
const editRequestPython = `

from alleai import alleImageEdit
client = alleImageEdit()

client.images.edit(
  image=open("otter.png", "rb"),
  prompt="A cute baby sea otter wearing a beret",
  size="1024x1024",
  models=["dall-e-3","midjourney"]
)

`;
const editRequestJavascript = `
import fs from "fs";
import alleai from "alleImageEdit";

const alleaiImage = new alleImageEdit();
async function main() {
  const image = await alleImageEdit.images.edit({
    image: fs.createReadStream("otter.png"),
    mask: fs.createReadStream("mask.png"),
    prompt: "A cute baby sea otter wearing a beret",
    models=["dall-e-3","midjourney"]
  });
}
main();

`;

export default function ApiImageGenerationDocs() {
  return (
    <div className=" ml-10">
      <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />

      {/* intro */}
      <section className="mb-10">
        <div className="mb-4">
          <h2 className="font-bold text-3xl">Image Generation API</h2>
        </div>
        <ApiDocLayout
          leftContent={
            <Card className="bg-background p-4">
              <h2
                data-section="image-generation"
                className="text-3xl font-bold mb-4"
              >
                Multi-Model Image Generation API
              </h2>
              <div className="text-muted-foreground">
                <p className="text-muted-foreground">
                  Our Multi-Model Image Generation API allows developers to
                  leverage multiple AI models simultaneously for image
                  generation and editing tasks. This unique approach enables you
                  to compare outputs across different models, provide users with
                  diverse creative options, and select the best result for your
                  specific use case.
                </p>
                <h3>The API supports two primary operations:</h3>
                <ul>
                  <li className="text-muted-foreground">
                    <strong className="text-black dark:text-white">
                      Text-to-Image Generation : &nbsp;
                    </strong>
                    Create images from text prompts across multiple models.
                  </li>
                  <li>
                    <strong className="text-black dark:text-white">
                      Image Editing :&nbsp;
                    </strong>
                    Modify existing images using text instructions across
                    multiple models.
                  </li>
                </ul>
                <p>
                  This documentation provides detailed information about
                  endpoints, request formats, response structures, and code
                  examples to help you integrate these capabilities into your
                  applications.
                </p>
              </div>
            </Card>
          }
          rightContent={
            <Card className="bg-background p-4 mt-5">
              <h2 className="text-3xl font-bold mb-4">Authentication</h2>
              <p className="text-muted-foreground mb-4">
                All API requests require authentication using an API key.
              </p>
              {/* Base URL and Endpoint */}
              <div className="bg-muted/50 mb-4 p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">Base URL</h4>
                <RenderCode
                  code="https://api.imagedomain.com/v1/generate/text-to-image"
                  language="bash"
                  className="text-sm block mb-2"
                  showLanguage={false}
                />
              </div>
              <p className="text-muted-foreground mb-4">
                You can obtain an API key by &nbsp;{" "}
                <Link href={"/"} target="_blank" className="text-blue-600">
                  registering for an account
                </Link>{" "}
                &nbsp; and navigating to the API Keys section in your dashboard.
              </p>
              <section className="">
                <div className="bg-yellow-500/10 border-yellow-500/50 border p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-500 mb-2">
                    Important: API Key Required
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Security Note: Keep your API key secure and never expose it
                    in client-side code or public repositories.
                  </p>
                </div>
              </section>
            </Card>
          }
        />
      </section>
      <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />
      {/* text to image */}
      <section className="mt-5 mb-10">
        <ApiDocLayout
          leftContent={
            <Card className="bg-background p-4">
              <h2 className="text-3xl font-bold mb-4">Text-to-Image API</h2>
              <div className="mb-4 text-muted-foreground">
                <p>
                  The Text-to-Image API transforms text descriptions into visual
                  imagery using multiple AI models simultaneously. This parallel
                  approach allows you to:
                </p>
                <ul>
                  <li>Compare stylistic differences between models</li>
                  <li>Offer diverse creative options to your users</li>
                  <li>
                    Experiment with prompt engineering across different model
                    architectures
                  </li>
                  <li>
                    Select the most suitable output for your specific needs
                  </li>
                </ul>
              </div>
              <section className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Request Body</h3>
                <div className="space-y-6">
                  {requestBodyFields.map((field, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{field.name}</span>
                        <span className="text-muted-foreground font-mono">
                          {field.type}
                        </span>
                        <span
                          className={
                            field.required
                              ? "text-red-500"
                              : "text-muted-foreground"
                          }
                        >
                          {field.required ? "Required" : "Optional"}
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        {field.description}
                      </p>
                      <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />
                    </div>
                  ))}
                </div>
              </section>
            </Card>
          }
          rightContent={
            <Card className="bg-background p-4">
              <div className="mb-7">
                <RenderCode
                  showLanguage={false}
                  title="Example request body"
                  code={requestbody}
                  language="json"
                />
              </div>
              <div className="mb-6">
                <Tabs defaultValue="python">
                  <TabsList>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="node">Node.js</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                  </TabsList>
                  <TabsContent value="python">
                    <RenderCode
                      showLanguage={false}
                      title="Example request "
                      code={python}
                      language="python"
                    />
                  </TabsContent>
                  <TabsContent value="node">
                    <RenderCode
                      showLanguage={false}
                      title="Example request "
                      code={node}
                      language="javascript"
                    />
                  </TabsContent>
                  <TabsContent value="curl">
                    <RenderCode
                      showLanguage={false}
                      title="Example request "
                      code={curl}
                      language="bash"
                    />
                  </TabsContent>
                </Tabs>
              </div>
              <div className="">
                <RenderCode
                  showLanguage={false}
                  title="Example response"
                  language="json"
                  code={response}
                />
              </div>
            </Card>
          }
        />
        <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />
      </section>
      {/* Create image edit */}
      <section className="">
        <ApiDocLayout
          leftContent={
            <Card className="bg-background p-4">
              <h2
                data-section="image-generation-edits"
                className="text-3xl font-bold mb-3"
              >
                Create image edits
              </h2>
              <p className="text-muted-foreground mb-5">
                Creates, edits or extended image given an original image and a
                prompt.
              </p>

              <h2 className="text-xl font-semibold mb-4">Request body</h2>
              {EditRequestBody.map((field, index) => (
                <div key={index} className="space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{field.name}</span>
                    <span className="text-muted-foreground font-mono">
                      {field.type}
                    </span>
                    <span
                      className={
                        field.required
                          ? "text-red-500"
                          : "text-muted-foreground"
                      }
                    >
                      {field.required ? "Required" : "Optional"}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{field.description}</p>
                  <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />
                </div>
              ))}
            </Card>
          }
          rightContent={
            <Card className="bg-background p-4 mb-10">
              <div className="mb-8">
                <RenderCode
                  showLanguage={false}
                  title="Example request body"
                  code={requestEdit}
                  language="json"
                />
              </div>
              <div className="mb-5">
                <Tabs defaultValue="javascript">
                  <TabsList>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                  </TabsList>
                  <TabsContent value="javascript">
                    <RenderCode
                      showLanguage={false}
                      title="Example request"
                      language="javascript"
                      code={editRequestJavascript}
                    />
                  </TabsContent>
                  <TabsContent value="curl">
                    <RenderCode
                      showLanguage={false}
                      title="Example request"
                      language="bash"
                      code={editRequestCurl}
                    />
                  </TabsContent>
                  <TabsContent value="python">
                    <RenderCode
                      showLanguage={false}
                      title="Example request"
                      language="python"
                      code={editRequestPython}
                    />
                  </TabsContent>
                </Tabs>
              </div>
              {/* response */}
              <div className="mt-5">
                <RenderCode
                  code={response}
                  showLanguage={false}
                  title="Response"
                />
              </div>
            </Card>
          }
        />
      </section>
    </div>
  );
}