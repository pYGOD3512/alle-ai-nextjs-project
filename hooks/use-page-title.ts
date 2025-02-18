import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function usePageTitle() {
  const pathname = usePathname();

  useEffect(() => {
    const baseTitle = "Alle-AI";
    let pageTitle = "Chat";

    // Match the pathname to determine the title
    if (pathname.startsWith('/image')) pageTitle = "Image";
    else if (pathname.startsWith('/audio')) pageTitle = "Audio";
    else if (pathname.startsWith('/video')) pageTitle = "Video";
    else if (pathname.startsWith('/changelog')) pageTitle = "Changelog";
    else if (pathname.startsWith('/terms-of-service')) pageTitle = "Terms of Service";
    else if (pathname.startsWith('/privacy-policy')) pageTitle = "Privacy Policy";
    else if (pathname.startsWith('/model-glossary')) pageTitle = "Model Glossary";

    document.title = `${pageTitle} - ${baseTitle}`;
  }, [pathname]);
}