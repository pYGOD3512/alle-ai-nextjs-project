"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "./GoogleButton";
import { motion } from "framer-motion";
import { formVariants } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import Link from "next/link";

interface RegisterFormProps {
  onSwitchMode: () => void;
  onRegister: (email: string) => void;
}

export function RegisterForm({ onSwitchMode, onRegister }: RegisterFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords don't match");
      }

      const result = await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      if (result && result.to === 'verify-email') {
        onRegister(email);
      } 
      
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "Please check your information and try again",
        variant: "destructive",
      });
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
      {/* Google Sign Up */}
      <GoogleButton />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-gray-500">OR</span>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="border-borderColorPrimary focus-visible:outline-none"
          />
          <Input
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="border-borderColorPrimary focus-visible:outline-none"
          />
        </div>

        <Input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-borderColorPrimary focus-visible:outline-none"
        />

        <Input
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-borderColorPrimary focus-visible:outline-none"
        />

        <Input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="border-borderColorPrimary focus-visible:outline-none"
        />

        <Button 
          variant="secondary"
          type="submit" 
          disabled={isLoading}
          className="w-full bg-black text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            'Register'
          )}
        </Button>
      </form>

      {/* Login Link */}
      <div className="text-center items-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Button
          variant="link"
          onClick={onSwitchMode}
          className="text-foreground text-sm underline font-medium p-0"
        >
          Log in
        </Button>
      </div>

      {/* Terms */}
      <div className="text-center text-xs text-muted-foreground">
        By continuing, you agree to Alle-AI's{" "}
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