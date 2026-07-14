<h1 align="center">CampusGenie 🎓🤖</h1>

<p align="center">
  <strong>A highly scalable, RAG-powered chatbot for instantaneous semantic querying of institutional documents.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
</p>

---

## 📖 Overview

CampusGenie is an end-to-end full-stack application designed to help students and faculty quickly find information buried in complex institutional documents. Built as a modular monorepo, it is designed for scalability and maintainability.

It utilizes a **Retrieval-Augmented Generation (RAG)** architecture. When a user asks a question, the system performs a low-latency semantic search over a FAISS vector database to retrieve relevant document chunks. It then injects them into the context window of an LLM (via LangChain & OpenRouter) to generate a highly accurate, context-aware response.

## ✨ Key Features

- **Semantic Document Retrieval:** Uses dense vector embeddings of campus documents and `FAISS` for blazingly fast similarity search.
- **RAG Architecture:** Integrates LangChain with OpenRouter to ensure answers are factual and strictly based on the provided context (minimizing hallucinations).
- **Scalable Monorepo:** Clean separation of concerns with a Node.js Auth service, Python Flask Chat service, and a React frontend.
- **Modern Web Interface:** A sleek, responsive frontend built with React, Tailwind CSS, and Framer Motion for a seamless chat experience.

## 📁 Repository Structure

```text
├── apps/
│   ├── auth/            # Node.js Express service for User Auth & Management (MongoDB)
│   ├── chat/            # Python Flask service for AI Chatbot (RAG with FAISS)
│   └── web/             # React (Vite) Frontend Application
├── data/                # Raw JSON data files and college-specific datasets
├── scripts/             # Internal utility scripts (Scrapers, Data Processors)
├── package.json         # Root manager scripts
└── .env                 # Application configuration (Shared across services)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- MongoDB (Running locally or on Atlas)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Menda-chandu/CampusGenie-college-chatbot.git
   cd CampusGenie-college-chatbot
   ```

2. **Install all dependencies:**
   *(This installs dependencies for the frontend, auth, and chat services simultaneously)*
   ```bash
   npm run install:all
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory (refer to `.env.example` if available) and add your MongoDB URI, API keys, etc.

### Local Development

Launch all services concurrently (Frontend on `5173`, Auth on `4000`, Chat on `2000`):
```bash
npm run dev
```

## 📸 Screenshots
*(Add a screenshot of your React chat interface here! Recruiters love visuals.)*
`![Chat Interface](link_to_image.png)`

## 📄 License
Internal Development - KMIT Campus Assistant.
