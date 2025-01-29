"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { Play, Copy, Terminal, FileJson, Code2, X, FileText, Image, FileType, Maximize2, Loader2, Download } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ExpandableCode } from "@/components/ui/expandable-code";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchSettings {
  webSearch: boolean;
  fileUpload: {
    enabled: boolean;
    type: 'pdf' | 'image' | 'docx' | 'text' | null;
  };
  analysisMode: {
    summary: boolean;
    comparison: boolean;
  };
  highlightContent: boolean;
  additionalNotes: boolean;
}

interface UploadedFile {
  file: File;
  preview: string;
  type: string;
}

const downloadAsFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const ResponsePlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 text-center">
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
        <div className="relative flex items-center justify-center w-12 h-12 bg-primary/5 rounded-full">
          <Terminal className="w-6 h-6 text-primary/60" />
        </div>
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        Ready to Process
      </h3>
      <p className="text-xs text-muted-foreground/60 max-w-[200px]">
        Click Run to see the response
      </p>
    </div>
  );
};

export function Workbench() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("curl");
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [modelsOpen, setModelsOpen] = useState(false);
  const [searchSettings, setSearchSettings] = useState<SearchSettings>({
    webSearch: true,
    fileUpload: {
      enabled: false,
      type: null,
    },
    analysisMode: {
      summary: false,
      comparison: false,
    },
    highlightContent: false,
    additionalNotes: false,
  });
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  
  const examples = {
    example1: "Write a blog post about artificial intelligence and its impact on healthcare in the next decade.",
    example2: "Create a comprehensive analysis of renewable energy trends and their economic implications.",
    example3: "Explain quantum computing to a high school student, focusing on practical applications.",
  };

  const handleExampleChange = (value: string) => {
    setQuery(examples[value as keyof typeof examples] || "");
  };

  const generateRequestStructure = () => {
    const structure: any = {};
    
    if (searchSettings.webSearch) {
      structure.web_search_results = {
        requestId: crypto.randomUUID(),
        autopromptString: query,
        resolvedSearchType: "keyword",
        results: []
      };
    }

    if (searchSettings.fileUpload.enabled && searchSettings.fileUpload.type) {
      structure.uploaded_files = [{
        file_name: "example." + searchSettings.fileUpload.type,
        file_type: searchSettings.fileUpload.type,
        file_content: "File content will be processed..."
      }];
    }

    if (searchSettings.highlightContent) {
      structure.highlighted_content = "Content highlights will appear here";
    }

    if (searchSettings.additionalNotes) {
      structure.additional_notes = "Additional notes will be included";
    }

    return structure;
  };

  const handleClear = () => {
    setQuery("");
    setResponse("");
  };

  const handleRun = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResponse(JSON.stringify(generateRequestStructure(), null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const codeExamples = {
    curl: `curl -X POST https://api.alle.ai/v1/chat/completions \\
  --header "accept: application/json" \\
  --header "content-type: application/json" \\
  --header "x-api-key: your-api-key" \\
  --data '${JSON.stringify({ query, ...generateRequestStructure() }, null, 2)}'`,
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

  const models = [
    {
      category: "Chat",
      items: [
        { id: 'claude-3-opus', name: 'claude-3-opus-20240229' },
        { id: 'claude-3-sonnet', name: 'claude-3-sonnet-20240229' },
        { id: 'claude-3-haiku', name: 'claude-3-haiku-20240229' },
      ]
    },
    {
      category: "Image",
      items: [
        { id: 'claude-2.1', name: 'claude-2.1' },
        { id: 'claude-2.0', name: 'claude-2.0' },
      ]
    },
    {
      category: "Audio",
      items: [
        { id: 'claude-2.1', name: 'claude-2.1' },
        { id: 'claude-2.0', name: 'claude-2.0' },
      ]
    },
    {
      category: "Video",
      items: [
        { id: 'claude-2.1', name: 'claude-2.1' },
        { id: 'claude-2.0', name: 'claude-2.0' },
      ]
    }
  ];

  // File type options
  const fileTypes = [
    { 
      value: 'pdf', 
      label: 'PDF Document', 
      icon: FileText,
      accept: '.pdf'
    },
    { 
      value: 'image', 
      label: 'Image File', 
      icon: Image,
      accept: '.jpg,.jpeg,.png,.gif,.webp'
    },
    { 
      value: 'docx', 
      label: 'Word Document', 
      icon: FileType,
      accept: '.doc,.docx'
    },
    { 
      value: 'text', 
      label: 'Text File', 
      icon: FileText,
      accept: '.txt,.md,.rtf'
    }
  ];

  // Update the handleFileUpload function
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile({
      file,
      type: file.type,
      preview: '' // We won't use this anymore
    });
  };

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (uploadedFile?.preview && uploadedFile.preview.startsWith('blob:')) {
        URL.revokeObjectURL(uploadedFile.preview);
      }
    };
  }, [uploadedFile]);

  // Add useEffect to handle file input click after state update
  useEffect(() => {
    if (searchSettings.fileUpload.type) {
      document.getElementById('file-upload')?.click();
    }
  }, [searchSettings.fileUpload.type]);

  // Add this function to handle the download
  const handleDownload = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `response-${timestamp}.txt`;
    downloadAsFile(response, filename);
  };

  // Add this function to handle code examples download
  const handleCodeDownload = (language: string) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${language}-example-${timestamp}.${language === 'javascript' ? 'js' : language}`;
    downloadAsFile(codeExamples[language as keyof typeof codeExamples], filename);
  };

  return (
    <PanelGroup direction="horizontal">
      {/* Left Panel - Query Input */}
      <Panel defaultSize={35} minSize={30}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-[calc(100vh-3.5rem)] border-r border-borderColorPrimary overflow-hidden"
        >
          <div className="p-6 space-y-6">
            {/* Modern Header */}
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="space-y-2 flex gap-2"
            >
              <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Search
              </h2>
              {/* <p className="text-sm text-muted-foreground">Return results and their contents</p> */}
            </motion.div>

            {/* Query Section */}
            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="space-y-3"
            >
              <div className="relative">
                <Textarea 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Input a query"
                  className="h-40 resize-none border-borderColorPrimary bg-backgroundSecondary/30 focus-visible:outline-none rounded-xl pr-16"
                />
                
                {uploadedFile && (
                  <div className="absolute right-3 top-3">
                    <Card className="w-10 h-10 relative flex items-center justify-center border-borderColorPrimary bg-backgroundSecondary/50 backdrop-blur-sm group">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-5 w-5 bg-background border border-borderColorPrimary opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setUploadedFile(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      {/* Show icon based on file type */}
                      {(() => {
                        const FileIcon = fileTypes.find(
                          type => type.accept.split(',').some(ext => 
                            uploadedFile.file.name.toLowerCase().endsWith(ext.replace('.', ''))
                          )
                        )?.icon || FileText;
                        return <FileIcon className="h-5 w-5 text-primary/60" />;
                      })()}
                    </Card>
                    <div className="absolute top-12 right-0">
                      <span className="text-xs text-muted-foreground max-w-[80px] truncate block text-right">
                        {uploadedFile.file.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Select onValueChange={handleExampleChange}>
                  <SelectTrigger className="w-[200px] border-borderColorPrimary bg-backgroundSecondary/30 rounded-lg">
                    <SelectValue placeholder="Try an example..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="example1">Healthcare AI Analysis</SelectItem>
                    <SelectItem value="example2">Renewable Energy Trends</SelectItem>
                    <SelectItem value="example3">Quantum Computing Explained</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  className="bg-primary hover:bg-primary/90 rounded-lg"
                  onClick={handleRun}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {!isLoading && "Run"}
                </Button>
                <Button 
                  variant="outline" 
                  className="border-borderColorPrimary rounded-lg"
                  onClick={handleClear}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </motion.div>

            {/* Configuration Tabs */}
            <Tabs defaultValue="search" className="w-full">
              <TabsList className="w-full bg-backgroundSecondary/30 p-1 rounded-xl">
                <TabsTrigger value="search" className="rounded-lg">Search</TabsTrigger>
                <TabsTrigger value="files" className="rounded-lg">Files</TabsTrigger>
                <TabsTrigger value="filters" className="rounded-lg">Filters</TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="m-0">
                {/* Model Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Models</h3>
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Badge 
                        variant="outline" 
                        className="bg-primary/10 text-primary border-0 px-3 py-1"
                      >
                        {selectedModels.map(id => 
                          models.flatMap(g => g.items).find(m => m.id === id)?.name
                        ).join(", ") || "No models selected"}
                      </Badge>
                    </motion.div>
                  </div>

                  <Popover open={modelsOpen} onOpenChange={setModelsOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={modelsOpen}
                        className="w-full justify-between border-borderColorPrimary bg-backgroundSecondary/30"
                      >
                        <span className="text-sm font-mono">
                          {selectedModels.length === 0
                            ? "Select models..."
                            : selectedModels.join(", ")}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0 border border-borderColorPrimary" align="start">
                      <Command>
                        <ScrollArea className="h-[300px] bg-backgroundSecondary">
                          {models.map((group) => (
                            <CommandGroup key={group.category} heading={group.category}>
                              {group.items.map((model) => (
                                <CommandItem
                                  key={model.id}
                                  onSelect={() => {
                                    setSelectedModels(prev =>
                                      prev.includes(model.id)
                                        ? prev.filter(id => id !== model.id)
                                        : [...prev, model.id]
                                    );
                                  }}
                                  className="flex items-center justify-between py-2 font-mono"
                                >
                                  <span>{model.name}</span>
                                  <Check
                                    className={cn(
                                      "h-4 w-4",
                                      selectedModels.includes(model.id) ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          ))}
                        </ScrollArea>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Features Card */}
                <ScrollArea className="h-[calc(100vh-32rem)] mt-4 pr-4 bg-backgroundSecondary rounded-xl border border-borderColorPrimary">
                  <Card className="bg-transparent border-none p-4 space-y-4 shadow-sm">
                    {/* Web Search */}
                    <div className="flex items-center justify-between p-2 hover:bg-backgroundSecondary/30 rounded-lg transition-colors">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Web Search</label>
                        <p className="text-xs text-muted-foreground">
                          Enable web search results in response
                        </p>
                      </div>
                      <Switch
                        checked={searchSettings.webSearch}
                        onCheckedChange={(checked) =>
                          setSearchSettings(prev => ({ ...prev, webSearch: checked }))
                        }
                      />
                    </div>

                    {/* File Upload Section */}
                    <div className="flex items-center justify-between p-2 hover:bg-backgroundSecondary/30 rounded-lg transition-colors">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Upload file</label>
                        <p className="text-xs text-muted-foreground">
                          Process and analyze file content
                        </p>
                      </div>
                      <Switch
                        checked={searchSettings.fileUpload.enabled}
                        onCheckedChange={(checked) =>
                          setSearchSettings(prev => ({
                            ...prev,
                            fileUpload: { ...prev.fileUpload, enabled: checked }
                          }))
                        }
                      />
                    </div>

                    {searchSettings.fileUpload.enabled && (
                      <div className="pl-4 border-l-2 border-primary/20">
                        <div className="space-y-2">
                          <Select
                            value={searchSettings.fileUpload.type || undefined}
                            onValueChange={(value: any) => {
                              setSearchSettings(prev => ({
                                ...prev,
                                fileUpload: { ...prev.fileUpload, type: value }
                              }));
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select file type..." />
                            </SelectTrigger>
                            <SelectContent>
                              {fileTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex items-center">
                                    <type.icon className="h-4 w-4 mr-2" />
                                    {type.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept={fileTypes.find(type => type.value === searchSettings.fileUpload.type)?.accept}
                            onChange={handleFileUpload}
                          />
                        </div>
                      </div>
                    )}

                    {/* Analysis Modes */}
                    <div className="space-y-4">
                      {/* Summary Mode */}
                      <div className="flex items-center justify-between p-2 hover:bg-backgroundSecondary/30 rounded-lg transition-colors">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">Summary Mode</label>
                          <p className="text-xs text-muted-foreground">
                            Generate a concise summary of the content
                          </p>
                        </div>
                        <Switch
                          checked={searchSettings.analysisMode.summary}
                          onCheckedChange={(checked) =>
                            setSearchSettings(prev => ({
                              ...prev,
                              analysisMode: { ...prev.analysisMode, summary: checked }
                            }))
                          }
                        />
                      </div>

                      {/* Comparison Mode */}
                      <div className="flex items-center justify-between p-2 hover:bg-backgroundSecondary/30 rounded-lg transition-colors">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">Comparison Mode</label>
                          <p className="text-xs text-muted-foreground">
                            Compare content with other sources
                          </p>
                        </div>
                        <Switch
                          checked={searchSettings.analysisMode.comparison}
                          onCheckedChange={(checked) =>
                            setSearchSettings(prev => ({
                              ...prev,
                              analysisMode: { ...prev.analysisMode, comparison: checked }
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Highlight Content */}
                    <div className="flex items-center justify-between p-2 hover:bg-backgroundSecondary/30 rounded-lg transition-colors">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Content Highlighting</label>
                        <p className="text-xs text-muted-foreground">
                          Include highlighted content from previous messages
                        </p>
                      </div>
                      <Switch
                        checked={searchSettings.highlightContent}
                        onCheckedChange={(checked) =>
                          setSearchSettings(prev => ({ ...prev, highlightContent: checked }))
                        }
                      />
                    </div>

                    {/* Additional Notes */}
                    <div className="flex items-center justify-between p-2 hover:bg-backgroundSecondary/30 rounded-lg transition-colors">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Additional Notes</label>
                        <p className="text-xs text-muted-foreground">
                          Include supplementary information in response
                        </p>
                      </div>
                      <Switch
                        checked={searchSettings.additionalNotes}
                        onCheckedChange={(checked) =>
                          setSearchSettings(prev => ({ ...prev, additionalNotes: checked }))
                        }
                      />
                    </div>
                  </Card>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </Panel>

      <PanelResizeHandle className="w-px hover:w-1 bg-borderColorPrimary hover:bg-primary/50 transition-all" />

      {/* Right Panel - Code & Response */}
      <Panel>
        <div className="flex-1 flex flex-col h-[calc(100vh-10rem)] border-borderColorPrimary">
          {/* Code Examples Section */}
          <div className="border-b border-borderColorPrimary">
            <div className="px-6 py-4">
              <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <TabsList className="bg-backgroundSecondary/30">
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
            
            <div className="relative max-w-full rounded-lg overflow-hidden border border-borderColorPrimary bg-secondary/5 mx-6 mb-4">
              {/* Language label and controls */}
              <div className="flex items-center justify-between px-4 py-2 bg-backgroundSecondary">
                <span className="text-xs font-medium text-muted-foreground">
                  {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      navigator.clipboard.writeText(codeExamples[selectedLanguage as keyof typeof codeExamples]);
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => handleCodeDownload(selectedLanguage)}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Code content with ScrollArea */}
              <ScrollArea className="h-[300px]">
                <div className="p-4">
                  <ExpandableCode 
                    content={codeExamples[selectedLanguage as keyof typeof codeExamples]}
                    language={selectedLanguage}
                  />
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Response Section */}
          <div className="flex-1 p-6">
            <div className="relative max-w-full rounded-lg overflow-hidden border border-borderColorPrimary bg-secondary/5">
              {/* Response label and controls */}
              <div className="flex items-center justify-between px-4 py-2 bg-backgroundSecondary">
                <span className="text-xs font-medium text-muted-foreground">
                  Response
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      navigator.clipboard.writeText(response);
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={handleDownload}
                    disabled={!response}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Response content with ScrollArea */}
              <ScrollArea className="h-[calc(100vh-35rem)]">
                <div className="p-4">
                  <ExpandableCode 
                    content={response || ""}
                    placeholder={!response && <ResponsePlaceholder />}
                  />
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </Panel>
    </PanelGroup>
  );
}