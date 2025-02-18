import React from "react";

const benefits = [
  {
    title: "Enhanced Creativity",
    description: [
      "Unlock New Ideas: By blending the strengths of various AI models—whether for chat, audio, image, or video generation—you can spark creative breakthroughs that wouldn’t be possible with just one model.",
      "Overcome Limitations: If one model struggles in a particular area, another can compensate, leading to more comprehensive and satisfying results.",
    ],
  },
  {
    title: "Greater Control and Personalization",
    description: [
      "Tailored Experience: With multiple models to choose from, you can hand-pick combinations that best align with your unique needs, offering a truly personalized AI experience.",
      "Experiment and Explore: The world of AI is vast and full of possibilities. Select different combinations to discover what works best for your project, whether for creative writing, video content, or complex problem-solving.",
    ],
  },
  {
    title: "Future-Proofing Your Experience",
    description: [
      "Adaptability: As the AI landscape evolves rapidly, selecting two models ensures your experience remains cutting-edge. With every new model release, you stay ahead and continue to benefit from the latest advancements in AI technology.",
    ],
  },
];

export default function ModelSelection() {
  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Why Do I Need to Select Two or More AI Models?
      </h1>
      <p className="dark:text-muted-foreground leading-relaxed">
        At alle-ai, we believe in the power of synergy, allowing you to select
        two AI models to unlock a truly dynamic and personalized experience. By
        combining different models, we not only offer greater flexibility but
        also enhance your creative potential. Here’s why this approach stands
        out:
      </p>
      <ul className="list-disc list-inside">
        {benefits.map((benefit, index) => (
          <li className="text-lg font-bold" key={index}>
            {benefit.title}
            <ul className="list-disc list-inside font-light">
              {benefit.description.map((desc, i) => (
                <li className="dark:text-muted-foreground" key={i}>
                  {desc}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p className="text-lg mt-4">
        In conclusion, selecting two or more AI models on our platform isn’t
        just a necessity—it’s an opportunity to elevate your projects,
        experiment with different approaches, and ensure your experience remains
        relevant as AI continues to evolve. Embrace the possibilities and
        discover a world of creativity, control, and future-proof innovation.
      </p>
    </div>
  );
}
