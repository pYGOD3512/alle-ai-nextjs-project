import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ModelDetails } from "@/lib/types"

export function ModelCard({ model }: { model: ModelDetails }) {
  return (
    <Link href={`/model-glossary/models/${model.id}`}>
      <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-lg overflow-hidden relative">
            <Image
              src={model.image}
              alt={model.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <CardTitle className="text-lg">{model.name}</CardTitle>
            <CardDescription>{model.provider}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{model.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}