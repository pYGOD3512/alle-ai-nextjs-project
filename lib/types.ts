export interface Model {
  id: string
  name: string
  provider: string
  description: string
  image: string
  type: "chat" | "image"
}

export interface ModelDetails extends Model {
  version: string
  releaseDate: string
  capabilities: string[]
  technicalSpecs: {
    parameters?: string
    resolution?: string
    contextWindow?: string
    inputCost?: string
    outputCost?: string
    trainingData?: string
    architecture?: string
  }
  benchmarks: {
    name: string
    score: number
    maxScore: number
  }[]
  useCases: {
    title: string
    description: string
  }[]
  limitations: string[]
}