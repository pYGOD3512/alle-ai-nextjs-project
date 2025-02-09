import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import Link from "next/link";

// Extended suggestions
const suggestions = [
  { title: "Text Generation", href: "/text-generation" },
  { title: "Image Generation", href: "/image-generation" },
  { title: "Audio Generation", href: "/audio-generation" },
  { title: "Error Handling", href: "/batch-processing" },
];

// Extended FAQs
const faqs = [
  {
    title: "What file formats are supported?",
    description:
      "We support a wide range of file formats, including images (JPEG, PNG, WebP, HEIC), audio (MP3, WAV, M4A, FLAC), and documents (PDF, DOCX, TXT, RTF). Check the API documentation for a full list of supported formats.",
  },
  {
    title: "Is there a file size limit?",
    description:
      "Yes, the maximum file size for uploads is 100MB. For larger files, consider using our chunked upload API or splitting them before uploading. Enterprise users can request increased limits.",
  },
  {
    title: "How do I handle file processing errors?",
    description:
      "Common errors include unsupported file formats or exceeding file size limits. Implement retry logic with exponential backoff for transient failures, and validate files before upload.",
  },
  {
    title: "What's the maximum concurrent upload limit?",
    description:
      "Free tier users can upload 5 files concurrently. Premium users can upload up to 20 files concurrently. Use our batch processing API for larger volumes.",
  },
];

// Example code for Python
const exampleCodePython = `import alleai
import time

client = alleai.Client(api_key="[YOUR API KEY HERE]")

# Example 1: Basic file upload and processing
with open("example.jpg", "rb") as file:
    response = client.process_file(
        file=file,
        task="image_captioning",
        models=["clip", "blip"],
        output_format="json"
    )

# Example 2: Chunked upload for large files
def upload_large_file(file_path, chunk_size=1024*1024):
    with open(file_path, 'rb') as f:
        upload_id = client.start_upload(file_path)
        
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            
            client.upload_chunk(upload_id, chunk)
        
        return client.complete_upload(upload_id)

# Example 3: Batch processing with progress tracking
def process_batch(files, max_concurrent=5):
    results = []
    for file in files:
        try:
            result = client.process_file(
                file=file,
                task="auto_detect",
                callback=lambda p: print(f"Progress: {p}%")
            )
            results.append(result)
        except Exception as e:
            results.append({"error": str(e), "file": file})
    return results`;

// Example code for JavaScript
const exampleCodeJS = `const alleai = require('alleai');
const fs = require('fs');

const client = new alleai.Client({ apiKey: '[YOUR API KEY HERE]' });

// Example 1: Basic file upload and processing
async function processFile() {
  try {
    const file = fs.readFileSync('example.jpg');
    const response = await client.processFile({
      file,
      task: 'image_captioning',
      models: ['clip', 'blip'],
      outputFormat: 'json'
    });
    return response;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 2: Chunked upload for large files
async function uploadLargeFile(filePath, chunkSize = 1024 * 1024) {
  const fileStream = fs.createReadStream(filePath, { highWaterMark: chunkSize });
  const uploadId = await client.startUpload(filePath);

  for await (const chunk of fileStream) {
    await client.uploadChunk(uploadId, chunk);
  }

  return client.completeUpload(uploadId);
}

// Example 3: Batch processing with progress tracking
async function processBatch(files, maxConcurrent = 5) {
  const results = [];
  const queue = [...files];

  while (queue.length) {
    const batch = queue.splice(0, maxConcurrent);
    const batchResults = await Promise.all(
      batch.map(file => 
        client.processFile({
          file,
          task: 'auto_detect',
          onProgress: progress => console.log(\`Progress: \${progress}%\`)
        }).catch(error => ({ error: error.message, file }))
      )
    );
    results.push(...batchResults);
  }

  return results;
}`;

export default function WorkingWithFilesDocs() {
  const [activeTab, setActiveTab] = useState("python");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    // Import Prism dynamically to avoid SSR issues
    import("prismjs").then((Prism) => {
      import("prismjs/components/prism-python");
      import("prismjs/components/prism-javascript");
      Prism.highlightAll();
    });
  }, [activeTab]);

  return (
    <div className="pb-16 w-full max-w-[100%] pr-4">
      <div className="space-y-8">
        {/* Title Section */}
        <div>
          {/* <h1 className="text-3xl font-bold mb-4">Working with Files</h1> */}
          <div className="prose prose-blue max-w-none">
            <p className="text-muted-foreground text-lg">
              Our API provides comprehensive file handling capabilities with
              support for uploads, processing, and batch operations. Learn how
              to integrate file processing into your applications efficiently
              and reliably.
            </p>
          </div>
        </div>

        {/* Prerequisites Section */}
        <div className="bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-gray-500 dark:text-gray-300 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Prerequisites
              </h3>
              <p className="text-gray-800 dark:text-gray-200">
                Before you begin, ensure you have:
              </p>
              <ul className="list-none mt-2 space-y-1">
                {[
                  "An API key with appropriate permissions",
                  "Basic understanding of REST APIs",
                  "Familiarity with async/await patterns",
                  "File handling knowledge in your preferred language",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center text-gray-800 dark:text-gray-200"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Advanced File Operations
          </h2>
          <p className="text-muted-foreground mb-4">
            Learn how to handle various file operations including chunked
            uploads, batch processing, and progress tracking:
          </p>
          <Tabs defaultValue="python" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="python">
              <div className="relative">
                <pre className="language-python bg-gray-900 text-white p-4 rounded-md">
                  <code>{exampleCodePython}</code>
                </pre>
                <Button
                  className="absolute top-2 right-2"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(exampleCodePython);
                  }}
                >
                  <Copy size={16} />
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="javascript">
              <div className="relative">
                <pre className="language-javascript bg-gray-900 text-white p-4 rounded-md">
                  <code>{exampleCodeJS}</code>
                </pre>
                <Button
                  className="absolute top-2 right-2"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(exampleCodeJS);
                  }}
                >
                  <Copy size={16} />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* FAQs Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b pb-3">
                <div
                  className="cursor-pointer flex items-center justify-between text-lg font-medium"
                  onClick={() => setExpanded(expanded === index ? null : index)}
                >
                  <span>{faq.title}</span>
                  <span>
                    {expanded === index ? (
                      <ChevronUp className="text-muted-foreground" />
                    ) : (
                      <ChevronDown className="text-muted-foreground" />
                    )}
                  </span>
                </div>
                {expanded === index && (
                  <div className="mt-2 text-muted-foreground">
                    {faq.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* What to Read Next Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">What to Read Next</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {suggestions.map((suggestion, index) => (
              <Link key={index} href={suggestion.href}>
                <div className="block p-4 bg-black text-white rounded-lg shadow-md dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-zinc-300 transition duration-200">
                  <div className="flex items-center justify-between">
                    <span>{suggestion.title}</span>
                    <ChevronRight className="text-current" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
