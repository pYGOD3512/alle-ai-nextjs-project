import dynamic from "next/dynamic";
import { FC } from "react";
import Introduction from "../docs/api-reference/introduction";

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
  chat: dynamic(() => import("@/components/docs/user-guides/text-generation")),
  audio: dynamic(() => import("@/components/docs/user-guides/audioGeneration")),
  video: dynamic(() => import("@/components/docs/user-guides/videoGeneration")),
  image: dynamic(
    () => import("@/components/docs/user-guides/image-generation")
  ),
  history: dynamic(() => import("@/components/docs/user-guides/History")),
  //api reference  pages
  overview: dynamic(() => import("@/components/docs/user-guides/Overview")),
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
  prompts: dynamic(() => import("@/components/docs/user-guides/prompts")),
  pricing: dynamic(() => import("@/components/docs/reference/pricing")),
  "error-codes": dynamic(() => import("@/components/docs/reference/Errors")),
  "prompts-inputs": dynamic(
    () => import("@/components/docs/reference/fine-tuning-inputs")
  ),

  // user guides pages
  "using-platform": dynamic(
    () => import("@/components/docs/user-guides/use-platform")
  ),
  models: dynamic(() => import("@/components/docs/reference/models")),

  // main api reference
  introduction: dynamic(
    () => import("@/components/docs/api-reference/introduction")
  ),
  endpoints: dynamic(() => import("@/components/docs/api-reference/endpoints")),
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
