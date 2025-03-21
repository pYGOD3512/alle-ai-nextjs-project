// landing page introductions snipppets

export const introCodes = {
  curl: `curl -X POST "[ENDPOINT_URL_HERE]" \
  -H "Authorization: Bearer [YOUR_API_KEY_HERE]" \
  -H "Content-Type: application/json" \
  -d '{
    "models": ["gpt-4o", "claude-3.5-sonnet"],
    "messages": [{"user": [{"type": "text", "text": "Hello!"}]}],
    "response_format": {"type": "text"}
  }'`,
  loadenvPython: `from alleai.core import AlleAIClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get API key from .env
api_key = os.getenv("ALLEAI_API_KEY")
`,
  loadEnvCurl: `# Load API key from .env file (requires dotenv-cli or manual export)
source <(cat .env | sed 's/^/export /')

# Use the API key in cURL
curl -H "Authorization: Bearer $ALLEAI_API_KEY" ...`,
  python: `from alleai.core import AlleAIClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get API key from .env
api_key = os.getenv("ALLEAI_API_KEY")

# Initialize client with API key
client = AlleAIClient(api_key=api_key)

# Make chat completion request
response = client.chat.completions({
    "models": ["gpt-4o", "claude-3.5-sonnet"],
    "messages": [{"user": [{"type": "text", "text": "Hello!"}]}],
    "response_format": {"type": "text"}
})

# Print the response
print(response.text)`,
  javascript: `const client = require("alleai-sdk");
require("dotenv").config();

async function chat() {
    // Get API key from .env
    const apiKey = process.env.ALLEAI_API_KEY;

    // Initialize client with API key
    const alleai = new client.AlleAI({ apiKey });

    // Make chat completion request
    const response = await alleai.chat.completions({
        models: ["gpt-4o", "claude-3.5-sonnet"],
        messages: [{ user: [{ type: "text", text: "Hello!" }] }],
        response_format: { type: "text" }
    });

    // Log the response
    console.log(response.text);
}

chat();`,
  streamPython: `# Example 1: Stream Individual Model Responses (combination: false)
print("Streaming Individual Model Responses:")
response = client.chat.completions({
    "models": ["gpt-4o", "claude-3.5-sonnet"],
    "messages": [{"user": [{"type": "text", "text": "Tell me a story!"}]}],
    "response_format": {"type": "text"},
    "stream": True,  # Enable streaming
    "combination": False  # No combined output
})
for chunk in response:
    if hasattr(chunk, "model") and hasattr(chunk, "text") and chunk.text:
        print(f"[{chunk.model}]: {chunk.text}", end="", flush=True)
print("\n")  # Newline after stream

# Example 2: Stream Combined Response (combination: true)
# Also includes individual responses, but we stream the combined output
print("Streaming Combined Response:")
response = client.chat.completions({
    "models": ["gpt-4o", "claude-3.5-sonnet"],
    "messages": [{"user": [{"type": "text", "text": "Tell me a story!"}]}],
    "response_format": {"type": "text"},
    "stream": True,  # Enable streaming
    "combination": True  # Include combined output
})
for chunk in response:
    # Assuming 'combined' is a special model value for the merged output
    if hasattr(chunk, "model") and chunk.model == "combined" and hasattr(chunk, "text") and chunk.text:
        print(chunk.text, end="", flush=True)
    # Uncomment to see individual responses too:
    # elif hasattr(chunk, "model") and hasattr(chunk, "text") and chunk.text:
    #     print(f"[{chunk.model}]: {chunk.text}", end="", flush=True)
print("\n")  # Newline after stream`,
  streamJavascript: `
    // Example 1: Stream Individual Model Responses (combination: false)
    console.log("Streaming Individual Model Responses:");
    const response1 = await alleai.chat.completions({
        models: ["gpt-4o", "claude-3.5-sonnet"],
        messages: [{ user: [{ type: "text", text: "Tell me a story!" }] }],
        response_format: { type: "text" },
        stream: true,  // Enable streaming
        combination: false  // No combined output
    });

    for await (const chunk of response1) {
        if (chunk.model && chunk.text) {
            process.stdout.write(\`[\${chunk.model}]: \${chunk.text}\`);
        }
    }
    console.log("");  // Newline after stream

    // Example 2: Stream Combined Response (combination: true)
    console.log("Streaming Combined Response:");
    const response2 = await alleai.chat.completions({
        models: ["gpt-4o", "claude-3.5-sonnet"],
        messages: [{ user: [{ type: "text", text: "Tell me a story!" }] }],
        response_format: { type: "text" },
        stream: true,  // Enable streaming
        combination: true  // Include combined output
    });

    for await (const chunk of response2) {
        if (chunk.model === "combined" && chunk.text) {
            process.stdout.write(chunk.text);
        }
        // Uncomment to see individual responses too:
        // else if (chunk.model && chunk.text) {
        //     process.stdout.write(\`[\${chunk.model}]: \${chunk.text}\`);
        // }
    }
    console.log("");  // Newline after stream
`,
  handleStreamError: `import time

# Example: Streaming with Error Handling
# Handles errors during streaming, including retries for transient issues
print("Streaming with Error Handling:")
max_retries = 3  # Max retry attempts for transient errors
for attempt in range(max_retries):
    try:
        # Make streaming chat completion request with combination
        response = client.chat.completions({
            "models": ["gpt-4o", "claude-3.5-sonnet"],
            "messages": [{"user": [{"type": "text", "text": "Tell me a story!"}]}],
            "response_format": {"type": "text"},
            "stream": True,  # Enable streaming
            "combination": True  # Include combined output
        })

        # Process the stream, handling chunk-level issues
        print("Combined Stream:")
        for chunk in response:
            # Check if chunk is valid before processing
            if not (hasattr(chunk, "model") and hasattr(chunk, "text") and chunk.text):
                print(f"[Warning] Invalid chunk received on attempt {attempt + 1}", flush=True)
                continue  # Skip invalid chunks
            
            # Stream combined output (assuming 'combined' model value)
            if chunk.model == "combined":
                print(chunk.text, end="", flush=True)
            # Optional: Log individual model responses (uncomment if needed)
            # else:
            #     print(f"[{chunk.model}]: {chunk.text}", end="", flush=True)
        
        print("\n")  # Newline after successful stream
        break  # Exit retry loop on success

    except client.APIConnectionError as e:
        # Handle connection failures (e.g., network issues)
        print(f"[Error] Connection failed on attempt {attempt + 1}: {e}", flush=True)
        if attempt < max_retries - 1:
            time.sleep(2)  # Wait 2 seconds before retry
            continue
        else:
            print("[Fatal] Max retries reached for connection error.", flush=True)
            raise  # Give up after max retries

    except client.RateLimitError as e:
        # Handle rate limit exceeded (HTTP 429)
        print(f"[Error] Rate limit hit on attempt {attempt + 1}: {e}", flush=True)
        if attempt < max_retries - 1:
            time.sleep(2 ** attempt)  # Exponential backoff: 2s, 4s, 8s
            continue
        else:
            print("`,
};
export const installSdks = {
    python:`pip install alleai-sdk`,
    javascript:`npm install alleai-sdk`,
}



// chat completions,summary and others snippets 