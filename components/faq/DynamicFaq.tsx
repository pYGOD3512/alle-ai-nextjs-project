import dynamic from "next/dynamic";
import { FC } from "react";

// available faq pages
const faqComponents = {
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
  "limits": dynamic(
    () => import("@/components/faq/others/model-limits")
  ),
};

interface DynamicFaqProps {
  faqName: keyof typeof faqComponents; // get name of faq component
}

const DynamicFaq: FC<DynamicFaqProps> = ({ faqName }) => {
  const SelectedFAQ = faqComponents[faqName];

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
