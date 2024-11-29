'use client';

import { Card } from "@/components/ui/card";
import Image from 'next/image';
import { Bot } from 'lucide-react';

interface ComparisonCard {
  model: string;
  content: string;
  icon?: string;
}

export function ModelComparison() {
  const comparisons: ComparisonCard[] = [
    {
      model: 'GPT-4o',
      content: 'Making one million dollars in just five days is an extremely ambitious goal...',
    },
    {
      model: 'Claude 3.5 Sonnet',
      content: 'Making $1 million in just 5 days is...',
    },
    {
      model: 'Gemini 1.5 Pro',
      content: 'Making a million dollars in 5 days is...',
    },
    {
      model: 'Llama 3 70B Instruct',
      content: 'The elusive goal of making $1 million in...',
    },
    {
      model: 'ChatGPT',
      content: 'Making $1 million in just 5 days is an...',
    }
  ];

  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {comparisons.map((card, index) => (
        <Card key={index} className="flex-shrink-0 w-[280px] p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <span className="font-medium">{card.model}</span>
          </div>
          <p className="text-sm text-muted-foreground">{card.content}</p>
        </Card>
      ))}
    </div>
  );
}