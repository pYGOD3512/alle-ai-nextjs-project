import React from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Prism.js theme
import "prismjs/components/prism-json";
import "prismjs/components/prism-javascript";

const PromptEngineeringGuide = () => {
  // Highlight code on component mount
  React.useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className=" ">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          
        </h1>

        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Introduction to Prompt Engineering
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Prompt engineering is the process of designing and refining inputs
            (prompts) to guide AI models toward generating desired outputs. With
            the rise of multi-model AI platforms like ours, understanding how to
            craft prompts that work across different models is essential.
          </p>
        </section>

        {/* Key Principles */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Key Principles of Prompt Design
          </h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
            <li>
              <strong>Clarity and Specificity</strong>: Clearly define what you
              want the AI to do.
            </li>
            <li>
              <strong>Contextual Framing</strong>: Provide context to help the
              AI understand the task.
            </li>
            <li>
              <strong>Instructional Directives</strong>: Use explicit
              instructions to guide the AI.
            </li>
            <li>
              <strong>Iterative Refinement</strong>: Experiment and refine
              prompts for better results.
            </li>
          </ul>
        </section>

        {/* Structured Example: System, Input, Models, Prompt */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Example: Structured Prompt
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Below is an example of a structured prompt using the{" "}
            <code>{`{ system, input, models, prompt }`}</code> format:
          </p>
          <pre className="bg-gray-900 p-4 rounded-lg">
            <code className="language-json">
              {JSON.stringify(
                {
                  system:
                    "You are an AI assistant that provides detailed and accurate explanations.",
                  input: "Explain the concept of prompt engineering.",
                  models: ["DeepSeek", "Claude", "ChatGPT", "Gemini"],
                  prompt:
                    "Provide a clear and concise explanation of prompt engineering, including its importance and best practices.",
                },
                null,
                2
              )}
            </code>
          </pre>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>Expected Response:</strong>
          </p>
          <pre className="bg-gray-900 p-4 rounded-lg">
            <code className="language-json">
              {JSON.stringify(
                {
                  response:
                    "Prompt engineering is the process of crafting inputs (prompts) to guide AI models toward generating desired outputs. It involves clarity, context, and iterative refinement to achieve optimal results. Best practices include being specific, providing examples, and tailoring prompts to the strengths of different models.",
                },
                null,
                2
              )}
            </code>
          </pre>
        </section>

        {/* API Response Example */}
        <section>
          <h2 className="text-2xl font-bold  ">
            Example: API Response
          </h2>
          <p className="text-muted-foreground">
            Below is an example of a well-structured API response from a model:
          </p>
          <pre className=" p-4 rounded-lg">
            <code className="language-json">
              {JSON.stringify(
                {
                  model: "DeepSeek",
                  prompt:
                    "Explain the difference between supervised and unsupervised learning.",
                  response: {
                    supervised_learning:
                      "Supervised learning involves training a model on labeled data, where the input and output pairs are known. The model learns to map inputs to outputs based on examples.",
                    unsupervised_learning:
                      "Unsupervised learning involves training a model on unlabeled data. The model identifies patterns and structures in the data without explicit guidance.",
                  },
                  usage: {
                    tokens: 150,
                    timestamp: "2023-10-15T12:34:56Z",
                  },
                },
                null,
                2
              )}
            </code>
          </pre>
        </section>

        {/* Advanced Techniques */}
        <section>
          <h2 className="text-2xl font-bold ">
            Advanced Techniques for Prompt Optimization
          </h2>
          <ul className="list-disc list-inside text-muted-foreground">
            <li>
              <strong>Role Assignment</strong>: Assign a role to the AI to guide
              its tone and perspective.
            </li>
            <li>
              <strong>Step-by-Step Reasoning</strong>: Break down complex tasks
              into smaller steps.
            </li>
            <li>
              <strong>Few-Shot Learning</strong>: Provide examples to guide the
              {`AI's response.`}
            </li>
          </ul>
        </section>

        {/* Common Pitfalls */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Common Pitfalls and How to Avoid Them
          </h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
            <li>
              <strong>Ambiguity</strong>: Be specific and provide context.
            </li>
            <li>
              <strong>Overloading the Prompt</strong>: Break tasks into smaller,
              manageable prompts.
            </li>
            <li>
              <strong>Ignoring Model Biases</strong>: Use multiple models to
              cross-verify responses.
            </li>
          </ul>
        </section>

        {/* Conclusion */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Will be adding more context here 
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            later
          </p>
        </section>
      </div>
    </div>
  );
};

export default PromptEngineeringGuide;
