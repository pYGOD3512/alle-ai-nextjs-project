'use client';

import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Model } from '@/lib/api/models';

interface ModelSelectorProps {
  models: Model[];
  activeModel: string;
  onSelect: (modelId: string) => void;
}

export function ModelSelector({ models, activeModel, onSelect }: ModelSelectorProps) {
  return (
    <div className="grid grid-cols-auto-fit gap-2 w-full mx-auto">
      {models.map((model) => (
        <Button
          key={model.model_uid}
          variant={activeModel === model.model_uid ? "active" : "outline"}
          className="flex flex-col items-start px-2 py-4 md:p-2 h-auto space-y-0 md:space-y-2 w-full"
          onClick={() => onSelect(model.model_uid)}
        >
          <p className="hidden md:flex text-xs text-left text-muted-foreground line-clamp-2 mb-auto">
            {model.response ? model.response.substring(0, 30) + '...' : 'No preview available'}
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-0 md:mt-2 w-full whitespace-nowrap overflow-auto scrollbar-none">
            <Image
              src={model.model_image}
              alt={model.model_name}
              width={16}
              height={16}
              className="rounded-full h-6 w-6 md:h-4 md:w-4"
            />
            <span className="hidden sm:flex text-xs font-medium">{model.model_name}</span>
          </div>
        </Button>
      ))}
    </div>
  );
}