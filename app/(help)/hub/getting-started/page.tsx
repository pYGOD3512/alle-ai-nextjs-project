import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ArrowRight, FileQuestion } from "lucide-react";
import Link from "next/link";
const features = [
  {
    title: "Chat Section",
    description:
      "Engage with multiple AI models in one space. Compare their responses side-by-side and dive deeper into your inquiries to unlock diverse insights and creative ideas.",
  },
  {
    title: "Image Generation",
    description:
      "Turn your imagination into reality with powerful image-generation tools. Explore creative prompts and see how different AI models interpret your vision. Perfect for artists, designers, and dreamers.",
  },
  {
    title: "Audio Generation",
    description:
      "Need a podcast intro, background music, or voice synthesis? Alle-AI's audio generation feature creates high-quality audio content tailored to your needs.",
  },
  {
    title: "Video Generation",
    description:
      "From explainer videos to animated concepts, Alle-AI allows you to generate videos by leveraging advanced AI tools. Customize scripts, scenes, and more—then let the platform do the magic.",
  },
  {
    title: "Smart Summarization",
    description:
      "When multiple responses feel overwhelming, Alle-AI's unique summarization model condenses outputs into actionable insights. Whether for research, decision-making, or creative projects, you'll get the most relevant answers fast.",
  },
  {
    title: "AI Collaboration",
    description:
      "Use Spaces to organize, collaborate, and share your projects. Keep your Threads private, or make them public to collaborate with others in real-time.",
  },
];
const benefits = [
  {
    title: "Unified AI Power",
    description:
      "Access the combined expertise of industry-leading AI models in one seamless platform.",
    gradient: "from-blue-50",
  },
  {
    title: "Diverse Applications",
    description:
      "From text and image generation to audio and video, Alle-AI is designed for creators, researchers, and professionals alike.",
    gradient: "from-purple-50",
  },
  {
    title: "Enhanced Productivity",
    description:
      "Smart summarization, deep customization, and collaborative tools ensure that Alle-AI adapts to your workflow.",
    gradient: "from-green-50",
  },
];

const tips = [
  {
    title: "Leverage All Features",
    description:
      "Experiment with chat, image, audio, and video generation for multifaceted creativity. File Upload for in-depth context or keep it simple with 2 or 3 keywords. Dial in, get answers",
  },
  {
    title: "Compare and Contrast",
    description:
      "Use Alle-AI to see how different models handle the same prompt and gain diverse insights.",
  },
  {
    title: "Collaborate Effectively",
    description:
      "Use Spaces to organize projects, invite team members, and share your work effortlessly.",
  },
  {
    title: "Optimize Your Prompts",
    description:
      "Fine-tune your queries to get the best responses for each AI model.",
  },
];

export default function Page() {
  return (
    <div className="space-y-16 pb-16">
      <section className="w-full text-center pt-8">
        {/* title */}
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
          Getting Started
        </h1>
        {/* Short Description */}
        <p className="text-lg mt-6 mb-8 max-w-2xl mx-auto">
          Learn how Alle-AI works with this quick video overview
        </p>

        {/* Youtube video */}
        <div className="relative overflow-hidden rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 max-w-3xl mx-auto group">
          <iframe
            className="w-full h-64 sm:h-80 md:h-96 rounded-lg transform transition-transform group-hover:scale-[1.01]"
            width="948"
            height="388"
            src="https://www.youtube.com/embed/DZqTaE0AvVo?rel=0&showinfo=0"
            title="Alle-AI"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* What is Alle-AI section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-850 hover:shadow-lg transition-all duration-300">
          <CardContent className="pt-8 pb-8">
            <h2 className="text-3xl font-semibold mb-4">What is Alle-AI?</h2>
            <p className="text-lg leading-relaxed">
              Alle-AI is the ultimate hub for cutting-edge AI capabilities. By
              integrating top models like ChatGPT, Claude, Gemini, and many
              others, Alle-AI provides a unified platform for generating text,
              images, audio, and videos. Whether you're brainstorming, creating,
              or researching, Alle-AI empowers you to explore and innovate with
              the best tools AI has to offer.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Alle-ai features section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-center mb-12">
          What Can You Do with Alle-AI?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-white dark:bg-zinc-800"
            >
              <CardHeader>
                <h3 className="text-2xl font-semibold">{feature.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* why choose us */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold">Why Choose Alle-AI?</h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className={`bg-gradient-to-br ${benefit.gradient} to-white dark:from-zinc-800 dark:to-zinc-850 hover:shadow-lg hover:scale-[1.02] transition-all duration-300`}
            >
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips Section */}
        <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-850 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <h3 className="text-2xl font-semibold">
              Tips for Getting the Most Out of Alle-AI
            </h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <h4 className="text-lg font-medium mb-3">{tip.title}</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
      {/* Learn more section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-850">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold ">
                There's Always More to Learn
              </h2>
              <p className=" text-lg max-w-2xl mx-auto">
                Explore our comprehensive FAQ section for detailed guides and
                answers to common questions, or jump right in and experience
                Alle-AI for yourself.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                <Link
                  href="/collection"
                  className="flex items-center gap-2 bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-400 text-white px-6 py-3 rounded-lg hover:bg-zinc-800 transition-all duration-300"
                >
                  <FileQuestion className="w-5 h-5" />
                  <span>Visit FAQ Page</span>
                </Link>

                <Link
                  href="/"
                  className="flex items-center dark:bg-white dark:text-black dark:hover:bg-zinc-400 gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-zinc-800 transition-all duration-300 font-medium"
                >
                  <span>Try Alle-AI Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
