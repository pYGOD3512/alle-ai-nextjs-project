"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authApi } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";

interface ResetPasswordFormProps {
  email: string;
  token: string;
}

export function ResetPasswordForm({ email, token }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== passwordConfirmation) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset. You can now log in with your new password.",
      });

      // Don't reset isLoading - keep button disabled during navigation
      router.push('/auth');
    } catch (error: any) {
      toast({
        title: "Failed to reset password",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false); // Reset only on error
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-borderColorPrimary focus-visible:outline-none pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>

      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Confirm New Password"
        value={passwordConfirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
        required
        className="border-borderColorPrimary focus-visible:outline-none"
      />

      <Button 
        variant="secondary"
        type="submit" 
        className="w-full bg-black text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center"
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Resetting...</span>
          </motion.div>
        ) : (
          "Reset Password"
        )}
      </Button>
    </form>
  );
}