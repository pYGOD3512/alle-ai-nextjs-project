import { ModelDetails } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"

interface RelatedModelsProps {
  currentModelId: string
  provider: string
  models: ModelDetails[]
}

export function RelatedModels({ currentModelId, provider, models }: RelatedModelsProps) {
  const relatedModels = models
    .filter(model => model.provider === provider && model.id !== currentModelId)
    .slice(0, 4)

  if (relatedModels.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-6">Other Models from {provider}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedModels.map((model) => (
          <Link key={model.id} href={`/model-glossary/models/${model.id}`}>
            <div className="flex flex-col items-center text-center p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
              <div className="w-12 h-12 rounded-lg overflow-hidden relative bg-muted mb-3">
                <Image
                  src={model.image}
                  alt={model.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-medium text-sm">{model.name}</h3>
              <p className="text-xs text-muted-foreground">{model.provider}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
