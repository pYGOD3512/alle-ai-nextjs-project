"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { formVariants } from "@/lib/utils";

interface ForgotPasswordFormProps {
  onSwitchMode: () => void;
  onSuccess: (email: string) => void;
}

export function ForgotPasswordForm({ onSwitchMode, onSuccess }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log("Password reset attempt:", { email });
    onSuccess(email);
  };

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <p className="text-center text-sm text-muted-foreground">
        Enter your email address and we'll send you instructions to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-borderColorPrimary focus-visible:outline-none"
        />

        <Button 
          variant="secondary"
          type="submit" 
          className="w-full bg-black text-white"
        >
          Send Email
        </Button>
      </form>

      <div className="text-center text-sm">
        <Button
          variant="link"
          onClick={onSwitchMode}
          className="text-muted-foreground hover:underline font-medium p-0"
        >
          Back to Login
        </Button>
      </div>
    </motion.div>
  );
}