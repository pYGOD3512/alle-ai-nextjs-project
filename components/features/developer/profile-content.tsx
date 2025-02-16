"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Mail, User, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores";

export function DeveloperProfile() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.first_name);
  const [editedName, setEditedName] = useState(name);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();


  // Check if name has been modified
  useEffect(() => {
    setIsEditing(editedName !== name);
  }, [editedName, name]);

  const handleSave = () => {
    if (!editedName?.trim()) return;
    setName(editedName);
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your name has been successfully updated.",
      duration: 3000,
    });
  };

  const handleCancel = () => {
    setEditedName(name);
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-[1200px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </div>

      {/* Profile Card */}
      <Card className="border-borderColorPrimary bg-transparent p-8">
        <div className="space-y-8">
          {/* Name Section */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name
            </label>
            <div className="flex items-center gap-2">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="max-w-md bg-transparent border-borderColorPrimary focus:border-primary transition-all"
                placeholder="Enter your name"
              />
              <AnimatePresence>
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex gap-2"
                  >
                    <Button
                      variant="outline"
                      onClick={handleSave}
                      className="w-16"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="w-16"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Email Section */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <Input
              value="pascal@example.com"
              readOnly
              className="max-w-md bg-transparent border-borderColorPrimary cursor-not-allowed"
            />
          </div>

          {/* Plan Section */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Current Plan
            </label>
            <Badge 
              variant="outline" 
              className="bg-primary/10 text-primary border-0"
            >
              FREE TIER
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}