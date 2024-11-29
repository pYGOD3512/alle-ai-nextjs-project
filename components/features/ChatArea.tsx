'use client';

import { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModelSelector } from './ModelSelector';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ModelResponse } from './ModelResponse';
import { useSidebarStore } from '@/lib/stores/sidebar-store';

const MODELS = [
  {
    id: 'gpt4',
    name: 'GPT-4o',
    icon: '/models/gpt-4o.png',
    preview: 'Making one million dollars in just five...'
  },
  {
    id: 'claude',
    name: 'Claude 3.5 Sonnet',
    icon: '/models/claude-3.png',
    preview: 'Making $1 million in just 5 days is...'
  },
  {
    id: 'gemini',
    name: 'Gemini 1.5 Pro',
    icon: '/models/gemini.png',
    preview: 'Making a million dollars in 5 days is...'
  },
  {
    id: 'llama',
    name: 'Llama 3 70B Instruct',
    icon: '/models/meta.png',
    preview: 'The elusive goal of making $1 million in...'
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: '/models/gpt-3-5.png',
    preview: 'Making $1 million in just 5 days is an...'
  }
];

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  responses?: {
    model: string;
    content: string;
    icon: string;
  }[];
}

export function ChatArea() {
  const { isOpen } = useSidebarStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'How do I make 1 million dollars in 5 days?',
      sender: 'user',
      timestamp: new Date(),
      responses: [
        {
          model: 'GPT-4o',
          content: 'Making one million dollars in just five days is an extremely ambitious goal...',
          icon: '/models/gpt-4o.png',
        },
        {
          model: 'Claude 3.5 Sonnet',
          content: 'Making $1 million in just 5 days requires careful consideration...',
          icon: '/models/claude-3.png',
        },
        {
          model: 'Gemini 1.5 Pro',
          content: 'While achieving this goal is challenging, here are some potential approaches...',
          icon: '/models/gemini.png',
        },
        {
          model: 'Llama 3 70B Instruct',
          content: 'This is a complex goal that requires analyzing multiple factors...',
          icon: '/models/meta.png',
        },
        {
          model: 'ChatGPT',
          content: 'Let me break down the possibilities and challenges...',
          icon: '/models/gpt-3-5.png',
        },
      ],
    }
  ]);
  const [input, setInput] = useState('');
  const [activeModel, setActiveModel] = useState('gpt4');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      responses: [
        {
          model: 'GPT-4o',
          content: 'Sample response from GPT-4o...',
          icon: '/models/gpt-4o.png',
        },
      ],
    };
    
    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-3.5rem)] transition-all duration-300 ${
      isOpen ? 'pl-60' : 'pl-16'
    }`}>
      <ScrollArea className="flex-1">
        <div className="max-w-5xl mt-4 mx-auto px-4">
          {messages.map((message) => (
            <div key={message.id} className="mb-8">
              <ChatMessage
                content={message.content}
                sender={message.sender}
                timestamp={message.timestamp}
              />
              {message.responses && (
                <div className="mt-4">
                  <ModelSelector
                    models={MODELS}
                    activeModel={activeModel}
                    onSelect={setActiveModel}
                  />
                  <div className="mt-4">
                    <ModelResponse
                      model={MODELS.find(m => m.id === activeModel)?.name || ''}
                      content={message.responses.find(r => r.model === MODELS.find(m => m.id === activeModel)?.name)?.content || ''}
                      model_img={MODELS.find(m => m.id === activeModel)?.icon || ''}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
      />
    </div>
  );
}