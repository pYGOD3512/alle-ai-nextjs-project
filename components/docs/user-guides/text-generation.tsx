import React from "react";

const TextGenerationPlatform = () => {
  return (
    <div className="min-h-screen ">
      <h1></h1>
      {/* Video Walkthrough Placeholder */}
      <aside className="mb-8">
        <iframe
          src="https://scribehow.com/embed/Accessing_GPT-4o_Chat_and_Saving_Summary__NQZpM_PXQ6mfOV17aHIq2A?as=video"
          width="70%"
          height="400"
        ></iframe>
      </aside>

      {/* Platform Introduction */}
      <section className="mb-8">
        <p className="text-muted-foreground">
          Our system integrates multiple AI models, including Claude AI,
          ChatGPT, DeepSeek, and others, to provide users with diverse responses
          from different AI perspectives. Users can also summarize AI-generated
          content, attach files, and link external storage drives such as Google
          Drive and Dropbox. Additionally, voice input is supported for a more
          seamless experience.
        </p>
      </section>

      {/* Using the Text Generation Page */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">
          Using the Text Generation Page
        </h2>

        {/* Inputting a Query */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">1. Inputting a Query</h3>
          <ul className="list-disc list-inside text-muted-foreground">
            <li>Enter text into the input box.</li>
            <li>Use voice input if preferred.</li>
            <li>Attach files for AI analysis.</li>
          </ul>
        </div>

        {/* Selecting AI Models */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">2. Selecting AI Models</h3>
          <ul className="list-disc list-inside text-muted-foreground">
            <li>Choose two or multiple AI models to generate responses.</li>
            <li>Compare outputs from different models side by side.</li>
          </ul>
        </div>

        {/* Generating Responses */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">
            3. Generating Responses
          </h3>
          <ul className="list-disc list-inside text-muted-foreground">
            <li>Click the ‘Generate’ button.</li>
            <li>View AI-generated text in real-time.</li>
            <li>Summarize responses from multiple models if needed.</li>
          </ul>
        </div>

        {/* Summarization Feature */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">
            4. Summarization Feature
          </h3>
          <ul className="list-disc list-inside text-muted-foreground">
            <li>
              Click the ‘Summarize’ button to condense multiple AI responses.
            </li>
            <li>Customize summary length and key focus areas.</li>
          </ul>
        </div>

        {/* File Attachments & External Drive Integration */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">
            5. File Attachments & External Drive Integration
          </h3>
          <ul className="list-disc list-inside text-muted-foreground">
            <li>Upload documents, PDFs, or other files for AI analysis.</li>
            <li>
              Connect Google Drive or Dropbox for additional storage access.
            </li>
          </ul>
        </div>

        {/* Export & Share */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">6. Export & Share</h3>
          <ul className="list-disc list-inside text-muted-foreground">
            <li>Copy, download, or share AI-generated text.</li>
            <li>Save responses to your linked external drive.</li>
          </ul>
        </div>
      </section>

      {/* Troubleshooting & Support */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Troubleshooting & Support</h2>

        {/* Common Issues & Solutions */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">
            1. Common Issues & Solutions
          </h3>
          <ul className="list-disc list-inside text-muted-foreground">
            <li>
              <strong>Issue:</strong> AI response delay.
              <br />
              <strong>Solution:</strong> Check internet connection and retry.
            </li>
            <li>
              <strong>Issue:</strong> File upload failure.
              <br />
              <strong>Solution:</strong> Ensure file format is supported and
              re-upload.
            </li>
            <li>
              <strong>Issue:</strong> Voice input not working.
              <br />
              <strong>Solution:</strong> Check microphone permissions and retry.
            </li>
          </ul>
        </div>

        {/* Contact Support */}
        <div>
          <h3 className="text-xl font-semibold mb-2">2. Contact Support</h3>
          <p className="text-muted-foreground">
            For further assistance, visit our Help Center or contact customer
            support at [Support Email/Phone].
          </p>
        </div>
      </section>
    </div>
  );
};

export default TextGenerationPlatform;
