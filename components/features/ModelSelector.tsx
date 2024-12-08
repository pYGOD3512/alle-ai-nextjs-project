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
          className="flex flex-col items-start px-2 py-4 md:p-2 h-auto space-y-0 md:space-y-2 w-full"
          onClick={() => onSelect(model.id)}
        >
          <p className="hidden md:flex text-xs text-left text-muted-foreground line-clamp-2 mb-auto">
            {model.preview}
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-0 md:mt-2 w-full whitespace-nowrap overflow-auto scrollbar-none">
            <Image
              src={model.icon}
              alt={model.name}
              width={16}
              height={16}
              className="rounded-full h-6 w-6 md:h-4 md:w-4"
            />
            <span className="hidden sm:flex text-xs font-medium">{model.name}</span>
          </div>
        </Button>
      ))}
    </div>
  );
}