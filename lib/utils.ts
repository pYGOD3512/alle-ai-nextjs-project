import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function textReveal(
  inputString: string
): Array<{ char: string; id: number }> {
  const characters: Array<{ char: string; id: number }> = [];
  const regex = /./gu;
  let match;
  let index = 0;

  while ((match = regex.exec(inputString)) !== null) {
    characters.push({ char: match[0], id: index++ });
  }

  return characters;
}

export const generateRandomId = () => {
  const chatId = uuidv4();
  return chatId;
};


// Active sideBar page navigation color picker

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
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds ${formatFileSize(MAX_FILE_SIZE)}`
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