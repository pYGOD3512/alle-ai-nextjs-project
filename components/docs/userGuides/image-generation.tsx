"use client";
import React, { useRef } from "react";
import ImageGenerationShowcase from "@/components/ImageGenerationShowcase";
import Link from "next/link";
import { useTheme } from "next-themes";
import CollapsibleItems from "../CollapsibleItem";
import ArticleFeedback from "../articleFeedback";
import DocsFooter from "../simpleFooterDocs";
export default function ImageGeneration() {
  const showcaseRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // FAQ data with an additional question
  const faqData = [
    {
      id: "1",
      question: "What types of images can I generate with ALLE-AI?",
      answer:
        "You can generate a wide variety of images, including realistic scenes, artistic visuals, and abstract designs. The platform supports multiple AI models to cater to different creative needs.",
    },
    {
      id: "2",
      question: "How do I ensure the best results from image generation?",
      answer:
        "Provide detailed and specific prompts, including subject, style, composition, lighting, mood, and color palette. Experiment with combinations and refine based on results.",
    },
    {
      id: "3",
      question: "Can I download the generated images?",
      answer:
        "Yes, you can download images in formats like JPEG and PNG. Hover over the image and click the download icon.",
    },
    {
      id: "4",
      question: "Is there a limit to the number of images I can generate?",
      answer:
        "Limits depend on your subscription plan. Free users have restrictions, while premium users enjoy higher quotas and extra features.",
    },
    {
      id: "5",
      question: "Why is my generated image blurry?",
      answer:
        "Blurry images may result from vague prompts or low-resolution settings. Try specifying 'high resolution' or 'sharp details' in your prompt and check your model settings.",
    },
  ];

  const handleContactSupport = () => {
    const email = "support@alle-ai.com";
    const subject = "Support Request";
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <section className="my-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Create Stunning Images with ALLE-AI
        </h2>
        <p className="text-muted-foreground">
          Alle-AI lets you generate images using multiple image generation
          models, all specialized in visual creation. Pick your models,
          fine-tune the settings, and bring your ideas to life with a single
          prompt from photorealistic scenes to abstract art.
          <span className="font-semibold">
            &nbsp; Check out the example below to see how different models
            interpret the same prompt
          </span>
        </p>

        {/* Showcase Container */}
        <div className="mt-6">
          <ImageGenerationShowcase />
        </div>
      </section>

      {/* Getting Started */}
      <section className="my-8">
        <h2 className="text-2xl font-semibold mb-4">
          Getting Started with Image Generation on Alle-AI
        </h2>
        <p className="text-muted-foreground mb-4">
          This guide walks you through generating images on our platform,
          focusing on image-specific features. For basics like model selection
          or voice input, see our{" "}
          <span className="text-blue-600 dark:text-blue-400 font-bold">
            <Link href={"/docs/user-guides/chat#walkthrough"}>
              Platform Interface
            </Link>
          </span>{" "}
          guide.
        </p>

        {/* Video Walkthrough */}
        <aside className="mb-8 flex justify-center">
          <div className="w-full max-w-4xl">
            <iframe
              src="https://www.youtube.com/embed/8g7kHVMFxlE"
              width="100%"
              height="315"
              className="rounded"
              allowFullScreen
            ></iframe>
            {/* TODO: Replace with actual image generation tutorial video */}
          </div>
        </aside>
      </section>

      {/* Providing Input */}
      <section className="my-8">
        {/* Effective Prompts */}
        <div className="my-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
            Crafting Effective Text Prompts
          </h1>
          <p className="text-muted-foreground mb-6">
            Descriptive prompts are key to high-quality images. Include these
            elements to guide the AI:
          </p>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Key Elements to Include
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-5">
              <li>
                <strong>Subject</strong>: Main focus (e.g., "a majestic lion,"
                "a futuristic city").
              </li>
              <li>
                <strong>Style</strong>: Artistic style (e.g., "photorealistic,"
                "anime," "abstract").
              </li>
              <li>
                <strong>Composition</strong>: Layout (e.g., "close-up," "wide
                shot").
              </li>
              <li>
                <strong>Lighting</strong>: Light type (e.g., "soft," "neon,"
                "dramatic").
              </li>
              <li>
                <strong>Mood/Emotion</strong>: Feeling (e.g., "tranquil,"
                "epic").
              </li>
              <li>
                <strong>Color Palette</strong>: Colors (e.g., "pastel,"
                "vibrant").
              </li>
              <li>
                <strong>Details</strong>: Extras (e.g., "with a waterfall,"
                "wearing a crown").
              </li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Example Prompts</h2>
            <div className="space-y-6">
              <div>
                <p className="text-muted-foreground">
                  "A photorealistic portrait of a lion with a golden mane on a
                  cliff at sunset, backlit by warm light, in an epic mood with
                  orange and gold colors."
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong>Why it works</strong>: Defines subject, style,
                  lighting, mood, and colors.
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  "A cyberpunk cityscape with neon skyscrapers, flying cars, and
                  a rainy street, in a mysterious mood with neon blue and purple
                  tones."
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong>Why it works</strong>: Specifies style, mood, and
                  details.
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  "A serene lake at dawn, impressionist style, wide shot with
                  soft lighting, tranquil mood, and pastel blues, greens, and
                  pinks."
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong>Why it works</strong>: Combines composition, style,
                  and mood.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Tips for Success</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-5">
              <li>
                <strong>Be Specific</strong>: Add relevant details.
              </li>
              <li>
                <strong>Experiment</strong>: Try different styles and moods.
              </li>
              <li>
                <strong>Iterate</strong>: Refine prompts based on outputs.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Viewing and Managing Generated Images */}

      {/* Troubleshooting & Support */}
      <section className="my-8">
        <h2 className="text-2xl font-semibold mb-4">Common Issues & Fixes</h2>
        <CollapsibleItems items={faqData} />
      </section>

      {/* Contact Support */}
      <section className="my-8">
        <h3 className="text-xl font-semibold mb-2">Contact Support</h3>
        <p className="text-muted-foreground">
          Need help? Visit our{" "}
          <span className="text-blue-600 dark:text-blue-400 font-bold">
            <Link href={"/collection"}>Help Center</Link>
          </span>{" "}
          or contact{" "}
          <button
            onClick={handleContactSupport}
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            support@alle-ai.com
          </button>
          .
        </p>
      </section>

      {/* <NavigationContainer
        previousTitle="Text Generation"
        preUrl="/docs/tutorials/image-ai"
        nextTitle="Audio Generation"
        nextUrl="/docs/tutorials/audio-ai"
      /> */}
      {/* article feedback */}
      <div className="mb-5">
        <ArticleFeedback />
      </div>

      <div>
        <DocsFooter nonDev={true} />
      </div>
    </div>
  );
}
