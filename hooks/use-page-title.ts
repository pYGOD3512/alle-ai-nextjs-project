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

    document.title = `${pageTitle} - ${baseTitle}`;
  }, [pathname]);
}