import { LucideProps } from "lucide-react";

export type Benchmark = {
  name: string;
  score: number;
  maxScore: number;
};

export type UseCase = {
  title: string;
  description: string;
};

export type TechnicalSpecs = {
  modelSize?: string;
  contextWindow?: string;
  trainingData?: string;
  architecture?: string;
  parameters?: string;
  [key: string]: string | undefined;
};

export type ModelDetails = {
  id: string;
  name: string;
  provider: string;
  version: string;
  type: string;
  releaseDate: string;
  image: string;
  description: string;
  capabilities: string[];
  technicalSpecs: TechnicalSpecs;
  benchmarks: Benchmark[];
  useCases: UseCase[];
  limitations: string[];
};

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  status: 'loading' | 'ready' | 'error';
  progress?: number;
}


export interface ChatThread {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  modelResponses: ModelResponse[];
}

export interface ModelResponse {
  id: string;
  modelId: string;
  content: string;
  status: 'loading' | 'complete' | 'error';
  parentMessageId: string;
  timestamp: Date;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  readingTime: string;
}

export interface Section {
  title: string;
  articles: Article[];
}

export interface HelpCategory {
  id: string;
  iconName: IconName;
  title: string;
  description: string;
  sections: Section[];
}

export type IconName = 
| "Settings"
| "BriefcaseBusiness"
| "Code"
| "MessageCircleMore"
| "FolderCog"
| "Users"
| "Building2"
| "AlertTriangle"
| "Clock"
| "ChevronRight"
| "Search"
| "ArrowLeft"
| "ThumbsUp"
| "ThumbsDown"

export type CategoryKeys = 
  | "3943089-account-login-and-billing"
  | "6864268-privacy-and-policies"
  | "3675931-api"
  | "3742473-alle-ai"
  | "7835004-alle-ai-custom"
  | "5688074-alle-ai-teams"
  | "11106745-alle-ai-enterprise";

export type HelpCategories = {
  [K in CategoryKeys]: HelpCategory;
};

export interface Transaction {
  id: string;
  type: 'subscription' | 'referral' | 'refund';
  amount: number;
  mode: 'platform' | 'card';
  status: 'completed' | 'pending' | 'failed';
  plan?: string;
  date: Date;
  cardLast4?: string;
  description: string;
  paymentMethod?: string;
}

export interface Source {
  url: string;
  title: string;
  type: 'wikipedia' | 'encyclopedia' | 'nba' | 'espn' | 'biography' | 'other';
  description: string;
  img?: string;
}

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'feature' | 'security' | 'update' | 'alert' | 'info';
  priority?: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionLabel?: string;
  icon?: string;
  metadata?: {
    category?: string;
    tags?: string[];
    relatedFeature?: string;
  };
};