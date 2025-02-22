"use client";
import RenderCode from "@/components/RenderCode";
import Link from "next/link";
import ApiDocLayout from "@/components/TwoLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import NavigationContainer from "@/components/NavigationContainer";
const requestbody = `{
  type: "text-to-speech",
  prompt:
    "Rich men do what it takes to double money",
  models: ["elevenlabs", "Gemini", "gpt-4o"],
  voice: "alloy",
  response_format: "mp3",
  speed:0.25
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
from pathlib import Path
import alleai

speech_file_path = Path(__file__).parent / "speech.mp3"
response = alleai.audio.speech.create(
  models: ["elevenlabs", "Gemini", "gpt-4o"],
  voice="alloy",
  input="The quick brown fox jumped over the lazy dog."
)
response.stream_to_file(speech_file_path)


`;

const node = `
import fs from "fs";
import path from "path";
import alleai from "alleai";

const alleai = new alleAI();

const speechFile = path.resolve("./speech.mp3");

async function main() {
  const mp3 = await openai.audio.speech.create({
    model: ["tts-1",,"Gemini"]
    voice: "alloy",
    input: "Today is a wonderful day to build something people love!",
  });
  console.log(speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
}
main();

`;
const response = `
{
  "created": 1589478378,
  "data": [
    { "model": "tts-1"
      "url": "https://..."
    },
    { "model":"gemini"
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
      "indicate the type of request [text-to-speech], [transcription] audio generation ",
  },
  {
    name: "prompt",
    type: "string",
    required: true,
    description:
      "The text to generate audio for. The maximum length is 4096 characters.",
  },
  {
    name: "models",
    type: "array",
    required: true,
    description: "Array of selected audio models for API call",
  },

  {
    name: "voice",
    type: "string",
    required: true,
    description:
      "The voice to use when generating the audio. Supported voices are alloy, ash, coral, echo, fable, onyx, nova, sage and shimmer. Previews of the voices are available in the Text t",
  },
  {
    name: "response_format",
    type: "string or null",
    required: false,
    description:
      "The format to audio in. Supported formats are mp3, opus, aac, flac, wav,",
  },
  {
    name: "size",
    type: "string or null",
    required: false,
    description:
      "The size of the generated images. Must be one of 256x256, 512x512, or 1024x1024 for dall-e-2. Must be one of  1024x1024, 1792x1024, or 1024x1792 for dall-e-3 models. Defaults to 1024x1024.",
  },
  {
    name: "speed",
    type: "number",
    required: false,
    description:
      "The speed of the generated audio. Select a value from 0.25 to 4.0. 1.0 is the default.",
  },
];
const musicRequest = [
  {
    name: "type",
    type: "string",
    required: true,
    description:
      "indicate the type of request [text-to-speech], [transcription] audio generation, In this case will be audio-generation ",
  },
  {
    name: "prompt",
    type: "string",
    required: true,
    description:
      "The text to generate audio for. The maximum length is 4096 characters.",
  },
  {
    name: "models",
    type: "array",
    required: true,
    description: "Array of selected audio models for API call",
  },
  {
    name: "response_format",
    type: "string or null",
    required: false,
    description:
      "The format to audio in. Supported formats are mp3, opus, aac, flac, wav,",
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
    name: "file",
    type: "file",
    required: true,
    description:
      "The audio file object (not file name) to transcribe, in one of these formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.",
  },
  {
    name: "models",
    type: "array",
    required: true,
    description: "selected models for audio transcription",
  },
  {
    name: "prompt",
    type: "string",
    required: false,
    description:
      "An optional text to guide the model's style or continue a previous audio segment. The prompt should match the audio language.",
  },
  {
    name: "language",
    type: "string",
    required: false,
    description:
      "A text description of the desired image(s). The maximum length is 1000 characters.",
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

export default function ApiAudioGenerationDocs() {
  return (
    <div className=" ml-10">
      <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />

      {/* intro */}
      <section className="mb-10">
        <ApiDocLayout
          leftContent={
            <Card className="bg-background p-4">
              <h2
                data-section="audio-text-to-speech"
                className="text-3xl font-bold mb-4"
              >
                Audio
              </h2>
              <div className="text-muted-foreground">
                <p className="text-muted-foreground">
                  Learn how to turn audio into text or text into audio by
                  combining multiple audio models.
                </p>
                <h3>The API supports three primary operations:</h3>
                <ul>
                  <li className="text-muted-foreground">
                    <strong className="text-black dark:text-white">
                      Create speech : &nbsp;
                    </strong>
                    Generates audio from the input text.
                  </li>
                  <li>
                    <strong className="text-black dark:text-white">
                      Create transcription :&nbsp;
                    </strong>
                    Transcribes audio into the input language.
                  </li>
                  <li>
                    <strong className="text-black dark:text-white">
                      Create audio :&nbsp;
                    </strong>
                    Generate sounds, music, and other audio formats from text by
                    combining power of multiple audio models
                  </li>
                </ul>
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
              <h2 className="text-3xl font-bold mb-4">Text-to-Speech API</h2>
              <div className="mb-4 text-muted-foreground">
                <p>
                  Generates audio from the input text with multiple audio
                  models.
                </p>
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
      {/* C */}
      <section className="">
        <ApiDocLayout
          leftContent={
            <Card className="bg-background p-4">
              <h2
                data-section="audio-speech-to-text"
                className="text-3xl font-bold mb-3"
              >
                Create transcription
              </h2>
              <p className="text-muted-foreground mb-5">
                Transcribes audio into the input language.
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
        <section>
          <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />

          <ApiDocLayout
            leftContent={
              <div>
                <h2
                  data-section="audio-generation"
                  className="text-3xl font-bold mb-4"
                >
                  Create audio
                </h2>
                <p className="text-muted-foreground mb-5">
                  Generate all kinds of sound from supported AI modes
                </p>
                <h3 className="text-xl font-semibold mb-5">Request body</h3>
                {musicRequest.map((field, index) => (
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
                    <p className="text-muted-foreground">{field.description}</p>
                    <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />
                  </div>
                ))}
              </div>
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
      </section>
    </div>
  );
}
