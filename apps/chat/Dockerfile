FROM python:3.9-slim

WORKDIR /app

# Install system dependencies for FAISS/Tensors
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Ensure we use the correct port
ENV CHAT_PORT=2000
EXPOSE 2000

CMD ["python", "app.py"]
