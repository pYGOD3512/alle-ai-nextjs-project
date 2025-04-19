"use client";
import React from "react";
import RenderCode from "@/components/RenderCode";

const fileUploadPython = `from alleai.core import AlleAIClient
from dotenv import load_dotenv
import os
import base64

# Load environment variables from .env file
load_dotenv()

# Get API key from .env
api_key = os.getenv("ALLEAI_API_KEY")

# Initialize client with API key
client = AlleAIClient(api_key=api_key)

def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# Example: Edit an image using base64
image_path = "path/to/your/image.jpg"
base64_image = encode_image_to_base64(image_path)

# Make image edit request with base64 image
response = client.image.edit({
    "type": "base64",
    "file_data": base64_image,  # Pass the base64 string directly
    "models": ["Stable-Diffusion", "DALL-E"],
    "prompt": "Add a bright blue sky and fluffy clouds",
    "quality": "hd"
})

print(response)`;

const fileUploadJS = `const client = require("alleai-sdk");
const fs = require('fs').promises;
require("dotenv").config();

async function editImageWithBase64() {
    // Get API key from .env
    const apiKey = process.env.ALLEAI_API_KEY;

    // Initialize client with API key
    const alleai = new client.AlleAI({ apiKey });

    // Function to encode file to base64
    async function encodeFileToBase64(filePath) {
        const fileBuffer = await fs.readFile(filePath);
        return fileBuffer.toString('base64');
    }

    try {
        // Convert image to base64
        const imagePath = "path/to/your/image.jpg";
        const base64Image = await encodeFileToBase64(imagePath);

        // Make image edit request with base64 image
        const response = await alleai.image.edit({
            type: "base64",
            file_data: base64Image,  // Pass the base64 string directly
            models: ["Stable-Diffusion", "DALL-E"],
            prompt: "Add a bright blue sky and fluffy clouds",
            quality: "hd"
        });

        console.log(response);
    } catch (error) {
        console.error("Error:", error);
    }
}

editImageWithBase64();`;

export default function UploadFiles() {
  return (
    <section className="flex gap-2 px-5 max-w-4xl ">
      <div className="documentation-container ">
        <h1 className="text-3xl font-bold mb-6">File Uploads</h1>

        <section className="mb-8">
          <p className="text-muted-foreground mb-4">
            When working with our API endpoints that require file inputs, you
            have two options for providing files:
          </p>
          <ul className="list-disc list-inside mb-4 text-muted-foreground">
            <li className="mb-2">URL link to the file hosted online</li>
            <li className="mb-2">Base64 encoded string of the file content</li>
          </ul>
          <p className="text-muted-foreground mb-6">
            Below are examples demonstrating how to handle file uploads using
            base64 encoding in both Python and Node.js. The examples show how to
            read a local file, convert it to base64, and send it to our API.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Python Example</h2>
          <p className="text-muted-foreground mb-4">
            This example shows how to read an image file, convert it to base64,
            and use it with our image editing endpoint:
          </p>
          <div className="mb-6">
            <RenderCode
              code={fileUploadPython}
              language="python"
              showLanguage={true}
            />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Node.js Example</h2>
          <p className="text-muted-foreground mb-4">
            Here's how to achieve the same functionality using Node.js:
          </p>
          <div className="mb-6">
            <RenderCode
              code={fileUploadJS}
              language="javascript"
              showLanguage={true}
            />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Important Notes</h2>
          <div className="bg-background border border-borderColorPrimary rounded-lg p-4">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Maximum file size limit: 10MB for base64 encoded files</li>
              <li>
                Supported file formats depend on the specific endpoint being
                used
              </li>
              <li>When using URLs, make sure they are publicly accessible</li>
              <li>
                Base64 strings should not include the data URI prefix (e.g.,
                "data:image/jpeg;base64,")
              </li>
            </ul>
          </div>
        </section>
      </div>
    </section>
  );
}
