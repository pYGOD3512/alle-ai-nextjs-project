'use client';

import { Button } from "@/components/ui/button";
import Image from 'next/image';

interface Model {
  id: string;
  name: string;
  icon: string;
  preview: string;
}

interface ModelSelectorProps {
  models: Model[];
  activeModel: string;
  onSelect: (modelId: string) => void;
}

export function ModelSelector({ models, activeModel, onSelect }: ModelSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-4 max-w-[90%] mx-auto">
      {models.map((model) => (
        <Button
          key={model.id}
          variant={activeModel === model.id ? "secondary" : "outline"}
          className="flex flex-col items-start p-4 h-auto space-y-2 w-full"
          onClick={() => onSelect(model.id)}
        >
          <p className="text-xs text-left text-muted-foreground line-clamp-2 mb-auto">
            {model.preview}
          </p>
          <div className="flex gap-2 mt-2 w-full overflow-hidden whitespace-nowrap">
            <Image
              src={model.icon}
              alt={model.name}
              width={16}
              height={16}
              className="rounded-full"
            />
            <span className="text-xs font-medium">{model.name}</span>
          </div>
        </Button>
      ))}
    </div>
  );
}