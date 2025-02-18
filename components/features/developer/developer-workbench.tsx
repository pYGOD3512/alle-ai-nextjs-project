"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Play, Copy, Terminal, FileJson, Code2, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function Workbench() {
  const [selectedLanguage, setSelectedLanguage] = useState("curl");
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  
  const codeExamples = {
    curl: `curl -X POST https://api.alle.ai/v1/chat/completions \\
  --header "accept: application/json" \\
  --header "content-type: application/json" \\
  --header "x-api-key: your-api-key" \\
  --data '{
    "query": "${query || "Hello"}"
  }'`,
    python: `import requests

headers = {
    "accept": "application/json",
    "content-type": "application/json",
    "x-api-key": "your-api-key"
}

data = {
    "query": "${query || "Hello"}"
}

response = requests.post(
    "https://api.alle.ai/v1/chat/completions",
    headers=headers,
    json=data
)`,
    javascript: `const response = await fetch("https://api.alle.ai/v1/chat/completions", {
    method: "POST",
    headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "x-api-key": "your-api-key"
    },
    body: JSON.stringify({
        query: "${query || "Hello"}"
    })
});`
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Left Panel - Query Input */}
      <div className="w-[400px] p-6 border-r border-borderColorPrimary">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Search</h2>
            <p className="text-sm text-muted-foreground mb-4">(return results and their contents)</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Query</label>
                <Textarea 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your query here..."
                  className="h-32 resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Select defaultValue="example1">
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Try an example..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="example1">Example 1</SelectItem>
                    <SelectItem value="example2">Example 2</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="bg-primary">
                  <Play className="h-4 w-4 mr-2" />
                  Run
                </Button>
                <Button variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="search">
            <TabsList className="w-full">
              <TabsTrigger value="search" className="flex-1">Search</TabsTrigger>
              <TabsTrigger value="filters" className="flex-1">Filters</TabsTrigger>
              <TabsTrigger value="crawling" className="flex-1">Crawling</TabsTrigger>
            </TabsList>
            <TabsContent value="search" className="mt-4">
              {/* Search options */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search Type</label>
                  <Select defaultValue="auto">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="neural">Neural</SelectItem>
                      <SelectItem value="keyword">Keyword</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Add more search options */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Panel - Code & Response */}
      <div className="flex-1 flex flex-col">
        <div className="border-b border-borderColorPrimary">
          <div className="px-6 py-4">
            <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <TabsList>
                <TabsTrigger value="python">
                  <Terminal className="h-4 w-4 mr-2" />
                  Python
                </TabsTrigger>
                <TabsTrigger value="javascript">
                  <Code2 className="h-4 w-4 mr-2" />
                  JavaScript
                </TabsTrigger>
                <TabsTrigger value="curl">
                  <Terminal className="h-4 w-4 mr-2" />
                  curl
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="bg-backgroundSecondary p-6 relative">
            <pre className="text-sm font-mono">
              <code>{codeExamples[selectedLanguage as keyof typeof codeExamples]}</code>
            </pre>
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => {
                navigator.clipboard.writeText(codeExamples[selectedLanguage as keyof typeof codeExamples])
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">RESPONSE</h3>
            <Button variant="ghost" size="icon">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <Card className="bg-backgroundSecondary h-[calc(100%-2rem)]">
            <pre className="p-4 text-sm font-mono">
              <code>{response || "Response will appear here..."}</code>
            </pre>
          </Card>
        </div>
      </div>
    </div>
  );
}