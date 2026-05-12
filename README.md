# SimpleRAG 📘

SimpleRAG is a lightweight NotebookLM-style Retrieval-Augmented Generation (RAG) application that allows users to upload PDF documents and chat with them using AI.

The system extracts text from uploaded PDFs, converts the content into vector embeddings, stores them in a vector database, retrieves the most relevant chunks for a query, and generates grounded responses using an LLM.

---

# 🚀 Features

- 📄 Upload PDF documents
- ✂️ Intelligent text chunking
- 🧠 Gemini Embeddings for semantic search
- 🗂️ ChromaDB vector storage
- 🔎 Context-aware retrieval
- 🤖 AI-generated grounded answers
- 🌐 FastAPI backend
- 🎨 Interactive frontend using HTML/CSS/JavaScript
- ☁️ Fully deployed using Render + Netlify

---

# 🏗️ Tech Stack

## Backend

- FastAPI
- LangChain
- ChromaDB
- Gemini Embedding API
- OpenRouter API

## Frontend

- HTML
- CSS
- JavaScript

## Deployment

- Render (Backend)
- Netlify (Frontend)

---

# ⚙️ System Architecture

```text
User Uploads PDF
        ↓
PDF Text Extraction
        ↓
Text Chunking
        ↓
Gemini Embeddings
        ↓
ChromaDB Vector Store
        ↓
Semantic Retrieval
        ↓
OpenRouter LLM
        ↓
Grounded AI Response
```

---

# 📂 Project Structure

```text
SimpleRAG/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── chroma_db/
│   └── uploads/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend folder.

```env
OPENROUTER_API_KEY=your_openrouter_key
GOOGLE_API_KEY=your_gemini_key
```

---

# ▶️ Run Backend

Navigate to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start server:

```bash
uvicorn main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

---

# ▶️ Run Frontend

Open frontend folder in VS Code and run using:

```text
Live Server
```

---

# 🧠 How RAG Works In This Project

1. User uploads a PDF.
2. PDF text is extracted using LangChain PDF Loader.
3. Text is split into chunks.
4. Gemini Embedding API converts chunks into vectors.
5. Vectors are stored in ChromaDB.
6. User asks a question.
7. Relevant chunks are retrieved using semantic similarity.
8. Retrieved context is passed to the LLM.
9. LLM generates a grounded answer.

---

# 📸 Screenshots

![alt text](<Screenshot 2026-05-12 at 3.49.34 PM.png>)
![alt text](<Screenshot 2026-05-12 at 3.49.43 PM.png>)
![alt text](<Screenshot 2026-05-12 at 3.50.16 PM.png>)

---

# 🌍 Deployment

- Frontend deployed on Netlify
- Backend deployed on Render

---

# 📌 Future Improvements

- Multi-PDF support
- Chat history
- Source citations
- Authentication
- Streaming responses
- Better retrieval ranking

---

# 👨‍💻 Author

Karthikeya