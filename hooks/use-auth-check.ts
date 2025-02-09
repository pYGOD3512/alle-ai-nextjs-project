import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { authApi } from '@/lib/api/auth';
import { LoadingScreen } from '@/components/features/auth/LoadingScreen';

interface UseAuthCheckOptions {
  onVerifyEmail?: (email: string) => void;
  redirectIfAuthenticated?: boolean;
}

interface UseAuthCheckReturn {
  shouldRender: boolean;
  isLoading: boolean;
}

export const useAuthCheck = (options: UseAuthCheckOptions = {}): UseAuthCheckReturn => {
  const { token, setLoading, isLoading } = useAuthStore();
  const router = useRouter();
  const { onVerifyEmail, redirectIfAuthenticated = true } = options;
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      if (token && redirectIfAuthenticated) {
        try {
          const response = await authApi.getUser();
          
          if (!mounted) return;

          // Update the auth store with the user's plan
          useAuthStore.getState().setAuth(
            response.data.user,
            token,
            response.plan  // Pass the plan from the response
          );

          // If user is verified, send them directly to chat
          if (response.data.user.email_verified_at) {
            router.replace('/chat');
            return;
          }
          
          // If user needs email verification
          if (response.data.to === 'verify-email' && onVerifyEmail) {
            onVerifyEmail(response.data.user.email);
            setShouldRender(true);
          }
        } catch (error) {
          if (!mounted) return;
          useAuthStore.getState().clearAuth();
          setShouldRender(true);
        }
      } else {
        if (!mounted) return;
        setShouldRender(true);
      }
    };

    setLoading(true);
    checkAuth().finally(() => {
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [token, redirectIfAuthenticated]);

  return {
    shouldRender,
    isLoading
  };
};