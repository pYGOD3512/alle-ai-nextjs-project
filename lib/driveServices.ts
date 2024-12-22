import { gapi } from 'gapi-script';
import { toast as showToast } from "@/hooks/use-toast";
import { useDriveAuthStore } from '@/lib/constants';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

class GoogleDriveService {
  private static instance: GoogleDriveService;
  private isInitialized = false;
  private isAuthenticated = false;

  private constructor() {}

  static getInstance(): GoogleDriveService {
    if (!GoogleDriveService.instance) {
      GoogleDriveService.instance = new GoogleDriveService();
    }
    return GoogleDriveService.instance;
  }

  async init(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      gapi.load('client:auth2', async () => {
        try {
          await gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
          });
          this.isInitialized = true;
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async signIn(): Promise<boolean> {
    if (!this.isInitialized) {
      try {
        await this.init();
      } catch (error) {
        showToast({
          title: "Error",
          description: "Failed to initialize Google Drive service",
          variant: 'destructive'
        });
        return false;
      }
    }
    
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      
      const currentUser = authInstance.currentUser.get();
      const authResponse = currentUser.getAuthResponse();
      
      // Store the auth data
      useDriveAuthStore.getState().setAuth(
        authResponse.access_token,
        authResponse.expires_in
      );
      
      this.isAuthenticated = true;
      showToast({
        title: "Success",
        description: "Successfully signed in to Google Drive",
        duration: 3000,
        className: "bg-toastBackgroundColor border-borderColorPrimary text-foreground"
      });
      return true;
    } catch (error) {
      this.isAuthenticated = false;
      showToast({
        title: "Error",
        description: `Failed to sign in to Google Drive`,
        variant: 'destructive',
        duration: 3000,
        className: "text-foreground"
      });
      return false;
    }
  }

  async signOut(): Promise<void> {
    if (!this.isInitialized) return;
    
    try {
      await gapi.auth2.getAuthInstance().signOut();
      this.isAuthenticated = false;
      useDriveAuthStore.getState().clearAuth();
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to sign out",
        variant: 'destructive'
      });
    }
  }

  isSignedIn(): boolean {
    return this.isAuthenticated;
  }
}

export const driveService = GoogleDriveService.getInstance();