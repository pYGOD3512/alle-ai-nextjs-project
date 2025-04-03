import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function textReveal(inputString: string): Array<{char: string, id: number}> {
  const characters: Array<{char: string, id: number}> = [];
  const regex = /./gu;
  let match;
  let index = 0;

  while ((match = regex.exec(inputString)) !== null) {
    characters.push({ char: match[0], id: index++ });
  }

  return characters;
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
};

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function validateFile(file: File): { isValid: boolean; error?: string } {
  // Check if it's an image
  const isImage = file.type.startsWith('image/');
  
  // Apply appropriate size limit
  const sizeLimit = isImage ? 5 * 1024 * 1024 : 20 * 1024 * 1024; // 5MB for images, 20MB for other files
  const readableLimit = isImage ? '5MB' : '20MB';
  
  if (file.size > sizeLimit) {
    return {
      isValid: false,
      error: `File size exceeds ${readableLimit} limit`
    };
  }

  if (!Object.keys(ALLOWED_FILE_TYPES).includes(file.type)) {
    return {
      isValid: false,
      error: 'File type not supported'
    };
  }

  return { isValid: true };
}

export const formVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

export const getQueryParam = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(name);
};

export const hasQueryParam = (name: string): boolean => {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).has(name);
};

export const PROTECTED_ROUTES = [
  '/audio',
  '/video',
  '/project',
  '/developer',
  '/changelog',
  
];

export const isProtectedRoute = (path: string): boolean => {
  return PROTECTED_ROUTES.some(route => path.startsWith(route));
};