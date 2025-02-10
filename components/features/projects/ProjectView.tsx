import React from "react";
import { Button } from "@/components/ui/button";
import { Folder, Pencil, FileText, Settings, FilePlus2 } from "lucide-react";
import { ChatInput } from "@/components/features/ChatInput";
import { ProjectFilesModal, ProjectInstructionsModal } from "@/components/ui/modals";
import { useProjectStore } from "@/stores";

export function ProjectView() {
  const { currentProject } = useProjectStore();
  
  // Chat input handlers
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [filesModalOpen, setFilesModalOpen] = React.useState(false);
  const [instructionsModalOpen, setInstructionsModalOpen] = React.useState(false);

  const handleSend = () => {
    // TODO: Implement send logic
    console.log("Sending message:", inputValue);
  };

  if (!currentProject) {
    return <div>No project selected</div>;
  }

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Project Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Folder className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-xl font-semibold">{currentProject.name}</h1>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* New Chat Input */}
        <div className="px-4 py-3">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            isLoading={isLoading}
          />
        </div>

      {/* Project Actions */}
      <div className="grid grid-cols-2 gap-4">
        <ProjectActionCard
          title="Add files"
          description="Chats in this project can access file content"
          icon={<FileText className="h-5 w-5" />}
          actionIcon={<FilePlus2 className="h-4 w-4" />}
          onClick={() => setFilesModalOpen(true)}
        />
        <ProjectActionCard
          title="Add instructions"
          description="Tailor the way ChatGPT responds in this project"
          icon={<Settings className="h-5 w-5" />}
          actionIcon={<Pencil className="h-4 w-4" />}
          onClick={() => setInstructionsModalOpen(true)}
        />
      </div>

      {/* Chat History */}
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">Chats will show up here</p>
        <div className="mt-4">
          <div className="h-8 w-3/4 bg-muted/30 rounded-md animate-pulse" />
        </div>
      </div>

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

interface ProjectActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionIcon: React.ReactNode;
  onClick?: () => void;
}

function ProjectActionCard({ title, description, icon, actionIcon, onClick }: ProjectActionCardProps) {
  return (
    <div 
      className="group relative rounded-xl border bg-background p-6 hover:shadow-sm transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-primary/10">
            {icon}
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="transition-opacity"
        >
          {actionIcon}
        </Button>
      </div>
    </div>
  );
}