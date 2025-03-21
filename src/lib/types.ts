
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  modifiedTime: string;
}

export interface EmbeddedFile extends DriveFile {
  vectorId: string;
}

export interface SearchResult {
  id: string;
  score: number;
  metadata: {
    name: string;
    fileId: string;
    webViewLink: string;
    modifiedTime: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  accessToken: string;
}
