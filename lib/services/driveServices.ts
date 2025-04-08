import { gapi } from 'gapi-script';
import { toast } from 'sonner';
import { useDriveAuthStore } from '@/stores';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

class GoogleDriveService {
  private static instance: GoogleDriveService;
  private isInitialized = false;
  private isAuthenticated = false;
  private gapi: typeof gapi | null = null;

  private constructor() {}

  static getInstance(): GoogleDriveService {
    if (!GoogleDriveService.instance) {
      GoogleDriveService.instance = new GoogleDriveService();
    }
    return GoogleDriveService.instance;
  }

  private async loadGapi(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    // Dynamically import gapi only on client side
    const { gapi } = await import('gapi-script');
    this.gapi = gapi;
  }

  async init(): Promise<void> {
    if (this.isInitialized) return;
    if (typeof window === 'undefined') return;

    await this.loadGapi();
    if (!this.gapi) return;

    return new Promise((resolve, reject) => {
      this.gapi!.load('client:auth2', async () => {
        try {
          await this.gapi!.client.init({
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
        toast.error('Something went wrong, please try agian')
        return false;
      }
    }
    
    try {
      const authInstance = this.gapi!.auth2.getAuthInstance();
      await authInstance.signIn();
      
      const currentUser = authInstance.currentUser.get();
      const authResponse = currentUser.getAuthResponse();
      
      // Store the auth data
      useDriveAuthStore.getState().setAuth(
        authResponse.access_token,
        authResponse.expires_in
      );
      
      this.isAuthenticated = true;
      toast('Signed into Google Drive');
      return true;
    } catch (error) {
      this.isAuthenticated = false;
      toast.error('Failed to sign in to Google Drive')
      return false;
    }
  }

  async signOut(): Promise<void> {
    if (!this.isInitialized) return;
    
    try {
      await this.gapi!.auth2.getAuthInstance().signOut();
      this.isAuthenticated = false;
      useDriveAuthStore.getState().clearAuth();
    } catch (error) {
      toast.error('Failed to sign out');
    }
  }

  isSignedIn(): boolean {
    return this.isAuthenticated;
  }

  getGapi(): typeof gapi | null {
    return this.gapi;
  }
}

export const driveService = GoogleDriveService.getInstance();