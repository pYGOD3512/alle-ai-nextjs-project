import { Description } from "@radix-ui/react-toast";
import dynamic from "next/dynamic";
import { FC } from "react";

// available faq pages
const faqComponents = {
  "reset-password": dynamic(
    () => import("@/components/faq/account/reset-password")
  ),
  "phone-verification": dynamic(
    () => import("@/components/faq/account/phone-verification")
  ),
  "auth-method": dynamic(() => import("@/components/faq/account/auth-method")),
  "change-password": dynamic(() => import("@/components/faq/account/change-password")),
};

interface DynamicFaqProps {
  faqName: keyof typeof faqComponents; // get name of faq component
}

const DynamicFaq: FC<DynamicFaqProps> = ({ faqName }) => {
  const SelectedFAQ = faqComponents[faqName];

  if (!SelectedFAQ) {
    return <p>FAQ not found!</p>; // Fallback UI will implement later
  }

  return (
    <div>
      <SelectedFAQ />
    </div>
  );
};

export default DynamicFaq;
