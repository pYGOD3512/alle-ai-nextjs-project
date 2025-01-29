"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function GoogleButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call with 3-second delay
      await new Promise((resolve) => setTimeout(resolve, 3000));
      // Add your actual Google sign-in logic here
      console.log("Google sign-in attempted");
    } catch (error) {
      console.error("Google sign-in failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <Button 
      variant="outline"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 border rounded-md py-2 px-4 transition-colors relative"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Signing in...</span>
        </>
      ) : (
        <>
          <Image src="/icons/google.png" alt="Google Logo" width={20} height={20} />
          <span>Continue with Google</span>
        </>
      )}
    </Button>
  );
}