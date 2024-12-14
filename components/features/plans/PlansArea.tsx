"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react"; 

const PlansArea = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Free",
      price: 0,
      description:
        "For small teams or individuals optimizing basic web queries.",
      about:
        "Interact with up to 2 AI models in a single conversation to gain diverse insights and perspectives.",
      features: [
        "Text",
        "Image",
        "2 AI Models/conversation",
        "Limited model Usage",
      ],
      buttonText: "Upgrade to Free",
      highlighted: false,
    },
    {
      name: "Standard",
      price: isYearly ? 200 : 20,
      description: "Enhanced AI capabilities and additional features.",
      about:
        "Interact with up to 3 AI models per conversation for even more diverse insights, plus access to Fact-checking, Audio, and Video generation models.",
      features: [
        "Everything in Free",
        "Up to 3 AI models",
        "Fact-checking",
        "Audio",
        "Video",
      ],
      buttonText: "Upgrade to Standard",
      highlighted: false,
    },
    {
      name: "Plus",
      price: isYearly ? 300 : 30,
      description: "Advanced AI interactions, and comprehensive flexibility.",
      about:
        "Access up to 5 AI models per conversation, with unlimited tokens and the ability to use all available AI models for maximum flexibility.",
      features: [
        "Everything in Standard",
        "Up to 5 AI models",
        "Access all AI models",
        "Early access to new features",
      ],
      buttonText: "Upgrade to Plus",
      highlighted: true,
    },
    {
      name: "Custom",
      price: "X",
      description:
        "Fully customizable features tailored for your unique needs.",
      about:
        "Get a plan tailored to your business needs with custom AI models, features, and usage limits.",
      features: [
        "Customize Features",
        "Flexible Billing Options",
        "Custom Integrations & Development",
      ],
      buttonText: "Coming Soon",
      highlighted: false,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl overflow-auto">
      <div className="text-center space-y-2 sm:space-y-8 mb-12">
        <h1 className="text-xl sm:text-3xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-sm">
          Select the perfect plan for your needs. All plans include access to our core features, with additional capabilities as you scale.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={cn("text-sm", !isYearly && "text-primary")}>
            Monthly
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-borderColorPrimary"
          />
          <div className="flex items-center gap-2">
            <span className={cn("text-sm", isYearly && "text-primary")}>
              Yearly
            </span>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              17% discount
            </Badge>
          </div>
        </div>
      </div>

      {/* Remove ScrollArea and just keep the grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            layout
            className={cn(
              "relative p-6 rounded-lg border h-full",
              plan.highlighted
                ? "bg-[#130f0f] text-white"
                : "border-borderColorPrimary"
            )}
          >
            <div className="relative space-y-4 min-h-[25rem]">
              <div>
                <h3 className="font-medium text-md">{plan.name}</h3>
                <motion.div
                  key={`${plan.name}-${isYearly ? "yearly" : "monthly"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-end gap-1"
                >
                  <span className="text-3xl font-bold">
                    £
                    {typeof plan.price === "number" ? plan.price : plan.price}
                  </span>
                  {plan.price !== "X" && (
                    <span className="text-muted-foreground mb-1">
                      /{isYearly ? "year" : "month"}
                    </span>
                  )}
                </motion.div>
              </div>

              <p className={`text-sm text-muted-foreground pb-4`}>
                {plan.description}
              </p>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-[0.8rem]"
                  >
                    <Check
                        className={`h-4 w-4 text-primary ${
                          plan.highlighted ? "text-[#fafafa]" : ""
                        }`}
                      />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                    className={`w-full absolute bottom-0 ${
                      plan.highlighted
                        ? "bg-[#fafafa] text-[#171717] hover:bg-[#F8F8F8]"
                        : ""
                    }`}
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                  {plan.buttonText}
                </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8 sm:mt-12  text-sm text-muted-foreground">
        Need more Capabilities?{" "}
        <a href="#" className="text-primary hover:underline">
          See Alle-AI Team & Enterprise plans
        </a>
      </div>
    </div>
  );
};

export default PlansArea;