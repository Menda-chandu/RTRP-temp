from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_pinecone import PineconeVectorStore
from dotenv import load_dotenv
import os

# Load env variables
load_dotenv()

# Custom HuggingFace Inference Embedding Class (same as in app.py)
from langchain.embeddings.base import Embeddings
import requests

class HuggingFaceInferenceEmbeddings(Embeddings):
    def __init__(self, model_name="sentence-transformers/all-MiniLM-L6-v2", api_key=None):
        self.api_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/ {model_name}"
        self.api_key = api_key or os.getenv("HUGGINGFACE_API_KEY")

    def embed_documents(self, texts):
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        response = requests.post(self.api_url, headers=headers, json={"inputs": texts, "options": {"wait_for_model": True}})
        return response.json()

    def embed_query(self, text):
        return self.embed_documents([text])[0]

# Initialize embeddings and Pinecone
embedding_function = HuggingFaceInferenceEmbeddings(api_key=os.getenv("HUGGINGFACE_API_KEY"))

import pinecone
pinecone.Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index_name = os.getenv("PINECONE_INDEX_NAME")

vectorstore = PineconeVectorStore(index_name=index_name, embedding=embedding_function)

# Load and split documents
loader = TextLoader("kmit_data.json")  # Replace with your actual file
documents = loader.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
docs = text_splitter.split_documents(documents)

# Upload to Pinecone
vectorstore.from_documents(docs, embedding_function, index_name=index_name)
print("✅ Documents uploaded to Pinecone")