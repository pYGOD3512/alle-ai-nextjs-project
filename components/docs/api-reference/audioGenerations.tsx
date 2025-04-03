"use client";
import RenderCode from "@/components/RenderCode";
import Link from "next/link";
import ApiDocLayout from "@/components/TwoLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { audioGenCodes } from "@/lib/constants/code-snippets-docs/apiDocs";
import { apiDocsEndpoints } from "@/lib/constants/code-snippets-docs/apiDocs";
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
    name: "models",
    type: "string[]",
    required: true,
    description:
      "Array of selected audio models for the text-to-speech API call.",
  },
  {
    name: "text",
    type: "string",
    required: true,
    description:
      "The text to generate audio for. Maximum length is 4096 characters.",
  },
  {
    name: "voice_id",
    type: "string",
    required: false,
    description:
      "The ID of the voice to use for audio generation. Optional, defaults to a model-specific voice.",
  },
  {
    name: "language",
    type: "string",
    required: false,
    description: "The language code for the audio (e.g., 'en-US'). Optional.",
  },
  {
    name: "speed",
    type: "number",
    required: false,
    description:
      "The speed of the generated audio. Ranges from 0.25 to 4.0. Defaults to 1.0.",
  },
  {
    name: "pitch",
    type: "number",
    required: false,
    description: "Voice pitch adjustment, ranging from -20 to 20. Optional.",
  },
  {
    name: "format",
    type: "'mp3' | 'wav' | 'ogg'",
    required: false,
    description:
      "The audio output format. Supported values are 'mp3', 'wav', or 'ogg'. Optional.",
  },
  {
    name: "quality",
    type: "'standard' | 'hd'",
    required: false,
    description:
      "The quality of the generated audio: 'standard' or 'hd'. Optional, defaults to 'standard'.",
  },
  {
    name: "emotion",
    type: "'neutral' | 'happy' | 'sad' | 'angry' | 'excited'",
    required: false,
    description:
      "The emotional tone of the voice. Options are 'neutral', 'happy', 'sad', 'angry', or 'excited'. Optional.",
  },
  {
    name: "volume",
    type: "number",
    required: false,
    description: "The volume level of the generated audio. Optional.",
  },
];
const musicRequest = [
  {
    name: "models",
    type: "string[]",
    required: true,
    description:
      "Array of selected audio models for generating audio from text.",
  },
  {
    name: "prompt",
    type: "string",
    required: true,
    description:
      "The text description to generate audio from. Maximum length is 4096 characters.",
  },
  {
    name: "duration",
    type: "number",
    required: false,
    description: "The duration of the generated audio in seconds. Optional.",
  },
  {
    name: "tempo",
    type: "number",
    required: false,
    description:
      "The tempo of the generated audio in beats per minute (BPM). Optional.",
  },
  {
    name: "genre",
    type: "string",
    required: false,
    description:
      "The musical genre for the generated audio (e.g., 'jazz', 'rock'). Optional.",
  },
  {
    name: "instruments",
    type: "string[]",
    required: false,
    description:
      "Array of instruments to include in the audio (e.g., 'piano', 'drums'). Optional.",
  },
  {
    name: "quality",
    type: "'standard' | 'hd'",
    required: false,
    description:
      "The quality of the generated audio: 'standard' or 'hd'. Optional, defaults to 'standard'.",
  },
  {
    name: "format",
    type: "'mp3' | 'wav' | 'ogg'",
    required: false,
    description:
      "The audio output format. Supported values are 'mp3', 'wav', or 'ogg'. Optional.",
  },
  {
    name: "loop",
    type: "boolean",
    required: false,
    description: "Whether the generated audio should be loopable. Optional.",
  },
  {
    name: "mood",
    type: "string",
    required: false,
    description:
      "The mood of the generated audio (e.g., 'happy', 'calm'). Optional.",
  },
  {
    name: "volume",
    type: "number",
    required: false,
    description: "The volume level of the generated audio. Optional.",
  },
];

const EditRequestBody = [
  {
    name: "models",
    type: "string[]",
    required: true,
    description: "Array of selected models for audio transcription.",
  },
  {
    name: "audioUrl",
    type: "string",
    required: true,
    description:
      "A base64-encoded string or a web URL pointing to the audio file to transcribe. Supported formats include flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.",
  },
  {
    name: "language",
    type: "string",
    required: false,
    description: "The source audio language (e.g., 'en-US'). Optional.",
  },
  {
    name: "timestamp",
    type: "boolean",
    required: false,
    description:
      "Whether to include word-level timestamps in the transcription. Optional.",
  },
  {
    name: "diarization",
    type: "boolean",
    required: false,
    description:
      "Whether to enable speaker identification (diarization). Optional.",
  },
  {
    name: "filter_profanity",
    type: "boolean",
    required: false,
    description:
      "Whether to filter inappropriate content from the transcription. Optional.",
  },
  {
    name: "output_format",
    type: "'json' | 'text' | 'srt' | 'vtt'",
    required: false,
    description:
      "The format of the transcription output. Options are 'json', 'text', 'srt', or 'vtt'. Optional.",
  },
  {
    name: "noise_reduction",
    type: "boolean",
    required: false,
    description: "Whether to apply background noise filtering. Optional.",
  },
  {
    name: "punctuation",
    type: "boolean",
    required: false,
    description:
      "Whether to automatically add punctuation to the transcription. Optional.",
  },
  {
    name: "max_speakers",
    type: "number",
    required: false,
    description:
      "The maximum number of speakers to identify during diarization. Optional.",
  },
];

export default function ApiAudioGenerationDocs() {
  return (
    <div className=" ml-10">
      <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />

      {/* intro */}
      <section className="mb-10">
        <h2
          data-section="audio-text-to-speech"
          className="text-3xl font-bold mb-4"
        >
          Audio Generation API
        </h2>
        <ApiDocLayout
          leftContent={
            <Card className="bg-background p-4">
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
                  code={`${apiDocsEndpoints.BaseUrl}/audio`}
                  language="bash"
                  className="text-sm block mb-2"
                  showLanguage={false}
                  isLink={true}
                />
              </div>
              <p className="text-muted-foreground mb-4">
                You can obtain an API key by &nbsp;{" "}
                <Link href={"/"} target="_blank" className="text-blue-600">
                  registering for an account
                </Link>{" "}
                &nbsp; and navigating to the API Keys section in your dashboard.
              </p>
            </Card>
          }
        />
      </section>
      <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />
      {/* text to image */}
      <section className="mt-5 mb-8">
        <h2 className="text-3xl font-bold mb-4">Text-to-Speech</h2>

        <ApiDocLayout
          leftContent={
            <Card className="bg-background p-4">
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
              <div className="mb-4 mt-4">
                <h4 className="font-semibold p-3">text-to-speech endpoint</h4>
                <RenderCode
                  code={apiDocsEndpoints.audio.tts}
                  language="bash"
                  className="text-sm"
                  showLanguage={false}
                  isLink={true}
                />
              </div>
              <div className="mb-7">
                <RenderCode
                  showLanguage={false}
                  title="Example request body"
                  code={audioGenCodes.examplBody}
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
                      code={audioGenCodes.python}
                      language="python"
                    />
                  </TabsContent>
                  <TabsContent value="node">
                    <RenderCode
                      showLanguage={false}
                      title="Example request "
                      code={audioGenCodes.javascritp}
                      language="javascript"
                    />
                  </TabsContent>
                  <TabsContent value="curl">
                    <RenderCode
                      showLanguage={false}
                      title="Example request "
                      code={audioGenCodes.curl}
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
      {/* speech to text */}
      <section className="">
        <h2
          data-section="audio-speech-to-text"
          className="text-3xl font-bold mb-3"
        >
          Create transcription
        </h2>
        <ApiDocLayout
          leftContent={
            <Card className="bg-background p-4">
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
              <div className="mb-4 mt-4">
                <h4 className="font-semibold p-3">transcription endpoint</h4>
                <RenderCode
                  code={apiDocsEndpoints.audio.stt}
                  language="bash"
                  className="text-sm"
                  showLanguage={false}
                  isLink={true}
                />
              </div>
              <div className="mb-8">
                <RenderCode
                  showLanguage={false}
                  title="Example request body"
                  code={audioGenCodes.transcribebody}
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
                      code={audioGenCodes.transcribeJavascript}
                    />
                  </TabsContent>
                  <TabsContent value="curl">
                    <RenderCode
                      showLanguage={false}
                      title="Example request"
                      language="bash"
                      code={audioGenCodes.transcribeCurl}
                    />
                  </TabsContent>
                  <TabsContent value="python">
                    <RenderCode
                      showLanguage={false}
                      title="Example request"
                      language="python"
                      code={audioGenCodes.transcribePython}
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
      <hr className="border-t-1 dark:border-zinc-700 border-gray-200 my-10 mt-5" />

      {/* Generate audio */}
      <section>
        <h2 data-section="audio-generate" className="text-3xl font-bold mb-4">
          Create audio
        </h2>
        <ApiDocLayout
          leftContent={
            <div>
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
              <div className="mt-5">
                <RenderCode
                  code={response}
                  showLanguage={false}
                  title="Response"
                />
              </div>
            </div>
          }
          rightContent={
            <Card className="bg-background p-4 mb-10">
              <div className="mb-4 mt-4">
                <h4 className="font-semibold p-3">audio generation endpoint</h4>
                <RenderCode
                  code={apiDocsEndpoints.audio.generate}
                  language="bash"
                  className="text-sm"
                  showLanguage={false}
                  isLink={true}
                />
              </div>
              <div className="mb-8">
                <RenderCode
                  showLanguage={false}
                  title="Example request body"
                  code={audioGenCodes.generatebody}
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
                      code={audioGenCodes.generateJavascript}
                    />
                  </TabsContent>
                  <TabsContent value="curl">
                    <RenderCode
                      showLanguage={false}
                      title="Example request"
                      language="bash"
                      code={audioGenCodes.generateCurl}
                    />
                  </TabsContent>
                  <TabsContent value="python">
                    <RenderCode
                      showLanguage={false}
                      title="Example request"
                      language="python"
                      code={audioGenCodes.generatePython}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          }
        />
      </section>
    </div>
  );
}
