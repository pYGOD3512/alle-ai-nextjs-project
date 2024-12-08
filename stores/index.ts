//@ts-nocheck
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ContentKey = "input" | "voice" | "attachment";
type ContentType = "chat" | "image" | "audio" | "video";

interface ContentValue {
  input: string;
  voice: File | null;
  attachment: File | null;
}

interface ContentStore {
  content: Record<ContentType, ContentValue>;
  setContent: <K extends ContentKey>(
    type: ContentType,
    key: K,
    value: ContentValue[K]
  ) => void;
  resetContent: (type: ContentType) => void;
}

export const useContentStore = create(
  persist<ContentStore>(
    (set) => ({
      content: {
        chat: { input: "", voice: null, attachment: null },
        image: { input: "", voice: null, attachment: null },
        audio: { input: "", voice: null, attachment: null },
        video: { input: "", voice: null, attachment: null },
      },
      setContent: (type, key, value) =>
        set((state) => ({
          content: {
            ...state.content,
            [type]: {
              ...state.content[type],
              [key]: value,
            },
          },
        })),
      resetContent: (type) =>
        set((state) => ({
          content: {
            ...state.content,
            [type]: { input: "", voice: null, attachment: null },
          },
        })),
    }),
    {
      name: "content-storage",
      partialize: (state) => ({ content: state.content }),
    }
  )
);
