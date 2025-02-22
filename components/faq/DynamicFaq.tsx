import dynamic from "next/dynamic";
import { FC } from "react";

// available faq pages
const faqComponents = {
  // help center pages
  "reset-password": dynamic(
    () => import("@/components/faq/account/reset-password")
  ),
  "change-email": dynamic(
    () => import("@/components/faq/account/change-email")
  ),
  "auth-method": dynamic(() => import("@/components/faq/account/auth-method")),
  "change-password": dynamic(
    () => import("@/components/faq/account/change-password")
  ),
  "contact-support": dynamic(
    () => import("@/components/faq/account/contact-support")
  ),
  "subscription-billing": dynamic(
    () => import("@/components/faq/account/subscription-billing")
  ),
  "privacy-policy": dynamic(
    () => import("@/components/faq/privacy/privacy-policy")
  ),
  "terms-service": dynamic(
    () => import("@/components/faq/privacy/terms-of-service")
  ),
  "usage-policies": dynamic(
    () => import("@/components/faq/privacy/usage-policy")
  ),
  "content-policy": dynamic(
    () => import("@/components/faq/privacy/content-policy")
  ),
  "subscription-discounts": dynamic(
    () => import("@/components/faq/others/subscription-discount")
  ),
  "models-selection": dynamic(
    () => import("@/components/faq/others/models-selection")
  ),

  //api reference  pages
  quickstart: dynamic(
    () => import("@/components/docs/reference/initial-setup")
  ),
  "text-generation": dynamic(
    () => import("@/components/docs/reference/text-generation")
  ),
  "image-generation": dynamic(
    () => import("@/components/docs/reference/image-generation")
  ),
  limits: dynamic(() => import("@/components/docs/reference/limits")),
  "audio-generation": dynamic(
    () => import("@/components/docs/reference/audio-generation")
  ),
  "file-uploads": dynamic(
    () => import("@/components/docs/reference/file-uploads")
  ),
  "video-generation": dynamic(
    () => import("@/components/docs/reference/video-generation")
  ),
  pricing: dynamic(() => import("@/components/docs/reference/pricing")),
  "error-codes": dynamic(() => import("@/components/docs/reference/Errors")),
  "prompts-inputs": dynamic(
    () => import("@/components/docs/reference/fine-tuning-inputs")
  ),

  // tutorials pages
  "using-platform": dynamic(
    () => import("@/components/docs/tutorials/Overview")
  ),
  "text-ai": dynamic(
    () => import("@/components/docs/tutorials/text-generation")
  ),
  "audio-ai": dynamic(
    () => import("@/components/docs/tutorials/audioGeneration")
  ),
  "video-ai": dynamic(
    () => import("@/components/docs/tutorials/videoGeneration")
  ),
  "image-ai": dynamic(
    () => import("@/components/docs/tutorials/image-generation")
  ),
  prompts: dynamic(() => import("@/components/docs/tutorials/prompts")),
  history: dynamic(() => import("@/components/docs/tutorials/History")),

  models: dynamic(() => import("@/components/docs/reference/models")),

 
};

type FaqName = keyof typeof faqComponents;

interface DynamicFaqProps {
  faqName: string;
}

const DynamicFaq: FC<DynamicFaqProps> = ({ faqName }) => {
  const SelectedFAQ =
    faqName in faqComponents ? faqComponents[faqName as FaqName] : null;

  if (!SelectedFAQ) {
    return <p>FAQ not found!</p>;
  }

  return (
    <div>
      <SelectedFAQ />
    </div>
  );
};

export default DynamicFaq;
