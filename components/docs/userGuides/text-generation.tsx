"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import CollapsibleItems from "../CollapsibleItem";
import ArticleFeedback from "../articleFeedback";
import DocsFooter from "../simpleFooterDocs";
const faqData = [
  {
    id: "1",
    question: "AI response delay",
    answer:
      "If you're experiencing delays in AI responses, please check your internet connection for stability. A slow or interrupted network can affect response times. Try refreshing the page or reconnecting to the internet before attempting again.",
  },
  {
    id: "2",
    question: "File upload failure",
    answer:
      "Make sure the file you're trying to upload is in a supported format (e.g., PDF, PNG, JPG). Also, check that the file size doesn’t exceed the maximum limit. If the issue persists, try renaming the file and re-uploading.",
  },
  {
    id: "3",
    question: "Voice input not working",
    answer:
      "Voice input may not work if microphone permissions are not granted. Check your browser settings to ensure microphone access is enabled. Also, verify that your microphone is connected and functioning properly.",
  },
  {
    id: "4",
    question: "Error message while processing",
    answer:
      "If an error message appears during processing, it might be due to temporary data issues or a system glitch. Try clearing your browser's cache and cookies, then refresh the page and attempt the action again.",
  },
  {
    id: "5",
    question: "Slow application performance",
    answer:
      "Performance may slow down if your device is running too many applications at once. Try closing unused programs or browser tabs. Restarting the app or your device can also help improve responsiveness.",
  },
];

const handleContactSupport = () => {
  const email = "support@alle.com";
  const subject = "Support Request"; // Optional: You can customize the subject
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  window.location.href = mailtoLink;
};

const TextGenerationPlatform = () => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        {/* intro */}
        <section>
          <p className="text-muted-foreground">
            <span className="font-bold">Alle-AI</span> brings together the
            world’s leading generative language models including ChatGPT,
            Claude, Grok, and many more into one powerful, unified chat
            experience. Whether you're exploring ideas, building products, or
            solving complex problems, Alle-AI gives you the tools to do it
            faster, with the power of all the AI models on your side.
          </p>
        </section>
      </div>
      <h1 className="text-2xl mb-4 font-semibold">A Quick Tour</h1>

      <p className="text-muted-foreground mb-3">
        {/* {`Experience the next level of text generation! This video tutorial
        introduces you to the Text Generation interface, highlighting its unique
        multi-model capabilities. We'll walk you through the process of
        selecting and interacting with ChatGPT, Claude, Gemini, and other
        leading AI models, demonstrating how to generate text and explore the
        distinct strengths of each model.`} */}
      </p>
      {/* Video Walkthrough Placeholder */}
      <aside id="walkthrough" className="mb-8 flex justify-center max-w-2xl">
        <div className="w-full max-w-4xl">
          <iframe
            src="https://www.youtube.com/embed/8g7kHVMFxlE"
            width="560"
            height="315"
            className="rounded"
            allowFullScreen
          ></iframe>
        </div>
      </aside>

      {/* Using the Text Generation Page */}
      <section className="mb-8">
        <h2 id="text-generation" className="text-2xl font-bold mb-2">
          Using the Text Generation Page
        </h2>
        <p className="text-muted-foreground mb-4">
          This section provides a step-by-step guide on how to generate text
          using our platform.
        </p>

        {/* Inputting a Query */}
        <div className="mb-6">
          <h3 className="text-1xl font-bold  mb-2 ">
            1. Selecting Your AI Models:
          </h3>
          <div className="text-muted-foreground mb-2">
            <p>
              Before you can generate text, you need to choose the AI model(s)
              you want to use. Our platform supports a variety of powerful
              models, including ChatGPT, Claude, Gemini, and more. You can
              select one or more models to interact with 😊.
            </p>
          </div>
          <div className="p-3">
            <ul className="list-disc ml-6 space-y-4">
              <li>
                <strong
                  className="text-muted-foreground font-bold "
                  id="select_models"
                >
                  How to Select Models:&nbsp;
                </strong>
                <p className="mt-1 text-muted-foreground">
                  {`To select a model, simply click on the checkbox next to its
                  name in the 'AI Models' panel as illustrated in the short
                  video above. You can select multiple models to generate text
                  using all of them simultaneously. For now we support choosing more than one and a max of five`}
                </p>
              </li>

              <li>
                <strong className="text-muted-foreground font-bold ">
                  Choosing the Right Model(s): &nbsp;
                </strong>
                <p className="mt-1 text-muted-foreground">
                  Each AI model has its own strengths and characteristics.
                  ChatGPT is known for its conversational abilities, while
                  Claude excels at creative writing. Gemini is particularly
                  adept at code generation. Experiment with different models to
                  find the ones that best suit your project. For a deeper dive
                  into each available model, including their strengths,
                  weaknesses, and more,&nbsp;
                  <span className="underline text-gray-600 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-400 font-bold">
                    <Link target="_blank" href={"/modal-gloassary"}>
                      check out this dedicated documentation page.
                    </Link>
                  </span>
                </p>
              </li>

              <li>
                <strong className="text-muted-foreground font-bold">
                  Selecting Multiple Models:&nbsp;
                </strong>
                <p className="mt-1 text-muted-foreground">
                  Selecting multiple models will generate text from each model,
                  allowing you to compare the results and choose the best
                  option. The output from each model will be clearly labeled.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Selecting AI Models */}
        <div className="mb-6">
          <h3 id="providing-inputs" className="text-xl font-semibold mb-2">
            2. Providing inputs
          </h3>
          <p className="text-muted-foreground">
            {`Once you've selected your AI models, you have several options for
            providing input to guide the text generation:`}
          </p>
          <div className="p-3">
            <ul className="list-disc space-y-6 ml-6">
              <li>
                <strong className="text-muted-foreground font-bold">
                  Text Prompt: &nbsp;
                </strong>
                <p className="mt-1 text-muted-foreground">
                  This is the most common way to provide input. Simply type your
                  instructions or ideas into the text prompt field. Be as
                  specific as possible to get the best results.
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-2">
                  <li>
                    <strong className="text-muted-foreground font-bold">
                      Good Prompt:&nbsp;
                    </strong>
                    <p className="mt-1 text-muted-foreground">
                      "Write a short story about a cat who travels to space."
                    </p>
                  </li>
                  <li>
                    <strong className="text-muted-foreground font-bold">
                      Less Effective Prompt:&nbsp;
                    </strong>
                    <p className="mt-1 text-muted-foreground">
                      "Write something interesting."
                    </p>
                  </li>
                </ul>
              </li>

              <li>
                <strong className="text-muted-foreground font-bold">
                  Voice Input:&nbsp;
                </strong>
                <p className="mt-1 text-muted-foreground">
                  For hands-free input, you can use our voice input feature.
                  Click the microphone icon and start speaking. The platform
                  will automatically transcribe your speech into text.
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-2">
                  <li>
                    <strong className="text-muted-foreground font-bold">
                      Enabling Voice Input:&nbsp;
                    </strong>
                    <p className="mt-1 text-muted-foreground">
                      Explain how to enable microphone access in the browser.
                    </p>
                  </li>
                  <li>
                    <strong className="text-muted-foreground font-bold">
                      Supported Languages:&nbsp;
                    </strong>
                    <p className="mt-1 text-muted-foreground">
                      List the supported languages, if any.
                    </p>
                  </li>
                  <li>
                    <strong className="text-muted-foreground font-bold">
                      Editing Transcribed Text:&nbsp;
                    </strong>
                    <p className="mt-1 text-muted-foreground">
                      Explain how to edit the transcribed text if there are
                      errors.
                    </p>
                  </li>
                </ul>
              </li>

              <li>
                <strong className="text-muted-foreground font-bold">
                  Attaching Files:&nbsp;
                </strong>
                <p className="mt-1 text-muted-foreground">
                  You can provide additional context by attaching files. This
                  can be useful for summarizing documents, analyzing data, or
                  generating text based on existing content.
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-2">
                  <li>
                    <strong className="text-muted-foreground font-bold">
                      Supported File Types:&nbsp;
                    </strong>
                    <p className="mt-1 text-muted-foreground">
                      List the supported file types, e.g., .txt, .pdf, .docx.
                    </p>
                  </li>
                  <li>
                    <strong className="text-muted-foreground font-bold">
                      How to Attach Files:&nbsp;
                    </strong>
                    <div className="mt-2 mb-3">
                      <Image
                        className="mb-2"
                        height={120}
                        width={800}
                        src={
                          resolvedTheme === "dark"
                            ? "/screenshots/input-dark.png"
                            : "/screenshots/input-light.png"
                        }
                        alt=""
                      ></Image>
                      <span className="text-muted-foreground">
                        Click the file icon to open a window, select a file, and
                        it will be uploaded automatically
                      </span>
                    </div>
                  </li>
                  <li>
                    <strong className="text-muted-foreground font-bold">
                      File Size Limits:&nbsp;
                    </strong>
                    <p className="mt-1 text-muted-foreground">
                      We support uploading files up to 20mb in size. Files
                      larger than this limit cannot be processed
                    </p>
                  </li>
                </ul>
              </li>

              <li>
                <strong className="text-muted-foreground font-bold">
                  Enabling Web Search:&nbsp;
                </strong>
                <Image
                  className="mb-2"
                  height={120}
                  width={800}
                  src={
                    resolvedTheme === "dark"
                      ? "/screenshots/web-dark.png"
                      : "/screenshots/web-light.png"
                  }
                  alt=""
                ></Image>
                <p className="mt-1 text-muted-foreground">
                  To incorporate current events or factual information into your
                  generated text, you can enable the web search feature.
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-2">
                  <li>
                    <strong className="text-muted-foreground font-bold">
                      How Web Search Works:&nbsp;
                    </strong>
                    <p className="mt-1 text-muted-foreground">
                      When web search is enabled, the model queries the internet
                      in real time by accessing search engines, retrieves
                      relevant and up-to-date information, and then processes
                      the results to generate a helpful and accurate response.
                    </p>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        {/* Generating Responses */}
        <div className="mb-6">
          <h3 className="text-xl  font-semibold mb-2">
            3. Generating Responses
          </h3>
          <p className="text-muted-foreground">
            {`Once you've provided your input, click the "Generate" button. The
            platform will then process your request and generate the text based
            on your chosen models and input. The time it takes to generate the
            text will vary depending on the complexity of your request and the
            selected models.`}
          </p>
        </div>

        {/* Summarization Feature */}
        <div className="mb-6">
          <h3 className="text-xl  font-semibold mb-2">
            4. Chat features (summarization,combination)
          </h3>
          {/* Video Walkthrough Placeholder */}
          <aside className="mb-5 flex justify-center max-w-2xl">
            <div className="w-full max-w-4xl">
              <iframe
                src="https://www.youtube.com/embed/8g7kHVMFxlE"
                width="560"
                height="315"
                className="rounded"
                allowFullScreen
              ></iframe>
            </div>
          </aside>
        </div>
        <div className="p-3">
          <p className="mb-4 text-muted-foreground">
            Once the text generation process is complete, you'll be presented
            with the generated output. This section explains how to review,
            edit, and refine the generated text.
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-bold ">
                1. Viewing the Generated Output:
              </h2>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>
                  <strong className="text-muted-foreground font-bold">
                    Single Model Output:&nbsp;
                  </strong>
                  <p className="mt-1 text-muted-foreground">
                    You can select a single model to view its response at
                    response area
                  </p>
                </li>
                <li>
                  <strong className="text-muted-foreground font-bold">
                    Multiple Model Output:&nbsp;
                  </strong>
                  <p className="mt-1 text-muted-foreground">
                    The output from each model will be displayed separately,
                    often with clear labels indicating which model generated
                    which text. This allows you to easily compare the different
                    outputs and choose the one you prefer. You can switch to
                    view model output but clicking on the model as illustrated
                    in the video above
                  </p>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg   font-bold">
                2. Editing the Generated Text:&nbsp;
              </h2>
              <p className="mt-2 text-muted-foreground">
                The generated text is fully editable. You can make any changes
                you like, just as you would with any other text document.
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>
                  <strong className="mb-3 text-muted-foreground font-bold">
                    Comparing Model Outputs :&nbsp;
                  </strong>
                  <Image
                    className="mb-2"
                    height={120}
                    width={800}
                    src={
                      resolvedTheme === "dark"
                        ? "/screenshots/summary-dark.png"
                        : "/screenshots/summary-light.png"
                    }
                    alt=""
                  ></Image>
                </li>
                <p className="text-muted-foreground">
                  We provide a model that offers summarization, combination, and
                  more. To get a summary, simply click on the 'Summary' button
                  as shown in the image above. You can also use the toggle to
                  select between summarization, combination, and other features.
                </p>
              </ul>
            </section>

            <section>
              <h2 className="text-lg   font-bold">
                3. Refining the Generated Text:&nbsp;
              </h2>
              <p className="mt-2 text-muted-foreground">
                Sometimes, the generated text might require some refinement to
                perfectly match your requirements. Here are some tips:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>
                  <strong className="text-muted-foreground font-bold">
                    Prompt Refinement:&nbsp;
                  </strong>
                  <p className="mt-1 text-muted-foreground">
                    If the generated text isn't quite what you were looking for,
                    try refining your original prompt. Be more specific or try a
                    different phrasing. You can also experiment with different
                    AI models.
                  </p>
                </li>
                <li>
                  <strong className="text-muted-foreground font-bold">
                    Manual Editing:&nbsp;
                  </strong>
                  <p className="mt-1 text-muted-foreground">
                    Don't hesitate to manually edit the generated text. This is
                    often the quickest way to make small adjustments.
                  </p>
                </li>
                <li>
                  <strong className="text-muted-foreground font-bold">
                    Regenerating Text:&nbsp;
                  </strong>
                  <p className="mt-1 text-muted-foreground">
                    In some cases, you might want to completely regenerate the
                    text. This will create a new output based on your original
                    prompt and selected models.
                  </p>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </section>

      {/* Troubleshooting & Support */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Common Issues & Fixes</h2>

        {/* Common Issues & Solutions */}
        <div className="mb-6">
          <ul className="space-y-3">
            <CollapsibleItems items={faqData} />
          </ul>
        </div>
      </section>

      {/* Contact Support */}
      <div>
        <h3 className="text-xl font-semibold mb-2"> Contact Support</h3>
        <p className="text-muted-foreground">
          For further assistance, visit our &nbsp;
          <span className="italic text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold">
            <Link target="_blank" href={"/collection"}>
              Help Center
            </Link>
          </span>{" "}
          or contact customer support at{" "}
          <span>
            <button
              onClick={handleContactSupport}
              className="  italic text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold"
            >
              support@alle-ai.com
            </button>
          </span>
        </p>
      </div>
      {/* article feedback  */}
      <div className="mb-5">
        <ArticleFeedback />
      </div>
      <div>
        <DocsFooter />
      </div>
    </div>
  );
};

export default TextGenerationPlatform;
