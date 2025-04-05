"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "./GoogleButton";
import { motion } from "framer-motion";
import { formVariants } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useAuth } from '@/components/providers/AuthProvider';
import { toast } from "sonner"

import Link from "next/link";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  onSwitchMode: () => void;
  onForgotPassword: () => void;
  onVerify: (email: string) => void;
}

export function LoginForm({ onSwitchMode, onForgotPassword, onVerify }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  ;
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    
    try {
      const result = await login(email, password);
      
      // Only handle verification if needed
      if (result.data.to === 'verify-email') {
        onVerify(email);
        return;
      }
      // Login function will handle other redirects
    } catch (error: any) {
      setPassword("");
      toast.error('Login failed, please try again');
      // console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      {/* Google Sign In */}
      <GoogleButton />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">OR</span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-borderColorPrimary focus-visible:outline-none"
          />
        </div>

        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-borderColorPrimary focus-visible:outline-none"
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="link"
            className="text-sm text-muted-foreground hover:underline"
            onClick={onForgotPassword}
          >
            Forgot Password?
          </Button>
        </div>

        <Button 
          variant="secondary"
          type="submit" 
          className="w-full bg-black text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      {/* Register Link */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Don&apos;t have an account yet? </span>
        <Button
          variant="link"
          onClick={onSwitchMode}
          className="text-foreground underline font-medium p-0"
        >
          Register
        </Button>
      </div>

      {/* Terms */}
      <div className="text-center text-xs text-muted-foreground">
        By continuing, you agree to Alle-AI&apos;s{" "}
        <Link href="/terms-of-service" target="_blank" className="underline">
          Terms of Service 
        </Link>{" "}
        &
        {" "}<Link href="/privacy-policy" target="_blank" className="underline">
           Privacy Policy
        </Link>
      </div>
    </motion.div>
  );
}