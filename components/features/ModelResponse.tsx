'use client';

import { Card } from "@/components/ui/card";
import { Bot } from 'lucide-react';
import Image from 'next/image';


interface ModelResponseProps {
  model: string;
  content: string;
  model_img: string;
}

export function ModelResponse({model_img, model, content }: ModelResponseProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
          <Image className="rounded-full" src={model_img} alt={model} width={24} height={24} />
        </div>
        <span className="font-medium text-sm">{model}</span>
      </div>
      <p className="text-sm text-muted-foreground">{content}</p>
    </Card>
  );
}