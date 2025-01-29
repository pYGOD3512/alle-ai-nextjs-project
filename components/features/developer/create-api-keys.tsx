"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  User, 
  Building2, 
  Users, 
  Folders,
  CreditCard,
  Gauge,
  Key,
  ShieldCheck,
  ScrollText,
  Lock,
  MoreVertical,
  Copy,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  Pencil,
  Power,
  PowerOff,
  Ban
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger,
  TooltipProvider 
} from "@/components/ui/tooltip";
import { useState } from "react";
import { useApiKeyStore, ApiKey } from "@/stores";
import { CreateApiKeyModal, EditApiKeyModal, PromptModalProps } from "@/components/ui/modals";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PromptModal } from "@/components/ui/modals";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const settingsSections = [
  {
    title: "Organization",
    items: [
      { label: "Profile", href: "/developer/settings/profile", icon: User },
      { label: "Organization", href: "/developer/settings/organization", icon: Building2 },
      { label: "Members", href: "/developer/settings/members", icon: Users },
      { label: "Workspaces", href: "/developer/settings/workspaces", icon: Folders },
    ]
  },
  {
    title: "Billing",
    items: [
      { label: "Billing", href: "/developer/settings/billing", icon: CreditCard },
      { label: "Limits", href: "/developer/settings/limits", icon: Gauge },
    ]
  },
  {
    title: "Security",
    items: [
      { label: "API keys", href: "/developer/settings/api-keys", icon: Key, active: true },
      { label: "Admin keys", href: "/developer/settings/admin-keys", icon: ShieldCheck },
      { label: "Logs", href: "/developer/settings/logs", icon: ScrollText },
      { label: "Privacy", href: "/developer/settings/privacy", icon: Lock },
    ]
  }
];

export function CreateApiKeys() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<{ id: string; name: string } | null>(null);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [promptConfig, setPromptConfig] = useState<PromptModalProps | null>(null);
  const { keys, removeKey, toggleKeyVisibility, toggleKeyStatus } = useApiKeyStore();
  const { toast } = useToast();

  const copyToClipboard = async (text: string, keyName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `API key '${keyName}' copied to clipboard`,
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleDeleteKey = (id: string, name: string) => {
    removeKey(id);
    toast({
      title: "API key deleted",
      description: `'${name}' has been deleted`,
      variant: "default",
    });
  };

  const handleToggleStatus = (key: ApiKey) => {
    const action = key.isDisabled ? 'enable' : 'disable';
    const newPromptConfig: PromptModalProps = {
      isOpen: true,
      onClose: () => setShowPromptModal(false),
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} API Key`,
      message: `Are you sure you want to ${action} the API key "${key.name}"? ${!key.isDisabled ? 'This will prevent the key from being used for any API calls.' : ''}`,
      type: key.isDisabled ? 'info' : 'warning',
      actions: [
        {
          label: "Cancel",
          onClick: () => setShowPromptModal(false),
          variant: "outline"
        },
        {
          label: action.charAt(0).toUpperCase() + action.slice(1),
          onClick: () => {
            toggleKeyStatus(key.id);
            toast({
              title: `API key ${action}d`,
              description: `"${key.name}" has been ${action}d`,
              duration: 2000,
            });
            setShowPromptModal(false);
          },
          variant: key.isDisabled ? "default" : "destructive"
        }
      ]
    };
    
    setPromptConfig(newPromptConfig);
    setShowPromptModal(true);
  };

  return (
    <TooltipProvider>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full"
      >
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-between items-start mb-8"
        >
          <div className="max-w-2xl">
            <h1 className="text-2xl font-semibold text-foreground mb-2">API keys</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Keep your API keys secure - don't commit them to version control or share them in public places.
            </p>
          </div>
          {keys.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Key className="h-4 w-4" />
                Create Key
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {keys.length === 0 ? (
            <Card className="border-borderColorPrimary bg-backgroundSecondary p-12 text-center">
              <div className="mx-auto w-fit p-4 rounded-full bg-primary/10 mb-4">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No API Keys</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Create an API key to integrate with the Alle-AI API.
              </p>
              <Button 
                className="gap-2"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Key className="h-4 w-4" />
                Create API Key
              </Button>
            </Card>
          ) : (
            <Card className="border-borderColorPrimary bg-backgroundSecondary">
              <div className="p-1">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-borderColorPrimary">
                      <TableHead className="text-muted-foreground">NAME</TableHead>
                      <TableHead className="text-muted-foreground">API KEY</TableHead>
                      {/* <TableHead className="text-muted-foreground">WORKSPACE</TableHead> */}
                      <TableHead className="text-muted-foreground">CREATED BY</TableHead>
                      <TableHead className="text-muted-foreground">CREATED AT</TableHead>
                      <TableHead className="text-muted-foreground">LAST USED</TableHead>
                      <TableHead className="text-muted-foreground">COST</TableHead>
                      <TableHead className="text-muted-foreground w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keys.map((key) => (
                      <TableRow key={key.name} className="hover:bg-hoverColorPrimary border-borderColorPrimary">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-foreground",
                              key.isDisabled && "text-muted-foreground line-through"
                            )}>
                              {key.name}
                            </span>
                            {key.isDisabled && (
                              <Ban className="w-4 h-4 text-red-500"/>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-mono">
                              {key.isVisible ? key.key : key.key.replace(/(?<=^.{8}).*(?=.{4}$)/g, '•'.repeat(12))}
                            </span>
                            <div className="flex items-center gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => toggleKeyVisibility(key.id)}
                                  >
                                    {key.isVisible ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {key.isVisible ? 'Hide API key' : 'Show API key'}
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => copyToClipboard(key.key, key.name)}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Copy API key</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </TableCell>
                        {/* <TableCell>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-0">
                            {key.workspace}
                          </Badge>
                        </TableCell> */}
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-foreground">{key.createdBy}</span>
                            <span className="text-sm text-muted-foreground">{key.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{key.createdAt}</TableCell>
                        <TableCell>{key.lastUsed}</TableCell>
                        <TableCell>{key.cost}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="hover:bg-background/50">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setEditingKey({ id: key.id, name: key.name })}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Name
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleStatus(key)}
                              >
                                {key.isDisabled ? (
                                  <>
                                    <Power className="h-4 w-4 mr-2" />
                                    Enable Key
                                  </>
                                ) : (
                                  <>
                                    <PowerOff className="h-4 w-4 mr-2" />
                                    Disable Key
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteKey(key.id, key.name)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Key
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Info Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex items-start gap-2 text-sm text-muted-foreground bg-backgroundSecondary/50 p-4 rounded-lg"
        >
          <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
          <p className="leading-relaxed">
            Your API keys carry many privileges. Keep them secure! Don't share your API key in publicly accessible areas such as GitHub, 
            client-side code, and so forth.
          </p>
        </motion.div>
      </motion.div>

      <CreateApiKeyModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      
      {editingKey && (
        <EditApiKeyModal
          isOpen={true}
          onClose={() => setEditingKey(null)}
          keyId={editingKey.id}
          initialName={editingKey.name}
        />
      )}

      {showPromptModal && promptConfig && (
        <PromptModal
          isOpen={promptConfig.isOpen}
          onClose={() => {
            setShowPromptModal(false);
            setPromptConfig(null);
          }}
          title={promptConfig.title}
          message={promptConfig.message}
          type={promptConfig.type}
          actions={promptConfig.actions}
        />
      )}
    </TooltipProvider>
  );
}