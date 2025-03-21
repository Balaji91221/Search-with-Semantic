const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { google } = require('googleapis');
const { OpenAI } = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:8081'],
  credentials: true
}));
app.use(express.json());

// ------------------ GOOGLE OAUTH CONFIG ------------------
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const drive = google.drive({ version: 'v3', auth: oauth2Client });

// ------------------ OPENAI CONFIG ------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ------------------ PINECONE CONFIG ------------------
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT
});

const index = pinecone.index(process.env.PINECONE_INDEX);

// ------------------ ROUTES ------------------

// ✅ Generate Google OAuth URL
app.get('/api/auth/google/url', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/drive.readonly'
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });

  res.json({ url });
});

// ✅ Handle Google OAuth Callback
app.get('/api/auth/google/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is missing' });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    res.json({
      id: data.id,
      name: data.name,
      email: data.email,
      picture: data.picture,
      accessToken: tokens.access_token
    });
  } catch (error) {
    console.error('OAuth callback error:', error.message);
    res.status(400).json({ error: 'Authentication failed' });
  }
});

// ✅ List Google Drive Files
app.get('/api/drive/files', async (req, res) => {
  const { accessToken } = req.query;

  if (!accessToken) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    oauth2Client.setCredentials({ access_token: accessToken });

    const response = await drive.files.list({
      q: "mimeType='text/plain' or mimeType='text/markdown' or mimeType='application/vnd.google-apps.document'",
      fields: 'files(id, name, mimeType, webViewLink, modifiedTime)'
    });

    res.json(response.data.files);
  } catch (error) {
    console.error('Failed to fetch files:', error.message);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// ✅ Ingest Files into Pinecone
app.post('/api/ingest', async (req, res) => {
  const { fileIds, accessToken } = req.body;

  if (!fileIds || !accessToken) {
    return res.status(400).json({ error: 'File IDs and access token are required' });
  }

  try {
    oauth2Client.setCredentials({ access_token: accessToken });

    for (const fileId of fileIds) {
      // Get file metadata
      const fileMetadata = await drive.files.get({
        fileId,
        fields: 'id, name, mimeType, webViewLink, modifiedTime'
      });

      // Get file content
      let content = '';

      if (fileMetadata.data.mimeType === 'application/vnd.google-apps.document') {
        const doc = await drive.files.export({
          fileId,
          mimeType: 'text/plain'
        });
        content = doc.data;
      } else {
        const file = await drive.files.get({
          fileId,
          alt: 'media'
        });
        content = file.data;
      }

      // Generate embeddings using OpenAI
      const embedding = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: content
      });

      // Store in Pinecone
      await index.upsert([
        {
          id: fileId,
          values: embedding.data[0].embedding,
          metadata: {
            name: fileMetadata.data.name,
            fileId: fileMetadata.data.id,
            webViewLink: fileMetadata.data.webViewLink,
            modifiedTime: fileMetadata.data.modifiedTime
          }
        }
      ]);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to ingest files:', error.message);
    res.status(500).json({ error: 'Failed to ingest files' });
  }
});

// ✅ Search from Pinecone
app.post('/api/search', async (req, res) => {
  const { query, accessToken } = req.body;

  if (!query || !accessToken) {
    return res.status(400).json({ error: 'Query and access token required' });
  }

  try {
    // Generate embeddings for query
    const embedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query
    });

    // Search Pinecone
    const results = await index.query({
      vector: embedding.data[0].embedding,
      topK: 5,
      includeMetadata: true
    });

    res.json(results.matches);
  } catch (error) {
    console.error('Failed to search:', error.message);
    res.status(500).json({ error: 'Search failed' });
  }
});

// ------------------ START SERVER ------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
