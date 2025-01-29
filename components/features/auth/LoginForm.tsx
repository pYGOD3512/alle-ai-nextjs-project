"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "./GoogleButton";
import { motion } from "framer-motion";
import { formVariants } from "@/lib/utils";


interface LoginFormProps {
  onSwitchMode: () => void;
  onForgotPassword: () => void;
}

export function LoginForm({ onSwitchMode, onForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { email, password });
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
        className="w-full bg-black  text-white">
          Log in
        </Button>
      </form>

      {/* Register Link */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Don't have an account yet? </span>
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
        By continuing, you agree to Alle-AI's{" "}
        <a href="#" className="underline">
          Terms of Service
        </a>{" "}
        &{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
      </div>
    </motion.div>
  );
}