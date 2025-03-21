# **Google Drive File Search with Semantic Embeddings**  

This project is a minimal but functional web-based tool that allows users to log in with Google OAuth, access text-based files from Google Drive, store embeddings in Pinecone for semantic search, and retrieve relevant files using vector similarity.  

---

## 🚀 **Project Overview**  

### ✅ **Core Features**  
- **Google OAuth Login** – Secure login using Google OAuth 2.0  
- **Google Drive Access** – Read-only access to `.txt` and `.md` files  
- **Embedding Generation** – Generate embeddings using OpenAI's `text-embedding-ada-002`  
- **Pinecone Integration** – Store embeddings and metadata for search  
- **Vector Search** – Perform semantic search and return file links  

---

## 🛠️ **Tech Stack**  

| Layer         | Technology Used            |
|--------------|----------------------------|
| **Frontend**  | React (Vite), TypeScript, Tailwind CSS |
| **Backend**   | Node.js (Express.js)       |
| **Auth & API**| Google OAuth 2.0, Google Drive API |
| **Embeddings**| OpenAI `text-embedding-ada-002` |
| **Vector Store**| Pinecone                 |

---

## 📂 **Project Structure**  

```plaintext
📁 google-drive-search
├── 📁 client              # Frontend (React)
│   ├── 📁 src
│   │   ├── 📁 components  # Reusable components
│   │   ├── 📁 pages       # Page components
│   │   └── 📄 App.tsx     # Main app
├── 📁 server              # Backend (Node.js)
│   ├── 📄 index.ts        # Express app setup
│   ├── 📄 auth.ts         # Google OAuth config
│   ├── 📄 drive.ts        # Google Drive API config
│   ├── 📄 embeddings.ts   # OpenAI & Pinecone logic
├── .env                   # Environment variables
├── .gitignore             # Ignore unnecessary files
├── README.md              # Project documentation
└── package.json           # Dependencies
```

---

## 🌐 **Setup Instructions**  

### 🔑 **1. Create a Google OAuth App**  
1. Go to [Google Cloud Console](https://console.cloud.google.com/)  
2. Create a new project  
3. Enable **Google Drive API**  
4. Create OAuth credentials:
   - Application Type: **Web Application**  
   - Add `http://localhost:5173` to **Authorized Redirect URIs**  
5. Download the `client_secret.json` file  

---

### 🌍 **2. Create a Pinecone Project**  
1. Sign up at [https://pinecone.io](https://pinecone.io)  
2. Create a new index:
   - Dimensions: `1536` (for OpenAI embeddings)  
   - Metric: `cosine`  
3. Save the API key and environment  

---

### 📦 **3. Install Dependencies**  
1. Install frontend dependencies:  

```bash
cd client
npm install
```

2. Install backend dependencies:  

```bash
cd server
npm install
```

---

### 🔐 **4. Create `.env` Files**  
Create a `.env` file in the `/server` folder:  

```env
# Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback

# Pinecone
PINECONE_API_KEY=<your-pinecone-api-key>
PINECONE_ENVIRONMENT=<your-pinecone-environment>
PINECONE_INDEX_NAME=<your-pinecone-index-name>

# OpenAI
OPENAI_API_KEY=<your-openai-api-key>
```

Create a `.env` file in the `/client` folder:  

```env
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
VITE_BACKEND_URL=http://localhost:5000
```

---

## ▶️ **How to Run**  

### 🚀 **Start Backend**  
```bash
cd server
npm run dev
```

### 🚀 **Start Frontend**  
```bash
cd client
npm run dev
```

---

## 📌 **Endpoints**  

### ✅ **1. Google OAuth Login**  
- **Endpoint:** `/auth/google`  
- **Method:** `GET`  
- **Description:** Initiates Google OAuth flow  

---

### ✅ **2. Fetch & Process Files**  
- **Endpoint:** `/ingest`  
- **Method:** `POST`  
- **Description:**  
   - Fetches `.txt` and `.md` files from Drive  
   - Generates embeddings using OpenAI  
   - Stores embeddings + metadata in Pinecone  

---

### ✅ **3. Search Files**  
- **Endpoint:** `/search`  
- **Method:** `POST`  
- **Description:**  
   - Converts user query to embeddings  
   - Performs vector similarity search  
   - Returns file metadata  

---

## 🎯 **How It Works**  

### ✅ **Authentication Flow**  
1. User clicks **“Sign in with Google”**  
2. Redirect to Google OAuth  
3. On success → Access token stored  

---

### ✅ **Ingestion Flow**  
1. Fetch file list from Google Drive  
2. Retrieve file content  
3. Generate embeddings with OpenAI  
4. Store in Pinecone  

---

### ✅ **Search Flow**  
1. User types a query  
2. Convert query to embeddings  
3. Search in Pinecone  
4. Return top-ranked results  

---

## 💻 **Frontend UI**  

### **🌟 Login Page**  
✅ Google OAuth button  

### **🌟 File Ingestion Page**  
✅ "Fetch & Process" button  
✅ Status updates  

### **🌟 Search Page**  
✅ Search bar  
✅ List of results (file titles + links)  

---

## 🚨 **Troubleshooting**  

| Issue | Solution |
|-------|----------|
| Google OAuth redirect error | Add `http://localhost:5173` to authorized redirects |
| Pinecone error | Double-check API key and index settings |
| OpenAI rate limit error | Reduce request frequency |

---

## 🌟 **Bonus**  
🎥 Short demo recording: ✅ (Optional)  

---

## 🏆 **Future Improvements**  
- ✅ Handle more file types (`.pdf`, `.docx`)  
- ✅ Real-time search suggestions  
- ✅ Improved error handling  

---

## 📎 **References**  
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)  
- [Google Drive API](https://developers.google.com/drive)  
- [Pinecone Documentation](https://docs.pinecone.io/)  
- [OpenAI API](https://platform.openai.com/docs)  

---

## 🎉 **Contributors**  
- [Kelavath Balaji Naik](https://github.com/Balaji91221)  

---

**💡 Happy coding! 😎**
