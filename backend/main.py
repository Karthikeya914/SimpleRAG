import os
import shutil

from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi import UploadFile
from fastapi import File

from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

from openai import OpenAI

from langchain_community.document_loaders import PyPDFLoader

from langchain_text_splitters import RecursiveCharacterTextSplitter

from langchain_google_genai import GoogleGenerativeAIEmbeddings

from langchain_community.vectorstores import Chroma


# =========================
# LOAD ENV VARIABLES
# =========================

load_dotenv()


# =========================
# FASTAPI APP
# =========================

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# OPENROUTER CLIENT
# =========================

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)


# =========================
# REQUEST MODEL
# =========================

class QueryRequest(BaseModel):
    query: str


# =========================
# ROOT ROUTE
# =========================

@app.get("/")

async def root():

    return {
        "message": "RAG Backend Running"
    }


# =========================
# PDF UPLOAD + INDEXING
# =========================

@app.post("/upload")

async def upload_pdf(
    file: UploadFile = File(...)
):

    # Create uploads folder
    os.makedirs("uploads", exist_ok=True)

    file_path = f"uploads/{file.filename}"

    # Save uploaded file
    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    # Load PDF
    loader = PyPDFLoader(file_path)

    documents = loader.load()

    # Chunking
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=2000,
        chunk_overlap=200
    )

    chunks = text_splitter.split_documents(
        documents
    )

    # Limit chunks to avoid Gemini quota issues
    chunks = chunks[:40]

    # Embeddings
    embeddings = GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-001"
    )

    # Store in ChromaDB
    try:

        Chroma.from_documents(
            documents=chunks,
            embedding=embeddings,
            persist_directory="chroma_db"
        )

    except Exception as e:

        return {
            "detail": str(e)
        }

    return {
        "message": "PDF uploaded successfully",
        "chunks_created": len(chunks)
    }


# =========================
# CHAT WITH PDF
# =========================

@app.post("/chat")

async def chat(
    request: QueryRequest
):

    user_query = request.query

    # Embeddings
    embeddings = GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-001"
    )

    # Load Vector DB
    vector_store = Chroma(
        persist_directory="chroma_db",
        embedding_function=embeddings
    )

    # Retriever
    retriever = vector_store.as_retriever(
        search_kwargs={"k": 6}
    )

    # Retrieve similar chunks
    searched_chunks = retriever.invoke(
        user_query
    )

    # Build Context
    context = "\n\n".join([
        doc.page_content
        for doc in searched_chunks
    ])

    # Better System Prompt
    system_prompt = f"""
You are an AI assistant helping users understand uploaded PDF documents.

Use the provided context to answer the question as accurately as possible.

If the exact answer is not directly available, try to infer the answer from the relevant context.

Give concise and helpful answers based on the document context.

Only say "I could not find the answer in the uploaded document" if the context is completely unrelated to the question.

Context:
{context}
"""

    try:

        # LLM Call
        response = client.chat.completions.create(

            model="openai/gpt-4o-mini",

            messages=[

                {
                    "role": "system",
                    "content": system_prompt
                },

                {
                    "role": "user",
                    "content": user_query
                }
            ]
        )

        answer = response.choices[0].message.content

    except Exception as e:

        return {
            "detail": str(e)
        }

    return {
        "answer": answer
    }