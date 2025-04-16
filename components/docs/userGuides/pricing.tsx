import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Calculator, Check, ArrowRight, ChevronRight } from "lucide-react";

const pricingTiers = [
  {
    title: "Free",
    price: "$0",
    billing: "per month",
    description: "Perfect for testing and exploration",
    features: [
      "100 credits/month",
      "Up to 2 models per request",
      "Text-only requests",
      "10 requests/minute rate limit",
      "Community support",
    ],
    ctaText: "Get Started",
    ctaLink: "/signup",
  },
  {
    title: "Starter",
    price: "$100",
    billing: "per month",
    description: "For developers building small-scale applications",
    features: [
      "5,000 credits/month",
      "Up to 3 models per request",
      "Basic multimodal (text, image, audio)",
      "50 requests/minute rate limit",
      "Email support",
    ],
    ctaText: "Choose Starter",
    ctaLink: "/signup",
  },
  {
    title: "Pro",
    price: "$200",
    billing: "per month",
    description: "For production applications with higher demand",
    features: [
      "50,000 credits/month",
      "Up to 5 models per request",
      "Full multimodal (text, image, audio, video)",
      "200 requests/minute rate limit",
      "Priority email + chat support",
    ],
    ctaText: "Choose Pro",
    ctaLink: "/signup",
    highlighted: true,
  },
  {
    title: "Enterprise",
    price: "Custom",
    billing: "pricing",
    description: "For large-scale applications and special requirements",
    features: [
      "Custom credits/month",
      "Unlimited models per request",
      "Full feature access",
      "Custom rate limits",
      "Dedicated support + SLA",
    ],
    ctaText: "Contact Sales",
    ctaLink: "/contact",
  },
];

const PricingPage = () => {
  const scrollToCalculator = (e) => {
    e.preventDefault();
    const calculatorSection = document.getElementById("calculator");
    calculatorSection.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToPricing = (e) => {
    e.preventDefault();
    const pricingSection = document.getElementById("pricing-tiers");
    pricingSection.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen  bg-background">
      {/* Main Content */}
      <main className="max-w-3xl    ">
        {/* Credit System Explanation */}
        <section className="mb-16 ">
          <div className="  text-muted-foreground mb-8">
            <p>
              AlleAI unites the world’s best AI models for chat, image, audio,
              and video into a single, powerful API. Our credit-based system
              makes accessing these diverse capabilities simple, transparent,
              and cost-effective. With one API request, you can combine multiple
              models to generate or edit text, visuals, audio, or videos,
              tailored to your project’s needs.
            </p>
            <div className="text-center mt-8 mb-4">
              <a
                href="#pricing-tiers"
                onClick={scrollToPricing}
                className="inline-flex items-center px-6 py-3 border-black border-2 dark:border-gray-500 text-black dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-300 font-medium"
              >
                View Pricing Tiers
                <ChevronRight className="w-4 h-4 ml-2 text-black dark:text-white" />
              </a>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-10 mb-3">
              How Credits Work
            </h3>
            <p className="text-muted-foreground">
              Each model involved in a request consumes a certain number of
              credits. Credits make it easy to use any single model or
              combination of models in one seamless request. The number of
              credits each model uses depends on its computational power and the
              type of task it's designed for, giving you transparent and
              predictable pricing every time.
            </p>
            <ul className=" list-disc list-inside mt-4 mb-4">
              <li>
                <span className="font-bold">Chat Models</span> (e.g., DeepSeek,
                Claude): Generate text, summaries, or translations for 0.5 to 1
                credit per request.
              </li>
              <li>
                <span className="font-bold">Advanced Chat Models</span> (e.g.,
                GPT-4o, Gemini): Handle complex reasoning or creative tasks for
                1 to 1.5 credits per request.
              </li>
              <li>
                <span className="font-bold">Image Models</span> (e.g., DALL·E,
                Stable Diffusion): Create or edit visuals like art, logos, or
                photos for 1 to 2 credits per request.
              </li>
              <li>
                <span className="font-bold">Audio Models</span> (e.g.,
                ElevenLabs, Whisper): Perform text-to-speech, speech-to-text, or
                generate audio from prompts for 0.75 to 1.5 credits per request.
              </li>
              <li>
                <span className="font-bold">Video Models</span> (e.g., Runway,
                Pika): Generate or edit video content for 1.5 to 2 credits per
                request.
              </li>
            </ul>
            <p>
              Credits scale with the complexity of each task: simple operations
              like text generation consume fewer credits, while intensive tasks
              like video editing or voice synthesis require more. Each request
              is sent to a dedicated endpoint{" "}
              <span className="font-bold">chat, image, audio, or video </span>{" "}
              and can include multiple models of the same type. For example, a
              single chat request might involve both Claude and DeepSeek working
              together to co-write content, costing around 1 to 1.5 credits. Or,
              a video request using both Runway for editing and Pika for effects
              could run between 2 to 3.5 credits all within the same video
              endpoint call. This unified credit system keeps pricing
              predictable, and combining models in a single-type request reduces
              overhead compared to multiple separate calls.
              <a
                href="#calculator"
                onClick={scrollToCalculator}
                className="underline text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold"
              >
                Credit Calculator
              </a>{" "}
              to estimate usage or explore our{" "}
              <a
                href="/docs/api-reference/introduction"
                className="underline text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold"
              >
                API documentation
              </a>{" "}
              to start building.
            </p>
          </div>
        </section>

        {/* Pricing Tiers - Card Layout */}
        <section id="pricing-tiers" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              From testing to enterprise-scale applications, we have a plan that
              fits your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative border border-borderColorPrimary rounded-lg bg-background hover:shadow-lg transition-all duration-200 group ${
                  tier.highlighted ? "border-2 bg-gray-300 dark:bg-accent" : ""
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute top-3 right-3 text-xs font-semibold bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-900 px-2 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-normal text-gray-800 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    {tier.title}
                  </CardTitle>
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {tier.price}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {" "}
                      {tier.billing}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <CardDescription className="text-base text-muted-foreground mb-4">
                    {tier.description}
                  </CardDescription>
                  <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-4 h-4 mr-2 text-black dark:text-white mt-1" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-0">
                  <a
                    href={tier.ctaLink}
                    className={`w-full py-3 px-6 rounded-lg font-medium text-center transition-all duration-300 ${
                      tier.highlighted
                        ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-zinc-200"
                        : "border-black border-2 dark:border-gray-500 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {tier.ctaText}
                    {tier.highlighted && (
                      <ArrowRight className="w-4 h-4 ml-2 inline text-white dark:text-black" />
                    )}
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Credit Calculator Placeholder */}
        <section id="calculator" className="mb-16 scroll-mt-16">
          <div className="rounded-xl border border-borderColorPrimary p-8 bg-background">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Credit Calculator
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Estimate your API costs based on the models and request types
                you plan to use.
              </p>
            </div>

            <Card className="bg-background border border-borderColorPrimary rounded-lg hover:shadow-lg transition-all duration-200 group">
              <CardContent className="p-10 text-center">
                <div className="flex flex-col items-center">
                  <div className="p-3 border-black border-2 dark:border-gray-500 rounded-lg mb-4 group-hover:bg-gray-100 dark:group-hover:bg-zinc-800 transition-colors">
                    <Calculator className="w-6 h-6 text-black dark:text-white" />
                  </div>
                  <h3 className="text-xl font-normal text-gray-800 dark:text-gray-100 mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    Interactive Calculator Coming Soon
                  </h3>
                  <p className="text-base text-muted-foreground max-w-md">
                    Our interactive calculator will help you estimate your
                    credit usage based on your specific needs and models.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl border border-borderColorPrimary p-12 text-center bg-background">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Ready to Build with AlleAI?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Start for free or contact our team to find the perfect plan for your
            needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/signup"
              className="bg-black dark:bg-white text-white dark:text-black py-3 px-8 rounded-lg hover:bg-gray-800 dark:hover:bg-zinc-200 transition-all duration-300 font-medium"
            >
              Get Started for Free
              <ArrowRight className="w-4 h-4 ml-2 inline text-white dark:text-black" />
            </a>
            <a
              href="/contact"
              className="border-black border-2 dark:border-gray-500 text-black dark:text-white py-3 px-8 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-300 font-medium"
            >
              Talk to Sales
            </a>
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-borderColorPrimary py-8 text-center text-gray-500 dark:text-gray-400">
        <div className="max-w-7xl mx-auto px-3 sm:px-3 lg:px-3">
          <p>© {new Date().getFullYear()} AlleAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
