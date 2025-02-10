import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Folder, Pencil, FileText, Settings, FilePlus2, MessageSquare, Check, Loader2, MessagesSquare } from "lucide-react";
import { ChatInput } from "@/components/features/ChatInput";
import { ProjectFilesModal, ProjectInstructionsModal } from "@/components/ui/modals";
import { useProjectStore } from "@/stores";
import { Badge } from "@/components/ui/badge";

const FileAvatars = ({ files }: { files: any[] }) => {
  const maxVisible = 3;
  const remainingCount = files.length - maxVisible;
  const visibleFiles = files.slice(0, maxVisible);

  return (
    <div className="flex items-center">
      <div className="flex -space-x-3">
        {visibleFiles.map((file, index) => (
          <div
            key={file.id}
            className="h-6 w-6 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center"
            style={{ zIndex: maxVisible - index }}
          >
            <FileText className="h-3 w-3 text-primary" />
          </div>
        ))}
        {remainingCount > 0 && (
          <div 
            className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium ml-1"
          >
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  );
};

export function ProjectView() {
  const { currentProject, updateProject } = useProjectStore();
  
  // State handlers
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [filesModalOpen, setFilesModalOpen] = React.useState(false);
  const [instructionsModalOpen, setInstructionsModalOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [projectName, setProjectName] = React.useState(currentProject?.name || "");
  const [isRenamingLoading, setIsRenamingLoading] = useState(false);

  // Early return if no project is selected
  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-lg font-medium">No project selected</h2>
          <p className="text-sm text-muted-foreground">Select a project to get started</p>
        </div>
      </div>
    );
  }

  // Handle project name edit
  const handleNameEdit = async () => {
    if (isEditing) {
      if (!currentProject?.id) {
        return; 
      }

      if (projectName.trim() && projectName !== currentProject.name) {
        setIsRenamingLoading(true);
        
        // Simulate loading
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        updateProject(currentProject.id, { name: projectName.trim() });
        setIsRenamingLoading(false);
      } else {
        setProjectName(currentProject.name || "");
      }
    }
    setIsEditing(!isEditing);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setProjectName(currentProject?.name || "");
    }
  };

  const handleSend = () => {
    // TODO: Implement send logic
    console.log("Sending message:", inputValue);
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-[400px] text-center p-8">
      <div className="rounded-full bg-primary/10 p-3 mb-4">
        <MessagesSquare className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-semibold mb-2">No history available</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Start a new conversation by typing a message below.
      </p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted p-3 rounded-lg">
        <div className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          <span>{currentProject.files?.length || 0} file(s) in project</span>
        </div>
        <span className="text-border">•</span>
        <div className="flex items-center gap-1.5">
          <Settings className="h-3.5 w-3.5" />
          <span>
            {currentProject.instructions 
              ? "Instructions added" 
              : "No instructions"}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto px-4 py-6">
      {/* Project Header with Title and Actions */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10">
            <Folder className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="text-xl font-semibold bg-transparent border-b border-primary outline-none focus:ring-0 px-0"
                />
              ) : (
                <h1 className="text-xl font-semibold">{currentProject.name}</h1>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={handleNameEdit}
                disabled={isRenamingLoading}
              >
                {isEditing ? (
                  isRenamingLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )
                ) : (
                  <Pencil className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentProject.description || "Your project workspace for organized conversations"}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Button 
          variant="outline" 
          size="lg" 
          className="h-auto py-4 px-6"
          onClick={() => setFilesModalOpen(true)}
        >
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span className="font-medium">Project Files</span>
              {currentProject.files && currentProject.files.length > 0 ? (
                <div className="flex items-center gap-2">
                  <FileAvatars files={currentProject.files} />
                  {/* <Badge variant="secondary">{currentProject.files.length}</Badge> */}
                </div>
              ) : (
                <Badge variant="secondary">0</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Add documents, code, or any files that models can reference
            </p>
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          size="lg"
          className="h-auto py-4 px-6"
          onClick={() => setInstructionsModalOpen(true)}
        >
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <span className="font-medium">Instructions</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {currentProject.instructions 
                ? currentProject.instructions
                : "Set custom instructions for how you want your response"}
            </p>
          </div>
        </Button>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col space-y-6">
        {/* Chat History Section */}
        <div className="flex-1 space-y-4">
          {/* <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-medium">Chats</h2>
          </div> */}

          {currentProject.histories && currentProject.histories.length > 0 ? (
            <div className="space-y-3">
              {/* Your existing chat history items */}
              {currentProject.histories.map((chat, index) => (
                <div 
                  key={chat.id || index}
                  className="group p-4 rounded-lg border border-border hover:border-primary/50 bg-background/50 hover:bg-accent/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium truncate">{chat.title}</h3>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {chat.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        {/* New Chat Input Section */}
        <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm pt-4">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSend}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProjectFilesModal
        isOpen={filesModalOpen}
        onClose={() => setFilesModalOpen(false)}
        projectName={currentProject.name}
      />

      <ProjectInstructionsModal
        isOpen={instructionsModalOpen}
        onClose={() => setInstructionsModalOpen(false)}
        projectName={currentProject.name}
      />
    </div>
  );
}
