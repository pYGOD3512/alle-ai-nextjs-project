import { useEffect } from "react";
import { useRouter } from "next/router"; // Import useRouter
import { useAuthStore } from "@/stores"; // Import your auth store

const GoogleCallback = () => {
  const router = useRouter();
  const { callback, token } = router.query; // Extract callback and token from query parameters

  console.log("GoogleCallback component rendered");

  useEffect(() => {
    const handleCallback = async () => {
      // Log the parameters for verification
      console.log("Callback:", callback);
      console.log("Token received:", token);

      if (token) {
        // Set the authentication state with the token
        // useAuthStore.getState().setAuth({ user: null, token: token as string }); // Assuming user is null for now

        // Redirect to the auth page where RouteGuard will handle the checkAuth
        router.push('/auth'); // Redirect to the auth page
      } else {
        console.log("No token received.");
      }
    };

    handleCallback();
  }, [router]);

  return <div>Loading...</div>; // Show a loading state while processing
};

export default GoogleCallback;
