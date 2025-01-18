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
};

interface DynamicFaqProps {
  faqName: keyof typeof faqComponents; // get name of faq component
}

const DynamicFaq: FC<DynamicFaqProps> = ({ faqName }) => {
  const SelectedFAQ = faqComponents[faqName];

  if (!SelectedFAQ) {
    return <p>FAQ not found!</p>; // Fallback
  }

  return (
    <div>
      <SelectedFAQ />
    </div>
  );
};

export default DynamicFaq;
