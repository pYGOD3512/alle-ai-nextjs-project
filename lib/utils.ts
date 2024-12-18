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
