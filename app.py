from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
from bson import ObjectId
from datetime import datetime
import asyncio
from langchain_core.messages import HumanMessage, AIMessage
from openai import OpenAI  # OpenRouter uses the OpenAI-compatible API
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Initialize Flask app
app = Flask(__name__, static_folder='build')
CORS(app, resources={r"/*": {"origins": os.getenv("CORS_ORIGIN", "http://localhost:5173")}})

# Add no-cache headers globally
@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response


# MongoDB connection
try:
    mongo_uri = os.getenv("MONGODB_URI")
    if not mongo_uri:
        raise ValueError("Missing MONGO_URI in .env")

    client = MongoClient(mongo_uri)
    db = client['campus-genie']
    chat_history_collection = db['chat_history']
    users_collection = db['users']

    # Test connection
    client.admin.command('ping')
    print("✅ Successfully connected to MongoDB")
except Exception as e:
    print(f"❌ Error connecting to MongoDB: {e}")
    raise


# OpenRouter API Setup
try:
    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    if not OPENROUTER_API_KEY:
        raise ValueError("Missing OPENROUTER_API_KEY in .env")

    # Initialize OpenRouter client
    openrouter_client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=OPENROUTER_API_KEY,
    )
    print("✅ OpenRouter client initialized")
except Exception as e:
    print(f"❌ Failed to initialize OpenRouter client: {e}")
    raise


# Load embedding model and FAISS index
try:
    embedding_function = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    persist_directory = "./faiss_index"

    if not os.path.exists(persist_directory):
        raise FileNotFoundError(f"The directory '{persist_directory}' does not exist. Please ensure the FAISS index is built.")

    vectorstore = FAISS.load_local(
        persist_directory,
        embeddings=embedding_function,
        allow_dangerous_deserialization=True
    )
    print("✅ FAISS vector store loaded successfully")
except Exception as e:
    print(f"❌ Error loading FAISS index: {e}")
    raise


# LLM Function
def llm(prompt):
    try:
        response = openrouter_client.chat.completions.create(
            model="qwen/qwen2.5-vl-32b-instruct:free",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.7,
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"LLM call failed: {e}")
        return "⚠️ Sorry, I couldn't process that request."


# Chatbot logic
def get_response(query, chat_history):
    search_results = vectorstore.similarity_search(query, k=4)
    context = "\n".join([result.page_content for result in search_results])

    history_text = " ".join([f"{msg.content}" for msg in chat_history])
    prompt_template = f"""
Answer the question based only on the following context:
{context}

Chat History:
{history_text}

Question: {query}
Answer:
"""

    answer = llm(prompt_template.strip())
    chat_history.extend([
        HumanMessage(content=query),
        AIMessage(content=answer)
    ])
    return answer


# Global variable to store dashboard data
dashboard_data = {
    'attendance': None,
    'timetable': None,
    'last_updated': None
}


# Simple async stub for login_to_kmit_netra()
async def login_to_kmit_netra(mobile_number):
    # Replace this with real implementation
    return {
        'attendance': f'Attendance for {mobile_number}',
        'timetable': 'Timetable data here',
        'last_updated': datetime.now().isoformat()
    }


# API Routes
@app.route('/api/dashboard-data', methods=['GET'])
def get_dashboard_data():
    return jsonify(dashboard_data)


@app.route('/api/update-dashboard', methods=['POST'])
def update_dashboard():
    try:
        mobile_number = request.json.get('mobile_number')
        if not mobile_number:
            return jsonify({'error': 'Mobile number is required'}), 400

        data = asyncio.run(login_to_kmit_netra(mobile_number))
        dashboard_data.update(data)
        return jsonify({
            'message': 'Dashboard data updated successfully',
            'data': dashboard_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200

    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        user = users_collection.find_one({'email': email})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        if user['password'] != password:  # Insecure — use hashed passwords in production
            return jsonify({'error': 'Invalid password'}), 401

        return jsonify({
            'user': {
                '_id': str(user['_id']),
                'email': user['email'],
                'name': user.get('name', '')
            }
        })

    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/auth/profile', methods=['GET', 'OPTIONS'])
def get_profile():
    if request.method == 'OPTIONS':
        return '', 200

    try:
        user_id = request.args.get('userId')
        if not user_id or user_id == 'undefined':
            return jsonify({'error': 'Invalid user ID'}), 400

        try:
            user_id_obj = ObjectId(user_id)
        except Exception:
            return jsonify({'error': 'Invalid user ID format'}), 400

        user = users_collection.find_one({'_id': user_id_obj})
        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({
            'user': {
                '_id': str(user['_id']),
                'email': user['email'],
                'name': user.get('name', '')
            }
        })

    except Exception as e:
        print(f"Profile error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/chat/history/<user_id>', methods=['GET'])
def get_chat_history(user_id):
    try:
        history = list(chat_history_collection.find(
            {'user_id': user_id},
            {'_id': 1, 'query': 1, 'response': 1, 'timestamp': 1}
        ).sort('timestamp', -1))

        for chat in history:
            chat['_id'] = str(chat['_id'])
            chat['timestamp'] = chat['timestamp'].isoformat() if isinstance(chat['timestamp'], datetime) else chat['timestamp']

        return jsonify(history)

    except Exception as e:
        print(f"Chat history error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/chat/history/<user_id>', methods=['DELETE'])
def clear_chat_history(user_id):
    try:
        result = chat_history_collection.delete_many({'user_id': user_id})
        return jsonify({
            'message': 'Chat history cleared successfully',
            'deleted_count': result.deleted_count
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        query = data.get('query')
        user_id = data.get('userId')

        if not query:
            return jsonify({'error': 'Query is required'}), 400
        if not user_id or user_id == 'undefined':
            return jsonify({'error': 'User ID is required'}), 400

        chat_history = []
        history_records = list(chat_history_collection.find({'user_id': user_id}))
        for record in history_records:
            chat_history.append(HumanMessage(content=record['query']))
            chat_history.append(AIMessage(content=record['response']))

        response = get_response(query, chat_history)

        chat_history_collection.insert_one({
            'user_id': user_id,
            'query': query,
            'response': response,
            'timestamp': datetime.now()
        })

        return jsonify({'response': response})

    except Exception as e:
        print(f"Chat error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/rate', methods=['POST'])
def rate_message():
    try:
        data = request.json
        message_id = data.get('messageId')
        rating = data.get('rating')
        user_id = data.get('userId')

        if not all([message_id, rating, user_id]):
            return jsonify({'error': 'Message ID, rating, and user ID are required'}), 400

        result = chat_history_collection.update_one(
            {'_id': ObjectId(message_id), 'user_id': user_id},
            {
                '$set': {
                    'rating': rating,
                    'rated_at': datetime.now()
                }
            }
        )

        if result.modified_count == 0:
            return jsonify({'error': 'Message not found or not owned by user'}), 404

        return jsonify({'message': 'Message rated successfully'})

    except Exception as e:
        print(f"Rate error: {str(e)}")
        return jsonify({'error': str(e)}), 500


# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == "__main__":
    PORT = int(os.getenv("PORT", 4000))
    app.run(debug=bool(os.getenv("FLASK_DEBUG", False)), port=PORT)