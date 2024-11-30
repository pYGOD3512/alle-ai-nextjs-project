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
    <Card className="bg-transparent border-none shadow-none p-4">
      <div className="flex items-start gap-4 mb-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center">
          <Image className="rounded-full" src={model_img} alt={model} width={32} height={32} />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-sm mb-3">{model}</span>
          <p className="text-sm text-muted-foreground">{content}</p>
        </div>
      </div>
    </Card>
  );
}