# Campus Genie Monorepo

Welcome to the professionalized structure of **Campus Genie**. This project has been reorganized into a modular monorepo to ensure scalability, maintainability, and production-readiness.

## 📁 Directory Structure

```text
├── apps/
│   ├── auth/            # Node.js Express service for User Authentication & Management
│   ├── chat/            # Python Flask service for AI Chatbot (RAG with FAISS)
│   └── web/             # React (Vite) Frontend Application
├── data/                # Raw JSON data files and college-specific datasets
├── scripts/             # Internal utility scripts (Scrapers, Data Processors)
├── package.json         # Root manager scripts
└── .env                 # Application configuration (Shared across services)
```

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- Python (3.9+)
- MongoDB (Running locally or on Atlas)

### 2. Installation
Install dependencies for all services simultaneously:
```bash
npm run install:all
```

### 3. Development
Launch all services concurrently (Frontend on 5173, Auth on 4000, Chat on 2000):
```bash
npm run dev
```

## 🛠️ Service Details

### **Auth Service (`apps/auth`)**
- Handles user signup, login, and profile management.
- Connects to MongoDB using Mongoose.
- Serves the production build of the frontend in a unified environment.

### **Chat Service (`apps/chat`)**
- Powerhouse AI logic using LangChain and OpenRouter.
- Local vector database using FAISS for lightning-fast retrieval.
- Optimized for CPU execution on macOS/Linux.

### **Frontend (`apps/web`)**
- Modern UI built with React, Tailwind CSS, and Framer Motion.
- Uses Vite's proxy system to direct API calls to the correct service.

## 📄 License
Internal Development - KMIT Campus Assistant.
