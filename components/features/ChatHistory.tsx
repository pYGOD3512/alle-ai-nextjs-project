import ChatEntry from "./ChatEntry";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { useHistoryStore } from "@/lib/constants";

interface chatHistoryProps {
  currentType: string;
  historyModalOpen: () => void;
  currentHistory: [];
}
function ChatHistory({
  currentType,
  historyModalOpen,
  currentHistory,
}: chatHistoryProps) {

  
  return (
    <div className="px-4 mt-5">
      <div className="flex justify-between  items-center mx-2 text-xs font-medium text-muted-foreground mb-2">
        <span className="text-black font-bold dark:text-white">{currentType.toUpperCase()} HISTORY</span>
        <Button
          variant={"ghost"}
          size={`icon`}
          className="p-0 h-8 w-8"
          onClick={historyModalOpen}
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1 h-[calc(100vh-40rem)]">
        <div className="space-y-0.5">
          {currentHistory.map((item) => (
            <ChatEntry key={item.id} chat={item} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default ChatHistory;
