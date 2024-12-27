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