"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  MessageSquare, 
  Wand2, 
  Sparkles, 
  Key, 
  LayoutGrid, 
  FileText,
  Activity,
  HelpCircle,
  Settings,
  Command,
  Eye,
  EyeOff,
  Wallet
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Dashboard", href: "/developer" },
  { label: "Workbench", href: "/developer/workbench" },
  { label: "Settings", href: "/developer/settings" },
];

const actions = [
  {
    title: "Write a prompt from scratch",
    icon: Command,
    href: "/developer/playground",
    description: "Test your API integration in our interactive playground"
  },
  {
    title: "Generate a prompt",
    icon: Wand2,
    href: "/developer/generate",
    description: "Auto-generate API requests based on your requirements"
  },
  {
    title: "Improve an existing prompt",
    icon: Sparkles,
    href: "/developer/improve",
    description: "Optimize your existing API implementations"
  },
  {
    title: "Get API keys",
    icon: Key,
    href: "/developer/settings/api-keys",
    description: "Manage your API keys and access tokens"
  },
  {
    title: "Manage batches",
    icon: LayoutGrid,
    href: "/developer/batches",
    description: "Monitor and manage your API request batches"
  },
  {
    title: "Explore documentation",
    icon: FileText,
    href: "/docs/api",
    description: "Read our comprehensive API documentation"
  }
];

export function DeveloperDashboard() {
  const [showBalance, setShowBalance] = useState(true);
  const balance = 0.00; // This should come from your state management or API

  return (
    <div className="flex-1 p-8 bg-sideBarBackground">
      <div className="max-w-4xl mx-auto w-full space-y-12">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold text-foreground">Good morning, Pascal</h1>
            
            {/* Balance and Actions Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Wallet className="h-4 w-4" />
                <span className="text-sm">Available Credits:</span>
                <div className="flex items-center gap-2">
                  <AnimatePresence mode="wait">
                    {showBalance ? (
                      <motion.span
                        key="balance"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="font-semibold text-foreground"
                      >
                        £{balance.toFixed(2)}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="hidden"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="font-semibold text-foreground"
                      >
                        £•••••
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowBalance(!showBalance)}
                  >
                    {showBalance ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Buy credits
              </Button>
            </div>
          </div>
        </div>

        {/* Main Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="p-6 hover:bg-hoverColorPrimary transition-colors cursor-pointer h-full border-borderColorPrimary bg-backgroundSecondary">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <action.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Footer Links */}
        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <Link 
            href="/docs/api-status" 
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Activity className="w-4 h-4" />
            API status
          </Link>
          <Link 
            href="/docs/help" 
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Help & support
          </Link>
        </div>
      </div>
    </div>
  );
}