"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { formVariants } from "@/lib/utils";
import { toast, useToast } from "@/hooks/use-toast";
import { useAuth } from '@/components/providers/AuthProvider';
import { authApi } from '@/lib/api/auth';
import { useRouter } from "next/navigation";

interface VerificationCodeFormProps {
  email: string;
  onSuccess: () => void;
  onBackToLogin: () => void;
}

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
    ip_address: string;
    user_agent: string;
    registration_type: string;
  }

interface VerificationResponse {
  data: {
    user: User;
    to: string;
  };
  is_valid: boolean;
  message: string;
  status: boolean;
}

export function VerificationCodeForm({ email, onSuccess, onBackToLogin }: VerificationCodeFormProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Add useAuth to handle verification state
  const { user, verifyEmail, logout } = useAuth();
  const router = useRouter();

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleInput = (index: number, value: string) => {
    setError('');
    
    // Allow only numbers
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // Submit automatically if all digits are filled
    if (value && index === 5) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (verificationCode: string) => {
    setIsVerifying(true);
    setError('');

    try {
      if (verificationCode.length !== 6) {
        throw new Error('Please enter all 6 digits');
      }

      const formattedCode = `A-${verificationCode}`;
      await verifyEmail(formattedCode);
      
      toast({
        title: "Success",
        description: "Email verified successfully!",
        variant: "default",
      });
      
      onSuccess();
      
    } catch (error: any) {
      // console.error('Verification error:', error);
      setError(error.message || 'Verification failed. Please try again.');
      toast({
        title: "Verification failed",
        description: error.message || "Please check your code and try again",
        variant: "destructive",
      });
      
      setCode(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    try {
      const response = await authApi.resendVerification();
      
      setCountdown(30);
      toast({
        title: "Success",
        description: response.message || "Verification code sent successfully!",
        variant: "default",
      });
      
      setCode(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
      setIsResending(false);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send code. Please try again.",
        variant: "destructive",
      });
      setIsResending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // toast({
      //   title: "Logged out",
      //   description: "You have been successfully logged out",
      //   variant: "default",
      // });
      onBackToLogin();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >      
      <div className="text-center space-y-2">
        <h2 className="text-xl xs:text-2xl font-semibold text-foreground">
          Enter Verification Code
        </h2>
        <p className="text-sm text-muted-foreground">
          We&apos;ve sent a verification code to
        </p>
        <p className="font-medium text-foreground">{email}</p>
      </div>

      {/* Code Input Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          {/* Prefix */}
          <div className="flex items-center">
            <span className="text-lg xs:text-xl font-semibold text-foreground">A -</span>
          </div>
          
          {/* Code Inputs */}
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => inputs.current[index] = el}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInput(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-8 h-10 xs:w-12 xs:h-14 text-center text-lg font-semibold border border-borderColorPrimary rounded-lg 
                focus:outline-none transition-colors
                bg-background text-foreground"
            />
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}
      </div>

      {/* Verify Button */}
      <Button
        variant="secondary"
        onClick={() => handleVerify(code.join(''))}
        disabled={code.some(digit => !digit) || isVerifying}
        className="w-full bg-black text-white"
      >
        {isVerifying ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify Email'
        )}
      </Button>

      {/* Resend Code Section */}
      <div className="text-center space-y-4">
        <div className="text-sm text-muted-foreground">
          Didn&apos;t receive the code?{" "}
          {countdown > 0 ? (
            <span>Resend in {countdown}s</span>
          ) : (
            <Button
              variant="link"
              onClick={handleResendCode}
              disabled={isResending}
              className="text-foreground underline font-medium p-0"
            >
              {isResending ? "Sending..." : "Resend Code"}
            </Button>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="mt-4 text-sm"
        >
          <LogOut className="w-3 h-3 mr-2" />
          Use a different account
        </Button>
      </div>
    </motion.div>
  );
}