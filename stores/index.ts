// @ts-nocheck
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from '@/lib/api/auth';
import { User } from '@/lib/api/auth';

import { driveService } from '@/lib/services/driveServices';

import { CHAT_MODELS, IMAGE_MODELS, AUDIO_MODELS, VIDEO_MODELS, chatHistory, imageHistory, audioHistory, videoHistory } from '@/lib/constants';

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

interface SidebarState {
  isOpen: boolean;
  currentPage: string;
  sectionIds: { [key: string]: string | null }; // Generalized section IDs
  currentConversationLink: string | null; // Add this
  toggle: () => void;
  setCurrentPage: (page: string) => void;
  setSectionId: (section: string, id: string | null) => void; // Setter for dynamic IDs
  setOpen: (value: boolean) => void;
  setCurrentConversationLink: (link: string | null) => void; // Add this
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: true,
      currentPage: "chat",
      sectionIds: {
        chatId: null,
        imageId: null,
        audioId: null,
        videoId: null,
      }, // Default section IDs
      currentConversationLink: null,
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      setCurrentPage: (page) => set({ currentPage: page }),
      setSectionId: (section, id) =>
        set((state) => ({
          sectionIds: {
            ...state.sectionIds,
            [section]: id, // Dynamically update the section ID
          },
        })),
      setOpen: (value) => set({ isOpen: value }),
      setCurrentConversationLink: (link) => set({ currentConversationLink: link }),
    }),
    {
      name: "sidebar-storage",
      partialize: (state) => ({
        isOpen: state.isOpen,
        sectionIds: state.sectionIds,
        currentConversationLink: state.currentConversationLink,
      }),
    }
  )
);

interface SelectedModelsStore {
  selectedModels: {
    chat: string[];
    image: string[];
    audio: string[];
    video: string[];
  };
  inactiveModels: string[];
  tempSelectedModels: string[];
  setTempSelectedModels: (models: string[]) => void;
  saveSelectedModels: (type: 'chat' | 'image' | 'audio' | 'video') => void;
  toggleModelActive: (modelId: string) => void;
  getSelectedModelNames: (type: 'chat' | 'image' | 'audio' | 'video') => any[];
  lastUpdate: number;
}

export const useSelectedModelsStore = create(
  persist<SelectedModelsStore>(
    (set, get) => ({
      selectedModels: {
        chat: [],
        image: [],
        audio: [],
        video: [],
      },
      inactiveModels: [],
      tempSelectedModels: [],
      lastUpdate: Date.now(),
      setTempSelectedModels: (models) => set({ tempSelectedModels: models }),
      saveSelectedModels: (type) => {
        set((state) => ({
          selectedModels: {
            ...state.selectedModels,
            [type]: state.tempSelectedModels
          },
          lastUpdate: Date.now()
        }));
      },
      toggleModelActive: (modelId) => {
        set((state) => ({
          inactiveModels: state.inactiveModels.includes(modelId)
            ? state.inactiveModels.filter(id => id !== modelId)
            : [...state.inactiveModels, modelId],
          lastUpdate: Date.now()
        }));
      },
      getSelectedModelNames: (type) => {
        const state = get();
        const modelList = type === 'chat' ? CHAT_MODELS 
          : type === 'image' ? IMAGE_MODELS
          : type === 'audio' ? AUDIO_MODELS
          : VIDEO_MODELS;
        
        return state.selectedModels[type]
          .map(id => {
            const model = modelList.find(model => model.id === id);
            return model ? { 
              name: model.name, 
              type: model.type,
              isActive: !state.inactiveModels.includes(id)
            } : null;
          })
          .filter((item): item is { name: string; type: string; isActive: boolean } => item !== null);
      }
    }),
    {
      name: 'selected-models-storage'
    }
  )
);

interface ImageResponse {
  modelId: string;
  liked: boolean;
  imageUrl: string;
}

interface GeneratedImagesStore {
  images: ImageResponse[];
  lastPrompt: string | null;
  setImages: (images: ImageResponse[]) => void;
  updateImage: (modelId: string, updates: Partial<ImageResponse>) => void;
  setLastPrompt: (prompt: string) => void;
  clearImages: () => void;
}

export const useGeneratedImagesStore = create<GeneratedImagesStore>()(
  persist(
    (set, get) => ({
      images: [],
      lastPrompt: null,
      setImages: (images) => set({ images }),
      updateImage: (modelId, updates) => set((state) => ({
        images: state.images.map(img => 
          img.modelId === modelId ? { ...img, ...updates } : img
        )
      })),
      setLastPrompt: (prompt) => set({ lastPrompt: prompt }),
      clearImages: () => set({ images: [], lastPrompt: null }),
    }),
    {
      name: 'generated-images-storage'
    }
  )
);

interface AudioResponse {
  modelId: string;
  content: string;
  audioUrl: string;
  liked?: boolean;
}

interface GeneratedAudioStore {
  responses: AudioResponse[];
  lastPrompt: string | null;
  setResponses: (responses: AudioResponse[]) => void;
  updateResponse: (modelId: string, updates: Partial<AudioResponse>) => void;
  setLastPrompt: (prompt: string) => void;
  clearResponses: () => void;
}

export const useGeneratedAudioStore = create<GeneratedAudioStore>()(
  persist(
    (set) => ({
      responses: [],
      lastPrompt: null,
      setResponses: (responses) => set({ responses }),
      updateResponse: (modelId, updates) => set((state) => ({
        responses: state.responses.map(res => 
          res.modelId === modelId ? { ...res, ...updates } : res
        )
      })),
      setLastPrompt: (prompt) => set({ lastPrompt: prompt }),
      clearResponses: () => set({ responses: [], lastPrompt: null }),
    }),
    {
      name: 'generated-audio-storage'
    }
  )
);

interface HistoryItem {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: 'chat' | 'image' | 'audio' | 'video';
}

interface HistoryStore {
  history: HistoryItem[];
  addHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  removeHistory: (id: string) => void;
  renameHistory: (id: string, newTitle: string) => void;
  getHistoryByType: (type: HistoryItem['type']) => HistoryItem[];
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      history: [
        ...chatHistory,
        ...imageHistory,
        ...audioHistory,
        ...videoHistory
      ],
      addHistory: (item) =>
        set((state) => ({
          history: [
            {
              ...item,
              id: generateId(),
              timestamp: new Date().toISOString(),
            },
            ...state.history,
          ],
        })),
      removeHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
      renameHistory: (id, newTitle) =>
        set((state) => ({
          history: state.history.map((item) =>
            item.id === id ? { ...item, title: newTitle } : item
          ),
        })),
      getHistoryByType: (type) => {
        return get().history
          .filter((item) => item.type === type)
          .map(item => ({
            ...item,
            timestamp: new Date(item.timestamp)
          }));
      },
    }),
    {
      name: 'history-storage',
      serialize: (state) => JSON.stringify({
        ...state,
        state: {
          ...state.state,
          history: state.state.history.map((item: HistoryItem) => ({
            ...item,
            timestamp: item.timestamp instanceof Date 
              ? item.timestamp.toISOString()
              : item.timestamp
          }))
        }
      }),
      deserialize: (str) => {
        const parsed = JSON.parse(str);
        return {
          ...parsed,
          state: {
            ...parsed.state,
            history: parsed.state.history.map((item: HistoryItem) => ({
              ...item,
              timestamp: new Date(item.timestamp)
            }))
          }
        };
      }
    }
  )
);

export interface LikedMediaItem {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  modelName: string;
  modelIcon: string;
  modelId: string;
  prompt: string;
  timestamp: Date;
  liked: boolean;
}

interface LikedMediaStore {
  likedMedia: LikedMediaItem[];
  addLikedMedia: (item: Omit<LikedMediaItem, 'id' | 'timestamp'>) => void;
  removeLikedMedia: (id: string) => void;
  getLikedMediaByType: (type: 'all' | 'image' | 'video' | 'audio') => LikedMediaItem[];
}

export const useLikedMediaStore = create<LikedMediaStore>()(
  persist(
    (set, get) => ({
      likedMedia: [],
      addLikedMedia: (item) =>
        set((state) => ({
          likedMedia: [
            {
              ...item,
              id: `${item.type}-${Date.now()}`,
              timestamp: new Date(),
            },
            ...state.likedMedia,
          ],
        })),
      removeLikedMedia: (id) =>
        set((state) => ({
          likedMedia: state.likedMedia.filter((item) => item.id !== id),
        })),
      getLikedMediaByType: (type) => {
        const media = get().likedMedia;
        if (type === 'all') return media;
        return media.filter((item) => item.type === type);
      },
    }),
    {
      name: 'liked-media-storage',
    }
  )
);

interface DriveAuthStore {
  isAuthenticated: boolean;
  accessToken: string | null;
  expiresAt: number | null;
  setAuth: (token: string, expiresIn: number) => void;
  clearAuth: () => void;
  checkAndRefreshAuth: () => Promise<boolean>;
}

export const useDriveAuthStore = create<DriveAuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      accessToken: null,
      expiresAt: null,

      setAuth: (token: string, expiresIn: number) => {
        const expiresAt = Date.now() + (expiresIn * 1000);
        set({ 
          isAuthenticated: true, 
          accessToken: token,
          expiresAt: expiresAt
        });
      },

      clearAuth: () => {
        set({ 
          isAuthenticated: false, 
          accessToken: null,
          expiresAt: null 
        });
      },

      checkAndRefreshAuth: async () => {
        const state = get();
        const now = Date.now();

        // If we have a valid token that's not expired
        if (state.accessToken && state.expiresAt && state.expiresAt > now) {
          return true;
        }

        try {
          // Get gapi instance from driveService
          const gapi = driveService.getGapi();
          if (!gapi) {
            throw new Error('Google Drive API not initialized');
          }

          // Try to refresh the token using gapi
          const authInstance = gapi.auth2.getAuthInstance();
          if (authInstance.isSignedIn.get()) {
            const currentUser = authInstance.currentUser.get();
            const authResponse = currentUser.getAuthResponse();
            
            set({
              isAuthenticated: true,
              accessToken: authResponse.access_token,
              expiresAt: authResponse.expires_at
            });
            
            return true;
          }
          
          // If not signed in, clear auth state
          state.clearAuth();
          return false;
        } catch (error) {
          console.error('Failed to refresh auth:', error);
          state.clearAuth();
          return false;
        }
      }
    }),
    {
      name: 'drive-auth-storage'
    }
  )
);

interface SharedLink {
  id: string;
  historyId: string;
  title: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SharedLinksStore {
  sharedLinks: SharedLink[];
  addSharedLink: (historyId: string, title: string, link: string) => void;
  updateSharedLink: (id: string, link: string) => void;
  removeSharedLink: (id: string) => void;
  getSharedLink: (historyId: string) => SharedLink | undefined;
}

export const useSharedLinksStore = create<SharedLinksStore>()(
  persist(
    (set, get) => ({
      sharedLinks: [],
      addSharedLink: (historyId, title, link) => 
        set((state) => ({
          sharedLinks: [
            {
              id: `share-${Date.now()}`,
              historyId,
              title,
              link,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            ...state.sharedLinks,
          ],
        })),
      updateSharedLink: (id, link) =>
        set((state) => ({
          sharedLinks: state.sharedLinks.map((item) =>
            item.id === id ? { ...item, link, updatedAt: new Date() } : item
          ),
        })),
      removeSharedLink: (id) =>
        set((state) => ({
          sharedLinks: state.sharedLinks.filter((item) => item.id !== id),
        })),
      getSharedLink: (historyId) => {
        return get().sharedLinks.find((item) => item.historyId === historyId);
      },
    }),
    {
      name: 'shared-links-storage',
    }
  )
);

interface VoiceSettings {
  voice: string;  // Voice identifier
  pitch: number;  // 0 to 2
  rate: number;   // 0.1 to 10
  volume: number; // 0 to 1
}

interface VoiceStore {
  settings: VoiceSettings;
  availableVoices: SpeechSynthesisVoice[];
  setVoice: (voiceURI: string) => void;
  setPitch: (pitch: number) => void;
  setRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  initVoices: () => void;
}

export const useVoiceStore = create<VoiceStore>()(
  persist(
    (set) => ({
      settings: {
        voice: '',
        pitch: 1,
        rate: 1,
        volume: 1
      },
      availableVoices: [],
      setVoice: (voiceURI) => set((state) => ({
        settings: { ...state.settings, voice: voiceURI }
      })),
      setPitch: (pitch) => set((state) => ({
        settings: { ...state.settings, pitch }
      })),
      setRate: (rate) => set((state) => ({
        settings: { ...state.settings, rate }
      })),
      setVolume: (volume) => set((state) => ({
        settings: { ...state.settings, volume }
      })),
      initVoices: () => {
        const voices = window.speechSynthesis.getVoices();
        set({ availableVoices: voices });
      }
    }),
    {
      name: 'voice-settings-storage'
    }
  )
);

interface WebSearchState {
  isWebSearch: boolean;
  setIsWebSearch: (enabled: boolean) => void;
}

export const useWebSearchStore = create<WebSearchState>((set) => ({
  isWebSearch: false,
  setIsWebSearch: (enabled) => set({ isWebSearch: enabled }),
}));

interface CodeThemeStore {
  theme: keyof typeof AVAILABLE_THEMES;
  setTheme: (theme: keyof typeof AVAILABLE_THEMES) => void;
}

export const useCodeThemeStore = create<CodeThemeStore>()(
  persist(
    (set) => ({
      theme: 'System Default',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'code-theme-storage',
    }
  )
);

interface SettingsState {
  personalization: {
    combination: boolean;
    summary: boolean;
    comparison: boolean;
    personalizedAds: boolean;
  };
  setPersonalizationSetting: (key: keyof SettingsState['personalization'], value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      personalization: {
        combination: true,
        summary: false,
        comparison: true,
        personalizedAds: true, // Default to true
      },
      setPersonalizationSetting: (key, value) =>
        set((state) => ({
          personalization: {
            ...state.personalization,
            [key]: value,
          },
        })),
    }),
    {
      name: 'settings-storage',
    }
  )
);

const generateId = () => {
  return 'key_' + Math.random().toString(36).substring(2, 15);
};

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 50); // Limit length
};

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  workspace: string;
  createdBy: string;
  email: string;
  createdAt: string;
  lastUsed: string;
  cost: string;
  isVisible?: boolean;
  isDisabled?: boolean;
}

interface ApiKeyStore {
  keys: ApiKey[];
  addKey: (key: Omit<ApiKey, 'id' | 'key' | 'createdAt' | 'lastUsed' | 'cost'>) => void;
  removeKey: (id: string) => void;
  toggleKeyVisibility: (id: string) => void;
  editKeyName: (id: string, newName: string) => void;
  toggleKeyStatus: (id: string) => void;
}

export const useApiKeyStore = create<ApiKeyStore>()(
  persist(
    (set) => ({
      keys: [],
      addKey: (newKey) => set((state) => ({
        keys: [...state.keys, {
          ...newKey,
          id: generateId(),
          key: `sk-ant-${generateId()}`,
          createdAt: new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          lastUsed: 'Never',
          cost: '—',
          isVisible: false,
          isDisabled: false
        }]
      })),
      removeKey: (id) => set((state) => ({
        keys: state.keys.filter(key => key.id !== id)
      })),
      toggleKeyVisibility: (id) => set((state) => ({
        keys: state.keys.map(key => 
          key.id === id ? { ...key, isVisible: !key.isVisible } : key
        )
      })),
      editKeyName: (id, newName) => set((state) => ({
        keys: state.keys.map(key => 
          key.id === id ? { ...key, name: newName } : key
        )
      })),
      toggleKeyStatus: (id) => set((state) => ({
        keys: state.keys.map(key => 
          key.id === id ? { ...key, isDisabled: !key.isDisabled } : key
        )
      })),
    }),
    {
      name: 'api-keys-storage'
    }
  )
);

export interface PaymentMethod {
  id: string;
  type: 'card' | 'link';
  lastFour?: string;
  expiryDate?: string;
  cardBrand?: 'visa' | 'mastercard' | 'amex' | 'other';
  bankName?: string;
  isDefault: boolean;
}

interface PaymentStore {
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  getDefaultPaymentMethod: () => PaymentMethod | undefined;
}

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set, get) => ({
      paymentMethods: [],
      addPaymentMethod: (method) => set((state) => ({
        paymentMethods: [
          ...state.paymentMethods.map(m => ({...m, isDefault: false})),
          { ...method, id: `pm_${Date.now()}`, isDefault: true }
        ]
      })),
      removePaymentMethod: (id) => set((state) => ({
        paymentMethods: state.paymentMethods.filter(m => m.id !== id)
      })),
      setDefaultPaymentMethod: (id) => set((state) => ({
        paymentMethods: state.paymentMethods.map(method => ({
          ...method,
          isDefault: method.id === id
        }))
      })),
      getDefaultPaymentMethod: () => {
        return get().paymentMethods.find(m => m.isDefault);
      }
    }),
    {
      name: 'payment-methods-storage'
    }
  )
);

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  plan: string | null;

  setAuth: (user: User, token: string, plan?: string | null) => void;
  clearAuth: () => void;
  setLoading: (status: boolean) => void;
  setPlan: (plan: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      plan: null,

      setAuth: (user: User, token: string, plan: string | null = null) => {
        if (!user || !token) return;
        set({ 
          user, 
          token, 
          isAuthenticated: true,
          plan,
        });
      },

      clearAuth: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          plan: null,
        });
      },

      setLoading: (status) => {
        set({ isLoading: status });
      },

      setPlan: (plan) => {
        set({ plan });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        plan: state.plan,
      }),
    }
  )
);

interface PlanStore {
  selectedPlan: 'free' | 'standard' | 'plus' | 'custom';
  billingCycle: 'monthly' | 'yearly';
  isProcessing: boolean;
  setSelectedPlan: (plan: 'free' | 'standard' | 'plus' | 'custom') => void;
  setBillingCycle: (cycle: 'monthly' | 'yearly') => void;
  setIsProcessing: (status: boolean) => void;
}

export const usePlanStore = create<PlanStore>((set) => ({
  selectedPlan: 'free',
  billingCycle: 'monthly',
  isProcessing: false,
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),
  setBillingCycle: (cycle) => set({ billingCycle: cycle }),
  setIsProcessing: (status) => set({ isProcessing: status }),
}));

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  files: ProjectFile[];
  instructions: string;
  createdAt: Date;
  histories: HistoryItem[];
}

export interface ProjectFile {
  id: string;
  name: string;
  status: 'accessible' | 'not-accessible';
  type: string;
  content: string;
  size: number;
  mimeType: string;
  url?: string;
  createdAt: Date;
}

interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  addProject: (name: string, description: string) => Project;
  updateProject: (id: string, data: Partial<Project>) => void;
  setCurrentProject: (project: Project | null) => void;
  addProjectHistory: (projectId: string, history: Omit<HistoryItem, 'id' | 'createdAt'>) => void;
  removeProjectHistory: (projectId: string, historyId: string) => void;
  addProjectFile: (projectId: string, file: File) => Promise<void>;
  removeProjectFile: (projectId: string, fileId: string) => void;
  removeProject: (id: string) => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,
      
      addProject: (name: string, description: string) => {
        const newProject = {
          id: generateId(),
          name,
          description,
          slug: generateSlug(name),
          files: [],
          histories: [],
          instructions: "",
          createdAt: new Date(),
        };

        set((state) => ({
          projects: [...state.projects, newProject],
          currentProject: newProject,
        }));

        return newProject;
      },

      updateProject: (id, data) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
          currentProject: state.currentProject?.id === id 
            ? { ...state.currentProject, ...data }
            : state.currentProject,
        }));
      },

      setCurrentProject: (project) => set({ currentProject: project }),

      addProjectHistory: (projectId, history) => {
        const newHistory = {
          ...history,
          id: crypto.randomUUID(),
          timestamp: new Date(),
          message: history.message || ''
        };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, histories: [newHistory, ...p.histories] }
              : p
          ),
          currentProject: state.currentProject?.id === projectId
            ? { ...state.currentProject, histories: [newHistory, ...state.currentProject.histories] }
            : state.currentProject,
        }));
      },

      removeProjectHistory: (projectId, historyId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, histories: p.histories.filter((h) => h.id !== historyId) }
              : p
          ),
          currentProject: state.currentProject?.id === projectId
            ? { ...state.currentProject, histories: state.currentProject.histories.filter((h) => h.id !== historyId) }
            : state.currentProject,
        }));
      },

      addProjectFile: async (projectId, file) => {
        try {
          // Convert file to base64 for storage
          const base64Content = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = reader.result as string;
              resolve(base64);
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          });

          // Only create and add the file after successful conversion
          const newFile: ProjectFile = {
            id: crypto.randomUUID(),
            name: file.name,
            status: 'accessible',
            type: 'file',
            content: base64Content,
            size: file.size,
            mimeType: file.type,
            createdAt: new Date(),
          };

          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === projectId
                ? { ...p, files: [...p.files, newFile] }
                : p
            ),
            currentProject: state.currentProject?.id === projectId
              ? { ...state.currentProject, files: [...state.currentProject.files, newFile] }
              : state.currentProject,
          }));

          return newFile;
        } catch (error) {
          throw new Error('Failed to process file: ' + (error as Error).message);
        }
      },

      removeProjectFile: (projectId, fileId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, files: p.files.filter((f) => f.id !== fileId) }
              : p
          ),
          currentProject: state.currentProject?.id === projectId
            ? { ...state.currentProject, files: state.currentProject.files.filter((f) => f.id !== fileId) }
            : state.currentProject,
        }));
      },

      removeProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject,
        }));
      },
    }),
    {
      name: 'project-storage',
    }
  )
);