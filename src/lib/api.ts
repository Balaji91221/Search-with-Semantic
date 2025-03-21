
import { API_BASE_URL } from './constants';
import { DriveFile, SearchResult, User } from './types';

export async function loginWithGoogle(): Promise<User> {
  try {
    // Get Google OAuth URL
    const response = await fetch(`${API_BASE_URL}/auth/google/url`);
    const { url } = await response.json();
    
    // Open Google Auth in a popup
    const popup = window.open(url, 'Google Auth', 'width=500,height=600');
    
    // Wait for the OAuth process to complete
    return new Promise((resolve, reject) => {
      window.addEventListener('message', async (event) => {
        // Check if the message is from our auth callback
        if (event.data.type === 'oauth-callback' && event.data.code) {
          // Exchange the code for tokens
          try {
            const tokenResponse = await fetch(`${API_BASE_URL}/auth/google/callback`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: event.data.code })
            });
            
            if (!tokenResponse.ok) {
              throw new Error('Failed to get tokens');
            }
            
            const user = await tokenResponse.json();
            resolve(user);
          } catch (error) {
            reject(error);
          } finally {
            popup?.close();
          }
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function fetchDriveFiles(accessToken: string): Promise<DriveFile[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/drive/files?accessToken=${accessToken}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
}

export async function ingestFiles(fileIds: string[], accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileIds, accessToken })
    });
    
    if (!response.ok) {
      throw new Error('Failed to ingest files');
    }
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error ingesting files:', error);
    throw error;
  }
}

export async function searchFiles(query: string, accessToken: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, accessToken })
    });
    
    if (!response.ok) {
      throw new Error('Failed to search files');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching files:', error);
    throw error;
  }
}
